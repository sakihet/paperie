<script setup lang="ts">
import { ref } from 'vue'
import { Note } from '../entities/note'
import { store } from '../store'

const props = defineProps<{
  note: Note,
}>()
const isDropdownOpen = ref(false)
const handleClickDropdown = (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
  isDropdownOpen.value = !(isDropdownOpen.value)
}
const handleDelete = (e: Event) => {
  if (window.confirm("Do you really want to delete?")) {
    store.actions.note.delete(store, props.note.id)
  }
  isDropdownOpen.value = false
}
const handleDuplicate = (e: Event) => {
  store.actions.note.duplicate(store, props.note.id)
  isDropdownOpen.value = false
}
const handleToggleIsPinned = (e: Event) => {
  store.actions.note.toggleIsPinned(store, props.note.id)
  isDropdownOpen.value = false
}
</script>

<template>
  <div class="w-6">
    <details
      class="pattern-dropdown"
      @click="handleClickDropdown($event)"
      :open="isDropdownOpen"
    >
      <summary>
        <div class="h-6 w-6 cursor-pointer user-select-none font-bold text-center hover rounded">
          <span class="">⋮</span>
        </div>
      </summary>
      <div class="w-24">
        <ul class="list-style-none border-solid border-color-default border-1 pl-0 user-select-none cursor-pointer my-1 shadow bg-dropdown rounded text-secondary py-1">
          <li class="h-8 hover">
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
