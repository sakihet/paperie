<script setup lang="ts">
const props = defineProps<{
  id: string,
  content: string,
  rows: number,
  cols: number
}>()
const emit = defineEmits<{
  (e: 'change', value: string): void
}>()
const handleChange = (event: Event) => {
  emit('change', (event.target as HTMLTextAreaElement).value)
}
</script>

<template>
  <textarea
    :rows="props.rows"
    :cols="props.cols"
    class="px-2 border-none w-100 resize-none focus:outline-none pattern-scrollbar-thin font-sans"
    @change="handleChange"
  >{{ props.content }}</textarea>
</template>
