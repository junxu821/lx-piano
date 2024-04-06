/eslint-disable @typescript-eslint/no-unused-vars */
<template>
  <div class="score-container component-auto-list">
    <div class="list-view" v-show="currentView == 'LIST'">
      <p class="component-title">
        <img src="@/assets/img/music_cd.png" alt="" class="title-img" />
        <span class="title">演奏示例</span>
        <span class="degree">热度</span>
      </p>

      <ol class="list score-list">
        <li
          class="list-item score-item"
          v-for="(item, index) in ScoreNum"
          :key="index"
        >
          <span class="num">{{ index + 1 }}</span>

          <a href="javascript:;" @click="clickScoreItem(item, 'numscore')">
            {{ item.name }}
          </a>

          <i
            class="pause icon-pause"
            v-show="item.playing"
            @click="stopMusicPlayer(item)"
          />
          <span class="difficulty-degree">
            <i
              class="icon-heartbeat"
              v-for="(star, sindex) in new Array(item.degree)"
              :key="sindex"
            ></i>
          </span>
        </li>
      </ol>

      <p class="component-title">
        <img src="@/assets/img/midi.png" alt="" class="title-img" />
        <span class="title">Midi实验室</span>
      </p>

      <ol class="list score-list">
        <li
          class="list-item score-item"
          v-for="(item, index) in ScoreMidi"
          :key="index"
        >
          <span class="num">{{ index + 1 }}</span>
          <a href="javascript:;" @click="clickScoreItem(item, 'midi')">
            {{ item.name }}
          </a>
          <i
            class="pause icon-pause"
            v-show="item.playing"
            @click="stopMusicPlayer(item)"
          />
          <span class="difficulty-degree">
            <i
              class="icon-heartbeat"
              v-for="(star, sindex) in new Array(item.degree)"
              :key="sindex"
            ></i>
          </span>
        </li>
      </ol>

      <p class="component-title">
        <img src="@/assets/img/lab.png" alt="" class="title-img" />
        <span class="title"
          >MusicXML实验室<span style="font-size: 12px">&nbsp;beta</span></span
        >
      </p>

      <ol class="list score-list">
        <li
          class="list-item score-item"
          v-for="(item, index) in ScoreXml"
          :key="index"
        >
          <span class="num">{{ index + 1 }}</span>
          <a href="javascript:;" @click="clickScoreItem(item, 'musicxml')">
            {{ item.name }}
          </a>
          <i
            class="pause icon-pause"
            v-show="item.playing"
            @click="stopMusicPlayer(item)"
          />
          <span class="difficulty-degree">
            <i
              class="icon-heartbeat"
              v-for="(star, sindex) in new Array(item.degree)"
              :key="sindex"
            ></i>
          </span>
        </li>
      </ol>
    </div>

    <div class="player-view" v-show="currentView == 'PLAYER'">
      <div class="top-bar">
        <!-- <a class="return-btn">&lt;&lt;&nbsp;返回列表</a> -->
        <h2>AutoPiano正在播放...</h2>
      </div>
      <div class="cd-box">
        <div class="cd-reader-1"></div>
        <div class="cd-reader-2"></div>
        <div class="cd">
          <div class="cd-inner">AutoPiano</div>
        </div>
      </div>

      <h2 class="music-name">{{ playingItem.name }}</h2>
      <div class="difficulty-degree">
        <i
          class="icon-heartbeat"
          v-for="(star, sindex) in new Array(playingItem.degree)"
          :key="sindex"
        ></i>
      </div>
      <div class="control-bar">
        <a class="stop-btn" @click.stop="stopMusicPlayer(null)">停止</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ScoreNum, ScoreNumItem } from "@/config/scorenum";
import ScoreMidi, { ScoreMidiItem } from "@/config/scoremidi";
import ScoreXml, { ScorexmlItem } from "@/config/scorexml";
import { onMounted, ref } from "vue";
import { useEventBusInject } from "@/utils/eventBus";
import { OBEvent } from "@/utils/OBEvent";
import axios from "axios";
type PlayingItem = ScoreMidiItem | ScoreNumItem | ScorexmlItem;
const playingItem = ref<PlayingItem>({
  name: "",
  url: "",
});

const currentView = ref("LIST");
const Observe = useEventBusInject();


function clickScoreItem(item: ScorexmlItem | null, scoreType?: string): void;
// @ts-ignore
function clickScoreItem(item: ScoreNumItem | null, scoreType?: string): void;
function clickScoreItem(item: ScoreMidiItem | null, scoreType?: string): void {
  if (!item || !item.name) return;
  if (item == playingItem.value) return;
  if (playingItem.value) {
    // @ts-ignore
    stopMusicPlayer(playingItem.value);
  }
  item.playing = true;
  playingItem.value = item;

  if (scoreType === "numscore") {
    Observe && Observe.$emit(OBEvent.AUTO_PLAY_NUM_SCORE, item.name);
  } else if (scoreType === "midi") {
    Observe && Observe.$emit(OBEvent.SHOW_GLOBAL_LOADING);
    Observe && Observe.$emit(OBEvent.AUTO_PLAY_MIDI, item.url);
  } else if (scoreType === "musicxml") {
    Observe && Observe.$emit(OBEvent.SHOW_GLOBAL_LOADING);
    item.url &&
      axios
        .get(`${item.url}`)
        .then((res) => {
          if (res.status === 200) {
            const score = res.data;
            if (score && typeof score == "object") {
              setTimeout(() => {
                Observe && Observe.$emit(OBEvent.HIDE_GLOBAL_LOADING);
                Observe && Observe.$emit(OBEvent.AUTO_PLAY_XML_SCORE, score);
              }, 200);
            }
          }
        })
        .catch(() => {
          alert("加载乐谱出错，请检查网络");
        });
  }
}

