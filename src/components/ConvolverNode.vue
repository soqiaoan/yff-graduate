<template>
  <div class="flex align-center">
    <label class="mr10">混响效果</label>
    <div class="ml20 flex flex-wrap flex-direction">
      <div>
        <el-select v-model="effect" @change="onChange">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ac: null,
      source: null,
      effect: "",
      options: [
        { label: "无混响", value: '' },
        { label: "效果1", value: require("@/assets/audio/mix.wav") },
        { label: "效果2", value: require("@/assets/audio/mix2.wav") },
      ],
    };
  },

  methods: {
    // 混响器
    getNode(ac) {
      this.ac = ac;
      this.source = ac.createConvolver();

      this.onChange();
      return this.source;
    },

    async onChange() {
      if (this.source) {
        if (!this.effect) {
          this.source.buffer = null;
        } else {
          let response = await fetch(this.effect);
          let arraybuffer = await response.arrayBuffer();
          this.source.buffer = await this.ac.decodeAudioData(arraybuffer);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.fq-slider {
  width: 600px;
}
</style>