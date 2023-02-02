<script setup lang="ts">
import { computed, onMounted, onUnmounted, onUpdated, ref, watch } from 'vue'
import markdownIt from 'markdown-it'
import { store } from '../store'
import TheNoteEditorHeader from '../components/TheNoteEditorHeader.vue'
import { useRoute } from 'vue-router'

const refEditorContent = ref<HTMLElement | null>(null)
const refEditorTitle = ref<HTMLElement | null>(null)
const pressingControlKey = ref(false)
const route = useRoute()

onMounted(() => {
  if (store.isAdding) {
    focusEditorTitle()
  } else if (store.isEditing) {
    focusEditorContent()
  }
})
watch (() => store.isAdding, async (after, before) => {
  if (after) focusEditorTitle()
})
watch (() => route.query.noteId, async (noteIdAfter, noteIdBefore) => {
  if (noteIdAfter && (noteIdAfter !== noteIdBefore)) focusEditorContent()
})
const emit = defineEmits<{
  (e: 'inputNote'): void
}>()
const md = new markdownIt()
const handleChangeNoteType = () => {
  store.actions.note.updateNoteType(store)
}
const handleComposingStart = () => store.composing = true
const handleComposingEnd = () => store.composing = false
const handleKeyDownOnContent = (e: KeyboardEvent) => {
  const target = (e.target as HTMLTextAreaElement)
  if (!store.composing) {
    if (target.selectionStart === 0) {
      if (e.key === 'ArrowUp') {
        setTimeout(() => focusEditorTitle(), 100)
      }
      if (e.key === 'Backspace') {
        setTimeout(() => focusEditorTitle(), 100)
      }
      if (e.key === 'p' && pressingControlKey.value) {
        setTimeout(() => focusEditorTitle(), 100)
      }
    }
    if (e.key === 'Control' ) {
      pressingControlKey.value = true
    }
  }
}
const handleKeyUpOnContent = (e: KeyboardEvent) => {
  if (e.key === 'Control' && !store.composing) {
    pressingControlKey.value = false
  }
}
const handleKeyDownOnTitle = (e: KeyboardEvent) => {
  if (!store.composing) {
    if (e.key === 'ArrowDown' || e.key === 'Enter') {
      setTimeout(() => focusEditorContent(), 100)
    }
    if (e.key === 'Control') {
      pressingControlKey.value = true
    }
    if (e.key === 'n' && pressingControlKey.value) {
      setTimeout(() => focusEditorContent(), 100)
    }
  }
}
const handleInput = (e: Event) => {
  emit('inputNote')
}
const handleKeyUpOnTitle = (e: KeyboardEvent) => {
  if (e.key === 'Control' && !store.composing) {
    pressingControlKey.value = false
  }
}
const focusEditorContent = () => {
  refEditorContent.value?.focus()
}
const focusEditorTitle = () => {
  refEditorTitle.value?.focus()
}
const outputMarkdown = computed(() => md.render(store.editor.noteContent) )
</script>

<template>
  <div class="bg-primary flex-column f-1">
    <div
      v-if="store.notesLayout === 'grid'"
      class="f-1 flex-column"
    >
      <div class="h-8 text-secondary">
        <TheNoteEditorHeader @change-note-type="handleChangeNoteType" />
      </div>
      <div class="f-1 flex-row divide-x-2 divide-solid divide-color-secondary">
        <div class="f-1 flex-column">
          <div>
            <input
              class="w-full h-8 border-none focus:outline-none text-large font-bold bg-primary"
              type="text"
              ref="refEditorTitle"
              v-model="store.editor.noteTitle"
              @keydown="handleKeyDownOnTitle"
              @keyup="handleKeyUpOnTitle"
              @compositionstart="handleComposingStart"
              @compositionend="handleComposingEnd"
              @input="handleInput"
            />
          </div>
          <textarea
            class="w-full border-color-default focus:outline-none text-medium border-none font-sans f-1 resize-none bg-primary"
            v-model="store.editor.noteContent"
            ref="refEditorContent"
            @keydown="handleKeyDownOnContent"
            @keyup="handleKeyUpOnContent"
            @compositionstart="handleComposingStart"
            @compositionend="handleComposingEnd"
            @input="handleInput"
          ></textarea>
        </div>
        <div
          class="f-1"
          v-if="store.editor.noteType === 'markdown'"
        >
          <div
            class="mx-4"
            v-html="outputMarkdown"
          ></div>
        </div>
      </div>
    </div>
    <div
      v-else-if="store.notesLayout === 'list'"
      class="f-1 flex-column"
    >
      <div class="h-4 m-4 text-secondary">
        <TheNoteEditorHeader @change-note-type="handleChangeNoteType" />
      </div>
      <div class="f-1 flex-row divide-x-2 divide-solid divide-color-secondary">
        <div class="f-1 flex-column">
          <div class="">
            <input
              class="p-4 w-full h-10 border-none focus:outline-none text-large font-bold bg-primary"
              type="text"
              ref="refEditorTitle"
              v-model="store.editor.noteTitle"
              @keydown="handleKeyDownOnTitle"
              @keyup="handleKeyUpOnTitle"
              @compositionstart="handleComposingStart"
              @compositionend="handleComposingEnd"
              @input="handleInput"
            />
          </div>
          <div class="f-1">
            <textarea
              class="px-4 border-color-default focus:outline-none text-medium border-none font-sans w-full bg-primary h-full pattern-scrollbar-thin resize-none"
              v-model="store.editor.noteContent"
              ref="refEditorContent"
              @keydown="handleKeyDownOnContent"
              @keyup="handleKeyUpOnContent"
              @compositionstart="handleComposingStart"
              @compositionend="handleComposingEnd"
              @input="handleInput"
            ></textarea>
          </div>
        </div>
        <div
          class="f-1"
          v-if="store.editor.noteType === 'markdown'"
        >
          <div class="h-12">
            <span class="text-small text-secondary mx-4">Preview</span>
          </div>
          <div
            class="mx-4"
            v-html="outputMarkdown">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
