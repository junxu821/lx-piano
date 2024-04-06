import { Note } from "@/types/note";
import { useEventBusInject } from "@/utils/eventBus";
import { Ref, onMounted, ref } from "vue";
interface UseXmlAutoPlay{
    playNote: (notename: string, duration?: string) => void;
    Notes: Ref<Note[]>;
}
export const useXmlAutoPlay = ({playNote:playNoteFunc,Notes}:UseXmlAutoPlay) => {
  const Observe = useEventBusInject();
  const xmlPlayQueue = ref([]);
   // 上一个音符
   const lastNote = ref({
    noteName: ''
  })
  const measures_len = ref(0)
  const xmlstop =ref(false)
const measures = ref([])
  const addToPlayQueue = (score: string) => {
    if (xmlPlayQueue.value.length <= 0) {
      playXMLScore(score);
    }
     // @ts-ignore
    xmlPlayQueue.value.push(score);
  };
  const   initXMLPlayState=() =>{
    xmlstop.value = false
    measures.value = []
    measures_len.value = 0
    lastNote.value = {
      noteName: ''
    }
  }
   // @ts-ignore
 const  playXMLScore=async(musicScore)=> {
    initXMLPlayState()
    measures.value = musicScore.measures
    measures_len.value = 0 || measures.value.length

    for (let i = 0; i < measures_len.value; i++) {
      // 按小节处理，分小节播放
      let measure = measures.value[i]
      let awaitAll = []

      for (let staff_key in measure) {
        // if (staff_key != 'staff1') continue
        let staff = measure[staff_key]

        for (let voice_key in staff) {
          let notes = staff[voice_key] || []
          // console.log(voice_key, ': ', notes);
          // 每个音轨的播放序列推入数组
          awaitAll.push(playNotesArr(notes))
        }
      }
      let playCurrentMeasure = Promise.all(awaitAll)
      await playCurrentMeasure
      if (xmlstop.value) {
           // @ts-ignore
        playCurrentMeasure = null
        Observe&&Observe.$emit('xml-music-stop')
        break
      }
      if (i == measures_len.value - 1) {
        Observe&&Observe.$emit('xml-music-stop')
      }
    }
  }
 // @ts-ignore
 const playNotesArr= (noteArr)=> {
   
    return new Promise((resolve, reject) => {
      // 初始化
      let i = 0
      let initTime = new Date()
      let playedTime = 0
       // @ts-ignore
      let pressedNotes = []
      let playTimer:number|null = null
      function loop() {
        // 监听到停止信号时，立即resolve
        if (xmlstop.value) {
            playTimer&&clearInterval(playTimer)
          playTimer = null
           // @ts-ignore
          resolve()
        }
        let curTime = new Date()
         // @ts-ignore
        let delta = curTime - initTime
        if (delta >= playedTime) {
          // 播放下一个音符
 // @ts-ignore
          pressedNotes.forEach(pNote => {
            if (pNote && pNote.noteName) {
                document
                .querySelector(`[data-name="${pNote.noteName}"]`)?.classList.remove("auto-key-active");
              
            
            }
          })
          pressedNotes = []
          let playNote = noteArr[i]
          if (!playNote || !playNote.duration) {
            // console.log(playNote, i);
            return
          }
          let duration = (playNote.duration) ? playNote.duration : 0
          playedTime += duration
          // let volume = 1
          // if (noteArr[i].staff > '1') {
          //   volume = 0.8
          // }
          if (playNote.rest) {
            // 休止符
          }
          else if (playNote.tie != 'start' && playNote.noteName == lastNote.value.noteName) {
            // 连音且同上一个音符
          }
          else if (playNote && playNote.noteName) {
            // 有音符名
            for (let j = 0; j < Notes.value.length; j++) {
              let n = Notes.value[j]
              if (playNote.noteName == n.name) {
                // 音符存在，是合理的
                playNoteFunc(playNote.noteName)
                document
                .querySelector(`[data-name="${playNote.noteName}"]`)?.classList.add("auto-key-active");
              
                
                // $(`[data-keyCode=${pressedNote.keyCode}]`).addClass('auto-key-active')
                pressedNotes.push(playNote)
                lastNote.value = playNote
                break
              }
            }
            // 循环看下个音符是否为和弦，直到找到非和弦为止
            while (noteArr[i + 1] && noteArr[i + 1].chord) {
              let chordNote = noteArr[i + 1]
              playNoteFunc(chordNote.noteName)
           
              document
              .querySelector(`[data-name="${chordNote.noteName}"]`)?.classList.add("auto-key-active");
            
              pressedNotes.push(chordNote)
              i++
            }
          }
          // vm.lastNote[voice] = noteArr[i]
          // if (!vm.lastNote[voice].noteName) vm.lastNote[voice].noteName = ''
          // 当前voice播放完毕
          i++
          if (i >= noteArr.length) {
            playTimer&& clearInterval(playTimer)
            playTimer = null
            // 最后一个音符播放完，才算结束，才能resolve
            let lastNoteDuration = Math.floor(noteArr[i - 1].duration || 0)
            setTimeout(() => {
                 // @ts-ignore
              resolve()
               // @ts-ignore
              pressedNotes.forEach(pNote => {
                if (pNote && pNote.noteName) {
                    document
                    .querySelector(`[data-name="${pNote.noteName}"]`)?.classList.remove("auto-key-active");
                  
                
                }
              })
            }, lastNoteDuration)
          }
        }
      }
       playTimer = setInterval(() => {
        loop()
      }, 17)
    })
  }
  const pauseXMLPlay=()=> {
    xmlstop.value = true
    document
    .querySelectorAll(`.piano-key`).forEach((item)=>{
        item.classList.remove("auto-key-active")
    })
  
   
  }
  onMounted(() => {
    Observe &&
      Observe.$on("xml-music-stop", () => {
        if (xmlPlayQueue.value && xmlPlayQueue.value.length > 0) {
          xmlPlayQueue.value.shift();
          if (xmlPlayQueue.value[0]) {
            playXMLScore(xmlPlayQueue.value[0]);
          }
        }
      });

    setTimeout(() => {
      // this.addToPlayQueue(testScore)
    }, 1e3);
  });
  return {
    addToPlayQueue,
    pauseXMLPlay
  };
};
