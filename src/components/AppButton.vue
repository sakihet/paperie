<script setup lang="ts">
const props = defineProps<{
  text: string
}>()
</script>

<template>
  <button class="px-4 py-1 text-small border-1 border-color-default shadow">{{ props.text }}</button>
</template>
