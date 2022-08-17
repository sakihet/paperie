<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TheCommandMenu from './components/TheCommandMenu.vue'
import TheFooter from './components/TheFooter.vue'
import TheNavBar from './components/TheNavBar.vue'
import { store } from './store';

const CommandMenuModifier = 'Meta' // TODO: consider the other OS
const route = useRoute()
const router = useRouter()
store.init()

onMounted(async () => {
  await store.load()
  document.onkeydown = (e: KeyboardEvent) => {
    if (!store.composing) {
      if (!store.isAdding && !store.isEditing && e.key === '+') {
        store.openEditorForAdd()
        store.pressingModifier = false
      } else if (e.key === 'Escape') {
        store.escape()
        router.push({})
      } else if (e.key === CommandMenuModifier) {
        store.pressingModifier = true
      } else if (store.pressingModifier){
        if (e.key === 'k') {
          store.editorDialogOpen = false
          store.commandMenuDialogOpen = !store.commandMenuDialogOpen
          store.pressingModifier = false
        } else if (e.key === 'Enter') {
          store.escape()
          router.push({})
        } else if (e.key === 'Delete') {
          const noteId = route.query.noteId?.toString()
          if (noteId) {
            if (window.confirm("Do you really want to delete?")) {
              store.deleteNote(noteId)
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
  <div id="app-page" class="flex-column">
    <TheNavBar />
    <TheCommandMenu />
    <div class="f-1 mx-4 my-2">
      <router-view />
    </div>
    <TheFooter />
  </div>
</template>

<style>
</style>
