<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { name, version } from '../../package.json'
import { store } from '../store'
import AppButton from '../components/AppButton.vue'
import AppTextarea from '../components/AppTextarea.vue'
import { Note } from '../entities/note';

const handleAdd = () => {
  const id = uuidv4()
  const date = new Date()
  const note: Note = {
    id: id,
    content: "",
    createdAt: date,
    updatedAt: date
  }
  store.addNote(note)
}
const handleChange = (id: string, value: string) => {
  store.updateNote(id, value)
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
    <div class="layout-stack-4 my-8">
      <div
        v-for="note in store.notes"
        :key="note.id"
      >
        <div>
          <div>
            <AppTextarea
              :id="note.id"
              :content="note.content"
              @change="handleChange(note.id, $event)"
            />
          </div>
          <div class="">
            <AppButton
              @click="store.deleteNote(note.id)"
              text="Delete"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
