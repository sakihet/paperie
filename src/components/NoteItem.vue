<script setup lang="ts">
import { ref } from 'vue'
import { Note } from '../entities/note'
import AppTextarea from '../components/AppTextarea.vue'
import NoteDropdown from './NoteDropdown.vue'

const props = defineProps<{
  layout: string,
  note: Note,
  selectedNoteId: string | undefined
}>()

const emit = defineEmits<{
  (e: 'delete', noteId: string): void
  (e: 'duplicate', noteId: string): void
  (e: 'toggleIsPinned', noteId: string): void
}>()

const isHovered = ref(false)

const handleDelete = (noteId: string) => {
  emit('delete', noteId)
}
const handleDuplicate = (noteId: string) => {
  emit('duplicate', noteId)
}
const handleToggleIsPinned = (noteId: string) => {
  emit('toggleIsPinned', noteId)
}
</script>

<template>
  <router-link
    class="text-decoration-none text-primary"
    :to="`/?noteId=${note.id}`"
  >
    <div
      @mouseover="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <div
        v-if="props.layout === 'grid'"
        class="border-solid border-color-default border-1 shadow rounded flex-column"
        :class="{ 'border-t-2 border-color-blue': note.isPinned, 'w-48': true, 'h-48' : true }"
      >
        <div class="font-semibold p-2 overflow-hidden h-9 text-overflow-ellipsis">
          <span class="">{{ note.title }}</span>
        </div>
        <div class="f-1">
          <AppTextarea
            class="text-secondary bg-primary"
            :id="note.id"
            :content="note.content"
            :rows="7"
            :cols="16"
          />
        </div>
        <div class="h-9 flex-row mx-1">
          <div class="f-1"></div>
          <NoteDropdown
            :note="note"
            @clickDelete="handleDelete(note.id)"
            @clickDuplicate="handleDuplicate(note.id)"
            @clickToggleIsPinned="handleToggleIsPinned(note.id)"
          />
        </div>
      </div>
      <div
        v-else-if="props.layout === 'list'"
        class="h-24"
        :class="{ 'border-l-2 border-color-blue border-solid': note.isPinned, 'bg-selected': note.id === selectedNoteId, 'bg-primary': note.id !== selectedNoteId }"
      >
        <div class="p-2 overflow-hidden h-10 flex-row">
          <div class="f-1 font-semibold overflow-hidden text-overflow-ellipsis">
            <span class="">{{ note.title }}</span>
          </div>
          <div>
            <NoteDropdown
              :note="note"
              @clickDelete="handleDelete(note.id)"
              @clickDuplicate="handleDuplicate(note.id)"
              @clickToggleIsPinned="handleToggleIsPinned(note.id)"
            />
          </div>
        </div>
        <div class="h-18 overflow-hidden text-secondary p-2">
          <div class="text-small">{{ note.content }}</div>
        </div>
      </div>
    </div>
  </router-link>
</template>
