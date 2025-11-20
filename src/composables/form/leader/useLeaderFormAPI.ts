import { ref, reactive, watch, onMounted } from 'vue';
import { apiService } from '@/services/api.service';
import type { Leader, LeaderFormData } from '@/types';
import type { ApiResponse } from '@/types/api';
import { useNotifier } from '@/composables/useNotifier';
import { useRoute, useRouter } from 'vue-router';

export function useLeaderFormAPI(leader?: Leader | null) {
    const router = useRouter();
    const { notify, error: notifyError } = useNotifier();
    const route = useRoute();
    const leaderId = route.params.id as string;

    const leaderData = ref<Leader | null>(leader || null);

    // Helper to safely stringify JSON, returning a default value if null/undefined
    const jsonStringify = (data: any, defaultValue = '{}') => {
        return data ? JSON.stringify(data, null, 2) : defaultValue;
    };

    const initialData: LeaderFormData = {
        name: leaderData.value?.name || '',
        position: leaderData.value?.position || '',
        title: leaderData.value?.title || null,
        quote: leaderData.value?.quote || null,
        bio: leaderData.value?.bio || null,
        message: leaderData.value?.message || null,
        education: leaderData.value?.education || null,
        career_highlights: leaderData.value?.career_highlights || null,
        socials: leaderData.value?.socials || null,
        image_url: leaderData.value?.image_url || null,
        image: null,
    };

    const form = reactive<LeaderFormData>({ ...initialData });
    const errors = ref<Record<string, string[]>>({});
    const isLoading = ref(false);
    const isDirty = ref(false);
    const dirtyFields = ref<Record<string, boolean>>({});

    watch(form, (newForm) => {
        isDirty.value = false;
        dirtyFields.value = {};
        (Object.keys(initialData) as Array<keyof LeaderFormData>).forEach((key) => {
            const fieldIsDirty = initialData[key] !== newForm[key];
            if (fieldIsDirty) {
                dirtyFields.value[key] = true;
                isDirty.value = true;
            } else {
                dirtyFields.value[key] = false;
            }
        });
    }, { deep: true });

    const submit = async () => {
        isLoading.value = true;
        errors.value = {};

        try {
            let response: ApiResponse;
            const payload: Record<string, any> = { ...form };
            const hasFile = payload.image instanceof File;
            // if (payload.education && typeof payload.education === 'object') {
            //     payload.education = JSON.stringify(payload.education);
            // }
            // if (payload.career_highlights && typeof payload.career_highlights === 'object') {
            //     payload.career_highlights = JSON.stringify(payload.career_highlights);
            // }
            // if (payload.socials && typeof payload.socials === 'object') {
            //     payload.socials = JSON.stringify(payload.socials);
            // }
            if (leaderData.value?.id) {
                if (hasFile) {
                    payload._method = 'PUT';
                    response = await apiService.postWithFiles<ApiResponse>(`/dashboard/leaders/${leaderData.value.id}`, payload);
                } else {
                    delete payload.image;
                    delete payload.image_url;
                    response = await apiService.put<ApiResponse>(`/dashboard/leaders/${leaderData.value.id}`, payload);
                }
            } else {
                if (hasFile) {
                    response = await apiService.postWithFiles<ApiResponse>('/dashboard/leaders', payload);
                } else {
                    response = await apiService.post<ApiResponse>('/dashboard/leaders', payload);
                }
            }
            notify(response);
            router.push({ name: 'dashboard.leaders.index' });
            isDirty.value = false;
            dirtyFields.value = {};
        } catch (error: any) {
            if (error.errors) errors.value = error.errors;
            notifyError(error, 'Submission failed');
        } finally {
            isLoading.value = false;
        }
    };

    const fetchLeader = async () => {
        if (!leaderId) return;
        isLoading.value = true;
        try {
            const response = await apiService.get<ApiResponse>(`/dashboard/leaders/${leaderId}`);
            leaderData.value = response.data.leader;

            const fetchedData = {
                ...response.data.leader
            };

            Object.assign(initialData, fetchedData);
            Object.assign(form, fetchedData);

            isDirty.value = false;
            dirtyFields.value = {};

        } catch (err) {
            notifyError(err as any, 'Failed to load leader details');
            router.push({ name: 'dashboard.leaders.index' });
        } finally {
            isLoading.value = false;
        }
    };

    onMounted(() => {
        if (leaderId && !leaderData.value) {
            fetchLeader();
        }
    });

    return { form, errors, isLoading, isDirty, dirtyFields, submit };
}