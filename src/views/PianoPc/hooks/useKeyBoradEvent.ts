import { Note } from "@/types/note";
import { nextTick, onMounted, ref } from "vue";
interface UseKeyBoradEvent {
    getNoteByKeyCode:(keyCode: string)=>Note|undefined;
    playNote:(notename:string, duration?:string)=>void
}
export const useKeyBoradEvent = ({
    getNoteByKeyCode, playNote
  }:UseKeyBoradEvent)=>{
    const lastKeyCode = ref("");
    const enableBlackKey = ref(false);
    const keyLock = ref(false);
    const keydownTimer = ref<number | null>(null);
    // 键盘操作 核心代码
const bindKeyBoradEvent = () => {
    const ShiftKeyCode = "16";
    document.addEventListener(
      "keydown",
      (e) => {
        console.log(e);
  
        let keyCode = e.keyCode.toString();
  
        // 按住Shfit键，则启用黑色按键
        if (keyCode === ShiftKeyCode) {
          enableBlackKey.value = true;
        }
        if (enableBlackKey.value) keyCode = "b" + keyCode;
  
        if (keyCode == lastKeyCode.value) {
          // 连续触发同一个键时，应节流 + 延音
          if (!keyLock.value) {
            playNoteByKeyCode(keyCode);
            // 这里应该延音，解决中...
            lastKeyCode.value = keyCode;
            keyLock.value = true;
          }
          if (keydownTimer.value) {
            clearTimeout(keydownTimer.value);
            keydownTimer.value = null;
          }
          keydownTimer.value = setTimeout(() => {
            keyLock.value = false;
          }, 120);
        } else {
          playNoteByKeyCode(keyCode);
          lastKeyCode.value = keyCode;
        }
      },
      false
    );
    // document.addEventListener('keydown', debounce((e) => {
    //   let keyCode = e.keyCode;
    //   let time = +new Date()
    //   if (this.DEV) console.log('keydown', keyCode);
    //   // 按住Shfit键，则启用黑色按键
    //   if (keyCode == ShiftKeyCode) {
    //     enableBlackKey.value= true
    //   }
    //   if (this.enableBlackKey) keyCode = 'b' + keyCode
    //   this.playNoteByKeyCode(keyCode)
    //   this.lastKeyCode = keyCode
    //   this.lastKeyTime = +new Date()
    // }, 100, { leading: true, trailing: false }), false)
  
    document.addEventListener(
      "keyup",
      (e) => {
        // console.log('keyup');
        let keyCode = e.keyCode.toString();
        // 松开Shfit键，则禁用黑色按键
        if (keyCode === ShiftKeyCode) {
          enableBlackKey.value = false;
        }
        document.querySelectorAll(".wkey").forEach((item) => {
          item.classList.remove("wkey-active");
        });
        document.querySelectorAll(".bkey").forEach((item) => {
          item.classList.remove("bkey-active");
        });
      },
      false
    );
  };
  // 根据键值播放音符
  const playNoteByKeyCode = (keyCode: string) => {
    let pressedNote = getNoteByKeyCode(keyCode);
    if (pressedNote) {
      playNote(pressedNote.name);
      let keyType = pressedNote.type;
      if (keyType == "white") {
        document
          .querySelectorAll(`[data-keycode="${pressedNote.keyCode}"]`)
          .forEach((item) => {
            item.classList.add("wkey-active");
          });
      } else if (keyType == "black") {
        document
          .querySelectorAll(`[data-keycode="${pressedNote.keyCode}"]`)
          .forEach((item) => {
            item.classList.add("bkey-active");
          });
      }
    }
  };
  onMounted(()=>{
    nextTick(()=>{
        bindKeyBoradEvent();
    })
  })
}