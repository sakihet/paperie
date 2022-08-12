<script setup lang="ts">
import { ref, nextTick, onMounted, watch, onUpdated, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store } from '../store'
import AppButton from '../components/AppButton.vue'
import NoteItem from '../components/NoteItem.vue'
import { Note } from '../entities/note'

const route = useRoute()
const router = useRouter()
const refEditorContent = ref<HTMLElement | null>(null)
const refEditorTitle = ref<HTMLElement | null>(null)

const handleAdd = () => {
  store.openEditorForAdd()
}
const handleAddConfirm = () => {
  store.addConfirm()
}
const handleChangeLayout = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  const nextLayout = (value === 'grid' ? 'grid' : 'list')
  store.notesLayout = nextLayout
  store.saveLayout()
}
const handleClose = () => {
  store.isAdding = false
  store.isEditing = false
  store.editorDialogOpen = false
}
const handleCloseEditorDialog = () => {
  if (store.isEditing) {
    handleEditConfirm()
  } else if (store.isAdding) {
    handleAddConfirm()
  } else {
    console.log('error')
  }
}
const handleDelete = (noteId: string) => {
  if (window.confirm("Do you really want to delete?")) store.deleteNote(noteId)
}
const handleEdit = (note: Note) => {
  router.push({query: {'noteId': `${note.id}`}})
  store.openEditorForEdit(note)
}
const handleEditConfirm = () => {
  router.push({})
  store.editConfirm()
}
const handleKeyDownOnContent = (e: KeyboardEvent) => {
  const target = (e.target as HTMLTextAreaElement)
  if (e.key === 'ArrowUp' && !store.composing && target.selectionStart === 0) {
    setTimeout(() => focusEditorTitle(), 100)
  }
}
const handleKeyDownOnTitle = (e: KeyboardEvent) => {
  if ((e.key === 'ArrowDown' || e.key === 'Enter') && !store.composing) {
    setTimeout(() => focusEditorContent(), 100)
  }
}
const handleToggleIsPinned = (noteId: string) => store.toggleNoteIsPinned(noteId)
const handleComposingStart = () => store.composing = true
const handleComposingEnd = () => store.composing = false

onMounted(async () => {
  const noteId = route.query.noteId?.toString()
  if (noteId) {
    store.editorDialogOpen = true
    store.isEditing = true
    const note = store.notes.find(x => x.id === noteId)
    if (note) {
      store.editorNoteTitle = note.title
      store.editorNoteContent = note.content
    } else {
      console.log('not found')
      router.push({})
    }
  }
})
watch (() => route.query.noteId, async (queryNoteId) => {
  if (store.commandMenuDialogOpen) store.commandMenuDialogOpen = false
  const noteId = queryNoteId?.toString()
  if (noteId) {
    store.commandMenuDialogOpen = false
    store.editorDialogOpen = true
    store.isEditing = true
    const note = store.notes.find(x => x.id === noteId)
    if (note) {
      store.editorNoteContent = note.content
      store.editorNoteId = note.id
      store.editorNoteTitle = note.title
    } else {
      console.log('not found')
      router.push({})
    }
  }
})
watchEffect(() => {
  if (store.isAdding) {
    setTimeout(() => focusEditorTitle(), 100)
  } else if (store.isEditing) {
    setTimeout(() => focusEditorContent(), 100)
  }
})
const focusEditorContent = () => {
  refEditorContent.value?.focus()
}
const focusEditorTitle = () => {
  refEditorTitle.value?.focus()
}
</script>

<template>
  <div class="layout-center px-4">
    <div class="h-8 my-2">
      <div class="">
        <AppButton
          text="Add"
          @click="handleAdd"
        />
      </div>
    </div>
    <div class="h-8 my-2">
      <div class="text-right">
        <label>
          <input
            type="radio"
            name="layout"
            value="grid"
            @change="handleChangeLayout"
            v-model="store.notesLayout"
          >
            Grid
        </label>
        <label>
          <input
            type="radio"
            name="layout"
            value="list"
            @change="handleChangeLayout"
            v-model="store.notesLayout"
          >
            List
        </label>
      </div>
    </div>
    <div class="text-secondary">
      <small>
        <p>Keyboard shortcuts (experimental):</p>
        <p>+: Add a new note, esc: Save the note, command + k: Open the command menu</p>
      </small>
    </div>
    <div>
      <div
        class="pattern-mask"
        v-if="store.editorDialogOpen"
        @click="handleCloseEditorDialog"
      ></div>
      <dialog
        class="border-1 border-color-default shadow"
        :open="store.editorDialogOpen"
        @close="handleClose"
      >
        <div>
          <input
            class="p-2 w-100 h-8 border-none focus:outline-none text-medium font-bold"
            type="text"
            ref="refEditorTitle"
            v-model="store.editorNoteTitle"
            @keydown="handleKeyDownOnTitle"
            @compositionstart="handleComposingStart"
            @compositionend="handleComposingEnd"
          />
        </div>
        <textarea
          class="px-2 border-color-default focus:outline-none text-medium border-none"
          rows="16"
          cols="60"
          v-model="store.editorNoteContent"
          ref="refEditorContent"
          @keydown="handleKeyDownOnContent"
          @compositionstart="handleComposingStart"
          @compositionend="handleComposingEnd"
        ></textarea>
        <div class="flex-row">
          <div class="f-1 text-secondary">
            <small>
              <p>Esc: Save and close the dialog</p>
            </small>
          </div>
        </div>
      </dialog>
    </div>
    <div :class="{ 'layout-cluster': store.notesLayout === 'grid', 'layout-stack-4': store.notesLayout === 'list', 'my-6': true }">
      <div
        class="bg-white"
        v-for="note in store.notes"
        :key="note.id"
      >
        <NoteItem
          :note="note"
          :layout="store.notesLayout"
          @delete="handleDelete"
          @edit="handleEdit"
          @toggleIsPinned="handleToggleIsPinned"
        />
      </div>
    </div>
  </div>
</template>
