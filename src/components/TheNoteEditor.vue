<script setup lang="ts">
import { ref } from 'vue'
import { store } from '../store'

const refEditorContent = ref<HTMLElement | null>(null)
const refEditorTitle = ref<HTMLElement | null>(null)
const pressingControlKey = ref(false)

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
</script>

<template>
  <div>
    <div>
      <input
        class="p-2 w-full h-8 border-none focus:outline-none text-large font-bold"
        type="text"
        ref="refEditorTitle"
        v-model="store.editorNoteTitle"
        @keydown="handleKeyDownOnTitle"
        @keyup="handleKeyUpOnTitle"
        @compositionstart="handleComposingStart"
        @compositionend="handleComposingEnd"
      />
    </div>
    <textarea
      class="px-2 border-color-default focus:outline-none text-medium border-none font-sans"
      rows="16"
      cols="60"
      v-model="store.editorNoteContent"
      ref="refEditorContent"
      @keydown="handleKeyDownOnContent"
      @keyup="handleKeyUpOnContent"
      @compositionstart="handleComposingStart"
      @compositionend="handleComposingEnd"
    ></textarea>
  </div>
</template>
