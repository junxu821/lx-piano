<template>
  <div class="component-random-lyric" ref="LyricComponent">
    <div class="lyric" ref="randomLyricRef">
      {{ randomLyric }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import Lyrics from "@/config/lyrics";
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
const randomLyric = ref("");
const randomIndex = ref(0);
const lyricTimer = ref<number | null>(null);
const randomLyricRef = ref();
onMounted(() => {
  lyricTimer.value && clearInterval(lyricTimer.value);
  lyricTimer.value = null;
  nextTick(() => {
    setRandomLyric();
  });
});
onBeforeUnmount(() => {
  lyricTimer.value && clearInterval(lyricTimer.value);
  lyricTimer.value = null;
});
function fadeIn(element: HTMLElement, duration: number) {
  // 确保元素的初始透明度为0（隐藏）
  element.style.opacity = "0";
  // 确保元素可见
  element.style.display = "block";

  let start = performance.now(); // 获取开始时间

  // 执行动画的递归函数
  (function fade() {
    // 计算当前经过的时间
    let elapsed = performance.now() - start;
    // 计算当前透明度应该是的值
    let opacity = elapsed / duration;
    // 如果透明度小于1（即未达到完全不透明），则继续淡入
    if (opacity < 1) {
      element.style.opacity = opacity.toString();
      requestAnimationFrame(fade); // 继续请求下一帧动画
    } else {
      // 否则，动画结束，设置为完全不透明
      element.style.opacity = "1";
    }
  })();
}

const setRandomLyric = () => {
  if (lyricTimer.value) return;
  randomIndex.value = Math.floor(Math.random() * Lyrics.length);
  let set = () => {
    randomLyricRef.value.style.display = "none";

    if (randomIndex.value < Lyrics.length - 1) {
      ++randomIndex.value;
    } else {
      randomIndex.value = 0;
    }
    randomLyric.value = '"' + Lyrics[randomIndex.value] + '"';
    fadeIn(randomLyricRef.value, 1000);
  };
  set();
  lyricTimer.value = setInterval(() => {
    set();
  }, 7e3);
};
</script>
<style lang="scss">
@import "@/style/variable.scss";
.component-random-lyric {
  width: 100%;
  min-height: 40px;
  padding: 5px 0;
  margin: 0 auto;
  text-align: center;
  .lyric {
    display: inline;
    line-height: 30px;
    font-size: 18px;
    font-style: italic;
    color: $c-blue-d;
    cursor: pointer;
    text-shadow: 2px 2px 8px #fff;
    &:hover {
      color: $c-blue;
    }
  }
}
</style>
