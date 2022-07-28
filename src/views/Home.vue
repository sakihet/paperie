<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { ref, nextTick, watch } from 'vue'
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
  if (value === 'grid') {
    router.push({ path: '/', query: { view: 'grid' }})
  } else {
    router.push({ path: '/' })
  }
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
const handleToggleIsPinned = (noteId: string) => {
  store.toggleNoteIsPinned(noteId)
}
store.init()
if (route.query.view === 'grid') {
  store.notesLayout = 'grid'
} else {
  store.notesLayout = 'list'
}
watch(
  () => route.query,
  async () => {
    if (route.query.view === 'grid') {
      store.notesLayout = 'grid'
    } else {
      store.notesLayout = 'list'
    }
  }
)
</script>

<template>
  <div class="layout-center px-4">
    <div class="my-4">
      <div class="">
        <AppButton
          text="Add"
          @click="handleAdd"
        />
      </div>
    </div>
    <div class="my-4">
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
          />
        </div>
        <textarea
          class="px-2 border-color-default focus:outline-none text-medium border-none"
          rows="16"
          cols="60"
          v-model="noteContent"
          ref="refEditor"
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
