<script setup lang="ts">
import { ref } from 'vue'
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
const isDropdownOpen = ref(false)

const handleClickDropdown = (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
  isDropdownOpen.value = !(isDropdownOpen.value)
}
const handleEdit = (note: Note) => {
  isHovered.value = false
  emit('edit', note)
}
const handleDelete = (e: Event, noteId: string) => {
  e.stopPropagation()
  isHovered.value = false
  emit('delete', noteId)
  isDropdownOpen.value = false
}
const handleToggleIsPinned = (e: Event, noteId: string) => {
  e.stopPropagation()
  isHovered.value = false
  emit('toggleIsPinned', noteId)
  isDropdownOpen.value = false
}
</script>

<template>
  <div
    @click="handleEdit(note)"
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div
      v-if="props.layout === 'grid'"
      class="border-solid border-color-default border-1 shadow rounded flex-column"
      :class="{ 'border-t-2 border-color-blue': note.isPinned, 'w-48': true, 'h-48' : true }"
    >
      <div class="font-semibold p-2 overflow-hidden h-9">
        <span class="">{{ note.title }}</span>
      </div>
      <div class="f-1">
        <AppTextarea
          :id="note.id"
          :content="note.content"
          :rows="7"
          :cols="16"
        />
      </div>
      <div class="h-9 flex-row mx-1">
        <div class="f-1"></div>
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
              <ul class="list-style-none border-solid border-color-default border-1 pl-0 user-select-none cursor-pointer my-1 shadow bg-dropdown rounded text-secondary">
                <li class="h-8 hover" v-if="props.note.isPinned">
                  <div class="py-2 px-4" @click="handleToggleIsPinned($event, note.id)">
                    <span>Unpin</span>
                  </div>
                </li>
                <li class="h-8 hover" v-else>
                  <div class="py-2 px-4" @click="handleToggleIsPinned($event, note.id)">
                    <span>Pin</span>
                  </div>
                </li>
                <li class="h-8 hover">
                  <div class="py-2 px-4" @click="handleDelete($event, note.id)">
                    <span>Delete</span>
                  </div>
                </li>
              </ul>
            </div>
          </details>
        </div>
      </div>
    </div>
    <div
      v-else-if="props.layout === 'list'"
      class="border-solid border-color-default border-1 bg-white"
      :class="{ 'border-l-2 border-color-blue': note.isPinned}"
    >
      <div class="p-2 overflow-hidden h-10 flex-row">
        <div class="f-1 font-semibold">
          <span class="">{{ note.title }}</span>
        </div>
        <div>
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
                <ul class="list-style-none border-solid border-color-default border-1 pl-0 user-select-none cursor-pointer my-1 shadow bg-dropdown rounded text-secondary">
                  <li class="h-8 hover" v-if="props.note.isPinned">
                    <div class="py-2 px-4" @click="handleToggleIsPinned($event, note.id)">
                      <span>Unpin</span>
                    </div>
                  </li>
                  <li class="h-8 hover" v-else>
                    <div class="py-2 px-4" @click="handleToggleIsPinned($event, note.id)">
                      <span>Pin</span>
                    </div>
                  </li>
                  <li class="h-8 hover">
                    <div class="py-2 px-4" @click="handleDelete($event, note.id)">
                      <span>Delete</span>
                    </div>
                  </li>
                </ul>
              </div>
            </details>
          </div>
        </div>
      </div>
      <div class="f-1">
        <AppTextarea
          :id="note.id"
          :content="note.content"
          :rows="3"
          :cols="60"
        />
      </div>
    </div>
  </div>
</template>
