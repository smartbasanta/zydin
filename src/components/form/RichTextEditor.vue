<script setup lang="ts">
import { ref, watch, computed, useAttrs, onMounted, onBeforeUnmount } from 'vue';
import InputError from '@/components/form/InputError.vue';

// Import more icons for the expanded toolbar
import {
    BoldIcon, ItalicIcon, UnderlineIcon, StrikethroughIcon, ListIcon, ListOrderedIcon,
    Heading1Icon, Heading2Icon, PilcrowIcon, QuoteIcon, LinkIcon, UndoIcon, RedoIcon, EraserIcon
} from 'lucide-vue-next';

const props = defineProps<{
    label?: string;
    error?: string | string[] | null;
    hint?: string;
    containerClass?: string | Record<string, boolean>;
    isDirty?: boolean;
    required?: boolean;
}>();

const model = defineModel<string | null>();

const editorRef = ref<HTMLDivElement | null>(null);
const activeCommands = ref<Set<string>>(new Set());

// State for the link modal
const showLinkModal = ref(false);
const linkUrl = ref('');
let savedSelection: Range | null = null;


// --- Security: Basic HTML Sanitizer ---
const sanitizeHTML = (html: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const allowedTags = ['B', 'I', 'U', 'STRIKE', 'H1', 'H2', 'P', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'A', 'BR'];
    
    // Remove any nodes that are not in the allowed list
    doc.body.querySelectorAll('*').forEach(node => {
        if (!allowedTags.includes(node.tagName)) {
            node.parentNode?.removeChild(node);
        }
        // Remove all attributes except href for <a> tags
        if (node.tagName === 'A') {
            const href = node.getAttribute('href');
            for (const attr of [...node.attributes]) {
                if (attr.name !== 'href') {
                    node.removeAttribute(attr.name);
                }
            }
            // Ensure href starts with http or https
            if (href && !href.startsWith('http')) {
                node.setAttribute('href', `https://${href}`);
            }
        } else {
            // Remove all attributes from other tags
            for (const attr of [...node.attributes]) {
                 node.removeAttribute(attr.name);
            }
        }
    });
    return doc.body.innerHTML;
};


// --- Core Editor Logic ---
const execCmd = (command: string, value?: string) => {
    // @ts-ignore: document.execCommand is deprecated but necessary here.
    document.execCommand(command, false, value);
    editorRef.value?.focus();
    updateActiveStates();
};

const handleInput = () => {
    if (editorRef.value) {
        // Sanitize on input to protect the model
        model.value = sanitizeHTML(editorRef.value.innerHTML);
    }
};

// --- Link Functionality ---
const promptForLink = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    savedSelection = selection.getRangeAt(0);
    
    // Check if the current selection is already a link to pre-fill the URL
    const parent = savedSelection.commonAncestorContainer.parentElement;
    if (parent?.tagName === 'A') {
        linkUrl.value = parent.getAttribute('href') || '';
    } else {
        linkUrl.value = '';
    }
    
    showLinkModal.value = true;
};

const addLink = () => {
    if (savedSelection) {
        // Restore selection before executing command
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(savedSelection);
        
        execCmd('createLink', linkUrl.value);
        savedSelection = null;
    }
    closeLinkModal();
};

const closeLinkModal = () => {
    showLinkModal.value = false;
    linkUrl.value = '';
};


// --- Active State Management ---
const updateActiveStates = () => {
    const commands = ['bold', 'italic', 'underline', 'strikeThrough', 'insertUnorderedList', 'insertOrderedList'];
    const newActiveCommands = new Set<string>();
    
    commands.forEach(cmd => {
        if (document.queryCommandState(cmd)) newActiveCommands.add(cmd);
    });

    const selection = window.getSelection();
    if (!selection?.focusNode) return;
    
    let parent = selection.focusNode.parentNode;
    while (parent && parent !== editorRef.value) {
        if (['H1', 'H2', 'P', 'BLOCKQUOTE', 'A'].includes(parent.nodeName)) {
            newActiveCommands.add(parent.nodeName.toLowerCase());
        }
        parent = parent.parentNode;
    }
    activeCommands.value = newActiveCommands;
};

// --- Lifecycle & Watchers ---
watch(model, (newValue) => {
    const sanitizedValue = sanitizeHTML(newValue || '');
    if (editorRef.value && editorRef.value.innerHTML !== sanitizedValue) {
        editorRef.value.innerHTML = sanitizedValue;
    }
});

onMounted(() => {
    if (editorRef.value) {
        editorRef.value.innerHTML = sanitizeHTML(model.value || '');
        document.addEventListener('selectionchange', updateActiveStates);
    }
});

onBeforeUnmount(() => {
    document.removeEventListener('selectionchange', updateActiveStates);
});

// Standard component setup
const attrs = useAttrs();
const capitalize = (str: string) => str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
const computedLabel = computed(() => props.label || (attrs.name ? capitalize(attrs.name as string) : ''));
const inputId = computed(() => (attrs.id as string) ?? `editor-${Math.random().toString(36).substring(2, 11)}`);
const isCommandActive = (cmd: string) => activeCommands.value.has(cmd);
</script>

