<template>
  <div class="flex align-center">
    <label class="mr10">增益</label>
    <div class="ml20 flex flex-wrap flex-direction">
      <div>
        <el-slider
          v-model="gain"
          show-input
          :max="100"
          class="fq-slider"
          @input="onChange"
        >
        </el-slider>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      source: null,
      gain: 1,
    };
  },

  methods: {
    getNode(ac) {
      this.source = ac.createGain()

      this.onChange();
      return this.source;
    },

    onChange() {
      if (this.source) {
        this.source.gain.value = this.gain
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.fq-slider {
  width: 600px;
}
</style>