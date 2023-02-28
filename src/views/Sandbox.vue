<script setup lang="ts">
import IconGrid from '../components/IconGrid.vue'
import IconList from '../components/IconList.vue'

</script>

<template>
  <div class="f-1 p-4">
    <div class="layout-center">
      <h2>Sandbox</h2>
      <div class="my-4 flex-row">
        <div class="border-1 border-solid border-button-default divide-solid divide-x rounded">
          <button class="px-4 py-1 text-small border-none bg-transparent hover">Grid</button>
          <button class="px-4 py-1 text-small border-none bg-transparent hover">Layout</button>
        </div>
      </div>
      <div class="">
        <button class="border-none bg-transparent py-0 px-1 hover-icon cursor-pointer rounded h-6">
          <IconGrid class="text-secondary" />
        </button>
        <button class="border-none bg-transparent py-0 px-1 hover-icon cursor-pointer rounded h-6">
          <IconList class="text-secondary" />
        </button>
      </div>
    </div>
  </div>
</template>
