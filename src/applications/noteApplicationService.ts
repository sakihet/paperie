import { Note } from "../entities/note"
import { NoteRepository } from "../repositories/noteRepository"

export class NoteApplicationService {
  noteRepository: NoteRepository

  constructor (
    noteRepository: NoteRepository
  ) {
    this.noteRepository = noteRepository
  }

  async add (note: Note): Promise<string> {
    return await this.noteRepository.add(note)
  }
  async clear (): Promise<void> {
    return await this.noteRepository.clear()
  }
  async delete (id: string): Promise<void> {
    return await this.noteRepository.delete(id)
  }
  async get (id: string): Promise<Note | undefined> {
    return await this.noteRepository.get(id)
  }
  async getAll (): Promise<Note[]> {
    return await this.noteRepository.getAll()
  }
  async put (note: Note): Promise<Note | undefined> {
    const currentNote = await this.noteRepository.get(note.id)
    if (currentNote) {
      if (currentNote.title === note.title && currentNote.content === note.content && currentNote.isPinned === note.isPinned) {
        return await this.noteRepository.get(note.id)
      } else {
        await this.noteRepository.put(note)
        return await this.noteRepository.get(note.id)
      }
    } else {
      return await this.noteRepository.get(note.id)
    }
  }
}
