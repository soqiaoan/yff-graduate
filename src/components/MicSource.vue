<template>
  <div>
    <!-- 麦克风音源 -->
  </div>
</template>

<script>
export default {
  data(){
    return{
      audioSource: null
    }
  },

  methods: {
    // 从麦克风创建音源
    async getSource(ac) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioSource = ac.createMediaStreamSource(stream);
      this.audioSource = audioSource
      return audioSource;
    },

    // 启动播放，不同类型的source，启动播放方式不一样
    play() {
      if (this.audioSource) {
        // 接收stream时已经开始，不需要启动
        // this.audioSource.start()
      }
    },
    stop() {
      // 接收stream时已经开始，不需要结束
      // this.audioSource.stop()

      // https://developer.mozilla.org/zh-CN/docs/Web/API/AudioBufferSourceNode
      // 一个 AudioBufferSourceNode 只能被播放一次，
      // 也就是说，每次调用 start() (en-US) 之后，如果还想再播放一遍同样的声音，
      // 那么就需要再创建一个 AudioBufferSourceNode
      // 因此这里销毁掉。
      this.audioSource = null
    }
  },
}
</script>

<style lang="scss" scoped>

</style>