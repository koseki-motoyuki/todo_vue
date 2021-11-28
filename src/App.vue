<template>
  <el-container class="container">
    <Header />
    <el-main>
      <router-view />
    </el-main>

    <el-footer class="footer" height="50px">
      <span>©todo</span>
    </el-footer>

  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import 'sanitize.css'

import Header from './components/common/Header.vue'

@Component({
  components: { Header }
})
export default class App extends Vue {
}
</script>

<style scoped>
  .container {
    height:100%;
    min-height: 100vh;
  }

  .el-main {
    padding-top: 30px;
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #dfd9c9;
    border-top: solid 1px #bea26f;
  }
</style>
