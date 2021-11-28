<template>
  <el-dialog :visible="dialogVisible" @close="cancel">
    <template v-slot:title>
      <p>カテゴリーを削除しますか？</p>
    </template>
    <span>カテゴリーに関連したタスクも削除されます</span>
    <template v-slot:footer>
      <span>
        <el-button @click="cancel">キャンセル</el-button>
        <el-button type="primary" @click="accept">削除</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class ConfirmModal extends Vue {
  title = ''
  description= ''
  dialogVisible = false
  resolve = (message: string): void => { console.log(message) }
  reject = (message: string): void => { console.log(message) }

  async open (title: string, description: string): Promise<string> {
    this.title = title
    this.description = description
    this.dialogVisible = true
    return new Promise((resolve: (message: string) => void, reject: (message: string) => void) => {
      this.resolve = resolve
      this.reject = reject
    })
  }

  accept (): void {
    this.dialogVisible = false
    this.resolve('accept')
  }

  cancel (): void {
    this.dialogVisible = false
    this.reject('cancel')
  }
}
</script>

<style scoped>
</style>
