<template>
  <div class="flex align-center">
    <label class="mr10">整形器</label>
    <div class="ml20 flex flex-wrap flex-direction">
      <div>
        <!-- <label class="ml20 mr10">数量</label> -->
        <el-slider
          v-model="amount"
          show-input
          :max="10000"
          class="fq-slider"
          @input="onChange"
        >
        </el-slider>
      </div>

      <!-- <div>
        <label class="ml20 mr10">倍数</label>
        <el-slider
          v-model="oversample"
          show-input
          :max="128"
          class="fq-slider"
          @input="onChange"
        >
        </el-slider>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      source: null,
      amount: 0,
      oversample: 4,
    };
  },

  methods: {
    getNode(ac) {
      this.source = ac.createWaveShaper();

      this.onChange();
      return this.source;
    },

    onChange() {
      if (this.source) {
        this.source.curve = this.makeDistortionCurve(this.amount);
        this.source.oversample = this.oversample + "x";
      }
    },

    // 失真曲线算法
    makeDistortionCurve(amount) {
      var k = typeof amount === "number" ? amount : 50,
        n_samples = 44100,
        curve = new Float32Array(n_samples),
        deg = Math.PI / 180,
        i = 0,
        x;
      for (; i < n_samples; ++i) {
        x = (i * 2) / n_samples - 1;
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
      }
      return curve;
    },
  },
};
</script>

<style lang="scss" scoped>
.fq-slider {
  width: 600px;
}
</style>