<script setup lang="ts">
import { currentNote, store } from '../store'

const handleChange = () => {
  store.actions.note.updateNoteType(store)
}
</script>

<template>
  <div class="h-8 text-secondary flex-row">
    <div class="f-1">
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
    <div>
      <span class="text-small text-secondary">
        {{ currentNote?.updatedAt.toISOString().split('.')[0] }}
      </span>
    </div>
  </div>
</template>
