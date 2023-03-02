<script setup lang="ts">
import { name, version } from '../../package.json'
import { store } from '../store'
import IconDarkMode from '../components/IconDarkMode.vue'
import IconLightMode from '../components/IconLightMode.vue'
import IconGrid from '../components/IconGrid.vue'
import IconList from '../components/IconList.vue'
import { LayoutType } from '../types/layoutType'

const capitalize = (str: string) => {
  return str[0].toUpperCase() + str.slice(1)
}
const handleChangeLayout = (layout: LayoutType) => {
  store.notesLayout = layout
  store.actions.saveLayout(store)
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
    <div class="f-1"></div>
    <div class="flex-column h-12 mx-3">
      <div class="m-auto">
        <div class="">
          <button
            class="border-none py-0 px-1 hover-icon cursor-pointer rounded h-6"
            :class="store.notesLayout === 'grid' ? 'bg-icon-selected' : 'bg-transparent'"
            @click="handleChangeLayout('grid')"
          >
            <IconGrid class="text-secondary" />
          </button>
          <button
            class="border-none py-0 px-1 hover-icon cursor-pointer rounded h-6"
            :class="store.notesLayout === 'list' ? 'bg-icon-selected' : 'bg-transparent'"
            @click="handleChangeLayout('list')"
          >
            <IconList class="text-secondary" />
          </button>
        </div>
      </div>
    </div>
    <div class="flex-column mx-3">
      <div class="m-auto">
        <button class="border-none bg-transparent p-0">
          <IconDarkMode
            class="text-secondary"
            v-if="store.theme === 'light'"
            @click="store.actions.toggleTheme(store)"
          />
          <IconLightMode
            class="text-secondary"
            v-else
            @click="store.actions.toggleTheme(store)"
          />
        </button>
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