// 停止播放器
// @ts-ignore
function stopMusicPlayer(item: ScorexmlItem | null): void;
// @ts-ignore
function stopMusicPlayer(item: ScoreNumItem | null): void;
function stopMusicPlayer(item: ScoreMidiItem | null):void {
  // @ts-ignore
  item = item || playingItem.value;
  // @ts-ignore
  item.playing = false;
  currentView.value = "LIST";
  Observe && Observe.$emit(OBEvent.STOP_AUTO_PLAY, item);
  playingItem.value = {
    name: "",
    url: "",
  };
}
onMounted(() => {
  // Observe.$on(OBEvent.MUSIC_END, () => {
  //     setTimeout(() => {
  //       this.stopMusicPlayer()
  //     }, 2e3)
  //   })
});
</script>
<style lang="scss">
@import "@/style/variable.scss";
.score-container.component-auto-list {
  width: 40%;
  min-width: 500px;
  padding-bottom: 50%;
  font-size: 14px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 5px;
  border: solid 1px #ddd;
  position: relative;

  .list-view {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    padding: 20px 15px;
    overflow-y: scroll;
  }
  .component-title {
    margin: 0 0 10px 0;
    font-size: 18px;
    font-weight: bold;
    line-height: 26px;
    position: relative;
    .title-img {
      display: inline-block;
      width: 26px;
      vertical-align: middle;
    }
    .title {
      vertical-align: middle;
      margin-left: 5px;
    }
    .degree {
      width: 150px;
      float: right;
      text-align: left;
    }
  }
  .list {
    width: 100%;
    padding-left: 25px;
    padding-bottom: 10px;
    line-height: 32px;
    .list-item {
      height: 32px;
      line-height: 32px;
      list-style: none;
      a {
        display: inline-block;
        min-width: 120px;
        cursor: pointer;
      }
      .icon-pause {
        display: inline-block;
        transform: scale(0.6);
        cursor: pointer;
        &:hover {
          opacity: 0.8;
        }
      }

      a:hover {
        color: $c-blue;
        text-decoration: underline;
      }
      .num {
        float: left;
        width: 35px;
        height: 32px;
        font-size: 16px;
        margin-left: -35px;
        text-align: center;
        color: $c-red;
      }
      .difficulty-degree {
        width: 150px;
        float: right;
        text-align: left;
        .icon-heartbeat {
          display: inline-block;
          transform: scale(0.7);
          margin-left: -6px;
        }
      }
    }
  }

  .player-view {
    font-size: 16px;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    padding: 20px 15px;
    overflow-y: scroll;
    .top-bar {
      .return-btn {
        cursor: pointer;
        width: 80px;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        color: $c-blue-d;
        &:hover {
          text-decoration: underline;
          color: $c-blue;
        }
      }
      h2 {
        font-size: 18px;
      }
    }
    .cd-box {
      width: 400px;
      margin: 15% auto 10px;
      padding: 10px;
      border-radius: 15px;
      position: relative;
      .cd-reader-1 {
        width: 100px;
        height: 10px;
        border-radius: 5px;
        background: linear-gradient(to right, #333, #aaa, #333);
        transform-origin: 0 0;
        transform: rotate(60deg);
        position: absolute;
        top: 10px;
        left: 10px;
        &::before {
          content: "";
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #888;
          position: absolute;
          top: -6px;
          left: -6px;
          border: solid 2px #444;
        }
      }
      .cd-reader-2 {
        width: 80px;
        height: 10px;
        border-radius: 5px;
        background: linear-gradient(to right, #333, #666, #888);
        transform: rotate(20deg);
        position: absolute;
        top: 105px;
        left: 50px;
        z-index: 10;
      }
      .cd {
        width: 220px;
        height: 220px;
        margin: 0 auto;
        border-radius: 50%;
        border: solid 5px #ccc;
        background: linear-gradient(to right, #000, #555, #000);
        position: relative;
        // animation: adjust-hue 10s linear infinite; z-index: 0;
        .cd-inner {
          width: 70px;
          height: 70px;
          line-height: 65px;
          border-radius: 50%;
          border: solid 3px #aaa;
          background: #cd3f11;
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          margin: auto;
          text-align: center;
          color: #fff;
          font-size: 12px;
          // &::after { content: ''; width: 7px; height: 7px; border-radius: 50%; background: #eee; position: absolute; top: -40px; left: 0; bottom: 0; right: 0; margin:auto; }
        }
      }
    }

    .music-name {
      text-align: center;
      padding: 15px 0 5px;
      font-size: 20px;
      font-weight: bold;
    }
    .difficulty-degree {
      text-align: center;
      .icon-heartbeat {
        display: inline-block;
        transform: scale(0.7);
        margin-left: -6px;
      }
    }
    .control-bar {
      width: 100%;
      text-align: center;
      padding: 15px 0;
      .stop-btn {
        display: inline-block;
        width: 70px;
        height: 30px;
        line-height: 30px;
        background: $c-red;
        color: #fff;
        cursor: pointer;
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }

  @keyframes adjust-hue {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
</style>
