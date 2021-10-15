<template>
  <div>
    <audio :src="src" controls ref="audio" @timeupdate="onTimeupdate"></audio>
    <div class="flex align-end relative line-box">
      <div class="pointer" :style="`left:${pointerLeft}px`"></div>
      <div
        v-for="(item, index) in waveArray"
        :key="index"
        :style="`height:${item}px`"
        class="line"
      ></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      src: require("@/assets/audio/kb.mp3"),
      ac: null,
      uH: 200,
      step: 4800 ,
      waveArray: [],
      pointerLeft: 0,
    };
  },

  mounted() {
    this.showWave();
  },

  methods: {
    onTimeupdate(e) {
      let au = e.target;
      this.pointerLeft =
        (au.currentTime / au.duration) * this.waveArray.length * (1+1);
    },

    async showWave() {
      const ac = new AudioContext();
      const res = await fetch(this.src);
      const buff = await res.arrayBuffer();
      const audioBuff = await ac.decodeAudioData(buff);

      let rsArray = new Float32Array(audioBuff.length);
      audioBuff.copyFromChannel(rsArray, 0, 0);
      //rsArray = audioBuff.getChannelData(0)

      const outputArr = [];
      for (let i = 0; i < rsArray.length; i += this.step) {
        const max = rsArray.slice(i, i + this.step).reduce((pre, curr) => {
          return Math.max(Math.abs(pre), Math.abs(curr));
        });

        outputArr.push(max * this.uH);
      }

      this.waveArray = outputArr;
      this.$forceUpdate();

      return audioBuff;
    },
  },
};
</script>
<style lang="scss" scoped>
.line {
  width: 1px;
  background: #000;
  margin-right: 1px;
  flex-grow: 0;
  flex-shrink: 0;
}

.pointer {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 1px;
  height: 200px;
  background: #f00;

  transition: all 0.3s linear;
}

.line-box{
  overflow-x: auto;
}

/*定义滚动条高宽及背景
 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar
{
    width:8px;
    height:8px;
    background-color:#F5F5F5;
}
/*定义滚动条轨道
 内阴影+圆角*/
::-webkit-scrollbar-track
{
    box-shadow:inset 0 0 2px rgba(0,0,0,0.3);
    border-radius:4px;
    background-color:#F5F5F5;
}
/*定义滑块
 内阴影+圆角*/
::-webkit-scrollbar-thumb
{
    border-radius:4px;
    box-shadow:inset 0 0 2px rgba(0,0,0,.3);
    background-color:#555;
}
</style>