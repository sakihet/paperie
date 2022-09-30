<script setup lang="ts">
const props = defineProps<{
  text: string
}>()
</script>

<template>
  <button class="px-4 py-1 text-small border-1 border-solid border-button-default rounded bg-transparent">
    {{ props.text }}
  </button>
</template>
