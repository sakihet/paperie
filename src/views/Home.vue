<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { ref, nextTick, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store } from '../store'
import AppButton from '../components/AppButton.vue'
import NoteItem from '../components/NoteItem.vue'
import { Note } from '../entities/note'

const route = useRoute()
const router = useRouter()
const isAdding = ref(false)
const isEditing = ref(false)
const editingNoteId = ref<string | null>(null)
const dialogOpen = ref(false)
const noteContent = ref("")
const noteTitle = ref("")
const refEditor = ref<HTMLElement | null>(null)
const refEditorTitle = ref<HTMLElement | null>(null)
const composing = ref(false)

const handleAdd = async () => {
  isAdding.value = true
  dialogOpen.value = true
  await nextTick()
  refEditorTitle.value?.focus()
}
const handleAddConfirm = () => {
  const id = uuidv4()
  const date = new Date()
  const note: Note = {
    id: id,
    title: noteTitle.value,
    content: noteContent.value,
    isPinned: false,
    createdAt: date,
    updatedAt: date
  }
  store.addNote(note)
  dialogOpen.value = false
  isAdding.value = false
  isEditing.value = false
  noteContent.value = ''
  noteTitle.value = ''
}
const handleCancel = () => {
  noteContent.value = ''
  noteTitle.value = ''
  isAdding.value = false
  isEditing.value = false
  dialogOpen.value = false
}
const handleChangeLayout = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  const nextLayout = (value === 'grid' ? 'grid' : 'list')
  store.notesLayout = nextLayout
  store.saveLayout()
}
const handleClose = () => {
  isAdding.value = false
  isEditing.value = false
  dialogOpen.value = false
}
const handleDelete = (noteId: string) => {
  if (window.confirm("Do you really want to delete?")) {
    store.deleteNote(noteId)
  }
}
const handleEdit = async (note: Note) => {
  isEditing.value = true
  dialogOpen.value = true
  editingNoteId.value = note.id
  noteTitle.value = note.title
  noteContent.value = note.content
  await nextTick()
  refEditor.value?.focus() // TODO
}
const handleEditConfirm = () => {
  const id = editingNoteId.value
  if (id) {
    store.updateNote(id, noteTitle.value, noteContent.value)
  }
  editingNoteId.value = null
  noteContent.value = ''
  noteTitle.value = ''
  dialogOpen.value = false
  isEditing.value = false
}
const handleKeyDownOnContent = (e: KeyboardEvent) => {
  const target = (e.target as HTMLTextAreaElement)
  if (e.key === 'ArrowUp' && !composing.value && target.selectionStart === 0) {
    refEditorTitle.value?.focus()
  } else if (e.key === 'Escape' && !composing.value) {
    if (isAdding.value) {
      handleAddConfirm()
    } else if (isEditing.value) {
      handleEditConfirm()
    } else {
    }
  }
}
const handleKeyDownOnTitle = (e: KeyboardEvent) => {
  if ((e.key === 'ArrowDown' || e.key === 'Enter') && !composing.value) {
    setTimeout(() => {
      refEditor.value?.focus()
    }, 100)
  } else if (e.key === 'Escape' && !composing.value) {
    if (noteTitle.value.length === 0) {
      handleCancel()
    } else if (isAdding.value) {
      handleAddConfirm()
    } else if (isEditing.value) {
      handleEditConfirm()
    } else {
    }
  }
}
const handleToggleIsPinned = (noteId: string) => {
  store.toggleNoteIsPinned(noteId)
}
const handleComposingStart = () => {
  composing.value = true
}
const handleComposingEnd = () => {
  composing.value = false
}
store.init()
onMounted(() => {
  document.onkeydown = (e: KeyboardEvent) => {
    if (!isAdding.value && !isEditing.value && e.key === '+') {
      isAdding.value = true
      dialogOpen.value = true
      setTimeout(() => {
        refEditorTitle.value?.focus()
      }, 100)
    }
  }
})
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
            value="list"
            @change="handleChangeLayout"
            v-model="store.notesLayout"
          >
            List
        </label>
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
      </div>
    </div>
    <div class="text-secondary">
      <small>
        <p>Keyboard shortcuts (experimental):</p>
        <p>+: Add a new note, esc: Save the note</p>
      </small>
    </div>
    <div>
      <dialog
        class="border-1 border-color-default"
        :open="dialogOpen"
        @close="handleClose"
      >
        <div>
          <input
            type="text"
            class="p-2 w-100 h-8 border-none focus:outline-none text-medium font-bold"
            ref="refEditorTitle"
            v-model="noteTitle"
            @keydown="handleKeyDownOnTitle"
            @compositionstart="handleComposingStart"
            @compositionend="handleComposingEnd"
          />
        </div>
        <textarea
          class="px-2 border-color-default focus:outline-none text-medium border-none"
          rows="16"
          cols="60"
          v-model="noteContent"
          ref="refEditor"
          @keydown="handleKeyDownOnContent"
          @compositionstart="handleComposingStart"
          @compositionend="handleComposingEnd"
        ></textarea>
        <div class="h-6 text-right my-1">
          <AppButton
            text="Cancel"
            @click="handleCancel"
          />
          <AppButton
            v-if="isAdding"
            text="Confirm"
            @click="handleAddConfirm"
          />
          <AppButton
            v-if="isEditing"
            text="Update"
            @click="handleEditConfirm"
          />
        </div>
      </dialog>
    </div>
    <div :class="{ 'layout-cluster': store.notesLayout === 'grid', 'layout-stack-4': store.notesLayout === 'list', 'my-8': true }">
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
