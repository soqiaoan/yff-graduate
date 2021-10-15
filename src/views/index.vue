<template>
  <div >
    <div class="w100">
      <div class="flex">
        <div class="comn comn-1 flex align-center">
          <label class="mr10 nowrap">音源</label>
          <el-select
            v-model="selectedVal"
            placeholder="请选择音源"
            @change="onSelect"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>

          <ElementSource ref="eleSource"></ElementSource>
          <NetSource ref="netSource"></NetSource>
          <MicSource ref="micSource"></MicSource>
          <OscillatorSource ref="oscSource"></OscillatorSource>
        </div>
        <div class="comn comn-2 flex-sub flex align-center">
          <div class="flex flex-direction">
            <div>
              <FilterNode ref="filter"></FilterNode>
            </div>
            <div>
              <WaveShaperNode ref="waveShaper"></WaveShaperNode>
            </div>
            <div>
              <ConvolverNode ref="covNode"></ConvolverNode>
            </div>
            <div>
              <GainNode ref="gain"></GainNode>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="bottom">
          <AnalyseNode ref="analyse"></AnalyseNode>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ElementSource from "@/components/ElementSource";
import NetSource from "@/components/NetSource";
import MicSource from "@/components/MicSource";
import OscillatorSource from "@/components/OscillatorSource";

import FilterNode from "@/components/FilterNode.vue";
import WaveShaperNode from "@/components/WaveShaperNode.vue";
import ConvolverNode from "@/components/ConvolverNode.vue";
import GainNode from "@/components/GainNode.vue";

import AnalyseNode from "@/components/AnalyseNode";
export default {
  name: "App",
  components: {
    ElementSource,
    NetSource,
    MicSource,
    OscillatorSource,

    FilterNode,
    WaveShaperNode,
    ConvolverNode,
    GainNode,

    AnalyseNode,
  },
  data() {
    return {
      selectedVal: "",

      ac: null,
      sourceCom: null,
      audioSourceType: "",
      options: [
        { label: "Audio标签", value: "eleSource" },
        { label: "网络", value: "netSource" },
        { label: "麦克风", value: "micSource" },
        { label: "振荡器", value: "oscSource" },
      ],
    };
  },
  mounted() {},

  methods: {
    async onSelect(item) {
      this.showActions = false;

      this.initAC();
      this.audioSourceType = item;
      if (!this.audioSourceType) {
        return;
      }
      if (this.sourceCom) {
        this.sourceCom.stop();
      }
      const sourceCom = this.$refs[this.audioSourceType];
      const audioSource = await sourceCom.getSource(this.ac);

      //过滤
      const filterNode = this.$refs.filter.getFilter(this.ac);
      //整形
      const waveShaperNode = this.$refs.waveShaper.getNode(this.ac);
      // 混响
      const covNode = this.$refs.covNode.getNode(this.ac);
      //增益
      const gainNode = this.$refs.gain.getNode(this.ac);

      if (!this.$refs.covNode.effect) {
        audioSource.connect(filterNode);
      } else {
        audioSource.connect(covNode);
        covNode.connect(filterNode);
      }
      filterNode.connect(waveShaperNode);
      waveShaperNode.connect(gainNode);
      gainNode.connect(this.getAnalyseNode());

      sourceCom.play();
      this.sourceCom = sourceCom;
    },

    // 必须和用户发生交互后，才可以初始化实例，否则<aduio>无法播放
    initAC() {
      if (!this.ac) {
        this.ac = new AudioContext();
      }
    },

    // 分析节点
    getAnalyseNode() {
      let analyseNode = this.$refs.analyse.getAnalyse(this.ac);
      analyseNode.connect(this.ac.destination);
      return analyseNode;
    },
  },
};
</script>

<style lang="scss" scoped>
.comn {
  padding: 20px;
  min-height: 300px;
}
.comn-1 {
  width: 360px;
  background: #eee;
}
.bottom {
  background: #fff;
}
</style>
