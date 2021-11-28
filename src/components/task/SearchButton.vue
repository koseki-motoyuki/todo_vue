<template>
  <div :class="['btn-flame', type]">
    <el-badge :value="value">
      <el-button class="btn" @click="$emit('click')" size="small" :icon="icon">
        <slot></slot>
      </el-button>
    </el-badge>
    <div :class="['active-bar', {'is-active': isActive}]" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class SearchButton extends Vue {
  @Prop({ type: String })
  type!: string

  @Prop({ type: String })
  mode!: string

  @Prop({ type: String })
  icon!: string

  @Prop({ type: Number })
  value!: number

  get isActive (): boolean {
    return this.type === this.mode
  }
}
</script>

<style scoped>
  .btn {
    width: 130px;
    color: #fff;
    border: initial
  }

  .btn-flame.all .btn {
    background-color: #AAA;
  }
  .btn-flame.due .btn {
    background-color: #ff6347;
  }
  .btn-flame.flag .btn {
    background-color: #eeaa33;
  }

  .btn-flame >>> .el-badge__content {
    box-sizing: content-box;
  }
  .btn-flame.all >>> .el-badge__content {
    background-color: #AAA;
  }
  .btn-flame.due >>> .el-badge__content {
    background-color: #ff6347;
  }
  .btn-flame.flag >>> .el-badge__content {
    background-color: #eeaa33;
  }

  .active-bar {
    width: 100%;
    height: 4px;
    margin-top: 2px;
    background-color: transparent;
    border-radius: 2px;
  }
  .all .active-bar.is-active {
    background-color: #AAA;
  }
  .due .active-bar.is-active {
    background-color: #ff6347;
  }
  .flag .active-bar.is-active {
    background-color: #eeaa33;
  }
</style>
