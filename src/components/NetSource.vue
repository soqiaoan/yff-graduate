<template>
  <div></div>
</template>

<script>
export default {
  name: 'NetSource',
  props: {
    url: {
      default: require('@/assets/audio/scb.mp3')
    }
  },
  data() {
    return {
      audioSource: null,
      buffCache: null
    }
  },
  mounted() {},

  methods: {
    // 获取 Net audio source
    async getSource(ac) {
      if (!ac) {
        throw Error('AudioContext not set!')
      }

      const audioSource = ac.createBufferSource()
      audioSource.buffer = await this.downloadNetMedia(ac)
      this.audioSource = audioSource

      return this.audioSource
    },

    // download
    async downloadNetMedia(ac) {
      if (this.buffCache) {
        return this.buffCache
      }
      const res = await fetch(this.url)
      const buff = await res.arrayBuffer()
      const audioBuff = await ac.decodeAudioData(buff)
      this.buffCache = audioBuff
      return audioBuff
    },

    // 启动播放，不同类型的source，启动播放方式不一样
    play() {
      if (this.audioSource) {
        this.audioSource.start()
      }
    },
    stop() {
      this.audioSource.stop()

      // https://developer.mozilla.org/zh-CN/docs/Web/API/AudioBufferSourceNode
      // 一个 AudioBufferSourceNode 只能被播放一次，
      // 也就是说，每次调用 start() (en-US) 之后，如果还想再播放一遍同样的声音，
      // 那么就需要再创建一个 AudioBufferSourceNode
      // 因此这里销毁掉。
      this.audioSource = null
    }
  }
}
</script>

<style lang="less" scoped>
</style>
