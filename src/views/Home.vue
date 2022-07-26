<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { ref, nextTick } from 'vue'
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
const handleChangeLayout = (e: Event) => {
  console.log('change layout', e, (e.target as HTMLInputElement).value)
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
  <div class="layout-center px-4">
    <div class="my-4">
      <div class="">
        <AppButton
          @click="handleAdd"
          text="Add"
        />
      </div>
    </div>
    <div class="my-4">
      <div class="text-right">
        <label>
          <input type="radio" name="layout" value="list" @change="handleChangeLayout" v-model="store.notesLayout">List
        </label>
        <label>
          <input type="radio" name="layout" value="grid" @change="handleChangeLayout" v-model="store.notesLayout">Grid
        </label>
      </div>
    </div>
    <div>
      <dialog
        :open="dialogOpen"
        @close="handleClose"
        class="border-1 border-color-default"
      >
        <textarea
          rows="16"
          cols="60"
          class="p-2 border-color-default"
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
    <div :class="{ 'layout-cluster': store.notesLayout === 'grid', 'layout-stack-4': store.notesLayout === 'list', 'my-8': true }">
      <div
        v-for="note in store.notes"
        :key="note.id"
        class=""
      >
        <div class="border-solid border-color-default border-1">
          <div class="">
            <span v-if="note.isPinned">📌</span>
          </div>
          <div>
            <AppTextarea
              :id="note.id"
              :content="note.content"
              :rows="store.notesLayout === 'list' ? 5 : 10"
              :cols="store.notesLayout === 'list' ? 60 : 20"
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
