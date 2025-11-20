<script setup lang="ts">
import { ref, onMounted, reactive, watch, computed, type Ref } from 'vue';
import { apiService } from '@/services/api.service';
import { useNotifier } from '@/composables/useNotifier';
import type { ApiError, ApiResponse } from '@/types/api';
import type { Address } from '@/types/auth';
import { Edit, Home, LoaderCircle, MapPin, PlusCircle, Trash2, User, X } from 'lucide-vue-next';
import TextInput from '@/components/form/TextInput.vue';
import SelectInput from '@/components/form/SelectInput.vue';

// --- Type Definitions ---
interface AddressFormData {
    id?: number;
    full_name: string;
    email: string;
    phone: string;
    type: string | 'shipping' | 'billing' | 'other';
    street_address: string;
    address_line_1: string;
    address_line_2?: string;
    city?: string;
    state?: string;
    postal_code: string;
    country_id: string | null;
    province_id?: string | null;
    district_id?: string | null;
    municipality_id?: string | null;
    ward_number?: number;
    is_primary: boolean;
}

type LocationOptions = Record<string, string>;

// --- Composables ---
const { notify } = useNotifier('bottom-right');

interface pageAddress extends Address {
    can: {
        "viewAnyUserAddress": boolean,
        "viewUserAddress": boolean,
        "createUserAddress": boolean,
        "updateUserAddress": boolean,
        "deleteUserAddress": boolean
    }
    country: {
        "id": number,
        "name": string
    },
    province: {
        "id": number,
        "name": string
    },
    district: {
        "id": number,
        "name": string
    },
    municipality: {
        "id": number,
        "name": string
    }
}
// --- Component State ---
const addresses: Ref<pageAddress[]> = ref([]);
const isLoading = ref(true);
const isModalOpen = ref(false);
const formMode = ref<'add' | 'edit'>('add');

// --- State for Dynamic Location Dropdowns ---
const countries = ref<LocationOptions>({});
const provinces = ref<LocationOptions>({});
const districts = ref<LocationOptions>({});
const municipalities = ref<LocationOptions>({});
const wards = ref<number | undefined>(undefined);
const nepalCountryId = ref<string | null>(null);

// --- Form State Management ---
const initialFormState: AddressFormData = {
    full_name: '',
    phone: '',
    email: '',
    type: 'shipping', // Default type
    street_address: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    is_primary: false,
    country_id: null,
    province_id: null,
    district_id: null,
    municipality_id: null,
};

const form = reactive({
    data: { ...initialFormState },
    errors: {} as Record<string, [string]>,
    isSubmitting: false,
});

const addressTypeOptions: LocationOptions = {
    shipping: 'Shipping',
    billing: 'Billing',
    other: 'Other'
};

// --- API Functions ---
const fetchAddresses = async () => {
    isLoading.value = true;
    try {
        const response = await apiService.get<ApiResponse<{addresses:pageAddress[]}>>('/user/account/addresses');
        addresses.value = response.data?.addresses || [];
    } catch (error) {
        notify(error as ApiError);
    } finally {
        isLoading.value = false;
    }
};

const fetchLocationData = async () => {
    try {
        const [countryRes, provinceRes] = await Promise.all([
            apiService.get<ApiResponse<LocationOptions>>('/countries'),
            apiService.get<ApiResponse<LocationOptions>>('/provinces')
        ]);

        countries.value = countryRes.data;
        provinces.value = provinceRes.data;

        const nepalEntry= Object.entries(countryRes.data).find(([, name]) => name === 'Nepal');
        if (nepalEntry) {
            nepalCountryId.value = nepalEntry[0];
        }
    } catch (error) {
        notify(error as ApiError);
    }
}

const fetchDistricts = async (provinceId: number) => {
    if (!provinceId) {
        districts.value = {};
        return;
    }
    try {
        const response = await apiService.get<ApiResponse<LocationOptions>>(`/districts/${provinceId}`);
        districts.value = response.data;
    } catch (error) {
        notify(error as ApiError);
    }
}

const fetchMunicipalities = async (districtId: number) => {
    if (!districtId) {
        municipalities.value = {};
        return;
    }
    try {
        const response = await apiService.get<ApiResponse<LocationOptions>>(`/municipalities/${districtId}`);
        municipalities.value = response.data;
    } catch (error) {
        notify(error as ApiError);
    }
}
const fetchWards = async (municipalityId: number) => {
    if (!municipalityId) {
        wards.value = undefined;
        return;
    }
    try {
        const response = await apiService.get<ApiResponse<number>>(`/wards/${municipalityId}`);
        wards.value = response.data ?? null;
    } catch (error) {
        notify(error as ApiError);
    }
}

