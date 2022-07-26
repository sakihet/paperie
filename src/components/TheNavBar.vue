<script setup lang="ts">
import { name, version } from '../../package.json'
</script>

<template>
  <div class="flex-row h-12 border-solid border-color-default border-b-1 px-4">
    <div class="f-1 py-4">{{ version }}</div>
    <div class="f-1 text-center py-4">
      <router-link to="/">
        {{ name }}
      </router-link>
    </div>
    <div class="f-1 text-right py-4">
      <router-link to="/about">
        About
      </router-link>
    </div>
  </div>
</template>

<style scoped>
</style>
