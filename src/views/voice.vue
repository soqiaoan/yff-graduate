<template>
  <div v-loading="loading" class="p20">
    <el-button type="primary" @click="onClick">启动</el-button>

    <div class="mt20">
      <label class="mr10">下采样</label>
      <el-select v-model="extract" placeholder="">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>

      <label class="mr10 ml40">上采样</label>
      <el-select v-model="insert" placeholder="">
        <el-option
          v-for="item in options2"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      src: require("@/assets/audio/Until_You.mp3"),
      ac: null,
      source: null,
      buff: null,
      // 倍数
      extract: 0,
      insert: 0,
      options: [
        {
          label: "正常",
          value: 0,
        },
        {
          label: "+1",
          value: 1,
        },
        {
          label: "+2",
          value: 2,
        },
        {
          label: "+3",
          value: 3,
        },
      ],
      options2: [
        {
          label: "0",
          value: 0,
        },
        {
          label: "-1",
          value: 1,
        },
        {
          label: "-2",
          value: 2,
        },
        {
          label: "-3",
          value: 3,
        },
      ],
      loading: false,
    };
  },

  mounted() {},

  methods: {
    async getBuff(ac) {
      if (!this.buff) {
        const res = await fetch(this.src);
        const buff = await res.arrayBuffer();
        const audioBuff = await ac.decodeAudioData(buff);
        this.buff = audioBuff;
      }

      return this.buff;
    },

    async onClick() {
      let ac;
      if (!this.ac) {
        ac = new AudioContext();
        this.ac = ac;
      } else {
        ac = this.ac;
      }

      if (this.source) {
        this.source.stop();
        this.source = null;
      }

      this.loading = true;

      const audioBuff = await this.getBuff(ac);

      const outputArr = [];

      for (let chn = 0; chn < audioBuff.numberOfChannels; chn++) {
        outputArr[chn] = [];

        let rsArray = new Float32Array(audioBuff.length);
        audioBuff.copyFromChannel(rsArray, chn, 0);

        // 下采样
        const tempArr = [];
        for (let i = 0; i < rsArray.length; i += this.extract + 1) {
          tempArr.push(rsArray[i]);
        }

        // 上采样
        let tempArr2 = [];
        for (let i = 0; i < tempArr.length; i++) {
          tempArr2.push(tempArr[i]);
          if (this.insert) {
            tempArr2.push.apply(tempArr2, Array(this.insert).fill(0));
          }
        }

        outputArr[chn] = tempArr2;
      }

      const newBuff = ac.createBuffer(2, outputArr[0].length, ac.sampleRate);

      // 重新合并
      for (let i = 0; i < outputArr.length; i++) {
        newBuff.copyToChannel(Float32Array.from(outputArr[i]), i, 0);
      }

      this.loading = false;

      // 播放
      const source = ac.createBufferSource();
      source.buffer = newBuff;
      source.connect(ac.destination);
      source.start();
      this.source = source;
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

.line-box {
  overflow-x: auto;
}

/*定义滚动条高宽及背景
 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: #f5f5f5;
}
/*定义滚动条轨道
 内阴影+圆角*/
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  background-color: #f5f5f5;
}
/*定义滑块
 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 4px;
  box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
  background-color: #555;
}
</style>