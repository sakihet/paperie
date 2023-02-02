<script setup lang="ts">
import { name, version } from '../../package.json'
import { store } from '../store'
import AppButton from '../components/AppButton.vue'
import router from '../router'
import { ref } from 'vue'

const isDropdownOpen = ref(false)
const capitalize = (str: string) => {
  return str[0].toUpperCase() + str.slice(1)
}
const handleChangeLayout = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  const nextLayout = (value === 'grid' ? 'grid' : 'list')
  store.notesLayout = nextLayout
  store.actions.saveLayout(store)
}
const handleToggle = (e: Event) => {
  const elem = e.currentTarget as HTMLDetailsElement
  if (elem.open) {
    isDropdownOpen.value = true
  }
}
const handleDeleteAll = (e: Event) => {
  if (window.confirm("Do you really want to delete?")) {
    store.actions.note.deleteAll(store)
  }
  isDropdownOpen.value = false
  router.push({})
}
</script>

<template>
  <div class="flex-row h-12 border-b-1 border-solid border-color-default px-2">
    <div class="my-2">
      <router-link
        to="/"
        class="inline-block text-decoration-none text-large text-primary hover rounded flex-row h-8"
      >
        <div class="">
          <img src="../assets/paperie.png" height="32" width="32"/>
        </div>
        <div class="pattern-show-when-not-mobile">
          <span class="font-bold">
            {{ capitalize(name) }}
          </span>
        </div>
        <div class="pattern-show-when-not-mobile">
          <span class="mx-2 text-small">
            v{{ version }}
          </span>
        </div>
      </router-link>
    </div>
    <div class="flex-column mx-2">
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
    <div class="flex-column">
      <div class="m-auto mx-2">
        <details
          class="pattern-dropdown"
          :open="isDropdownOpen"
          @toggle="handleToggle($event)"
        >
          <summary>
            <div class="text-secondary">
              <span>…</span>
            </div>
          </summary>
          <div class="">
            <ul class="list-style-none border-solid border-color-default border-1 pl-0 text-secondary bg-dropdown cursor-pointer py-1 rounded">
              <li class="h-8 hover">
                <div
                  class="py-2 px-4"
                  @click="handleDeleteAll($event)"
                >
                  <span>Delete All</span>
                </div>
              </li>
            </ul>
          </div>
        </details>
      </div>
    </div>
    <div class="flex-column nowrap">
      <div class="m-auto">
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
