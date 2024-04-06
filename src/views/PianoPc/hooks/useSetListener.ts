import { OBEvent } from "@/utils/OBEvent";
import { useEventBusInject } from "@/utils/eventBus";
interface UseSetListener {
  playScoreByName: (scoreName: string) => void;
  loadMidiAndPlay: (midi: string) => void;
  addToPlayQueue: (musicScore: string) => void;
  pauseAutoPlay: () => void;
  stopMidiPlay: () => void;
  pauseXMLPlay:()=>void
}
export const useSetListener = ({
  playScoreByName,
  loadMidiAndPlay,
  addToPlayQueue,
  pauseAutoPlay,
  stopMidiPlay,
  pauseXMLPlay
}: UseSetListener) => {
  const Observe = useEventBusInject();
  // 数字简谱自动播放
  Observe &&
    Observe.$on(OBEvent.AUTO_PLAY_NUM_SCORE, (scorename) => {
      playScoreByName(scorename);
    });
  // XML乐谱自动播放
  Observe &&
    Observe.$on(OBEvent.AUTO_PLAY_XML_SCORE, (musicScore) => {
      addToPlayQueue(musicScore);
      // try {
      //   this.playXMLScore(musicScore)
      // } catch (e) {
      //   console.log(e)
      // }
    });
  // MIDI 自动播放
  Observe &&
    Observe.$on(OBEvent.AUTO_PLAY_MIDI, (midiUrl) => {
      loadMidiAndPlay(midiUrl);
    });
  // 暂停自动播放
  Observe &&
    Observe.$on(OBEvent.STOP_AUTO_PLAY, () => {
      pauseAutoPlay();
      pauseXMLPlay();
    
      stopMidiPlay();
    });
};
