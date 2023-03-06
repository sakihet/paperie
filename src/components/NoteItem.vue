<script setup lang="ts">
import { computed, ref } from 'vue'
import { Note } from '../entities/note'
import { formatDate } from '../utils'
import AppTextarea from '../components/AppTextarea.vue'
import NoteDropdown from './NoteDropdown.vue'
import { store } from '../store'

const props = defineProps<{
  layout: string,
  note: Note,
  selectedNoteId: string | undefined
}>()
const isHovered = ref(false)
const classObject = computed(() => ({
  'w-48 h-48': store.notesLayout === 'grid',
  'h-24': store.notesLayout === 'list',
  'border-t-2 border-color-blue border-solid': props.note.isPinned && store.notesLayout === 'grid',
  'border-l-2 border-color-blue border-solid': props.note.isPinned && store.notesLayout === 'list',
  'bg-selected': props.note.id === props.selectedNoteId
}))
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
      <div :class="classObject">
        <div class="p-2 layout-stack-1">
          <div class="overflow-hidden h-6 flex-row">
            <div class="f-1 font-semibold overflow-hidden text-overflow-ellipsis">
              <span class="nowrap">{{ note.title }}</span>
            </div>
            <div class="w-6">
              <div v-if="isHovered">
                <NoteDropdown :note="note"/>
              </div>
            </div>
          </div>
          <div
            v-if="props.layout === 'grid'"
            class="f-1"
          >
            <AppTextarea
              class="text-secondary bg-primary"
              :id="note.id"
              :content="note.content"
              :rows="8"
              :cols="16"
            />
          </div>
          <div
            v-else-if="props.layout === 'list'"
            class="h-8 overflow-hidden text-secondary"
          >
            <div class="text-small">{{ note.content }}</div>
          </div>
          <div class="h-4 flex-row">
            <div class="text-small text-secondary f-1">
              {{ formatDate(note.updatedAt) }}
            </div>
            <div class="text-small text-secondary text-right border-1 border-solid border-color-default px-1">
              {{ note.noteType }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>
