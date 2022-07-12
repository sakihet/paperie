<script setup lang="ts">
const props = defineProps<{
  id: number,
  content: string
}>()
</script>

<template>
  <textarea
    rows="8"
    cols="40"
    class="p-4"
  >{{ props.content }}</textarea>
</template>
