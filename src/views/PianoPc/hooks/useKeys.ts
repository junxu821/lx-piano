import { Ref, computed, ref } from "vue";
import { Note, NoteType } from "@/types/note";
import notes from "@/config/notes";
interface UseKeys {
  showKeyName: Ref<boolean>;
  showNoteName: Ref<boolean>;
  Notes: Ref<Note[]>;
  wkey: Ref<Note[]>;
  bkeyWrap1: Ref<Note[]>;
  bkeyWrap2: Ref<Note[]>;
  bkeyWrap3: Ref<Note[]>;
  bkeyWrap4: Ref<Note[]>;
  bkeyWrap5: Ref<Note[]>;
}
export const useKeys = (): UseKeys => {
  const showKeyName = ref(true);
  const showNoteName = ref(false);
  const Notes = ref<Note[]>(notes);
  const wkey = computed(() =>
    Notes.value.filter((note) => note.type == NoteType.white)
  );
  const bkeyWrap1 = computed(() =>
    Notes.value.filter(
      (note) => note.type == NoteType.black && note.id >= 36 && note.id <= 40
    )
  );
  const bkeyWrap2 = computed(() =>
    Notes.value.filter(
      (note) => note.type == NoteType.black && note.id >= 41 && note.id <= 45
    )
  );
  const bkeyWrap3 = computed(() =>
    Notes.value.filter(
      (note) => note.type == NoteType.black && note.id >= 46 && note.id <= 50
    )
  );
  const bkeyWrap4 = computed(() =>
    Notes.value.filter(
      (note) => note.type == NoteType.black && note.id >= 51 && note.id <= 55
    )
  );
  const bkeyWrap5 = computed(() =>
    Notes.value.filter(
      (note) => note.type == NoteType.black && note.id >= 56 && note.id <= 60
    )
  );
  return {
    showKeyName,
    showNoteName,
    Notes,
    wkey,
    bkeyWrap1,
    bkeyWrap2,
    bkeyWrap3,
    bkeyWrap4,
    bkeyWrap5,
  };
};
