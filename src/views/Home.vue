<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { store } from '../store'
import AppButton from '../components/AppButton.vue'
import AppTextarea from '../components/AppTextarea.vue'

const handleAdd = () => {
  const id = uuidv4()
  store.addNote({ id, content: "" })
}
const handleChange = (id: string, value: string) => {
  store.updateNote(id, value)
}
store.init()
</script>

<template>
  <div>
    <h1>Home</h1>
    <div>
      <AppButton
        @click="handleAdd"
        text="Add"
      />
    </div>
    <div
      v-for="note in store.notes"
      :key="note.id"
    >
      <div>
        <AppTextarea
          :id="note.id"
          :content="note.content"
          @change="handleChange(note.id, $event)"
        />
      </div>
      <AppButton
        @click="store.deleteNote(note.id)"
        text="Delete"
      />
    </div>
  </div>
</template>
