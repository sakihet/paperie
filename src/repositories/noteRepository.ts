import { openDB } from 'idb'
import { DB_NAME, DB_VERSION } from '../db'
import { Note } from '../entities/note'

const getNotesStore = async () => {
  const db = await openDB(DB_NAME, DB_VERSION)
  const store = db.transaction('notes', 'readwrite').objectStore('notes')
  return store
}

export class NoteRepository {
  async add (note: Note) {
    const store = await getNotesStore()
    const result = await store.add(note)
    return result
  }
  async clear () {
    const store = await getNotesStore()
    const result = await store.clear()
    return result
  }
  async delete (id: string) {
    const store = await getNotesStore()
    const result = await store.delete(id)
    return result
  }
  async get (id: string) {
    const store = await getNotesStore()
    const result = await store.get(id)
    return result
  }
  async getAll () {
    const store = await getNotesStore()
    const result = await store.getAll()
    return result
  }
  async put (note: Note) {
    const store = await getNotesStore()
    const result = await store.put(note)
    return result
  }
}
