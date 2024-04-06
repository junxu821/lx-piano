import { Ref, onMounted, ref } from "vue";
// @ts-ignore
import SmapleLibrary from "@/lib/Tonejs-Instruments";
import { Note } from "@/types/note";
 interface UsePlayPiano{
    getNoteByName:(name:string)=>Note|undefined
 }
export const usePlayPiano = (Notes:Ref<Note[]>) => {
  const synth = ref(null);
  const getNoteByKeyCode = (keyCode: string): Note | undefined => {
    // 改为更高性能的写法
    let target;
    const len = Notes.value.length || 0;
    for (let i = 0; i < len; i++) {
      let note = Notes.value[i];
      if (note.keyCode == keyCode) {
        target = note;
        break;
      }
    }
    return target;
  };
  const clickPianoKey = (_e: MouseEvent, keyCode: string) => {
    const pressedNote = getNoteByKeyCode(keyCode);
    if (pressedNote) {
      playNote(pressedNote.name);
    }
  };
  // 触发单个音符播放
  const playNote = (notename = "C4", duration = "1n") => {
    if (!synth.value) return;
    try {
      // @ts-ignore
      synth.value.triggerAttackRelease(notename, duration);
    } catch (e) {}
  };
  const getNoteByName =(name = 'C4'):Note | undefined=> {
    // 改为更高性能的写法
    let target
    let len = Notes.value.length || 0
    for (let i = 0; i < len; i++) {
      let note = Notes.value[i]
      if (note.name == name) {
        target = note
        break
      }
    }
    return target
  }
  onMounted(() => {
    synth.value = SmapleLibrary.load({
      instruments: "piano",
    }).toMaster();
  });
  return {
    clickPianoKey,
    getNoteByKeyCode,
    playNote,
    getNoteByName
  };
};
