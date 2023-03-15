<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { sidebarWidthDefault, store } from '../store'
import NoteList from '../components/NoteList.vue'
import TheNoteEditor from '../components/TheNoteEditor.vue'

const route = useRoute()
const router = useRouter()

const handleClose = () => {
  store.isAdding = false
  store.isEditing = false
  store.editorDialogOpen = false
}
const handleCloseEditorDialog = () => {
  if (store.isEditing) {
    handleEditConfirm()
  } else if (store.isAdding) {
  } else {
    console.log('error')
  }
  router.push({ path: '/'})
}
const handleDblclick = (e: Event) => {
  store.actions.updateSettings(store, {...store.settings, sidebarWidth: sidebarWidthDefault})
}
const handleEditConfirm = () => {
  store.actions.note.update(store)
  router.push({})
}
const resizeBarDowned = ref(false)
const resizePosX = ref(0)
const sidebarWidthMin = 160
const sidebarWidthMax = 480
const handleMousedown = (e: Event) => {
  if (!resizeBarDowned.value) {
    resizeBarDowned.value = true
    const target = (e.target as HTMLButtonElement)
    resizePosX.value = target.getBoundingClientRect().x
  }
}
const handleMousemove = (e: Event) => {
  if (resizeBarDowned.value) {
    const mouseEvent = e as MouseEvent
    const clientX = mouseEvent.clientX
    if (sidebarWidthMin <= clientX && clientX <= sidebarWidthMax) {
      store.settings.sidebarWidth = mouseEvent.clientX
    }
  }
}
const handleMouseup = (e: Event) => {
  if (resizeBarDowned.value) {
    resizeBarDowned.value = false
    store.actions.updateSettings(store, store.settings)
  }
}
const handleInputNote = () => {
  store.actions.createOrUpdateNote(store)
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
    class="f-1 flex-column m-4"
  >
    <div class="layout-center">
      <div
        class="pattern-mask"
        v-if="store.editorDialogOpen"
        @click="handleCloseEditorDialog"
      ></div>
      <dialog
        class="border-none p-0"
        :open="store.editorDialogOpen"
        @close="handleClose"
      >
        <div class="border-1 border-color-default border-solid shadow rounded layout-stack-1 bg-primary h-192 w-196 flex-column">
          <TheNoteEditor
            v-if="store.isAdding || store.isEditing"
            @input-note="handleInputNote"
          />
        </div>
      </dialog>
    </div>
    <NoteList />
  </div>
  <div
    v-else-if="store.notesLayout === 'list'"
    class="f-1 flex-column"
  >
    <div
      class="f-1 flex-row"
      @mousemove="handleMousemove"
      @mouseup="handleMouseup"
    >
      <div
        class="py-4 pl-4 flex-column"
        style="height: calc(100vh - 4.5rem);"
        :style="{ width: `${store.settings.sidebarWidth}px` }"
      >
        <NoteList />
      </div>
      <div>
        <button
          class="h-full w-4 bg-transparent border-none text-tertiary cursor-ew-resize"
          @mousedown="handleMousedown"
          @dblclick="handleDblclick"
        >|</button>
      </div>
      <div
        class="f-1 flex-column overflow-hidden"
        style="height: calc(100vh - 4.5rem);"
      >
        <TheNoteEditor
          v-if="store.isAdding || store.isEditing"
          @input-note="handleInputNote"
          class="overflow-hidden"
        />
      </div>
    </div>
  </div>
</template>