onMounted(() => {
    fetchAddresses();
    fetchLocationData(); // Fetch locations on mount
});

// --- Dynamic Form Logic & Watchers ---
const isNepalSelected = computed(() => !!nepalCountryId.value && form.data.country_id === nepalCountryId.value);

watch(() => form.data.country_id, () => {
    // Reset all location fields when country changes
    // form.data.state = '';
    // form.data.city = '';
    // form.data.postal_code = '';
    // form.data.province_id = null;
    // form.data.district_id = null;
    // form.data.municipality_id = null;
    // form.data.ward_number = undefined;
    // districts.value = {};
    // municipalities.value = {};
});

watch(() => form.data.province_id, (newProvinceId) => {
    // form.data.district_id = null;
    // form.data.municipality_id = null;
    // form.data.ward_number = undefined;
    // municipalities.value = {};
    if (newProvinceId) {
        fetchDistricts(parseInt(newProvinceId));
    } else {
        // districts.value = {};
    }
});

watch(() => form.data.district_id, (newDistrictId) => {
    // form.data.municipality_id = null;
    // form.data.ward_number = undefined;
    if (newDistrictId) {
        fetchMunicipalities(parseInt(newDistrictId));
    } else {
        // municipalities.value = {};
    }
});
watch(() => form.data.municipality_id, (newMunicipalityId) => {
    // form.data.ward_number = undefined;
    // form.data.ward_number = undefined;
    if (newMunicipalityId) {
        fetchWards(parseInt(newMunicipalityId));
    } else {
        wards.value = undefined;
    }
});

// --- Form Submission & Deletion ---
const saveAddress = async () => {
    form.isSubmitting = true;
    form.errors = {};
    const isUpdate = formMode.value === 'edit';
    const url = isUpdate ? `/user/account/addresses/${form.data.id}` : '/user/account/addresses';
    const method = isUpdate ? 'put' : 'post';

    try {
        const response = await apiService[method]<ApiResponse<Address>>(url, form.data);
        notify(response);
        await fetchAddresses(); // Refresh the list
        closeModal();
    } catch (error) {
        const apiError = error as ApiError;
        form.errors = apiError.errors || {};
        notify(apiError);
    } finally {
        form.isSubmitting = false;
    }
};

const deleteAddress = async (id: number | undefined) => {
    if (!id || !confirm('Are you sure you want to delete this address?')) return;

    try {
        const response = await apiService.delete<ApiResponse<[]>>(`/user/account/addresses/${id}`);
        notify(response);
        await fetchAddresses();
    } catch (error) {
        notify(error as ApiError);
    }
};

// --- Modal Controls ---
const openModal = async (mode: 'add' | 'edit', address: pageAddress | null = null) => {
    formMode.value = mode;
    form.errors = {};
    form.isSubmitting = false;

    if (mode === 'edit' && address) {
        // Populate form with existing address data for editing
        form.data = {
            id: address.id,
            full_name: address.full_name,
            email: address.email,
            phone: address.phone,
            type: address.type,
            street_address: address.street_address,
            address_line_1: address.address_line_1,
            address_line_2: address.address_line_2,
            city: address.city,
            state: address.state,
            postal_code: address.postal_code,
            is_primary: address.is_primary,
            country_id: address.country_id.toString(), // Select inputs expect string values
            province_id: address.province_id?.toString(),
            district_id: address.district_id?.toString(),
            municipality_id: address.municipality_id?.toString(),
            ward_number: address.ward_number ?? undefined,
        };
        // Step 2: Sequentially fetch data for dependent dropdowns.
        // This is the key change. We `await` each fetch before proceeding to the next.
        if (isNepalSelected.value) {
            if (form.data.province_id) {
                await fetchDistricts(parseInt(form.data.province_id));
                // Only after districts are fetched, do we fetch municipalities
                if (form.data.district_id) {
                    await fetchMunicipalities(parseInt(form.data.district_id));
                    // Only after municipalities are fetched, do we fetch wards
                    if (form.data.municipality_id) {
                        await fetchWards(parseInt(form.data.municipality_id));
                    }
                }
            }
        }
        // Pre-fetch dependent dropdown data for the edited address
        // if (form.data.province_id) await fetchDistricts(parseInt(form.data.province_id));
        // if (form.data.district_id) await fetchMunicipalities(parseInt(form.data.district_id));
        // if (form.data.municipality_id) await fetchWards(parseInt(form.data.municipality_id));
    } else {
        // Reset form to its initial state for adding a new address
        form.data = { ...initialFormState, country_id: nepalCountryId.value }; // Default to Nepal if available
    }
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
};

