<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { ref, nextTick, onMounted, watch } from 'vue'
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
const editorDialogOpen = ref(false)
const commandMenuDialogOpen = ref(false)
const refCommandMenuInput = ref<HTMLElement | null>(null)
const noteContent = ref("")
const noteTitle = ref("")
const refEditorContent = ref<HTMLElement | null>(null)
const refEditorTitle = ref<HTMLElement | null>(null)
const composing = ref(false)
const pressingMeta = ref(false)

const handleAdd = async () => {
  isAdding.value = true
  editorDialogOpen.value = true
  commandMenuDialogOpen.value = false
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
  editorDialogOpen.value = false
  isAdding.value = false
  isEditing.value = false
  noteContent.value = ''
  noteTitle.value = ''
}
const handleCancel = () => {
  router.push({})
  noteContent.value = ''
  noteTitle.value = ''
  isAdding.value = false
  isEditing.value = false
  editorDialogOpen.value = false
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
  editorDialogOpen.value = false
}
const handleDelete = (noteId: string) => {
  if (window.confirm("Do you really want to delete?")) store.deleteNote(noteId)
}
const handleEdit = async (note: Note) => {
  router.push({query: {'noteId': `${note.id}`}})
  isEditing.value = true
  editorDialogOpen.value = true
  editingNoteId.value = note.id
  noteTitle.value = note.title
  noteContent.value = note.content
  await nextTick()
  refEditorContent.value?.focus()
}
const handleEditConfirm = () => {
  router.push({})
  const id = editingNoteId.value
  if (id) store.updateNote(id, noteTitle.value, noteContent.value)
  editingNoteId.value = null
  noteContent.value = ''
  noteTitle.value = ''
  editorDialogOpen.value = false
  isEditing.value = false
}
const handleKeyDownOnContent = (e: KeyboardEvent) => {
  const target = (e.target as HTMLTextAreaElement)
  if (e.key === 'ArrowUp' && !composing.value && target.selectionStart === 0) {
    refEditorTitle.value?.focus()
  }
}
const handleKeyDownOnTitle = (e: KeyboardEvent) => {
  if ((e.key === 'ArrowDown' || e.key === 'Enter') && !composing.value) {
    setTimeout(() => refEditorContent.value?.focus(), 100)
  }
}
const handleToggleIsPinned = (noteId: string) => store.toggleNoteIsPinned(noteId)
const handleComposingStart = () => composing.value = true
const handleComposingEnd = () => composing.value = false
store.init() // TODO: fix double load

onMounted(async () => {
  document.onkeydown = async (e: KeyboardEvent) => {
    if (!isAdding.value && !isEditing.value && e.key === '+') {
      isAdding.value = true
      editorDialogOpen.value = true
      commandMenuDialogOpen.value = false
      pressingMeta.value = false
      setTimeout(() => refEditorTitle.value?.focus(), 100)
    } else if (e.key === 'Escape' && !composing.value) {
      if (noteTitle.value.length === 0) {
        handleCancel()
      } else if (isAdding.value) {
        handleAddConfirm()
      } else if (isEditing.value) {
        handleEditConfirm()
      } else {
      }
    } else if (e.key === 'Meta' && !composing.value) {
      pressingMeta.value = true
    } else if (e.key === 'k' && !composing.value && pressingMeta.value) {
      commandMenuDialogOpen.value = !commandMenuDialogOpen.value
      if (commandMenuDialogOpen.value) {
        await nextTick()
        refCommandMenuInput.value?.focus()
      }
      pressingMeta.value = false
    }
  }
  document.onkeyup = (e: KeyboardEvent) => {
    if (e.key === 'Meta') pressingMeta.value = false
  }
  await store.load()
  const noteId = route.query.noteId?.toString()
  if (noteId) {
    editorDialogOpen.value = true
    isEditing.value = true
    editingNoteId.value = noteId
    const note = store.notes.find(x => x.id === noteId)
    if (note) {
      noteTitle.value = note.title
      noteContent.value = note.content
    } else {
      console.log('not found')
      router.push({})
    }
  }
})
watch (() => route.query.noteId, async (queryNoteId) => {
  if (commandMenuDialogOpen.value) commandMenuDialogOpen.value = false
  const noteId = queryNoteId?.toString()
  if (noteId) {
    commandMenuDialogOpen.value = false
    editorDialogOpen.value = true
    isEditing.value = true
    editingNoteId.value = noteId
    const note = store.notes.find(x => x.id === noteId)
    if (note) {
      noteTitle.value = note.title
      noteContent.value = note.content
      await nextTick()
      refEditorContent.value?.focus()
    } else {
      console.log('not found')
      router.push({})
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
      <dialog
        class="border-1 border-color-default"
        :open="editorDialogOpen"
        @close="handleClose"
      >
        <div>
          <input
            class="p-2 w-100 h-8 border-none focus:outline-none text-medium font-bold"
            type="text"
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
          ref="refEditorContent"
          @keydown="handleKeyDownOnContent"
          @compositionstart="handleComposingStart"
          @compositionend="handleComposingEnd"
        ></textarea>
        <div class="flex-row">
          <div class="f-1 text-secondary">
            <small>
              <p>Esc: Save the note</p>
            </small>
          </div>
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
        </div>
      </dialog>
    </div>
    <div class="">
      <dialog
        class="border-color-default"
        :open="commandMenuDialogOpen"
      >
        <div>
          <div class="h-8">
            <input
              class="w-full border-color-default"
              type="text"
              placeholder="Under constrcution..."
              ref="refCommandMenuInput"
            />
          </div>
          <div>
            <hr />
            <ul class="list-style-none pl-0 my-2">
              <li
                class="h-8"
                v-for="note in store.notes"
                :key="note.id"
              >
                <router-link
                  class="text-decoration-none"
                  :to="{ path: '/', query: { noteId: note.id} }"
                >
                  {{ note.title }}
                </router-link>
              </li>
            </ul>
            <hr />
          </div>
          <div>
            <div class="f-1 text-secondary">
              <small>
                <p>command + k: Close the command menu</p>
              </small>
            </div>
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
