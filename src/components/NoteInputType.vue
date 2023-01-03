<script setup lang="ts">
import { NoteType } from '../types/noteType'

const props = defineProps<{
  noteId: string | null,
  noteType: NoteType
}>()

const emit = defineEmits<{
  (e: 'updateNoteType', value: NoteType): void
}>()

const handleChange = (e: Event) => {
  if (props.noteId) {
    const value = (e.target as HTMLInputElement).value
    emit('updateNoteType', value as NoteType)
  }
}
</script>

<template>
  <div class="h-8 text-secondary m-4">
    <span>Type:</span>
    <label>
      <input
        type="radio"
        value="plain"
        name="type"
        :checked="noteType === 'plain'"
        @change="handleChange"
      />Plain
    </label>
    <label>
      <input
        type="radio"
        value="markdown"
        name="type"
        :checked="noteType === 'markdown'"
        @change="handleChange"
      />Markdown
    </label>
  </div>
</template>
