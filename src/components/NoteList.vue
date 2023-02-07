<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Note } from '../entities/note'
import { store } from '../store'
import NoteItem from '../components/NoteItem.vue'
import { computed } from 'vue';

const route = useRoute()
const handleEdit = (note: Note) => {
  store.actions.openEditorForEdit(store, note)
}
const classObjectHeader = computed(() => ({
  'w-48 text-secondary': store.notesLayout === 'grid',
  'text-secondary': store.notesLayout === 'list'
}))
const classObjectContent = computed(() => ({
  'layout-cluster': store.notesLayout === 'grid',
  'f-1 divide-y-2 divide-solid divide-color-secondary': store.notesLayout === 'list'
}))
</script>

<template>
  <div>
    <div :class="classObjectHeader">
      <div class="flex-row h-8">
        <div class="f-1">Notes</div>
        <div>{{ store.notes.length }}</div>
      </div>
    </div>
    <div :class="classObjectContent">
      <div
        class="bg-primary"
        v-for="note in store.notes"
        :key="note.id"
      >
        <NoteItem
          :layout="store.notesLayout"
          :note="note"
          :selectedNoteId="route.query.noteId?.toString()"
          @edit="handleEdit"
        />
      </div>
    </div>
  </div>
</template>