<template>
    <div class="flex flex-col gap-1" :class="containerClass">
        <label v-if="computedLabel" :for="inputId" class="label">
            {{ computedLabel }}
            <span v-if="props.required" class="text-red-500">*</span>
        </label>

        <div class="border rounded-lg" :class="{ 'invalid-input-ring': !!error, 'dirty-input-ring': isDirty && !error }">
            <!-- Toolbar -->
            <div class="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600 rounded-t-lg">
                <!-- Undo/Redo -->
                <button @click="execCmd('undo')" class="toolbar-btn" type="button" title="Undo"><UndoIcon class="size-4" /></button>
                <button @click="execCmd('redo')" class="toolbar-btn" type="button" title="Redo"><RedoIcon class="size-4" /></button>
                <div class="divider"></div>

                <!-- Heading Dropdown -->
                <select @change="execCmd('formatBlock', ($event.target as HTMLSelectElement).value)" class="toolbar-select">
                    <option value="p" :selected="isCommandActive('p')">Paragraph</option>
                    <option value="h1" :selected="isCommandActive('h1')">Heading 1</option>
                    <option value="h2" :selected="isCommandActive('h2')">Heading 2</option>
                </select>
                <div class="divider"></div>

                <!-- Text Styles -->
                <button @click="execCmd('bold')" :class="{ 'is-active': isCommandActive('bold') }" class="toolbar-btn" type="button" title="Bold"><BoldIcon class="size-4" /></button>
                <button @click="execCmd('italic')" :class="{ 'is-active': isCommandActive('italic') }" class="toolbar-btn" type="button" title="Italic"><ItalicIcon class="size-4" /></button>
                <button @click="execCmd('underline')" :class="{ 'is-active': isCommandActive('underline') }" class="toolbar-btn" type="button" title="Underline"><UnderlineIcon class="size-4" /></button>
                <button @click="execCmd('strikeThrough')" :class="{ 'is-active': isCommandActive('strikeThrough') }" class="toolbar-btn" type="button" title="Strikethrough"><StrikethroughIcon class="size-4" /></button>
                <div class="divider"></div>

                <!-- Link -->
                <button @click="promptForLink" :class="{ 'is-active': isCommandActive('a') }" class="toolbar-btn" type="button" title="Add Link"><LinkIcon class="size-4" /></button>
                <div class="divider"></div>

                <!-- Block Elements -->
                <button @click="execCmd('insertUnorderedList')" :class="{ 'is-active': isCommandActive('insertUnorderedList') }" class="toolbar-btn" type="button" title="Bulleted List"><ListIcon class="size-4" /></button>
                <button @click="execCmd('insertOrderedList')" :class="{ 'is-active': isCommandActive('insertOrderedList') }" class="toolbar-btn" type="button" title="Numbered List"><ListOrderedIcon class="size-4" /></button>
                <button @click="execCmd('formatBlock', '<blockquote>')" :class="{ 'is-active': isCommandActive('blockquote') }" class="toolbar-btn" type="button" title="Blockquote"><QuoteIcon class="size-4" /></button>
                <div class="divider"></div>
                
                <!-- Clear Formatting -->
                <button @click="execCmd('removeFormat')" class="toolbar-btn" type="button" title="Clear Formatting"><EraserIcon class="size-4" /></button>
            </div>
            
            <!-- Editor Content Area -->
            <div
                :id="inputId"
                ref="editorRef"
                contenteditable="true"
                class="prose dark:prose-invert max-w-none prose-sm p-3 min-h-[150px] focus:outline-none"
                @input="handleInput"
                @mouseup="updateActiveStates"
                @keyup="updateActiveStates"
            ></div>
        </div>

        <p v-if="hint && !error" class="text-xs mt-1 text-muted">{{ hint }}</p>
        <InputError v-if="error" :error="error" class="mt-1" />

        <!-- Link Creation Modal -->
        <div v-if="showLinkModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="closeLinkModal">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5 w-full max-w-sm">
                <h3 class="text-lg font-bold mb-4">Add/Edit Link</h3>
                <input type="url" v-model="linkUrl" class="input w-full" placeholder="https://example.com" @keyup.enter="addLink">
                <div class="flex justify-end gap-3 mt-4">
                    <button @click="closeLinkModal" type="button" class="btn-secondary">Cancel</button>
                    <button @click="addLink" type="button" class="btn-primary">Save</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";
/* Scoped styles are great for UI elements not easily handled by utility classes */
.toolbar-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 0.375rem;
    transition: background-color 0.2s;
}
.toolbar-btn:hover { background-color: #e5e7eb; }
.dark .toolbar-btn:hover { background-color: #374151; }
.toolbar-btn.is-active { background-color: #dbeafe; color: #2563eb; }
.dark .toolbar-btn.is-active { background-color: #1e3a8a; color: #eff6ff; }

.divider {
    width: 1px;
    height: 1.25rem;
    background-color: #d1d5db; /* gray-300 */
    margin: 0 0.5rem;
}
.dark .divider { background-color: #4b5563; }

.toolbar-select {
    @apply text-sm px-2 py-1 h-8;
}

.invalid-input-ring {
    @apply border-red-500 dark:border-red-400 ring-2 ring-red-500/20;
}
.dirty-input-ring {
     @apply border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20;
}
</style>