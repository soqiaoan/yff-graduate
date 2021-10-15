<template>
  <div class="flex align-center">
    <label class="mr10">滤波器</label>
    <el-select v-model="type" placeholder="选择滤波器" @change="onChange">
      <el-option
        v-for="item in typeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>

    <div class="ml20 flex flex-wrap flex-direction">
      <div class="flex align-center">
        <label class="mr10 w40px text-right">频率</label>
        <el-slider
          v-model="frequency"
          show-input
          :max="10000"
          class="fq-slider"
          @input="onChange"
        >
        </el-slider>
      </div>

      <div class="flex align-center">
        <label class="mr10 w40px text-right">Q</label>
        <el-slider
          v-model="Q"
          show-input
          :max="100"
          class="fq-slider"
          @input="onChange"
        >
        </el-slider>
      </div>

      <div class="flex align-center">
        <label class="mr10 w40px text-right">增益</label>
        <el-slider
          v-model="gain"
          show-input
          :min="-100"
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
      filterNode: null,
      enabled: true,
      type: "allpass",
      frequency: 0,
      Q: 1,
      gain: 1,

      typeOptions: [
        { label: "全通滤波器", value: "allpass" },
        { label: "低通滤波器", value: "lowpass" },
        { label: "高通滤波器", value: "highpass" },
        { label: "带通滤波器", value: "bandpass" },
        { label: "低架滤波器", value: "lowshelf" },
        { label: "高架滤波器", value: "highshelf" },
        { label: "峰值滤波器", value: "peaking" },
        { label: "陷波滤波器", value: "notch" },
      ],
    };
  },

  methods: {
    onChange() {
      if (this.filterNode) {
        this.filterNode.type = this.type;
        this.filterNode.frequency.value = this.frequency;
        this.filterNode.Q.value = this.Q;
        this.filterNode.gain.value = this.gain;
      }
    },

    getFilter(ac) {
      // 创建二阶滤波器
      const filter = ac.createBiquadFilter();
      filter.type = this.type;
      filter.frequency.value = this.frequency;
      filter.Q.value = this.Q;
      this.filterNode = filter;
      return filter;
    },
  },
};
</script>

<style lang="scss" scoped>
.fq-slider {
  width: 600px;
}
</style>