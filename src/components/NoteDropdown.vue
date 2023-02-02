<script setup lang="ts">
import { ref } from 'vue'
import { Note } from '../entities/note';

const props = defineProps<{
  note: Note,
}>()
const emit = defineEmits<{
  (e: 'clickDelete'): void
  (e: 'clickDuplicate'): void
  (e: 'clickToggleIsPinned'): void
}>()
const isDropdownOpen = ref(false)
const handleClickDropdown = (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
  isDropdownOpen.value = !(isDropdownOpen.value)
}
const handleDelete = (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
  emit('clickDelete')
  isDropdownOpen.value = false
}
const handleDuplicate = (e: Event) => {
  emit('clickDuplicate')
  isDropdownOpen.value = false
}
const handleToggleIsPinned = (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
  emit('clickToggleIsPinned')
  isDropdownOpen.value = false
}
</script>

<template>
  <div class="w-8">
    <details
      class="pattern-dropdown"
      @click="handleClickDropdown($event)"
      :open="isDropdownOpen"
    >
      <summary>
        <div class="h-8 w-8 py-1 cursor-pointer user-select-none font-bold text-center hover rounded-4">
          <span class="">⋮</span>
        </div>
      </summary>
      <div class="w-24">
        <ul class="list-style-none border-solid border-color-default border-1 pl-0 user-select-none cursor-pointer my-1 shadow bg-dropdown rounded text-secondary py-1">
          <li
            class="h-8 hover"
          >
            <div
              class="py-2 px-4"
              @click="handleToggleIsPinned($event)"
            >
              <span>{{ props.note.isPinned ? 'Unpin' : 'Pin'}}</span>
            </div>
          </li>
          <li class="h-8 hover">
            <div
              class="py-2 px-4"
              @click="handleDuplicate($event)"
            >
              <span>Duplicate</span>
            </div>
          </li>
          <li class="h-8 hover">
            <div
              class="py-2 px-4"
              @click="handleDelete($event)"
            >
              <span>Delete</span>
            </div>
          </li>
        </ul>
      </div>
    </details>
  </div>
</template>
