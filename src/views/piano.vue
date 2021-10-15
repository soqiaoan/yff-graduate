<template>
  <div>
    <div>
      <el-button
        v-for="(item, index) in oscList"
        :key="index"
        class="m10"
        :class="{'active': activeKeys.indexOf(index)>-1}"
        @mousedown.native="onmousedown(index)"
        @mouseup.native="onmouseup(index)"
      >
        <span v-if="index < 2">.{{ index + 6 }}</span>
        <span v-else-if="index < 9">{{ index - 2 + 1 }}</span>
        <span v-else>˙{{ index - 9 + 1 }}</span>
      </el-button>
    </div>
    <div class="mt20">也可按主键盘数字1-9体验</div>
    <div class="bottom">
      <AnalyseNode ref="analyse" :fftSize="128"></AnalyseNode>
    </div>
  </div>
</template>

<script>
import AnalyseNode from "@/components/AnalyseNode";

export default {
  components:{
    AnalyseNode
  },

  data() {
    return {
      ac: null,
      // 频率
      musicF: [220, 245, 262, 294, 330, 349, 392, 440, 494, 523, 587],
      oscList: [],
      // 谐频数量
      xpNum: 0,
      activeKeys: [],
    };
  },

  created() {
    let ac = new AudioContext();
    this.ac = ac;

    this.createOscillators();

    document.documentElement.addEventListener(
      "keydown",
      (e) => {
        this.onkeydown(e);
      },
      false
    );
    document.documentElement.addEventListener(
      "keyup",
      (e) => {
        this.onkeyup(e);
      },
      false
    );
  },

  methods: {
    createOscillators() {
      for (let i = 0; i < this.musicF.length; i++) {
        let F = this.musicF[i];
        let curSources = [];
        for (let j = 0; j < this.xpNum + 1; j++) {
          let source = this.ac.createOscillator();
          source.type = "sine";
          source.frequency.value = F * (j + 1);
          source.detune.value = j * 4;
          source.start();
          curSources.push(source);
        }

        this.oscList.push(curSources);
      }
    },

    getDest() {
      let analyse = this.$refs.analyse.getAnalyse(this.ac);
      analyse.connect(this.ac.destination);
      return analyse;
    },

    onmousedown(index) {
      let curSources = this.oscList[index];
      curSources.forEach((item) => {
        item.connect(this.getDest());
      });
      console.log("[frequency]", curSources[0].frequency.value);
    },

    onmouseup(index) {
      let curSources = this.oscList[index];
      curSources.forEach((item) => {
        item.disconnect(this.getDest());
      });
    },

    onkeydown(e) {
      console.log("[keyCode]", e.keyCode);
      let index = e.keyCode - 49 + 2;
      if(index>-1 && index<this.oscList.length){
        if( this.activeKeys.indexOf(index) == -1 ){
          this.activeKeys.push(index);
          this.onmousedown(e.keyCode - 49 + 2);
        }
      }
      
    },

    onkeyup(e) {
      let index = e.keyCode - 49 + 2;
      if(index>-1 && index<this.oscList.length){
        this.activeKeys.splice(this.activeKeys.indexOf(index), 1);
        this.onmouseup(e.keyCode - 49 + 2);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.active{
  background: #18f;
  color: #fff;
}
</style>