import { v4 } from 'uuid'
import { reactive } from 'vue'
import { connect } from '../db'
import { NoteApplicationService } from '../applications/noteApplicationService'
import { NoteRepository } from '../repositories/noteRepository'
import { Note } from '../entities/note'
import { NoteType } from '../types/noteType'
import { LayoutType } from '../types/layoutType'

const noteApplicationService = new NoteApplicationService(
  new NoteRepository()
)

const storageKey = 'layout'
const getLayout = (): LayoutType => {
  const value = localStorage.getItem(storageKey)
  return value === 'grid' ? 'grid' : 'list'
}

const getTheme = () => {
  const key = 'theme'
  if (localStorage.getItem(key)) {
    return localStorage.getItem(key)
  } else {
    return window.matchMedia('(preferes-color-scheme: dark)').matches ? 'dark' : 'light'
  }
}

const applyTheme = (theme: string) => {
  if (theme === 'dark') {
    document.firstElementChild?.classList.add('dark')
  } else {
    document.firstElementChild?.classList.remove('dark')
  }
}

interface Store {
  commandMenuDialogOpen: boolean,
  editorDialogOpen: boolean,
  dialogKeyboardShortcutsOpen: boolean,
  notes: Array<Note>,
  notesLayout: LayoutType,
  editorNoteContent: string,
  editorNoteId: string,
  editorNoteTitle: string,
  editorNoteType: NoteType,
  pressingModifier: boolean,
  composing: boolean,
  isAdding: boolean,
  isEditing: boolean,
  theme: string,
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
  updateNote: (id: string, title: string, content: string, noteType: NoteType) => void,
  updateNoteType: (id: string, noteType: NoteType) => void,
  toggleTheme: () => void
}

export const store: Store = reactive<Store>({
  commandMenuDialogOpen: false,
  editorDialogOpen: false,
  dialogKeyboardShortcutsOpen: false,
  notes: [],
  notesLayout: 'list',
  editorNoteContent: '',
  editorNoteId: '',
  editorNoteTitle: '',
  editorNoteType: 'plain',
  pressingModifier: false,
  composing: false,
  isAdding: false,
  isEditing: false,
  theme: 'light',
  init () {
    this.notesLayout = getLayout()
    const connectHandler = async () => await connect()
    const loadHandler = async () => await this.load()
    connectHandler()
    loadHandler()
    const theme = getTheme()
    if (theme) {
      this.theme = theme
      applyTheme(theme)
    }
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
        noteType: store.editorNoteType,
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
      this.editorNoteTitle = ''
      this.editorNoteContent = ''
      this.isEditing = false
      this.editorDialogOpen = false
    }
    handler()
  },
  editConfirm () {
    this.updateNote(
      this.editorNoteId,
      this.editorNoteTitle,
      this.editorNoteContent,
      this.editorNoteType
    )
    this.editorNoteContent = ''
    this.editorNoteId = '',
    this.editorNoteTitle = ''
    this.editorNoteType = 'plain'
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
        noteType: note.noteType,
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
    store.editorNoteType = 'plain'
    store.editorNoteTitle = ''
    store.editorNoteContent = ''
  },
  openEditorForEdit (note: Note) {
    store.isEditing = true
    store.editorDialogOpen = true
    store.commandMenuDialogOpen = false
    store.editorNoteId = note.id
    store.editorNoteTitle = note.title
    store.editorNoteContent = note.content
    store.editorNoteType = note.noteType
  },
  saveLayout () {
    localStorage.setItem(storageKey, this.notesLayout)
  },
  updateNote (id: string, title: string, content: string, noteType: NoteType) {
    const handler = async () => {
      const idx = this.notes.findIndex((x) => x.id === id)
      const note: Note = this.notes[idx]
      const n: Note = {
        id: note.id,
        title: title,
        content: content,
        isPinned: note.isPinned,
        noteType: noteType,
        createdAt: note.createdAt,
        updatedAt: new Date()
      }
      const updated = await noteApplicationService.put(n)
      if (updated) {
        this.notes[idx].title = updated.title
        this.notes[idx].content = updated.content
        this.notes[idx].noteType = updated.noteType
        this.notes[idx].updatedAt = updated.updatedAt
        this.notes = this.notes.sort((a: Note, b:Note) => b.updatedAt.getTime() - a.updatedAt.getTime()).sort(x => x.isPinned ? -1 : 1)
      }
    }
    handler()
  },
  updateNoteType (id: string, noteType: NoteType) {
    const handler = async () => {
      const idx = this.notes.findIndex((x) => x.id === id)
      const note: Note = this.notes[idx]
      const n: Note = {
        id: note.id,
        title: note.title,
        content: note.content,
        isPinned: note.isPinned,
        noteType: noteType,
        createdAt: note.createdAt,
        updatedAt: new Date()
      }
      const updated = await noteApplicationService.put(n)
      if (updated) {
        this.notes[idx].noteType = updated.noteType
        this.notes[idx].updatedAt = updated.updatedAt
        this.notes = this.notes.sort((a: Note, b:Note) => b.updatedAt.getTime() - a.updatedAt.getTime()).sort(x => x.isPinned ? -1 : 1)
      }
    }
    handler()
  },
  toggleTheme () {
    if (this.theme === 'light') {
      this.theme = 'dark'
    } else if (this.theme === 'dark') {
      this.theme = 'light'
    }
    applyTheme(this.theme)
    localStorage.setItem('theme', this.theme)
  }
})
