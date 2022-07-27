<script setup lang="ts">
import AppButton from '../components/AppButton.vue'
import AppTextarea from '../components/AppTextarea.vue'
import { Note } from '../entities/note'

const props = defineProps<{
  note: Note,
  layout: string
}>()

const emit = defineEmits<{
  (e: 'delete', noteId: string): void
  (e: 'edit', note: Note): void
  (e: 'toggleIsPinned', noteId: string): void
}>()

const handleEdit = (note: Note) => {
  emit('edit', note)
}
const handleDelete = (e: Event, noteId: string) => {
  e.stopPropagation()
  emit('delete', noteId)
}
const handleToggleIsPinned = (e: Event, noteId: string) => {
  e.stopPropagation()
  emit('toggleIsPinned', noteId)
}
</script>

<template>
  <div
    class="border-solid border-color-default border-1"
    @click="handleEdit(note)"
  >
    <div class="">
      <span v-if="note.isPinned">📌</span>
    </div>
    <div>
      <AppTextarea
        :id="note.id"
        :content="note.content"
        :rows="props.layout === 'list' ? 5 : 10"
        :cols="props.layout === 'list' ? 60 : 20"
      />
    </div>
    <div class="">
      <AppButton
        @click="handleDelete($event, note.id)"
        text="Delete"
      />
      <AppButton
        v-if="props.note.isPinned"
        text="Unpin"
        @click="handleToggleIsPinned($event, note.id)"
      />
      <AppButton
        v-else
        text="Pin"
        @click="handleToggleIsPinned($event, note.id)"
      />
    </div>
  </div>
</template>
