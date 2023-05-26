<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import { Note } from '../entities/note'
import { notesResult, store } from '../store'
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
  <div class="overflow-y-hidden flex-column">
    <div :class="classObjectHeader">
      <div class="layout-stack-2">
        <div class="flex-row h-6">
          <div class="f-1">
            <span class="text-small">Notes</span>
          </div>
          <div class="mx-2">
            <span class="text-small font-mono">{{ store.notes.length }}</span>
          </div>
          <div class="">
            <details
              class="pattern-dropdown"
              @toggle="handleToggle($event)"
              :open="isDropdownOpen"
            >
              <summary>
                <div class="h-6 w-6 cursor-pointer user-select-none font-bold text-center hover rounded">
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
        <div class="h-6">
          <input
            class="h-6 w-full border-solid border-1 border-color-default px-2"
            type="search"
            placeholder="Search"
            v-model="store.searchQuery"
          />
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
    </div>
    <div
      :class="classObjectContent"
      class="overflow-y-scroll pattern-scrollbar-thin pr-2"
    >
      <div
        class="bg-primary"
        v-for="note in notesResult"
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
