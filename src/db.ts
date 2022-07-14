import { openDB } from 'idb'

export const DB_NAME = 'n1'
export const DB_VERSION = 1

export const connect = async () => {
  await openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      db.createObjectStore('notes', { keyPath: 'id' })
    }
  })
}
