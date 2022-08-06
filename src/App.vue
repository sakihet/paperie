<script setup lang="ts">
import { onMounted, ref } from 'vue';
import TheCommandMenu from './components/TheCommandMenu.vue'
import TheFooter from './components/TheFooter.vue'
import TheNavBar from './components/TheNavBar.vue'
import { store } from './store';

const CommandMenuModifier = 'Meta' // TODO: consider the other OS
store.init()

onMounted(async () => {
  await store.load()
  document.onkeydown = (e: KeyboardEvent) => {
    if (!store.isAdding && !store.isEditing && e.key === '+') {
      store.isAdding = true
      store.editorDialogOpen = true
      store.commandMenuDialogOpen = false
      store.pressingModifier = false
    } else if (e.key === 'Escape' && !store.composing) {
      store.escape()
    } else if (e.key === CommandMenuModifier && !store.composing) {
      store.pressingModifier = true
    } else if (e.key === 'k' && !store.composing && store.pressingModifier) {
      store.editorDialogOpen = false
      store.commandMenuDialogOpen = !store.commandMenuDialogOpen
      store.pressingModifier = false
    }
  }
  document.onkeyup = (e: KeyboardEvent) => {
    if (e.key === CommandMenuModifier) store.pressingModifier = false
  }
})
</script>

<template>
  <div id="app" class="flex-column">
    <TheNavBar />
    <TheCommandMenu />
    <div class="f-1">
      <router-view />
    </div>
    <TheFooter />
  </div>
</template>

<style>
</style>
