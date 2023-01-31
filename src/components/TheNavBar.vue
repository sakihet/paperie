<script setup lang="ts">
import { name, version } from '../../package.json'
import { store } from '../store'
import AppButton from '../components/AppButton.vue'

const capitalize = (str: string) => {
  return str[0].toUpperCase() + str.slice(1)
}
const handleChangeLayout = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  const nextLayout = (value === 'grid' ? 'grid' : 'list')
  store.notesLayout = nextLayout
  store.actions.saveLayout(store)
}
</script>

<template>
  <div class="flex-row h-12 border-b-1 border-solid border-color-default">
    <router-link
      to="/"
      class="inline-block px-4 text-decoration-none text-large text-primary hover rounded flex-row"
    >
      <div class="py-2">
        <img src="../assets/paperie.png" height="32" width="32"/>
      </div>
      <div class="py-2 pattern-show-when-not-mobile">
        <span class="font-bold">
          {{ capitalize(name) }}
        </span>
      </div>
      <div class="py-3 pattern-show-when-not-mobile">
        <span class="mx-2 text-small">
          v{{ version }}
        </span>
      </div>
    </router-link>
    <div class="flex-column mx-1">
      <div class="m-auto">
        <router-link
          to="/new"
          class="inline-block text-decoration-none hover:text-decoration-underline text-primary hover rounded border-solid border-1 border-button-default"
        >
          <div class="inline-block py-1 px-2 mx-2 text-small">
            Add
          </div>
        </router-link>
      </div>
    </div>
    <div class="flex-column f-1 text-right">
      <div class="inline-block m-auto mx-2 nowrap">
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
    <div class="flex-column">
      <div class="m-auto mx-2">
        <AppButton
          class=""
          @click="store.actions.toggleTheme(store)"
          :text="store.theme === 'light' ? 'Dark' : 'Light' "
        />
      </div>
    </div>
    <div class="flex-column">
      <div class="m-auto mx-2">
        <button
          class="px-2 py-1 border-1 border-solid border-button-default rounded bg-transparent hover"
          @click="store.dialogKeyboardShortcutsOpen = true"
        >
          ?
        </button>
      </div>
    </div>
    <div class="flex-column nowrap">
      <div class="m-auto mx-2">
        <router-link
          class="inline-block text-decoration-none hover:text-decoration-underline text-secondary hover rounded text-small"
          to="/about"
        >
          <div class="inline-block py-2 px-2">
            About
          </div>
        </router-link>
        <a
          class="inline-block text-decoration-none hover:text-decoration-underline text-secondary hover rounded text-small"
          href="https://github.com/sakihet/paperie"
        >
          <div class="inline-block py-2 px-2">
            GitHub
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
