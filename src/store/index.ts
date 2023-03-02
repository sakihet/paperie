import { v4 } from 'uuid'
import { computed, reactive } from 'vue'
import { connect } from '../db'
import { NoteApplicationService } from '../applications/noteApplicationService'
import { NoteRepository } from '../repositories/noteRepository'
import { Note } from '../entities/note'
import { NoteType } from '../types/noteType'
import { LayoutType } from '../types/layoutType'
import { SortKey } from '../types/sortKey'

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
const getSettings = () => {
  const key = 'settings'
  const item = localStorage.getItem(key)
  if (item) {
    return item
  }
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

export const sidebarWidthDefault = 240

type Settings = {
  sidebarWidth: number
}

const settingsDefault: Settings = {
  sidebarWidth: sidebarWidthDefault
}

interface Store {
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
  searchQuery: string,
  settings: Settings,
  sortKey: SortKey,
  theme: string,
  actions: {
    createOrUpdateNote: (store: Store) => void,
    init: (store: Store) => Promise<void>,
    load: (store: Store) => Promise<void>,
    openEditorForAdd: (store: Store) => void,
    openEditorForEdit: (store: Store, note: Note) => void,
    saveLayout: (store: Store) => void,
    toggleTheme: (store: Store) => void,
    updateSettings: (store: Store, settings: Settings) => void,
    note: {
      create: (store: Store) => void,
      delete: (store: Store, id: string) => void,
      deleteAll: (store: Store) => void,
      duplicate: (store: Store, id: string) => void,
      toggleIsPinned: (store: Store, id: string) => void,
      update: (store: Store) => void,
      updateNoteType: (store: Store, noteType: NoteType) => void
    }
  }
}

export const store: Store = reactive<Store>({
  commandMenuDialogOpen: false,
  composing: false,
  dialogKeyboardShortcutsOpen: false,
  editor: {
    noteContent: '',
    noteId: '',
    noteTitle: '',
    noteType: 'plain'
  },
  editorDialogOpen: false,
  isAdding: false,
  isEditing: false,
  isLoaded: false,
  notes: [],
  notesLayout: 'list',
  pressingModifier: false,
  searchQuery: '',
  settings: settingsDefault,
  sortKey : 'updated',
  theme: 'light',
  actions: {
    async init (store) {
      store.notesLayout = getLayout()
      const connectHandler = async () => await connect()
      const loadHandler = async () => await store.actions.load(store)
      connectHandler()
      loadHandler().then(() => {
        store.isLoaded = true
      })
      const theme = getTheme()
      if (theme) {
        store.theme = theme
        applyTheme(theme)
      }
      const settings = getSettings()
      if (settings) {
        store.settings = JSON.parse(settings)
      }
    },
    async load (store) {
      const result = await noteApplicationService.getAll()
      store.notes = result
    },
    createOrUpdateNote (store) {
      if (store.isAdding) {
        if (store.editor.noteId) {
          store.actions.note.update(store)
        } else {
          store.actions.note.create(store)
        }
      } else if (store.isEditing) {
        store.actions.note.update(store)
      }
    },
    openEditorForAdd (store) {
      store.isAdding = true
      store.editorDialogOpen = true
      store.commandMenuDialogOpen = false
      store.editor.noteId = ''
      store.editor.noteType = 'plain'
      store.editor.noteTitle = ''
      store.editor.noteContent = ''
    },
    openEditorForEdit (store:Store, note: Note) {
      store.isEditing = true
      store.editorDialogOpen = true
      store.commandMenuDialogOpen = false
      store.editor.noteId = note.id
      store.editor.noteTitle = note.title
      store.editor.noteContent = note.content
      store.editor.noteType = note.noteType
    },
    saveLayout (store) {
      localStorage.setItem(storageKey, store.notesLayout)
    },
    toggleTheme () {
      if (store.theme === 'light') {
        store.theme = 'dark'
      } else if (store.theme === 'dark') {
        store.theme = 'light'
      }
      applyTheme(store.theme)
      localStorage.setItem('theme', store.theme)
    },
    updateSettings (store: Store, settings: Settings) {
      store.settings = settings
      localStorage.setItem('settings', JSON.stringify(settings))
    },
    note: {
      create (store) {
        if (store.editor.noteContent.length === 0 && store.editor.noteTitle.length === 0) {
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
          const handler = async () => {
            await noteApplicationService.add(note)
            const result = await noteApplicationService.getAll()
            store.notes = result
          }
          handler().then(() => {
            store.editor.noteId = note.id
          })
        }
      },
      delete(store, id) {
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
      deleteAll(store) {
        const handler = async () => {
          await noteApplicationService.clear()
        }
        handler().then(() => store.notes = [])
      },
      duplicate(store, id) {
        const handler = async () => {
          const n = await noteApplicationService.get(id)
          if (n) {
            const note: Note = n
            const date = new Date()
            const duplicated: Note = {...note, id: v4(), title: `${note.title} copy`, createdAt: date, updatedAt: date}
            await noteApplicationService.add(duplicated)
            const result = await noteApplicationService.getAll()
            store.notes = result
          }
        }
        handler()
      },
      toggleIsPinned(store, id) {
        const handler = async () => {
          const idx = store.notes.findIndex((x) => x.id === id)
          const note: Note = store.notes[idx]
          const updated = await noteApplicationService.put(
            {...note, isPinned: !note.isPinned, updatedAt: new Date()}
          )
          if (updated) {
            store.notes[idx].isPinned = updated.isPinned
            store.notes[idx].updatedAt = updated.updatedAt
          }
        }
        handler()
      },
      update(store) {
        const handler = async () => {
          const idx = store.notes.findIndex((x) => x.id === store.editor.noteId)
          const note: Note = store.notes[idx]
          const updated = await noteApplicationService.put({
            ...note,
            title: store.editor.noteTitle,
            content: store.editor.noteContent,
            noteType: store.editor.noteType,
            updatedAt: new Date()
          })
          if (updated) {
            store.notes[idx].title = updated.title
            store.notes[idx].content = updated.content
            store.notes[idx].noteType = updated.noteType
            store.notes[idx].updatedAt = updated.updatedAt
          }
        }
        handler().then(() => {
        })
      },
      updateNoteType(store, noteType) {
        const handler = async () => {
          const idx = store.notes.findIndex((x) => x.id === store.editor.noteId)
          const note: Note = store.notes[idx]
          const updated = await noteApplicationService.put(
            {...note, noteType: noteType, updatedAt: new Date()}
          )
          if (updated) {
            store.notes[idx].noteType = updated.noteType
            store.notes[idx].updatedAt = updated.updatedAt
            store.editor.noteType = noteType
          }
        }
        if (store.isEditing) {
          handler()
        }
      }
    }
  },
})

const sortFunc = (sortKey: SortKey): ((a: Note, b:Note) => number) => {
  if (sortKey === 'updated') {
    return (a: Note, b: Note) => b.updatedAt.getTime() - a.updatedAt.getTime()
  } else if (sortKey === 'created') {
    return (a: Note, b: Note) => b.createdAt.getTime() - a.createdAt.getTime()
  } else {
    return (a: Note, b: Note) => a.title.localeCompare(b.title)
  }
}

export const notesResult = computed(() =>
  store.notes.filter(n =>
    n.title.includes(store.searchQuery) || n.content.includes(store.searchQuery)
  ).sort(sortFunc(store.sortKey)).sort(x => x.isPinned ? -1 : 1)
)

export const currentNote = computed(() =>
  store.notes.find(x => x.id === store.editor.noteId)
)
