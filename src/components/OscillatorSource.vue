<template>
  <div>
    <el-select
      v-if="audioSource"
      v-model="oscType"
      placeholder="请选择振荡器波形"
      @change="onSelect"
    >
      <el-option
        v-for="item in oscTypeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      audioSource: null,
      // 谐频振荡器
      partnerSource: [],
      // 谐频数量
      partnerCount: 0,
      // 是否开启谐频
      enablePartnerSource: true,

      timer: null,
      musicF: [0, 262, 294, 330, 349, 392, 440, 494, 523, 587],
      // 小星星 简谱
      musicScore: [
        1, 1, 5, 5, 6, 6, 5, 0, 4, 4, 3, 3, 2, 2, 1, 0, 5, 5, 4, 4, 3, 3, 2, 0,
        5, 5, 4, 4, 3, 3, 2, 0, 1, 1, 5, 5, 6, 6, 5, 0, 4, 4, 3, 3, 2, 2, 1, 0,
      ],
      // 节拍
      musicRhythm: 2 / 4,
      // 振荡器波形
      oscType: "sine",
      oscTypeOptions: [
        { label: "square", value: "square" },
        { label: "sine", value: "sine" },
        { label: "triangle", value: "triangle" },
        { label: "sawtooth", value: "sawtooth" },
      ],
    };
  },

  methods: {
    onSelect() {
      if (this.audioSource) {
        this.audioSource.type = this.oscType;

        this.partnerSource.forEach((item) => {
          item.type = this.oscType;
        });
      }
    },
    // 从振荡器创建音源
    async getSource(ac) {
      const audioSource = ac.createOscillator();
      audioSource.type = this.oscType;
      audioSource.frequency.value = 0;
      this.audioSource = audioSource;

      if (this.enablePartnerSource) {
        for (let i = 0; i < this.partnerCount; i++) {
          let subSource = ac.createOscillator();
          subSource.type = this.oscType;
          subSource.frequency.value = 0;
          subSource.connect(ac.destination)
          this.partnerSource.push(subSource);
        }
      }

      return audioSource;
    },

    // 启动播放，不同类型的source，启动播放方式不一样
    play() {
      if (this.audioSource) {
        this.audioSource.start();
        this.partnerSource.forEach((item) => {
          item.start();
        });

        this.playMusicScore();
      }
    },
    stop() {
      this.audioSource.stop();

      this.partnerSource.forEach((item) => {
        item.stop();
      });

      // https://developer.mozilla.org/zh-CN/docs/Web/API/AudioBufferSourceNode
      // 一个 AudioBufferSourceNode 只能被播放一次，
      // 也就是说，每次调用 start() (en-US) 之后，如果还想再播放一遍同样的声音，
      // 那么就需要再创建一个 AudioBufferSourceNode
      // 因此这里销毁掉。
      this.audioSource = null;
      this.partnerSource = [];

      this.timer = clearInterval(this.timer);
    },

    // 播放音乐
    playMusicScore() {
      let index = 0;
      let af = this.audioSource.frequency;
      // 2/4拍， 500ms一个音
      setInterval(() => {
        let fq = this.musicF[this.musicScore[index % this.musicScore.length]];
        af.value = fq;

        // 谐频震荡
        this.partnerSource.forEach((item, i) => {
          item.frequency.value = fq * (i + 2);
        });
        // 暂停一下
        setTimeout(() => {
          af.value = 0;
          this.partnerSource.forEach((item) => {
            item.frequency.value = 0;
          });
        }, this.musicRhythm * 1000 - 50);
        index++;
      }, this.musicRhythm * 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>