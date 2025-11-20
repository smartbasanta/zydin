<script setup lang="ts">
import type { RoleFormData } from "@/types/access-control";
import TextInput from "@/components/form/TextInput.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import SlugInput from "@/components/form/SlugInput.vue";
import InputError from "@/components/form/InputError.vue";

const props = defineProps<{
	form: RoleFormData;
	errors: Record<string, string[]>;
	isEdit: boolean;
	onKeyInput?: (event: Event) => void;
	section: "core" | "display" | "config";
    dirtyFields?: Record<string, boolean>;
}>();

defineEmits(["update:form"]);
</script>

<template>
	<div class="space-y-6">
		<template v-if="section === 'core'">
			<TextInput
				label="Role Name"
				id="name"
				v-model="form.name"
				:error="errors.name?.[0]"
				required
				autofocus
				placeholder="e.g., Administrator, Editor"
                :class="{ 'dirty-input': dirtyFields?.name }"
			/>

			<SlugInput
				v-model="form.key"
				:sourceValue="form.name"
                :form="form"
                source-field="name"
                target-field="key"
				label="URL Slug"
				hint="Unique identifier, cannot be changed after creation."
				:maxLength="100"
				:error="errors?.key?.[0]"
				:disabled="isEdit"
                :class="{ 'dirty-input': dirtyFields?.key }"
			/>

			<TextareaInput
				label="Description"
				id="description"
				v-model="form.description"
				:error="errors.description?.[0]"
				:rows="3"
				placeholder="A brief description of the role's purpose."
                :class="{ 'dirty-input': dirtyFields?.description }"
			/>
		</template>

		<template v-if="section === 'display'">
			<div class="@container grid grid-cols-1 @md:grid-cols-2 gap-4">
				<!-- Light Mode Color -->
				<div class="group">
					<div class="my-2">
						<label
							for="color_light"
							class="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4"
						>
							Color (Light Mode)
						</label>

						<div class="flex items-center gap-4 mb-4">
							<!-- Enhanced Color Picker -->
							<div class="relative">
								<input
									id="color_light"
									type="color"
									v-model="form.color_light"
									class="w-16 h-16 cursor-pointer transition-all duration-300 hover:scale-105"
								/>
							</div>

							<!-- Styled Hex Input -->
							<div class="flex-1">
								<input
									type="text"
									v-model="form.color_light"
									class="input text-sm font-mono rounded-xl"
									placeholder="#3B82F6"
                                    pattern="#[0-9A-Fa-f]{6}"
                                    maxlength="7"
                                    title="Enter a valid hex color code (e.g., #1E40AF)"
                                    aria-label="Light mode color hex code"
                                    :class="{ 'dirty-input': dirtyFields?.color_light }"
								/>
							</div>
						</div>

						<div
							v-if="errors.color_light"
							class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"
						>
							<p class="text-sm text-red-600 dark:text-red-400">
								{{ errors.color_light[0] }}
							</p>
						</div>
					</div>
				</div>

				<!-- Dark Mode Color -->
				<div class="group">
					<div class="my-2">
						<label
							for="color_dark"
							class="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4"
						>
							Color (Dark Mode)
						</label>

						<div class="flex items-center gap-4 mb-4">
							<!-- Enhanced Color Picker -->
							<div class="relative">
								<input
									id="color_dark"
									type="color"
									v-model="form.color_dark"
									class="w-16 h-16 cursor-pointer  transition-all duration-300 hover:scale-105"
								/>
							</div>

							<!-- Styled Hex Input -->
							<div class="flex-1">
								<input
									type="text"
									v-model="form.color_dark"
									class="input text-sm font-mono rounded-xl"
									placeholder="#1E40AF"
                                    pattern="#[0-9A-Fa-f]{6}"
                                    maxlength="7"
                                    title="Enter a valid hex color code (e.g., #1E40AF)"
                                    aria-label="Dark mode color hex code"
                                    :class="{ 'dirty-input': dirtyFields?.color_dark }"
								/>
							</div>
						</div>

						<div
							v-if="errors.color_dark"
							class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"
						>
							<p class="text-sm text-red-600 dark:text-red-400">
								{{ errors.color_dark[0] }}
							</p>
						</div>
					</div>
				</div>
			</div>
		</template>

		<template v-if="section === 'config'">
			<TextInput
				type="number"
				label="Level"
				id="level"
				v-model.number="form.level"
				:error="errors.level?.[0]"
				required
				min="0"
				max="1000"
				hint="Hierarchy level (0-1000). Higher is more privileged."
                :class="{ 'dirty-input': dirtyFields?.level }"
			/>
			<div>
				<div class="flex items-center gap-3">
					<input
						type="checkbox"
						id="is_default"
						v-model="form.is_default"
						class="checkbox checkbox-primary"
                        :class="{ 'dirty-input': dirtyFields?.is_default }"
					/>
					<label
						for="is_default"
						class="label cursor-pointer select-none"
						>Set as Default Role</label
					>
				</div>
				<InputError :error="errors.is_default?.[0]" />
				<p class="text-xs text-gray-500 mt-1">
					Assign this role to new users automatically.
				</p>
			</div>
		</template>
	</div>
</template>
