import { Note } from "@/types/note";
import { OBEvent } from "@/utils/OBEvent";
import { useEventBusInject } from "@/utils/eventBus";
import { isNoteNameValid } from "@/utils/isNoteNameValid";
import { Midi } from "@tonejs/midi";
import { nextTick, onMounted, ref, toRaw } from "vue";
interface UseMidiAutoPlay {
  playNote: (notename: string, duration?: string) => void;
}

export const useMidiAutoPlay = ({ playNote }: UseMidiAutoPlay) => {
  const Observe = useEventBusInject();
  const currentMidiData = ref<Midi | null>(null);
  const midiNotes = ref([]);
  const midiStop = ref(false);
  const midiOffset = ref(0);
  const startTime = ref<number>(0);
  const loadMidiAndPlay = (midi: string) => {
    Midi.fromUrl(midi).then((data) => {
      currentMidiData.value = data;
      midiOffset.value = 0;
      playMidi();
    });
  };
  const playMidi = () => {
    if (currentMidiData.value) {
      midiStop.value = false;
      midiNotes.value = [];

      const tracks = currentMidiData.value.tracks.map((item) => toRaw(item));
      tracks.forEach((track) => {
        // 需要是钢琴乐器 FIXME

        // @ts-ignore
        midiNotes.value = midiNotes.value.concat(track.notes);
      });
      startTime.value = +new Date();
      playLoop();
      console.log(midiNotes.value.length);
      Observe && Observe.$emit(OBEvent.HIDE_GLOBAL_LOADING);
    }
  };
  const playLoop = () => {
    if (midiStop.value) return;
    // @ts-ignore
    let unPlayedNotes = midiNotes.value.filter((n) => !n.played);
    if (unPlayedNotes.length <= 0) {
      Observe && Observe.$emit(OBEvent.MUSIC_END);
      return;
    }
    let now = +new Date();
    let playedTime = now - startTime.value; // 单位毫秒ms
    const rawuUnPlayedNotes = unPlayedNotes.map((item) => toRaw(item));
    rawuUnPlayedNotes.forEach((note: Note) => {
      // @ts-ignore
      if (playedTime >= note.time * 1000 && !note.played) {
        // 播放note
        // @ts-ignore
        note.played = true;
        Observe && Observe.$emit(OBEvent.PLAY_MIDI_NOTE, toRaw(note));
      }
    });
    setTimeout(() => {
      playLoop();
    }, 30);
  };
  const stopMidiPlay = () => {
    midiStop.value = true;
    currentMidiData.value = null;
    midiNotes.value = [];
  };
  onMounted(() => {
    nextTick(() => {
      Observe &&
        Observe.$on(OBEvent.PLAY_MIDI_NOTE, (note) => {
          setTimeout(() => {
            if (isNoteNameValid(note.name)) {
              playNote(note.name, "1n");
              if (document.querySelector(`[data-name="${note.name}"]`)) {
                // @ts-ignore
                document
                  .querySelector(`[data-name="${note.name}"]`)
                  .classList.add("auto-key-active");

                setTimeout(() => {
                  document
                    .querySelector(`[data-name="${note.name}"]`)
                    ?.classList.remove("auto-key-active");
                }, note.duration * 900);
              }
            }
          }, 0);
        });
    });
  });
  return {
    loadMidiAndPlay,
    stopMidiPlay,
  };
};
