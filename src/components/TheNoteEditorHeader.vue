<script setup lang="ts">
import { store } from '../store'

const handleChange = () => {
  emit('changeNoteType')
}

const emit = defineEmits<{
  (e: 'changeNoteType'): void
}>()
</script>

<template>
  <div class="h-8 text-secondary">
    <label>
      <input
        class="m-0"
        type="radio"
        value="plain"
        name="type"
        v-model="store.editor.noteType"
        @change=handleChange
      />
        <span class="p-2">Plain</span>
    </label>
    <label>
      <input
        class="m-0"
        type="radio"
        value="markdown"
        name="type"
        v-model="store.editor.noteType"
        @change="handleChange"
      />
        <span class="p-2">Markdown</span>
    </label>
  </div>
</template>
