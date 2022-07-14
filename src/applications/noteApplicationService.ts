import { Note } from "../entities/note"
import { NoteRepository } from "../repositories/noteRepository"

export class NoteApplicationService {
  noteRepository: NoteRepository

  constructor (
    noteRepository: NoteRepository
  ) {
    this.noteRepository = noteRepository
  }

  async add (note: Note) {
    const result = await this.noteRepository.add(note)
    return result
  }
  async clear () {
    const result = await this.noteRepository.clear()
    return result
  }
  async delete (id: string) {
    const result = await this.noteRepository.delete(id)
    return result
  }
  async get (id: string) {
    const result = await this.noteRepository.get(id)
    return result
  }
  async getAll (): Promise<Note[]> {
    const result = await this.noteRepository.getAll()
    return result
  }
  async put (note: Note) {
    const result = await this.noteRepository.put(note)
    return result
  }
}
