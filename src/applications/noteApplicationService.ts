export class NoteApplicationService {
  constructor (
    noteRepository
  ) {
    this.noteRepository = noteRepository
  }
  async add (obj) {
    const result = await this.noteRepository.add(obj)
    return result
  }
  async clear () {
    const result = await this.noteRepository.clear()
    return result
  }
  async delete (id) {
    const result = await this.noteRepository.delete(id)
    return result
  }
  async get (id) {
    const result = await this.noteRepository.get(id)
    return result
  }
  async getAll () {
    const result = await this.noteRepository.getAll()
    return result
  }
  async put (obj) {
    const result = await this.noteRepository.put(obj)
    return result
  }
}
