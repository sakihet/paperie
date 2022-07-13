import { reactive } from 'vue'
import { connect } from '../db'
import { NoteApplicationService } from '../applications/noteApplicationService'
import { NoteRepository } from '../repositories/noteRepository'
import { Note } from '../entities/note'

const noteApplicationService = new NoteApplicationService(
  new NoteRepository()
)

export const store: {
  notes: Array<Note>,
  init: () => void,
  load: () => Promise<void>,
  addNote: ({}) => void,
  deleteNote: (id: string) => void,
  updateNote: (id: string, content: string) => void
} = reactive({
  notes: [],
  init () {
    console.log('init')
    const connectHandler = async () => await connect()
    const loadHandler = async () => await this.load()
    connectHandler()
    loadHandler()
  },
  async load () {
    console.log('load')
    const result = await noteApplicationService.getAll()
    this.notes = result
  },
  addNote (obj) {
    const handler = async () => {
      await noteApplicationService.add(obj)
      this.notes.push(obj)
    }
    handler()
  },
  deleteNote (id) {
    const handler = async () => {
      await noteApplicationService.delete(id)
      const idx = this.notes.findIndex((x) => x.id === id)
      this.notes.splice(idx, 1)
    }
    handler()
  },
  updateNote (id, content) {
    const handler = async () => {
      await noteApplicationService.put({id: id, content: content})
      const idx = this.notes.findIndex((x) => x.id === id)
      this.notes[idx].content = content
    }
    handler()
  }
})
