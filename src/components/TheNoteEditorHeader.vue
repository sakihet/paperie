<script setup lang="ts">
import { Ref, ref } from 'vue'
import { currentNote, store } from '../store'
import { NoteType } from '../types/noteType'
import { formatDate } from '../utils'
import NoteDropdown from './NoteDropdown.vue'

type dateType = 'updated' | 'created'

const dateType: Ref<dateType> = ref('updated')

const handleClickDate = (e: Event) => {
  if (dateType.value === 'updated') {
    dateType.value = 'created'
  } else {
    dateType.value = 'updated'
  }
}
const handleClickNoteType = (e: Event, noteType: NoteType) => {
  store.actions.note.updateNoteType(store, noteType)
}
</script>

<template>
  <div class="text-secondary flex-row">
    <div class="nowrap f-1">
      <button
        class="h-6 border-none text-secondary hover px-2 cursor-pointer"
        :class="store.editor.noteType === 'plain' ? 'bg-selected-text' : 'bg-transparent'"
        @click="handleClickNoteType($event, 'plain')"
      >Plain</button>
      <button
        class="h-6 border-none text-secondary hover px-2 cursor-pointer"
        :class="store.editor.noteType === 'markdown' ? 'bg-selected-text' : 'bg-transparent'"
        @click="handleClickNoteType($event, 'markdown')"
      >Markdown</button>
    </div>
    <div class="nowrap">
      <NoteDropdown
        :note="currentNote"
        v-if="currentNote"
      />
    </div>
    <div class="nowrap">
      <div class="h-6 flex-row">
        <div class="m-auto">
          <span
            class="text-small text-secondary text-overflow-ellipsis cursor-pointer user-select-none"
            v-if="currentNote?.createdAt && dateType === 'created'"
            @click="handleClickDate"
          >
            Created: {{ formatDate(currentNote?.createdAt!) }}
          </span>
          <span
            class="text-small text-secondary text-overflow-ellipsis cursor-pointer user-select-none"
            v-if="currentNote?.updatedAt && dateType === 'updated'"
            @click="handleClickDate"
          >
            Updated: {{ formatDate(currentNote?.updatedAt!) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
