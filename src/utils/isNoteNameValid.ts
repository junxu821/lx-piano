import  Notes  from '@/config/notes'

export const isNoteNameValid = (noteName:string) => {
  return Notes.some(n => {
    return n.name == noteName
  })
}