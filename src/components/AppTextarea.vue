<script setup lang="ts">
const props = defineProps<{
  id: string,
  content: string,
  rows: number,
  cols: number
}>()
</script>

<template>
  <textarea
    :rows="props.rows"
    :cols="props.cols"
    class="px-2 border-none w-100 resize-none focus:outline-none pattern-scrollbar-thin font-sans"
  >{{ props.content }}</textarea>
</template>
