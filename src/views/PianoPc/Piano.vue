<template>
  <div class="component-autopiano" ref="PianoComponent">
    <div class="piano-scroll-wrap">
      <div
        class="piano-wrap responsive-section-a"
        :class="{ visible: pianoShow }"
      >
        <div class="piano-band">
          <img class="piano-band-img" :src="bandImg" alt="" />
          <div class="piano-tip">⇧ 代表 shift 键</div>
        </div>
        <div
          class="piano-key-wrap"
          ref="pianoKeyWrapRef"
          :style="{ height: pianoKeyWrapHeight + 'px' }"
        >
          <div
            class="piano-key wkey"
            v-for="note in wkey"
            :key="note.keyCode"
            :data-keyCode="note.keyCode"
            :data-name="note.name"
            @click.stop="clickPianoKey($event, note.keyCode)"
          >
            <div class="keytip">
              <div class="keyname" v-show="showKeyName">{{ note.key }}</div>
              <div class="notename" v-show="showNoteName">{{ note.name }}</div>
            </div>
          </div>
          <div class="bkey-wrap bkey-wrap1">
            <div
              class="piano-key bkey"
              v-for="note in bkeyWrap1"
              :key="note.keyCode"
              :data-keyCode="note.keyCode"
              :data-name="note.name"
              :style="{ height: bkeyHeight + 'px' }"
              @click.stop="clickPianoKey($event, note.keyCode)"
            >
              <div class="keytip">
                <div
                  class="keyname"
                  v-html="note.key"
                  v-show="showKeyName"
                ></div>
              </div>
            </div>
          </div>
          <div class="bkey-wrap bkey-wrap2">
            <div
              class="piano-key bkey"
              v-for="note in bkeyWrap2"
              :key="note.keyCode"
              :style="{ height: bkeyHeight + 'px' }"
              :data-keyCode="note.keyCode"
              :data-name="note.name"
              @click.stop="clickPianoKey($event, note.keyCode)"
            >
              <div class="keytip">
                <div
                  class="keyname"
                  v-html="note.key"
                  v-show="showKeyName"
                ></div>
              </div>
            </div>
          </div>
          <div class="bkey-wrap bkey-wrap3">
            <div
              class="piano-key bkey"
              :style="{ height: bkeyHeight + 'px' }"
              v-for="note in bkeyWrap3"
              :key="note.keyCode"
              :data-keyCode="note.keyCode"
              :data-name="note.name"
              @click.stop="clickPianoKey($event, note.keyCode)"
            >
              <div class="keytip">
                <div
                  class="keyname"
                  v-html="note.key"
                  v-show="showKeyName"
                ></div>
              </div>
            </div>
          </div>
          <div class="bkey-wrap bkey-wrap4">
            <div
              class="piano-key bkey"
              v-for="note in bkeyWrap4"
              :key="note.keyCode"
              :style="{ height: bkeyHeight + 'px' }"
              :data-keyCode="note.keyCode"
              :data-name="note.name"
              @click.stop="clickPianoKey($event, note.keyCode)"
            >
              <div class="keytip">
                <div
                  class="keyname"
                  v-html="note.key"
                  v-show="showKeyName"
                ></div>
              </div>
            </div>
          </div>
          <div class="bkey-wrap bkey-wrap5">
            <div
              class="piano-key bkey"
              v-for="note in bkeyWrap5"
              :key="note.keyCode"
              :style="{ height: bkeyHeight + 'px' }"
              :data-keyCode="note.keyCode"
              :data-name="note.name"
              @click.stop="clickPianoKey($event, note.keyCode)"
            >
              <div class="keytip">
                <div
                  class="keyname"
                  v-html="note.key"
                  v-show="showKeyName"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="piano-options responsive-section-a">
      <div class="option-item-wrap">
        <div class="option-item">
          <label class="label">
            显示按键提示
            <input type="checkbox" id="keyname" v-model="showKeyName" />
            <i></i>
          </label>
        </div>

        <div class="option-item">
          <label class="label">
            显示音名
            <input type="checkbox" id="notename" v-model="showNoteName" />
            <i></i>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import bandImg from "@/assets/img/band.png";
import { useKeys } from "./hooks/useKeys";
import { usePlayPiano } from "./hooks/usePlayPiano";
import { useKeyBoradEvent } from "./hooks/useKeyBoradEvent";
import { useComputeEleSize } from "./hooks/useComputeEleSize";
import { useMidiAutoPlay } from "./hooks/useMidiAutoPlay";
import { usePianoAutoPlay } from "./hooks/usePianoAutoPlay";
import { useSetListener } from "./hooks/useSetListener";
import { useXmlAutoPlay } from "./hooks/useXmlAutoPlay";

