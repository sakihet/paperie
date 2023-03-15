<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TheFooter from './components/TheFooter.vue'
import TheNavBar from './components/TheNavBar.vue'
import { store } from './store'

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
    }
  }
})
</script>

<template>
  <TheNavBar />
  <router-view />
  <TheFooter />
</template>

<style>
</style>
