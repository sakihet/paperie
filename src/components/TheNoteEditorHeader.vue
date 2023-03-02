<script setup lang="ts">
import { currentNote, store } from '../store'
import { NoteType } from '../types/noteType';

const handleClick = (e: Event, noteType: NoteType) => {
  store.actions.note.updateNoteType(store, noteType)
}
</script>

<template>
  <div class="text-secondary flex-row">
    <div class="nowrap f-1">
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
    <div class="nowrap">
      <div class="h-6 flex-row">
        <div class="m-auto">
          <span class="text-small text-secondary text-overflow-ellipsis">
            {{ currentNote?.updatedAt.toISOString().split('.')[0] }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
