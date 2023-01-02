<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store } from '../store'
import NoteItem from '../components/NoteItem.vue'
import { Note } from '../entities/note'
import AppCode from '../components/AppCode.vue'
import TheNoteEditor from '../components/TheNoteEditor.vue'

const route = useRoute()
const router = useRouter()

const handleAddConfirm = () => {
  store.addConfirm()
  router.push({})
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
  router.push({})
}
const handleDelete = (noteId: string) => {
  if (window.confirm("Do you really want to delete?")) {
    store.deleteNote(noteId)
    router.push({})
  }
}
const handleEdit = (note: Note) => {
  store.openEditorForEdit(note)
}
const handleEditConfirm = () => {
  store.editConfirm()
  router.push({})
}
const handleToggleIsPinned = (noteId: string) => store.toggleNoteIsPinned(noteId)

onMounted(async () => {
  const noteId = route.query.noteId?.toString()
  if (noteId) {
    store.editorDialogOpen = true
    store.isEditing = true
    const note = store.notes.find(x => x.id === noteId)
    if (note) {
      store.editorNoteTitle = note.title
      store.editorNoteContent = note.content
      store.editorNoteType = note.noteType || 'plain'
    } else {
      console.log('not found')
      router.push({})
    }
  }
})
watch (() => route.query.noteId, async (noteIdAfter, noteIdBefore) => {
  if (store.commandMenuDialogOpen) store.commandMenuDialogOpen = false
  if (noteIdAfter) {
    if (noteIdAfter !== noteIdBefore) {
      const noteId = noteIdAfter?.toString()
      if (noteId) {
        store.commandMenuDialogOpen = false
        store.editorDialogOpen = true
        store.isEditing = true
        const note = store.notes.find(x => x.id === noteId)
        if (note) {
          store.editorNoteContent = note.content
          store.editorNoteId = note.id
          store.editorNoteTitle = note.title
          store.editorNoteType = note.noteType || 'plain'
        } else {
          console.log('not found')
          router.push({})
        }
      }
    }
  } else if (!noteIdAfter && noteIdBefore) {
    // TODO: handle loading
    const path = route.path
    if (path !== '/new') {
      store.isAdding = false
      store.isEditing = false
      store.editorDialogOpen = false
    }
  }
})
</script>

<template>
  <div
    v-if="store.notesLayout === 'grid'"
    class="f-1 flex-column"
  >
    <div class="layout-center">
      <div
        class="pattern-mask"
        v-if="store.editorDialogOpen"
        @click="handleCloseEditorDialog"
      ></div>
      <dialog
        class="border-1 border-color-default shadow rounded layout-stack-1 bg-primary"
        :open="store.editorDialogOpen"
        @close="handleClose"
      >
        <TheNoteEditor v-if="store.isAdding || store.isEditing" />
        <div class="flex-row">
          <div class="f-1 text-secondary">
            <small>
              <p><AppCode>Command + Enter</AppCode> or <AppCode>Esc</AppCode>: Save</p>
              <p><AppCode>Command + Delete</AppCode>: Delete</p>
            </small>
          </div>
        </div>
      </dialog>
    </div>
    <div :class="{ 'layout-cluster': true, 'my-4': true }">
      <div
        class="bg-primary"
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
  <div
    v-else-if="store.notesLayout === 'list'"
    class="f-1 flex-column"
  >
    <div class="f-1 flex-row">
      <div
        class="f-1 p-4 flex-column overflow-y-scroll pattern-scrollbar-thin"
        style="height: calc(100vh - 4.5rem);"
      >
        <div class="f-1 divide-y-2 divide-solid divide-color-secondary">
          <div
            v-for="note in store.notes"
            :key="note.id"
            class="bg-secondary"
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
      <div class="f-5 flex-column">
        <TheNoteEditor v-if="store.isAdding || store.isEditing" />
      </div>
    </div>
  </div>
</template>
