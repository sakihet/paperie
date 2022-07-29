import { openDB } from 'idb'
import { name } from '../package.json'

export const DB_NAME = name
export const DB_VERSION = 1

export const connect = async () => {
  await openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      db.createObjectStore('notes', { keyPath: 'id' })
    }
  })
}
