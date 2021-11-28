<template>
  <el-header>
    <img src="../../../public/image/logo.png" art="" title="" class="logo">
    <el-menu
      :default-active="activeIndex"
      mode="horizontal">
    </el-menu>
  </el-header>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
  }
})
export default class Header extends Vue {
  activeIndex = '1'
}
</script>

<style scoped>
  .logo {
    margin: 0 auto 0 30px;
    height: 50px;
  }
  .nav-info {
    display: flex;
    align-items: center;
  }
  .nav-info p {
    padding-top: 5px;
  }
  .el-header {
    display: flex;
    align-items: center;
    background-color: #bea26f;
    border-bottom: solid 5px #dfd9c9;
    box-sizing: content-box;
  }
  .el-menu.el-menu--horizontal {
    border-bottom: initial;
  }
</style>
