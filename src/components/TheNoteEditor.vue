<script setup lang="ts">
import { computed, onMounted, onUnmounted, onUpdated, ref } from 'vue'
import markdownIt from 'markdown-it'
import AppCode from '../components/AppCode.vue'
import { store } from '../store'

const refEditorContent = ref<HTMLElement | null>(null)
const refEditorTitle = ref<HTMLElement | null>(null)
const pressingControlKey = ref(false)

onMounted(() => {
  if (store.isAdding) {
    focusEditorTitle()
  } else if (store.isEditing) {
    focusEditorContent()
  }
})
onUpdated(() => {})
onUnmounted(() => {})

const md = new markdownIt()
const handleChangeNoteType = () => {
  store.updateNoteType(store.editorNoteId, store.editorNoteType)
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
const outputMarkdown = computed(() => md.render(store.editorNoteContent) )
</script>

<template>
  <div class="bg-primary f-1 flex-column">
    <div
      v-if="store.notesLayout === 'grid'"
      class="f-1"
    >
      <div class="h-8 text-secondary">
        <span>Type:</span>
        <label>
          <input
            type="radio"
            value="plain"
            name="type"
            v-model="store.editorNoteType"
            @change=handleChangeNoteType
          />Plain
        </label>
        <label>
          <input
            type="radio"
            value="markdown"
            name="type"
            v-model="store.editorNoteType"
            @change="handleChangeNoteType"
          />Markdown
        </label>
      </div>
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
      <div class="flex-row">
        <textarea
          class="px-2 border-color-default focus:outline-none text-medium border-none font-sans f-1"
          rows="16"
          cols="60"
          v-model="store.editorNoteContent"
          ref="refEditorContent"
          @keydown="handleKeyDownOnContent"
          @keyup="handleKeyUpOnContent"
          @compositionstart="handleComposingStart"
          @compositionend="handleComposingEnd"
        ></textarea>
        <div class="f-1" v-if="store.editorNoteType === 'markdown'">
          <div class="mx-4" v-html="outputMarkdown"></div>
        </div>
      </div>
    </div>
    <div
      v-else-if="store.notesLayout === 'list'"
      class="f-1 flex-column"
    >
      <div class="h-4 m-4 text-secondary">
        <span>Type:</span>
        <label>
          <input
            type="radio"
            value="plain"
            name="type"
            v-model="store.editorNoteType"
            @change=handleChangeNoteType
          />Plain
        </label>
        <label>
          <input
            type="radio"
            value="markdown"
            name="type"
            v-model="store.editorNoteType"
            @change="handleChangeNoteType"
          />Markdown
        </label>
      </div>
      <div class="f-1 flex-row divide-x-2 divide-solid divide-color-secondary">
        <div class="f-1 flex-column">
          <div class="">
            <input
              class="p-4 w-full h-12 border-none focus:outline-none text-large font-bold bg-primary"
              type="text"
              ref="refEditorTitle"
              v-model="store.editorNoteTitle"
              @keydown="handleKeyDownOnTitle"
              @keyup="handleKeyUpOnTitle"
              @compositionstart="handleComposingStart"
              @compositionend="handleComposingEnd"
            />
          </div>
          <div class="f-1">
            <textarea
              class="px-4 border-color-default focus:outline-none text-medium border-none font-sans w-full bg-primary h-full pattern-scrollbar-thin"
              v-model="store.editorNoteContent"
              ref="refEditorContent"
              @keydown="handleKeyDownOnContent"
              @keyup="handleKeyUpOnContent"
              @compositionstart="handleComposingStart"
              @compositionend="handleComposingEnd"
            ></textarea>
          </div>
          <div class="text-secondary px-2 h-6">
            <p><AppCode>Command + Enter</AppCode> or <AppCode>Esc</AppCode>: Save</p>
          </div>
        </div>
        <div
          class="f-1"
          v-if="store.editorNoteType === 'markdown'"
        >
          <div class="h-12">
            <span class="text-small text-secondary mx-4">Preview</span>
          </div>
          <div class="mx-4" v-html="outputMarkdown"></div>
        </div>
      </div>
    </div>
  </div>
</template>
