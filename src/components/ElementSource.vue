<template>
  <div>
    <audio :src="src" ref="audio"></audio>
  </div>
</template>

<script>
export default {
  name: 'ElementSource',
  props: {
    src: {
      default: require('@/assets/audio/Five_Hundred_Miles.mp3')
    }
  },
  data() {
    return {
      audioSource: null
    }
  },
  mounted() {},

  methods: {
    // 获取 Element audio source
    getSource(ac) {
      if (!ac) {
        throw Error('AudioContext not set!')
      }
      if (!this.audioSource) {
        this.audioSource = ac.createMediaElementSource(this.$refs.audio)
      }
      return this.audioSource
    },

    // 启动播放，不同类型的source，启动播放方式不一样
    play() {
      this.$refs.audio.play()
    },
    stop() {
      // 模拟stop
      this.$refs.audio.pause()
      this.$refs.audio.currentTime = 0
    }
  }
}
</script>

<style lang="less" scoped>
</style>
