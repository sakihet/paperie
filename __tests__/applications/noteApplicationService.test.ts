import { v4 } from 'uuid'
import { beforeEach, describe, expect, it } from 'vitest'
import { NoteApplicationService } from '../../src/applications/noteApplicationService'
import { Note } from '../../src/entities/note'
import { INoteRepository } from '../../src/repositories/noteRepository'

class ArrayNoteRepository implements INoteRepository{
  ary: Note[]
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
    const index = this.ary.findIndex(x => x.id === note.id)
    this.ary[index] = note
    return this.ary[index].id
  }
}

describe('NoteApplicationService', () => {
  let ary
  let service
  let id1
  beforeEach(async () => {
    ary = []
    service = new NoteApplicationService(
      new ArrayNoteRepository(ary)
    )
    id1 = v4()
    const date = new Date()
    const n: Note = {
      id: id1,
      title: 'title 1',
      content: 'content 1',
      isPinned: false,
      noteType: 'plain',
      createdAt: date,
      updatedAt: date
    }
    await service.add(n)
  })
  it('add', async () => {
    const id = v4()
    const date = new Date()
    const n: Note = {
      id: id,
      title: 'title 2',
      content: 'content',
      isPinned: false,
      noteType: 'plain',
      createdAt: date,
      updatedAt: date
    }
    await service.add(n)
    const result = await service.getAll()
    expect(result.length).toEqual(2)
  })
  it('clear', async () => {
    await service.clear()
    const result = await service.getAll()
    expect(result.length).toEqual(0)
  })
  it('delete', async () => {
    await service.delete(id1)
    const result = await service.getAll()
    expect(result.length).toEqual(0)
  })
  it('get', async () => {
    const result = await service.get(id1)
    expect(result.title).toEqual('title 1')
  })
  it('getAll', async () => {
    const result = await service.getAll()
    expect(result.length).toEqual(1)
  })
  it('put', async () => {
    const date = new Date()
    const newNote: Note = {
      id: id1,
      title: 'updated',
      content: 'content',
      isPinned: false,
      noteType: 'plain',
      createdAt: date,
      updatedAt: date
    }
    const result = await service.put(newNote)
    expect(result.title).toEqual('updated')
  })
})
