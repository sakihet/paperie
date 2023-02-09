<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import { Note } from '../entities/note'
import { notesSorted, store } from '../store'
import NoteItem from '../components/NoteItem.vue'

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
const isDropdownOpen = ref(false)
const handleDeleteAll = (e: Event) => {
  if (window.confirm("Do you really want to delete?")) {
    store.actions.note.deleteAll(store)
  }
  isDropdownOpen.value = false
}
const handleToggle = (e: Event) => {
  const elem = e.currentTarget as HTMLDetailsElement
  if (elem.open) {
    isDropdownOpen.value = true
  }
}
</script>

<template>
  <div>
    <div :class="classObjectHeader">
      <div class="flex-row h-8">
        <div class="f-1">Notes</div>
        <div class="mx-2">{{ store.notes.length }}</div>
        <div class="w-6">
          <details
            class="pattern-dropdown"
            @toggle="handleToggle($event)"
            :open="isDropdownOpen"
          >
            <summary>
              <div class="cursor-pointer user-select-none font-bold text-center hover">
                <span class="">⋮</span>
              </div>
            </summary>
            <div class="w-28">
              <ul class="list-style-none border-solid border-color-default border-1 pl-0 user-select-none cursor-pointer my-1 shadow bg-dropdown rounded text-secondary py-1">
                <li class="h-8 hover">
                  <div
                    class="py-2 px-4"
                    @click="handleDeleteAll($event)"
                  >
                    <span>Delete all</span>
                  </div>
                </li>
              </ul>
            </div>
          </details>
        </div>
      </div>
      <div class="h-6 mb-2 text-right">
        <select
          class="h-6 px-2 border-solid border-1 border-color-default text-secondary bg-secondary text-small"
          v-model="store.sortKey"
        >
          <option value="updated">Last updated</option>
          <option value="created">Last created</option>
          <option value="title">Title</option>
        </select>
      </div>
    </div>
    <div :class="classObjectContent">
      <div
        class="bg-primary"
        v-for="note in notesSorted"
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
