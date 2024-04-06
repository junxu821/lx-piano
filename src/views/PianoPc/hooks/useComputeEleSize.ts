import { Ref, nextTick, onMounted, ref } from "vue";
interface UseComputeEleSize {
    pianoKeyWrapRef:Ref,
  pianoShow: Ref<boolean>;
  pianoKeyWrapHeight: Ref<number>;
  bkeyHeight: Ref<number>;
}
export const useComputeEleSize = (): UseComputeEleSize => {
  const pianoKeyWrapRef = ref();
  const pianoShow = ref(false);
  const pianoKeyWrapHeight = ref(0);
  const bkeyHeight = ref(0);
  const computeEleSize = () => {
    const wkey_width = pianoKeyWrapRef.value.offsetWidth / 36;
    const wkey_height = wkey_width * 7;
    pianoKeyWrapHeight.value = wkey_height;
    bkeyHeight.value = wkey_height * 0.7;
  };
  const setListener = () => {
    window.onresize = computeEleSize;
  };
  onMounted(() => {
    nextTick(() => {
      computeEleSize();
      pianoShow.value = true;

      setListener();
    });
  });
  return {
    pianoKeyWrapRef,
    pianoShow,
    pianoKeyWrapHeight,
    bkeyHeight,
  };
};
