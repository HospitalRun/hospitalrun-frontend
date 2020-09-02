import Note from '../../shared/model/Note'

export class NoteError extends Error {
  noteError?: string

  constructor(message: string, note: string) {
    super(message)
    this.noteError = note
    Object.setPrototypeOf(this, NoteError.prototype)
  }
}

export default function validateNote(note: Partial<Note>) {
  const error: any = {}
  if (!note.text) {
    error.noteError = 'patient.notes.error.noteRequired'
  }

  return error
}
