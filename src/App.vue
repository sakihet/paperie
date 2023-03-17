<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TheCommandMenu from './components/TheCommandMenu.vue'
import TheFooter from './components/TheFooter.vue'
import TheNavBar from './components/TheNavBar.vue'
import { commandMenuModifiler, store } from './store'

const router = useRouter()
const moveToIndex = () => router.push({ path: '/' })

onMounted(async () => {
  await store.actions.init(store)
  document.onkeydown = (e: KeyboardEvent) => {
    if (!store.composing) {
      if (e.key === 'Escape') {
        store.actions.createOrUpdateNote(store)
        moveToIndex()
      }
      if (e.key === commandMenuModifiler) {
        store.pressingCommandMenuModifier = true
      }
      if (e.key === 'k' && store.pressingCommandMenuModifier) {
        if (store.commandMenuOpen) {
          store.commandMenuOpen = false
        } else {
          store.commandMenuOpen = true
        }
      }
    }
  }
  document.onkeyup = (e: KeyboardEvent) => {
    if (e.key === commandMenuModifiler) {
      store.pressingCommandMenuModifier = false
    }
  }
})
</script>

<template>
  <TheNavBar />
  <TheCommandMenu />
  <router-view />
  <TheFooter />
</template>

<style>
</style>
