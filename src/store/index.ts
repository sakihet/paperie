import { reactive } from 'vue'

export const store = reactive({
  notes: [],
  addNote (obj) {
    this.notes.push(obj)
  },
  deleteNote (id) {
    const idx = this.notes.findIndex((x) => x.id === id)
    this.notes.splice(idx, 1)
  },
  updateNote (id, content) {
    const idx = this.notes.findIndex((x) => x.id === id)
    this.notes[idx].content = content
  }
})
