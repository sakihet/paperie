import { openDB } from 'idb'

const getNotesStore = async () => {
  const db = await openDB('n1', 1)
  const store = db.transaction('notes', 'readwrite').objectStore('notes')
  return store
}

export class NoteRepository {
  async add (obj) {
    const store = await getNotesStore()
    const result = await store.add(obj)
    return result
  }
  async clear () {
    const store = await getNotesStore()
    const result = await store.clear()
    return result
  }
  async delete (id) {
    const store = await getNotesStore()
    const result = await store.delete(id)
    return result
  }
  async get (id) {
    const store = await getNotesStore()
    const result = await store.get(id)
    return result
  }
  async getAll () {
    const store = await getNotesStore()
    const result = await store.getAll()
    return result
  }
  async put (obj) {
    const store = await getNotesStore()
    const result = await store.put(obj)
    return result
  }
}
