<script setup lang="ts">
import { ref } from 'vue'
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

const isHovered = ref(false)

const handleEdit = (note: Note) => {
  isHovered.value = false
  emit('edit', note)
}
const handleDelete = (e: Event, noteId: string) => {
  e.stopPropagation()
  isHovered.value = false
  emit('delete', noteId)
}
const handleToggleIsPinned = (e: Event, noteId: string) => {
  e.stopPropagation()
  isHovered.value = false
  emit('toggleIsPinned', noteId)
}
</script>

<template>
  <div
    class="border-solid border-color-default border-1"
    :class="{ 'border-t-2 border-color-blue': note.isPinned }"
    @click="handleEdit(note)"
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div>
      <AppTextarea
        :id="note.id"
        :content="note.content"
        :rows="props.layout === 'list' ? 5 : 10"
        :cols="props.layout === 'list' ? 60 : 20"
      />
    </div>
    <div class="h-8 text-right px-4 py-1">
      <AppButton
        @click="handleDelete($event, note.id)"
        text="Delete"
        :hidden="!isHovered"
      />
      <AppButton
        v-if="props.note.isPinned"
        text="Unpin"
        @click="handleToggleIsPinned($event, note.id)"
        :hidden="!isHovered"
      />
      <AppButton
        v-else
        text="Pin"
        @click="handleToggleIsPinned($event, note.id)"
        :hidden="!isHovered"
      />
    </div>
  </div>
</template>
