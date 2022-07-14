<script setup lang="ts">
const props = defineProps<{
  id: string,
  content: string
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
    rows="8"
    cols="40"
    class="p-2"
    @change="handleChange"
  >{{ props.content }}</textarea>
</template>
