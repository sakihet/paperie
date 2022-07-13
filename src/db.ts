import { openDB } from 'idb'

const DB_NAME = 'n1'
const VERSION = 1

export const connect = async () => {
  await openDB(DB_NAME, VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      db.createObjectStore('notes', { keyPath: 'id' })
    }
  })
}
