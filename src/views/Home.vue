<script setup lang="ts">
import { store } from '../store'
import AppButton from '../components/AppButton.vue'
import AppTextarea from '../components/AppTextarea.vue'

const handleAdd = () => {
  const id = store.notes.length + 1
  store.addNote({ id, content: "" })
}
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
        />
      </div>
      <AppButton
        @click="store.deleteNote(note.id)"
        text="Delete"
      />
    </div>
  </div>
</template>
