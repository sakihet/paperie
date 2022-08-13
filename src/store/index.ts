import { v4 } from 'uuid'
import { reactive } from 'vue'
import { connect } from '../db'
import { NoteApplicationService } from '../applications/noteApplicationService'
import { NoteRepository } from '../repositories/noteRepository'
import { Note } from '../entities/note'

const noteApplicationService = new NoteApplicationService(
  new NoteRepository()
)

const storageKey = 'layout'
const getLayout = (): string => {
  const currentLayout = localStorage.getItem(storageKey)
  return currentLayout ? currentLayout : 'grid'
}

interface Store {
  commandMenuDialogOpen: boolean,
  editorDialogOpen: boolean,
  notes: Array<Note>,
  notesLayout: string,
  editorNoteContent: string,
  editorNoteId: string,
  editorNoteTitle: string,
  pressingModifier: boolean,
  composing: boolean,
  isAdding: boolean,
  isEditing: boolean,
  init: () => void,
  load: () => Promise<void>,
  addConfirm: () => void,
  addNote: (note: Note) => void,
  deleteNote: (id: string) => void,
  editConfirm: () => void,
  escape: () => void,
  toggleNoteIsPinned: (id: string) => void,
  openEditorForAdd: () => void,
  openEditorForEdit: (note: Note) => void,
  saveLayout: () => void,
  updateNote: (id: string, title: string, content: string) => void
}

export const store: Store = reactive<Store>({
  commandMenuDialogOpen: false,
  editorDialogOpen: false,
  notes: [],
  notesLayout: '',
  editorNoteContent: '',
  editorNoteId: '',
  editorNoteTitle: '',
  pressingModifier: false,
  composing: false,
  isAdding: false,
  isEditing: false,
  init () {
    this.notesLayout = getLayout()
    const connectHandler = async () => await connect()
    const loadHandler = async () => await this.load()
    connectHandler()
    loadHandler()
  },
  async load () {
    const result = await noteApplicationService.getAll()
    this.notes = result.sort((a: Note, b:Note) => b.updatedAt.getTime() - a.updatedAt.getTime()).sort(x => x.isPinned ? -1 : 1)
  },
  addConfirm () {
    if (this.editorNoteContent.length === 0 && this.editorNoteTitle.length === 0) {
    } else {
      const id = v4()
      const date = new Date()
      const note: Note = {
        id: id,
        title: store.editorNoteTitle,
        content: store.editorNoteContent,
        isPinned: false,
        createdAt: date,
        updatedAt: date
      }
      this.addNote(note)
    }
    this.editorDialogOpen = false
    this.isAdding = false
    this.editorNoteContent = ''
    this.editorNoteTitle = ''
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
  editConfirm () {
    this.updateNote(
      this.editorNoteId,
      this.editorNoteTitle,
      this.editorNoteContent
    )
    this.editorNoteContent = ''
    this.editorNoteId = '',
    this.editorNoteTitle = ''
    this.editorDialogOpen = false
    this.isEditing = false
  },
  escape () {
    if (this.isAdding) {
      this.addConfirm()
    } else if (this.isEditing) {
      this.editConfirm()
    }
    this.editorDialogOpen = false
  },
  toggleNoteIsPinned (id: string) {
    const handler = async () => {
      const idx = this.notes.findIndex((x) => x.id === id)
      const note: Note = this.notes[idx]
      const n: Note = {
        id: note.id,
        title: note.title,
        content: note.content,
        isPinned: !note.isPinned,
        createdAt: note.createdAt,
        updatedAt: new Date()
      }
      const updated = await noteApplicationService.put(n)
      if (updated) {
        this.notes[idx].isPinned = updated.isPinned
        this.notes[idx].updatedAt = updated.updatedAt
        this.notes = this.notes.sort((a: Note, b:Note) => b.updatedAt.getTime() - a.updatedAt.getTime()).sort(x => x.isPinned ? -1 : 1)
      }
    }
    handler()
  },
  openEditorForAdd () {
    store.isAdding = true
    store.editorDialogOpen = true
    store.commandMenuDialogOpen = false
  },
  openEditorForEdit (note: Note) {
    store.isEditing = true
    store.editorDialogOpen = true
    store.commandMenuDialogOpen = false
    store.editorNoteId = note.id
    store.editorNoteTitle = note.title
    store.editorNoteContent = note.content
  },
  saveLayout () {
    localStorage.setItem(storageKey, this.notesLayout)
  },
  updateNote (id: string, title: string, content: string) {
    const handler = async () => {
      const idx = this.notes.findIndex((x) => x.id === id)
      const note: Note = this.notes[idx]
      const n: Note = {
        id: note.id,
        title: title,
        content: content,
        isPinned: note.isPinned,
        createdAt: note.createdAt,
        updatedAt: new Date()
      }
      const updated = await noteApplicationService.put(n)
      if (updated) {
        this.notes[idx].title = updated.title
        this.notes[idx].content = updated.content
        this.notes[idx].updatedAt = updated.updatedAt
        this.notes = this.notes.sort((a: Note, b:Note) => b.updatedAt.getTime() - a.updatedAt.getTime()).sort(x => x.isPinned ? -1 : 1)
      }
    }
    handler()
  }
})