const { pianoKeyWrapRef, pianoShow, pianoKeyWrapHeight, bkeyHeight } =
  useComputeEleSize();
const {
  showKeyName,
  showNoteName,
  Notes,
  wkey,
  bkeyWrap1,
  bkeyWrap2,
  bkeyWrap3,
  bkeyWrap4,
  bkeyWrap5,
} = useKeys();
const { clickPianoKey, getNoteByKeyCode, playNote, getNoteByName } =
  usePlayPiano(Notes);
useKeyBoradEvent({
  getNoteByKeyCode,
  playNote,
});

const { loadMidiAndPlay, stopMidiPlay } = useMidiAutoPlay({ playNote });
const { playScoreByName ,pauseAutoPlay} = usePianoAutoPlay({ getNoteByName, playNote });
const { addToPlayQueue, pauseXMLPlay } = useXmlAutoPlay({playNote,Notes});
useSetListener({
  playScoreByName,
  loadMidiAndPlay,
  addToPlayQueue,
  pauseAutoPlay,
  stopMidiPlay,
  pauseXMLPlay,
});
</script>
<style lang="scss">
@import "@/style/variable.scss";
.component-autopiano {
  width: 100%;
  position: relative;
  color: #000;
  #audioEffectCanvas {
    display: none;
  }
  .piano-scroll-wrap {
    width: 100%;
    overflow: scroll;
  }
  .piano-wrap.visible {
    opacity: 1;
  }
  .piano-wrap {
    width: 90%;
    margin: 20px auto;
    box-shadow: 5px 5px 20px 5px #888;
    border-radius: 5px;
    position: relative;
    overflow: hidden;
    opacity: 0;
    .piano-band {
      width: 100%;
      height: 40px;
      line-height: 40px;
      background: #000;
      box-shadow: inset 0px -1px 2px rgba(255, 255, 255, 0.4),
        0 2px 3px rgba(0, 0, 0, 0.4);
      border-width: 3px 2px 2px;
      border-style: solid;
      border-color: #555 #222 #111 #777;
      position: relative;
      .piano-band-img {
        width: 130px;
        height: 100%;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
      }
      .piano-tip {
        position: absolute;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        color: #fff;
        font-size: 14px;
      }
    }
    .piano-key-wrap {
      width: 100%;
      background: $c-black;
      overflow: hidden;
      position: relative;
      .piano-key {
        &:hover {
          cursor: pointer;
        }
      }

      .wkey {
        display: inline-block;
        width: 2.775%;
        height: 100%;
        margin: 0 auto;
        background: #fff;
        background: linear-gradient(-30deg, #f5f5f5, #fff);
        border: 1px solid #ccc;
        box-shadow: inset 0 1px 0px #fff, inset 0 -1px 0px #fff,
          inset 1px 0px 0px #fff, inset -1px 0px 0px #fff,
          0 4px 3px rgba(0, 0, 0, 0.7);
        border-radius: 0 0 5px 5px;
        position: relative;

        &:active {
          box-shadow: 0 2px 2px rgba(0, 0, 0, 0.4);
          top: -1%;
          height: 99%;
          background: #efefef;
        }
        &:active:before {
          content: "";
          border-width: 250px 5px 0px;
          border-style: solid;
          border-color: transparent transparent transparent rgba(0, 0, 0, 0.1);
          position: absolute;
          left: 0;
          bottom: 0;
        }
        &:active:after {
          content: "";
          border-width: 250px 5px 0px;
          border-style: solid;
          border-color: transparent rgba(0, 0, 0, 0.1) transparent transparent;
          position: absolute;
          right: 0;
          bottom: 0;
        }

        .keytip {
          width: 100%;
          color: $c-black;
          text-align: center;
          font-size: 14px;
          position: absolute;
          bottom: 5%;
          .keyname {
            margin-bottom: 5px;
          }
          .notename {
            color: $c-blue;
            font-weight: bold;
          }
        }
      }
      .wkey-active {
        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.4);
        top: -1%;
        height: 99%;
        background: #efefef;
        &:before {
          content: "";
          border-width: 250px 5px 0px;
          border-style: solid;
          border-color: transparent transparent transparent rgba(0, 0, 0, 0.1);
          position: absolute;
          left: 0;
          bottom: 0;
        }
        &:after {
          content: "";
          border-width: 250px 5px 0px;
          border-style: solid;
          border-color: transparent rgba(0, 0, 0, 0.1) transparent transparent;
          position: absolute;
          right: 0;
          bottom: 0;
        }
      }

      .bkey {
        display: inline-block;
        width: 10%;
        height: 70%;
        background: linear-gradient(-20deg, #333, #000, #333);
        border-width: 1px 2px 7px;
        border-style: solid;
        border-color: #666 #222 #111 #555;
        border-radius: 0 0 2px 2px;
        box-shadow: inset 0px -1px 2px rgba(255, 255, 255, 0.4),
          0 2px 3px rgba(0, 0, 0, 0.4);
        position: absolute;
        top: 0;
        overflow: hidden;
        &:active {
          height: 101%;
          border-bottom-width: 2px;
          box-shadow: inset 0px -1px 1px rgba(255, 255, 255, 0.4),
            0 1px 0px rgba(0, 0, 0, 0.8), 0 2px 2px rgba(0, 0, 0, 0.4),
            0 -1px 0px #000;
        }
        .keytip {
          width: 100%;
          color: #fff;
          position: absolute;
          left: 0;
          bottom: 5%;
          font-size: 14px;
          overflow: hidden;
          .keyname {
            width: 100%;
            text-align: center;
          }
        }
      }
      .bkey-active {
        height: 101%;
        border-bottom-width: 2px;
        box-shadow: inset 0px -1px 1px rgba(255, 255, 255, 0.4),
          0 1px 0px rgba(0, 0, 0, 0.8), 0 2px 2px rgba(0, 0, 0, 0.4),
          0 -1px 0px #000;
      }

      .wkey.auto-key-active {
        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.4);
        top: 0%;
        height: 100%;
        background: $c-yellow !important;
        &:before {
          content: "";
          border-width: 250px 5px 0px;
          border-style: solid;
          border-color: transparent transparent transparent rgba(0, 0, 0, 0.1);
          position: absolute;
          top: 0;
          left: 0;
        }
        &:after {
          content: "";
          border-width: 250px 5px 0px;
          border-style: solid;
          border-color: transparent rgba(0, 0, 0, 0.1) transparent transparent;
          position: absolute;
          right: 0;
          left: 0;
        }
      }
      .bkey.auto-key-active {
        height: 101%;
        border-bottom-width: 2px;
        box-shadow: inset 0px -1px 1px rgba(255, 255, 255, 0.4),
          0 1px 0px rgba(0, 0, 0, 0.8), 0 2px 2px rgba(0, 0, 0, 0.4),
          0 -1px 0px #000;
        background: $c-yellow !important;
      }

      .bkey:nth-child(1) {
        left: 9%;
      }
      .bkey:nth-child(2) {
        left: 23%;
      }
      .bkey:nth-child(3) {
        left: 50%;
      }
      .bkey:nth-child(4) {
        left: 65%;
      }
      .bkey:nth-child(5) {
        left: 79%;
      }

      .bkey-wrap {
        width: 20%;
        height: 0;
        position: absolute;
        top: 0;
      }
      .bkey-wrap1 {
        left: 0;
      }
      .bkey-wrap2 {
        left: 19.5%;
      }
      .bkey-wrap3 {
        left: 39%;
      }
      .bkey-wrap4 {
        left: 58.3%;
      }
      .bkey-wrap5 {
        left: 77.7%;
      }
    }
  }

  .piano-options {
    width: 90%;
    height: 50px;
    margin: 10px auto 15px;
    padding: 0;
    position: relative;
    .option-item-wrap {
      position: absolute;
      right: 1%;
    }
    .option-item {
      display: inline-block;
      height: 50px;
      line-height: 50px;
      margin: 0 15px;
      .label {
        // Hide the ugly checkbox
        > input {
          display: none;
        }
        // New beautiful checkbox
        i {
          display: inline-block;
          margin-left: 5px;
          padding: 2px;
          width: 40px;
          height: 20px;
          border-radius: 13px;
          vertical-align: middle;
          transition: 0.25s 0.09s;
          position: relative;
          background: #d8d9db;
          box-sizing: initial;
          &:after {
            content: " ";
            display: block;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #fff;
            position: absolute;
            left: 2px;
            transition: 0.25s;
          }
        }
        // Checked-state
        > input:checked + i {
          background: $c-green;
        }
        > input:checked + i:after {
          transform: translateX(20px);
        }
        // Label-hover
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