// --- Display Helpers ---
// --- Display Helpers ---
const formatAddressLine = (address: pageAddress): string => {
    // Ensure we have an address object to work with
    if (!address) return '';

    const parts: (string | undefined)[] = [];

    // Start with the most specific, common address lines
    parts.push(address.street_address);
    parts.push(address.address_line_1);
    parts.push(address.address_line_2);

    // Conditional formatting based on the country
    if (address.country?.name === 'Nepal') {
        // Build the specific "Municipality-ward, District" line for Nepal
        let municipalityLine = address.municipality?.name;
        if (municipalityLine && address.ward_number && address.district?.name) {
            municipalityLine = `${municipalityLine}-${address.ward_number}, ${address.district.name}`;
        }
        parts.push(municipalityLine);

        // Add province and country
        parts.push(address.province?.name);
        parts.push(address.country?.name);

    } else {
        // Use a standard format for all other countries
        parts.push(address.city);
        parts.push(address.state);
        parts.push(address.postal_code);
        parts.push(address.country?.name);
    }


    // Filter out any null, undefined, or empty string parts and join them with a comma and space.
    return parts.filter(Boolean).join(', ');
};
</script>

<template>
    <div
        class="rounded-2xl p-6 sm:p-8 overflow-hidden backdrop-blur-lg bg-white/5 border border-black/10 dark:border-white/10 shadow-2xl">
        <!-- <div class="absolute inset-0 -z-10 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-50"></div> -->
        <div class="flex justify-between items-center gap-4 mb-6">
            <h3 class="text-xl font-bold text-slate-800 dark:text-white">User Addresses</h3>
            <button @click="openModal('add')" class="btn btn-primary whitespace-nowrap">
                <PlusCircle class="size-4 mr-2" />
                <span>Add New</span>
            </button>
        </div>

        <div v-if="isLoading" class="space-y-4">
            <div v-for="i in 2" :key="i" class="h-24 bg-slate-200 dark:bg-slate-800/60 rounded-lg animate-pulse"></div>
        </div>

        <div v-else-if="addresses.length <= 0"
            class="text-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
            <h4 class="font-semibold text-slate-700 dark:text-slate-200">No Addresses Found</h4>
            <p class="text-slate-500 dark:text-slate-400 mt-1">Get started by adding your first shipping address.</p>
            <button @click="openModal('add')" class="btn btn-primary mt-4">Add Address</button>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <div v-for="address in addresses" :key="address.id"
        class="relative flex flex-col rounded-lg p-5 border transition-all duration-300 hover:translate-y-[-2px] "
        :class="address.is_primary ? 'border-blue-500/80 bg-indigo-50 dark:bg-blue-900/20 shadow-md dark:hover:border-blue-700' : 'border-slate-200 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/40'">

        <!-- Main Content Area -->
        <div class="flex-grow">
            <div class="flex justify-between items-start">
                <p class="font-semibold text-slate-800 dark:text-slate-100">{{ address.full_name }}</p>
                
                <div class="flex-shrink-0">
                    <div v-if="address.is_primary"
                        class="flex bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        PRIMARY
                    </div>
                    <div v-else class="flex text-gray-400 dark:text-gray-500 text-xs font-bold px-2 py-1">
                        {{ address.type.toUpperCase() }}
                    </div>
                </div>
            </div>
            <div class="pr-4 mt-1">
                <p class="text-sm text-slate-600 dark:text-slate-400">{{ formatAddressLine(address) }}</p>
                <p v-if="address.phone || address.email"
                    class="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <span v-if="address.phone">
                        <span class="font-medium">Phone:</span> {{ address.phone }}
                    </span>
                    <span v-if="address.email && address.phone" class="mx-2">·</span>
                    <span v-if="address.email">
                        <span class="font-medium">Email:</span> {{ address.email }}
                    </span>
                </p>
            </div>
        </div>

        <!-- Action Buttons - Pushed to the bottom -->
        <div class="flex items-center justify-end gap-2 mt-4">
            <button @click="openModal('edit', address)"
                class="btn btn-primary text-sm py-1 px-3">
                <Edit class="size-3.5 mr-1" /> Edit
            </button>
            <button @click="deleteAddress(address.id!)" class="btn btn-destructive text-sm py-1 px-3">
                <Trash2 class="size-3.5 mr-1" /> Delete
            </button>
        </div>
    </div>
</div>
    </div>

    <!-- Add/Edit Address Modal (Redesigned) -->
