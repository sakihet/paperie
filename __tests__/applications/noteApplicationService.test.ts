import { v4 } from 'uuid'
import { beforeAll, describe, expect, it } from 'vitest'
import { NoteApplicationService } from '../../src/applications/noteApplicationService'
import { Note } from '../../src/entities/note'
import { INoteRepository } from '../../src/repositories/noteRepository'

class ArrayNoteRepository implements INoteRepository{
  constructor (
    ary
  ) {
    this.ary = ary
  }

  async add (note: Note) {
    this.ary.push(note)
    return note.id
  }

  async clear () {
    this.ary = []
    return
  }

  async delete (id: string) {
    const index = this.ary.findIndex(x => x.id === id)
    this.ary.splice(index, 1)
    return
  }

  async get (id: string) {
    return this.ary.find(x => x.id === id)
  }

  async getAll () {
    return this.ary
  }

  async put (note: Note) {
    const index = this.ary.findIndex(x => x.id === id)
    this.ary[index] = note
    return this.ary[index].id
  }
}

describe('NoteApplicationService', () => {
  let ary
  let service
  beforeAll(() => {
    ary = []
    service = new NoteApplicationService(
      new ArrayNoteRepository(ary)
    )
  })
  it('add', async () => {
    const id = v4()
    const date = new Date()
    const n: Note = {
      id: id,
      title: 'title',
      content: 'content',
      isPinned: false,
      noteType: 'plain',
      createdAt: date,
      updatedAt: date
    }
    await service.add(n)
    expect(ary.length).toEqual(1)
  })
})
