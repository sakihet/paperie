import { reactive } from 'vue'
import { connect } from '../db'
import { NoteApplicationService } from '../applications/noteApplicationService'
import { NoteRepository } from '../repositories/noteRepository'
import { Note } from '../entities/note'

const noteApplicationService = new NoteApplicationService(
  new NoteRepository()
)

interface Store {
  notes: Array<Note>,
  notesLayout: string,
  init: () => void,
  load: () => Promise<void>,
  addNote: (note: Note) => void,
  deleteNote: (id: string) => void,
  toggleNoteIsPinned: (id: string) => void
  updateNote: (id: string, title: string, content: string) => void
}

export const store: Store = reactive<Store>({
  notes: [],
  notesLayout: 'list',
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
    this.notes = result.sort((a: Note, b:Note) => b.updatedAt.getTime() - a.updatedAt.getTime()).sort(x => x.isPinned ? -1 : 1)
  },
  addNote (note: Note) {
    const handler = async () => {
      await noteApplicationService.add(note)
      const result = await noteApplicationService.getAll()
      this.notes = result.sort((a: Note, b:Note) => b.updatedAt.getTime() - a.updatedAt.getTime()).sort(x => x.isPinned ? -1 : 1)
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
  toggleNoteIsPinned (id: string) {
    const handler = async () => {
      const idx = this.notes.findIndex((x) => x.id === id)
      const note: Note = this.notes[idx]
      const updated: Note = {
        id: note.id,
        title: note.title,
        content: note.content,
        isPinned: !note.isPinned,
        createdAt: note.createdAt,
        updatedAt: new Date()
      }
      await noteApplicationService.put(updated)
      this.notes[idx].isPinned = updated.isPinned
      this.notes[idx].updatedAt = updated.updatedAt
      this.notes = this.notes.sort((a: Note, b:Note) => b.updatedAt.getTime() - a.updatedAt.getTime()).sort(x => x.isPinned ? -1 : 1)
    }
    handler()
  },
  updateNote (id: string, title: string, content: string) {
    const handler = async () => {
      const idx = this.notes.findIndex((x) => x.id === id)
      const note: Note = this.notes[idx]
      const updated: Note = {
        id: note.id,
        title: title,
        content: content,
        isPinned: note.isPinned,
        createdAt: note.createdAt,
        updatedAt: new Date()
      }
      await noteApplicationService.put(updated)
      this.notes[idx].title = title
      this.notes[idx].content = content
      this.notes[idx].updatedAt = updated.updatedAt
      this.notes = this.notes.sort((a: Note, b:Note) => b.updatedAt.getTime() - a.updatedAt.getTime()).sort(x => x.isPinned ? -1 : 1)
    }
    handler()
  }
})
