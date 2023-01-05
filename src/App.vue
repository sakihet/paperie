<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TheCommandMenu from './components/TheCommandMenu.vue'
import TheFooter from './components/TheFooter.vue'
import TheDialogKeyboardShortcuts from './components/TheDialogKeyboardShortcuts.vue'
import TheNavBar from './components/TheNavBar.vue'
import { store } from './store'

const CommandMenuModifier = 'Meta' // TODO: consider the other OS
const route = useRoute()
const router = useRouter()

const moveToIndex = () => router.push({ path: '/' })

onMounted(async () => {
  await store.actions.init(store)
  document.onkeydown = (e: KeyboardEvent) => {
    if (!store.composing) {
      if (!store.isAdding && !store.isEditing && e.key === '+') {
        store.actions.openEditorForAdd(store)
        store.pressingModifier = false
      } else if (e.key === 'Escape') {
        store.actions.escape(store)
        moveToIndex()
      } else if (e.key === CommandMenuModifier) {
        store.pressingModifier = true
      } else if (store.pressingModifier){
        if (e.key === 'k') {
          store.editorDialogOpen = false
          store.commandMenuDialogOpen = !store.commandMenuDialogOpen
          store.pressingModifier = false
        } else if (e.key === 'Enter') {
          store.actions.escape(store)
          moveToIndex()
        } else if (e.key === 'Delete') {
          const noteId = route.query.noteId?.toString()
          if (noteId) {
            if (window.confirm("Do you really want to delete?")) {
              store.actions.note.delete(store, noteId)
              router.push({})
            }
          }
        }
      }
    }
  }
  document.onkeyup = (e: KeyboardEvent) => {
    if (e.key === CommandMenuModifier) store.pressingModifier = false
  }
})
</script>

<template>
  <div
    id="app-page"
    class="flex-column"
  >
    <TheNavBar />
    <TheCommandMenu />
    <TheDialogKeyboardShortcuts />
    <router-view />
    <TheFooter />
  </div>
</template>

<style>
</style>
