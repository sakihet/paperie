import { NoteType } from "../types/noteType"

export type Note = {
  id: string
  title: string
  content: string
  isPinned: boolean
  noteType: NoteType
  createdAt: Date
  updatedAt: Date
}