<Transition name="fade">
    <div v-if="isModalOpen"
        class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6 mb-20"
        @click.self="closeModal">
        
        <!-- Modal Panel -->
        <div class="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            
            <!-- Modal Header -->
            <header class="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
                <h3 class="text-xl font-bold text-slate-900 dark:text-white">
                    {{ formMode === 'add' ? 'Add New Address' : 'Edit Address' }}
                </h3>
                <button @click="closeModal"
                    class="p-1 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-white transition-colors">
                    <X class="size-6" />
                </button>
            </header>

            <!-- Form Body with Scrolling -->
            <form @submit.prevent="saveAddress" class="flex-grow overflow-y-auto">
                <div class="p-6 space-y-8">

                    <!-- Section 1: Contact Information -->
                    <fieldset class="space-y-4">
                        <legend class="text-base font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                            <User class="size-5" />
                            Contact Information
                        </legend>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextInput v-model="form.data.full_name" label="Full Name" :error="form.errors.full_name" />
                            <TextInput v-model="form.data.phone" label="Phone Number" :error="form.errors.phone" required />
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextInput v-model="form.data.email" label="Email Address" type="email" :error="form.errors.email" />
                            <SelectInput v-model="form.data.type" label="Address Type" :options="addressTypeOptions" :error="form.errors.type" required />
                        </div>
                    </fieldset>

                    <!-- Section 2: Location -->
                    <fieldset class="space-y-4">
                         <legend class="text-base font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                            <MapPin class="size-5" />
                            Location
                        </legend>
                        <SelectInput v-model="form.data.country_id" label="Country" :options="countries" :error="form.errors.country_id" required />

                        <Transition name="fade-slow" mode="out-in">
                            <!-- Nepal Specific Fields -->
                            <div v-if="isNepalSelected" class="space-y-4 pt-2">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <SelectInput v-model="form.data.province_id" label="Province" :options="provinces" :error="form.errors.province_id" required />
                                    <SelectInput v-model="form.data.district_id" label="District" :options="districts" :error="form.errors.district_id" :disabled="!form.data.province_id" required />
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <SelectInput v-model="form.data.municipality_id" label="Municipality" :options="municipalities" :error="form.errors.municipality_id" :disabled="!form.data.district_id" required />
                                    <TextInput v-model.number="form.data.ward_number" label="Ward Number" type="number" :error="form.errors.ward_number" :disabled="!form.data.municipality_id" required min="1" :maxLength="wards?.toString()" />
                                </div>
                            </div>

                            <!-- Other Countries Fields -->
                            <div v-else class="space-y-4 pt-2">
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <TextInput v-model="form.data.city" label="City" :error="form.errors.city" :required="!isNepalSelected" />
                                    <TextInput v-model="form.data.state" label="State / Province" :error="form.errors.state" :required="!isNepalSelected" />
                                    <TextInput v-model="form.data.postal_code" label="Postal / ZIP Code" :error="form.errors.postal_code" :required="!isNepalSelected" />
                                </div>
                            </div>
                        </Transition>
                    </fieldset>
                    
                    <!-- Section 3: Address Details -->
                     <fieldset class="space-y-4">
                         <legend class="text-base font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                            <Home class="size-5" />
                            Address Details
                        </legend>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <TextInput v-model="form.data.street_address" label="Street / Tole" :error="form.errors.street_address" placeholder="e.g., Maitidevi" />
                            <TextInput v-model="form.data.address_line_1" label="Address Line 1" :error="form.errors.address_line_1" placeholder="e.g., Apartment, building, etc." required />
                            <TextInput v-model="form.data.address_line_2" label="Address Line 2 (Optional)" :error="form.errors.address_line_2" placeholder="e.g., Suite, floor, etc." />
                        </div>
                    </fieldset>

                    <!-- Section 4: Settings -->
                    <div>
                        <label class="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors">
                            <input type="checkbox" v-model="form.data.is_primary"
                                class="mt-1 size-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 shadow-sm focus:ring-indigo-500 bg-transparent" />
                            <div>
                                <span class="font-semibold text-gray-800 dark:text-gray-200">Set as primary address</span>
                                <p class="text-sm text-gray-500 dark:text-gray-400">This will be your default shipping and billing address.</p>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- Modal Footer -->
            </form>
            <footer class="flex justify-end gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex-shrink-0">
                <button type="button" @click="closeModal" class="btn btn-secondary">Cancel</button>
                <button @click="saveAddress" type="submit" class="btn btn-primary" :disabled="form.isSubmitting">
                    <LoaderCircle v-if="form.isSubmitting" class="size-4 animate-spin -ml-1 mr-2" />
                    {{ formMode === 'add' ? 'Save Address' : 'Update Address' }}
                </button>
            </footer>
        </div>
    </div>
</Transition>
</template>

<style scoped>
/* For the fade transition on the modal */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>