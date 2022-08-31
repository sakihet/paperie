<script setup lang="ts">
import { name, version } from '../../package.json'
import { store } from '../store'
import AppButton from '../components/AppButton.vue'

const capitalize = (str: string) => {
  return str[0].toUpperCase() + str.slice(1)
}
</script>

<template>
  <div class="flex-row h-12 border-b-1 shadow">
    <div class="m-2">
      <router-link
        to="/"
        class="inline-block px-4 text-decoration-none text-large text-primary hover"
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
          @click="store.openEditorForAdd()"
      />
    </div>
    <div class="f-1 text-right m-2">
      <button
        class="mx-4"
        @click="store.dialogKeyboardShortcutsOpen = true"
      >
        ?
      </button>
      <router-link
        to="/about"
        class="inline-block text-decoration-none hover:text-decoration-underline text-secondary hover"
      >
        <div class="inline-block py-2 px-2 font-medium">
          About
        </div>
      </router-link>
      <a
        class="inline-block text-decoration-none hover:text-decoration-underline text-secondary hover"
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
