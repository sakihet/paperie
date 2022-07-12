<script setup lang="ts">
const props = defineProps<{
  text: string
}>()
</script>

<template>
  <button>{{ props.text }}</button>
</template>
