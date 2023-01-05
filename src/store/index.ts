import { v4 } from 'uuid'
import { reactive } from 'vue'
import { connect } from '../db'
import { NoteApplicationService } from '../applications/noteApplicationService'
import { NoteRepository } from '../repositories/noteRepository'
import { Note } from '../entities/note'
import { NoteType } from '../types/noteType'
import { LayoutType } from '../types/layoutType'

const storageKey = 'layout'
const applyTheme = (theme: string) => {
  if (theme === 'dark') {
    document.firstElementChild?.classList.add('dark')
  } else {
    document.firstElementChild?.classList.remove('dark')
  }
}
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
const noteApplicationService = new NoteApplicationService(
  new NoteRepository()
)

interface Store {
  actions: {
    deleteNote: (store: Store, id: string) => void,
    toggleNoteIsPinned: (store: Store, id: string) => void,
    updateNote: (store: Store, id: string, title: string, content: string, noteType: NoteType) => void,
    updateNoteType: (store: Store, id: string, noteType: NoteType) => void
  },
  commandMenuDialogOpen: boolean,
  composing: boolean,
  dialogKeyboardShortcutsOpen: boolean,
  editor: {
    noteContent: string
    noteId: string,
    noteTitle: string,
    noteType: NoteType
  },
  editorDialogOpen: boolean,
  isAdding: boolean,
  isEditing: boolean,
  isLoaded: boolean,
  notes: Array<Note>,
  notesLayout: LayoutType,
  pressingModifier: boolean,
  theme: string,
  addConfirm: () => void,
  addNote: (note: Note) => void,
  editConfirm: () => void,
  escape: () => void,
  init: () => Promise<void>,
  load: () => Promise<void>,
  openEditorForAdd: () => void,
  openEditorForEdit: (note: Note) => void,
  saveLayout: () => void,
  toggleTheme: () => void
}

export const store: Store = reactive<Store>({
  actions: {
    deleteNote(store, id) {
      const handler = async () => {
        await noteApplicationService.delete(id)
      }
      handler().then(() => {
        const idx = store.notes.findIndex((x) => x.id === id)
        store.notes.splice(idx, 1)
        store.editor.noteTitle = ''
        store.editor.noteContent = ''
        store.isEditing = false
        store.editorDialogOpen = false
      })
    },
    toggleNoteIsPinned(store, id) {
      const handler = async () => {
        const idx = store.notes.findIndex((x) => x.id === id)
        const note: Note = store.notes[idx]
        const updated = await noteApplicationService.put(
          {...note, isPinned: !note.isPinned, updatedAt: new Date()}
        )
        if (updated) {
          store.notes[idx].isPinned = updated.isPinned
          store.notes[idx].updatedAt = updated.updatedAt
          store.notes = store.notes.sort((a: Note, b:Note) => b.updatedAt.getTime() - a.updatedAt.getTime()).sort(x => x.isPinned ? -1 : 1)
        }
      }
      handler()
    },
    updateNote(store, id, title, content, noteType) {
      const handler = async () => {
        const idx = store.notes.findIndex((x) => x.id === id)
        const note: Note = store.notes[idx]
        const updated = await noteApplicationService.put({
          ...note,
          title: title,
          content: content,
          noteType: noteType,
          updatedAt: new Date()
        })
        if (updated) {
          store.notes[idx].title = updated.title
          store.notes[idx].content = updated.content
          store.notes[idx].noteType = updated.noteType
          store.notes[idx].updatedAt = updated.updatedAt
          store.notes = store.notes.sort((a: Note, b:Note) => b.updatedAt.getTime() - a.updatedAt.getTime()).sort(x => x.isPinned ? -1 : 1)
        }
      }
      handler()
    },
    updateNoteType(store, id, noteType) {
      const handler = async () => {
        const idx = store.notes.findIndex((x) => x.id === id)
        const note: Note = store.notes[idx]
        const updated = await noteApplicationService.put(
          {...note, noteType: noteType, updatedAt: new Date()}
        )
        if (updated) {
          store.notes[idx].noteType = updated.noteType
          store.notes[idx].updatedAt = updated.updatedAt
          store.notes = store.notes.sort((a: Note, b:Note) => b.updatedAt.getTime() - a.updatedAt.getTime()).sort(x => x.isPinned ? -1 : 1)
        }
      }
      handler()
    }
  },
  commandMenuDialogOpen: false,
  editorDialogOpen: false,
  dialogKeyboardShortcutsOpen: false,
  notes: [],
  notesLayout: 'list',
  editor: {
    noteContent: '',
    noteId: '',
    noteTitle: '',
    noteType: 'plain'
  },
  pressingModifier: false,
  composing: false,
  isAdding: false,
  isEditing: false,
  isLoaded: false,
  theme: 'light',
  async init () {
    this.notesLayout = getLayout()
    const connectHandler = async () => await connect()
    const loadHandler = async () => await this.load()
    connectHandler()
    loadHandler().then(() => {
      this.isLoaded = true
    })
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
    if (this.editor.noteContent.length === 0 && this.editor.noteTitle.length === 0) {
    } else {
      const id = v4()
      const date = new Date()
      const note: Note = {
        id: id,
        title: store.editor.noteTitle,
        content: store.editor.noteContent,
        isPinned: false,
        noteType: store.editor.noteType,
        createdAt: date,
        updatedAt: date
      }
      this.addNote(note)
    }
    this.editorDialogOpen = false
    this.isAdding = false
    this.editor.noteContent = ''
    this.editor.noteTitle = ''
  },
  addNote (note: Note) {
    const handler = async () => {
      await noteApplicationService.add(note)
      const result = await noteApplicationService.getAll()
      this.notes = result.sort((a: Note, b:Note) => b.updatedAt.getTime() - a.updatedAt.getTime()).sort(x => x.isPinned ? -1 : 1)
    }
    handler()
  },
  editConfirm () {
    this.actions.updateNote(
      this,
      this.editor.noteId,
      this.editor.noteTitle,
      this.editor.noteContent,
      this.editor.noteType
    )
    this.editor.noteContent = ''
    this.editor.noteId = '',
    this.editor.noteTitle = ''
    this.editor.noteType = 'plain'
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
  openEditorForAdd () {
    store.isAdding = true
    store.editorDialogOpen = true
    store.commandMenuDialogOpen = false
    store.editor.noteType = 'plain'
    store.editor.noteTitle = ''
    store.editor.noteContent = ''
  },
  openEditorForEdit (note: Note) {
    store.isEditing = true
    store.editorDialogOpen = true
    store.commandMenuDialogOpen = false
    store.editor.noteId = note.id
    store.editor.noteTitle = note.title
    store.editor.noteContent = note.content
    store.editor.noteType = note.noteType
  },
  saveLayout () {
    localStorage.setItem(storageKey, this.notesLayout)
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
