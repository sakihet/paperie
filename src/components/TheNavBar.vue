<script setup lang="ts">
import { name, version } from '../../package.json'
import { store } from '../store'
import AppButton from '../components/AppButton.vue'
import { useRouter } from 'vue-router';

const router = useRouter()

const capitalize = (str: string) => {
  return str[0].toUpperCase() + str.slice(1)
}
const handleChangeLayout = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  const nextLayout = (value === 'grid' ? 'grid' : 'list')
  store.notesLayout = nextLayout
  store.saveLayout()
}
const handleAdd = (e: Event) => {
  router.push({})
  store.editorNoteTitle = ''
  store.editorNoteContent = ''
  store.openEditorForAdd()
}
</script>

<template>
  <div class="flex-row h-12 border-b-1 shadow">
    <div class="m-2">
      <router-link
        to="/"
        class="inline-block px-4 text-decoration-none text-large text-primary hover rounded"
      >
        <div class="py-1">
          <span class="font-bold">
            {{ capitalize(name) }}
          </span>
          <span class="mx-2 text-small">v{{ version }}</span>
        </div>
      </router-link>
    </div>
    <div class="my-3">
      <AppButton
          text="Add"
          @click="handleAdd"
      />
    </div>
    <div class="f-1 text-right m-2">
      <div class="inline-block">
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
      <div class="inline-block mx-2">
        <button
          class=""
          v-if="store.theme === 'light'"
          @click="store.toggleTheme()"
        >
          Dark
        </button>
        <button
          class=""
          v-else
          @click="store.toggleTheme()"
        >
          Light
        </button>
      </div>
      <button
        class="mx-4 px-2 py-1 border-1 border-solid border-button-default rounded bg-transparent"
        @click="store.dialogKeyboardShortcutsOpen = true"
      >
        ?
      </button>
      <router-link
        to="/about"
        class="inline-block text-decoration-none hover:text-decoration-underline text-secondary hover rounded"
      >
        <div class="inline-block py-2 px-2 font-medium">
          About
        </div>
      </router-link>
      <a
        class="inline-block text-decoration-none hover:text-decoration-underline text-secondary hover rounded"
        href="https://github.com/sakihet/paperie"
      >
        <div class="inline-block py-2 px-2 font-medium">
          GitHub
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>
</style>
