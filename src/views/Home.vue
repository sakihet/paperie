<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { ref, nextTick } from 'vue'
import { name, version } from '../../package.json'
import { store } from '../store'
import AppButton from '../components/AppButton.vue'
import AppTextarea from '../components/AppTextarea.vue'
import { Note } from '../entities/note'

const isAdding = ref(false)
const isEditing = ref(false)
const editingNoteId = ref<string | null>(null)
const dialogOpen = ref(false)
const noteContent = ref("")
const refAdd = ref<HTMLElement | null>(null)

const handleAdd = async () => {
  isAdding.value = true
  dialogOpen.value = true
  await nextTick()
  refAdd.value?.focus()
}
const handleCancel = () => {
  noteContent.value = ''
  isAdding.value = false
  isEditing.value = false
  dialogOpen.value = false
}
const handleChange = (id: string, value: string) => {
  store.updateNote(id, value)
}
const handleClose = () => {
  isAdding.value = false
  isEditing.value = false
  dialogOpen.value = false
}
const handleAddConfirm = () => {
  const id = uuidv4()
  const date = new Date()
  const note: Note = {
    id: id,
    content: noteContent.value,
    isPinned: false,
    createdAt: date,
    updatedAt: date
  }
  store.addNote(note)
  dialogOpen.value = false
  isAdding.value = false
  isEditing.value = false
}
const handleEdit = async (note: Note) => {
  isEditing.value = true
  dialogOpen.value = true
  editingNoteId.value = note.id
  noteContent.value = note.content
  await nextTick()
  refAdd.value?.focus() // TODO
}
const handleEditConfirm = () => {
  const id = editingNoteId.value
  if (id) {
    store.updateNote(id, noteContent.value)
  }
  editingNoteId.value = null
  noteContent.value = ''
  dialogOpen.value = false
  isEditing.value = false
}
const handleToggleIsPinned = (id: string) => {
  store.toggleNoteIsPinned(id)
}
store.init()
</script>

<template>
  <div class="layout-center">
    <div class="flex-row">
      <div class="f-1">
        <code>v{{ version }}</code>
      </div>
      <div class="f-1 text-center">
        <h1 class="">{{ name }}</h1>
      </div>
      <div class="f-1"></div>
    </div>
    <hr />
    <div class="my-4">
      <AppButton
        @click="handleAdd"
        text="Add"
      />
    </div>
    <div>
      <dialog
        :open="dialogOpen"
        @close="handleClose"
      >
        <textarea
          rows="16"
          cols="40"
          class="p-2"
          v-model="noteContent"
          ref="refAdd"
        ></textarea>
        <div>
          <AppButton
            @click="handleCancel"
            text="Cancel"
          />
          <AppButton
            v-if="isAdding"
            @click="handleAddConfirm"
            text="Confirm"
          />
          <AppButton
            v-if="isEditing"
            @click="handleEditConfirm"
            text="Update"
          />
        </div>
      </dialog>
    </div>
    <div class="layout-stack-4 my-8">
      <div
        v-for="note in store.notes"
        :key="note.id"
      >
        <div>
          <div class="">
            <span v-if="note.isPinned">📌</span>
          </div>
          <div>
            <AppTextarea
              :id="note.id"
              :content="note.content"
              @change="handleChange(note.id, $event)"
              @click="handleEdit(note)"
            />
          </div>
          <div class="">
            <AppButton
              @click="store.deleteNote(note.id)"
              text="Delete"
            />
            <AppButton
              v-if="note.isPinned"
              text="Unpin"
              @click="handleToggleIsPinned(note.id)"
            />
            <AppButton
              v-else
              text="Pin"
              @click="handleToggleIsPinned(note.id)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
