<script setup lang="ts">
const props = defineProps<{
  text: string
}>()
</script>

<template>
  <button class="px-4 py-1">{{ props.text }}</button>
</template>
