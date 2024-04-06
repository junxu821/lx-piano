export enum NoteType{
  white='white',
  black='black'
}
export interface Note {
  id: number;
  name: string;
  keyCode: string;
  key: string;
  url: string;
  type: NoteType;
}
