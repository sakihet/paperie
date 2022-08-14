<script setup lang="ts">
const props = defineProps<{
  text: string
}>()
</script>

<template>
  <button class="px-4 py-1 text-small border-2 border-button-default rounded shadow bg-transparent">{{ props.text }}</button>
</template>
