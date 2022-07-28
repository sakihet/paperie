<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import TheFooter from './components/TheFooter.vue'
import TheNavBar from './components/TheNavBar.vue'
</script>

<template>
  <div id="app" class="flex-column">
    <TheNavBar />
    <div class="f-1">
      <router-view />
    </div>
    <TheFooter />
  </div>
</template>

<style>
</style>
