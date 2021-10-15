<template>
  <div class="anyl-container">
    <div class="analyse-box flex align-end timedomain" v-if="dataArrayT">
      <div
        v-for="(item, index) in dataArrayT"
        :key="index"
        class="line"
        :style="`height:${item}px; border-top:4px solid ${getLineColor(index)}`"
        :color="`${getLineColor(index)}`"
      ></div>
    </div>
    <div class="analyse-box flex align-end" v-if="dataArrayF">
      <div
        v-for="(item, index) in dataArrayF"
        :key="index"
        class="line"
        :style="`height:${item}px; background:${getLineColor(index)}`"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 采样数量 [32, 32768]
    fftSize: {
      default: 512,
    },
  },
  data() {
    return {
      analyser: null,
      dataArrayT: null,
      dataArrayF: null,

      colorArray: null,
    };
  },
  methods: {
    getAnalyse(ac) {
      if (!this.analyser) {
        this.analyser = ac.createAnalyser();
        this.analyser.fftSize = this.fftSize;
      }

      this.showAnimation();

      return this.analyser;
    },

    getAnalyData() {
      if (!this.analyser) {
        return null;
      }
      const dataArrayT = new Uint8Array(this.analyser.frequencyBinCount);
      const dataArrayF = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteTimeDomainData(dataArrayT); //获取时域数据
      this.analyser.getByteFrequencyData(dataArrayF);  //获得频域数据

      this.dataArrayT = dataArrayT;
      this.dataArrayF = dataArrayF;
    },

    showAnimation() {
      this.getAnalyData();
      requestAnimationFrame(() => {
        this.showAnimation();
      });
    },

    getLineColor(index) {
      const cyCount = this.fftSize / 2;
      // 获取连续的颜色
      if (!this.colorArray) {
        this.colorArray = [];
        this.colorArray = [...this.generalColors("#ff6600", "#27C106", cyCount/2), ...this.generalColors("#27C106", "#1188ff", cyCount/2)];
      }

      return this.colorArray[index % this.colorArray.length];
    },

    // 颜色渐变生成算法
    generalColors(sColor, eColor, count) {
      const reg = /^#(\w{2})(\w{2})(\w{2})$/;
      let sM = sColor.match(reg);
      let eM = eColor.match(reg);
      if (!sM || !eM) {
        throw Error("arguments error!");
      }

      sM.shift();
      sM = sM.map((item) => parseInt(item, 16));
      eM.shift();
      eM = eM.map((item) => parseInt(item, 16));

      const dR = (eM[0] - sM[0]) / count;
      const dG = (eM[1] - sM[1]) / count;
      const dB = (eM[2] - sM[2]) / count;

      let colors = [];
      for (let i = 0; i < count; i++) {
        let R = Math.max(parseInt(sM[0] + dR * i, 10), 0);
        let G = Math.max(parseInt(sM[1] + dG * i, 10), 0);
        let B = Math.max(parseInt(sM[2] + dB * i, 10), 0);
        colors.push(`rgb(${R}, ${G}, ${B})`);
      }

      return colors;
    },
  },
};
</script>

<style lang="scss" scoped>
.anyl-container{
  min-height: 532px;
  padding: 0 20px;
}
.analyse-box {
  height: 256px;
  background: #fff;
  border-bottom: 1px solid #000;
  margin-bottom: 10px;
  .line {
    width: 4px;
    margin-left: 2px;
  }
}
</style>