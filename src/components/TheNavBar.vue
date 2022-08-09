<script setup lang="ts">
import { name, version } from '../../package.json'

const capitalize = (str: string) => {
  return str[0].toUpperCase() + str.slice(1)
}
</script>

<template>
  <div class="flex-row h-12 border-b-1 px-4 shadow">
    <div class="f-1 py-4">v{{ version }}</div>
    <div class="f-1 text-center py-2">
      <router-link to="/" class="text-decoration-none text-large">
        {{ capitalize(name) }}
      </router-link>
    </div>
    <div class="f-1 text-right py-4">
      <router-link
        to="/about"
        class="text-decoration-none hover:text-decoration-underline mx-1"
      >
        About
      </router-link>
      <a
        class="p-1 text-decoration-none hover:text-decoration-underline mx-1"
        href="https://github.com/sakihet/papyls"
      >
        GitHub
      </a>
    </div>
  </div>
</template>

<style scoped>
</style>
