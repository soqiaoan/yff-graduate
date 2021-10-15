<template>
  <div id="app">
    <div class="menu">
      <router-link to="/">首页</router-link>
      <router-link to="/eq">均衡器</router-link>
      <router-link to="/wave">静态波形</router-link>
      <router-link to="/voice">变声</router-link>
      <router-link to="/piano">电子琴</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.menu {
  background: #fff;
  a {
    display: inline-block;
    padding: 20px 40px;
  }
}
</style>