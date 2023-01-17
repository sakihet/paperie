<script setup lang="ts">
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store } from '../store'
import NoteItem from '../components/NoteItem.vue'
import { Note } from '../entities/note'
import TheNoteEditor from '../components/TheNoteEditor.vue'

const route = useRoute()
const router = useRouter()

const handleAddConfirm = () => {
  store.actions.note.create(store)
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
    store.actions.note.delete(store, noteId)
    router.push({})
  }
}
const handleEdit = (note: Note) => {
  store.actions.openEditorForEdit(store, note)
}
const handleEditConfirm = () => {
  store.actions.note.update(store)
  router.push({})
}
const handleInputNote = () => {
  store.actions.createOrUpdateNote(store)
}
const handleToggleIsPinned = (noteId: string) => {
  store.actions.note.toggleIsPinned(store, noteId)
}

watch (() => store.isLoaded, async (after, before) => {
  if (after) {
    if (route.query.noteId) {
      const note = store.notes.find(x => x.id === route.query.noteId)
      if (note) {
        store.editorDialogOpen = true
        store.isEditing = true
        store.editor = {
          noteContent: note.content,
          noteId: note.id,
          noteTitle: note.title,
          noteType: note.noteType || 'plain'
        }
      }
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
          store.editor = {
            noteContent: note.content,
            noteId: note.id,
            noteTitle: note.title,
            noteType: note.noteType || 'plain'
          }
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
    class="f-1 flex-column mx-4"
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
        <TheNoteEditor
          v-if="store.isAdding || store.isEditing"
          @input-note="handleInputNote"
        />
      </dialog>
    </div>
    <div class="flex-row w-48 py-4 text-secondary">
      <div class="f-1">Notes</div>
      <div>{{ store.notes.length }}</div>
    </div>
    <div :class="{ 'layout-cluster': true, 'my-4': true }">
      <div
        class="bg-primary"
        v-for="note in store.notes"
        :key="note.id"
      >
        <NoteItem
          :layout="store.notesLayout"
          :note="note"
          :selectedNoteId="route.query.noteId?.toString()"
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
        class="w-64 p-4 flex-column overflow-y-scroll pattern-scrollbar-thin"
        style="height: calc(100vh - 4.5rem);"
      >
        <div class="flex-row h-8 text-secondary">
          <div class="f-1">Notes</div>
          <div>{{ store.notes.length }}</div>
        </div>
        <div class="f-1 divide-y-2 divide-solid divide-color-secondary">
          <div
            v-for="note in store.notes"
            :key="note.id"
            class="bg-secondary"
          >
            <NoteItem
              :layout="store.notesLayout"
              :note="note"
              :selectedNoteId="route.query.noteId?.toString()"
              @delete="handleDelete"
              @edit="handleEdit"
              @toggleIsPinned="handleToggleIsPinned"
            />
          </div>
        </div>
      </div>
      <div class="f-1 flex-column">
        <TheNoteEditor
          v-if="store.isAdding || store.isEditing"
          @input-note="handleInputNote"
        />
      </div>
    </div>
  </div>
</template>
