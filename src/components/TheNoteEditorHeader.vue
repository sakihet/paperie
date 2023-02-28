<script setup lang="ts">
import { currentNote, store } from '../store'
import { NoteType } from '../types/noteType';

const handleClick = (e: Event, noteType: NoteType) => {
  store.actions.note.updateNoteType(store, noteType)
}
</script>

<template>
  <div class="text-secondary flex-row">
    <div class="f-1">
      <div class="">
        <button
          class="h-6 border-none text-secondary hover px-2"
          :class="store.editor.noteType === 'plain' ? 'bg-selected-text' : 'bg-transparent'"
          @click="handleClick($event, 'plain')"
        >Plain</button>
        <button
          class="h-6 border-none text-secondary hover px-2"
          :class="store.editor.noteType === 'markdown' ? 'bg-selected-text' : 'bg-transparent'"
          @click="handleClick($event, 'markdown')"
        >Markdown</button>
      </div>
    </div>
    <div>
      <span class="text-small text-secondary">
        {{ currentNote?.updatedAt.toISOString().split('.')[0] }}
      </span>
    </div>
  </div>
</template>
