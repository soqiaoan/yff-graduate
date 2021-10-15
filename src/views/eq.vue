<template>
  <div class="p20 bg-cfff">
    <div class="flex">
      <audio :src="src" ref="audioEQ"></audio>
      <el-button @click="onStart">播放</el-button>
      <div v-show="filterList.length > 0" class="flex">
        <div
          v-for="(item, index) in conf"
          :key="index"
          class="item p10 flex flex-direction align-center"
        >
          <el-slider
            v-model="item.gain"
            :min="-12"
            :max="12"
            vertical
            height="200px"
            @input="onChange(index)"
          ></el-slider>
          <div class="mt10">{{ item.fq }}</div>
        </div>
        <el-button @click="onReset">重置</el-button>
      </div>
    </div>
    <AnalyseNode ref="anlyserEQ"></AnalyseNode>
  </div>
</template>

<script>
import AnalyseNode from "@/components/AnalyseNode";

export default {
  components: {
    AnalyseNode,
  },
  data() {
    return {
      src: require("@/assets/audio/Until_You.mp3"),
      conf: [
        {
          fq: 31.5,
          type: "peaking",
          Q: 10,
          gain: 0,
        },
        {
          fq: 63,
          type: "peaking",
          gain: 0,
          Q: 10,
        },
        {
          fq: 125,
          type: "peaking",
          gain: 0,
          Q: 10,
        },
        {
          fq: 250,
          type: "lowshelf",
          gain: 0,
          Q: 10,
        },
        {
          fq: 500,
          type: "peaking",
          gain: 0,
          Q: 10,
        },
        {
          fq: 1000,
          type: "peaking",
          gain: 0,
          Q: 10,
        },
        {
          fq: 2000,
          type: "highshelf",
          gain: 0,
          Q: 10,
        },
        {
          fq: 4000,
          type: "peaking",
          gain: 0,
          Q: 10,
        },
        {
          fq: 8000,
          type: "peaking",
          gain: 0,
          Q: 10,
        },
        {
          fq: 16000,
          type: "peaking",
          Q: 10,
        },
      ],
      filterList: [],
    };
  },

  methods: {
    initFilter(ac) {
      this.conf.reduce((preFilter, current) => {
        const filter = ac.createBiquadFilter();
        filter.type = current.type;
        filter.frequency.value = current.fq;
        filter.gain.value = current.gain;
        if (current.Q) {
          filter.Q.value = current.Q;
        }

        if (preFilter) {
          filter.connect(preFilter);
        }

        this.filterList.push(filter);

        return filter;
      }, null);
    },

    onChange(i) {
      if (this.filterList.length > 0) {
        this.filterList[i].gain.value = this.conf[i].gain;
      }
    },

    onStart() {
      const ac = new AudioContext();
      this.initFilter(ac);

      const source = ac.createMediaElementSource(this.$refs.audioEQ);
      const analyseNode = this.$refs.anlyserEQ.getAnalyse(ac);

      source.connect(this.filterList[this.filterList.length - 1]);
      this.filterList[0].connect(analyseNode);
      analyseNode.connect(ac.destination);

      this.$refs.audioEQ.play();
    },

    onReset(){
      if (this.filterList.length > 0) {
        this.filterList.forEach((item,i)=>{
          this.conf[i].gain = 0
          this.filterList[i].gain.value = this.conf[i].gain;
        })
      }
    }
  },
};
</script>

<style lang="scss" scoped>
</style>