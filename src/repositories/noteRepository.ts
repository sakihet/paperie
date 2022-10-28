import { DBSchema, openDB } from 'idb'
import { DB_NAME, DB_VERSION } from '../db'
import { Note } from '../entities/note'
import { NoteType } from '../types/noteType'

interface MyDB extends DBSchema {
  notes: {
    value: {
      id: string
      title: string
      content: string
      isPinned: boolean
      noteType: NoteType
      createdAt: Date
      updatedAt: Date
    }
    key: string
  }
}

const getNotesStore = async () => {
  const db = await openDB<MyDB>(DB_NAME, DB_VERSION)
  return db.transaction('notes', 'readwrite').objectStore('notes')
}

export class NoteRepository {
  async add (note: Note): Promise<string> {
    return await (await getNotesStore()).add(note)
  }
  async clear (): Promise<void> {
    return await (await getNotesStore()).clear()
  }
  async delete (id: string): Promise<void> {
    return await (await getNotesStore()).delete(id)
  }
  async get (id: string): Promise<Note | undefined> {
    return await (await getNotesStore()).get(id)
  }
  async getAll (): Promise<Note[]> {
    return await (await getNotesStore()).getAll()
  }
  async put (note: Note): Promise<string> {
    return await (await getNotesStore()).put(note)
  }
}
