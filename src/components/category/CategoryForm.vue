<template>
  <div>
    <el-tabs v-model="tabName">
      <el-tab-pane label="追加" name="add"></el-tab-pane>
      <el-tab-pane v-if="editCategory.id" label="編集" name="edit"></el-tab-pane>
    </el-tabs>
    <el-form :model="category" :rules="rules" ref="form" label-width="110px">
      <el-form-item label="カテゴリー名"  prop="name">
        <el-input v-model="category.name"></el-input>
      </el-form-item>
      <el-form-item label="カラー" prop="color" class="form-color">
        <el-color-picker v-model="category.color"></el-color-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="clear">キャンセル</el-button>
        <el-button type="primary" @click="validate">保存</el-button>
      </el-form-item>
    </el-form>
    <span v-if="tabName==='edit'" class="button-field">
      <el-button
        type="danger" icon="el-icon-delete" size="mini" circle
        @click="deleteCategory(category.id)"
      />
    </span>
    <ConfirmModal ref="confirmModal" />
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import { ElForm } from 'element-ui/types/form'
import { Component, Vue, Prop, Watch, Emit, Ref } from 'vue-property-decorator'
import { Category } from '../task/TaskList.vue'
import ConfirmModal from '../common/ConfirmModal.vue'
import SelectCategory from './SelectCategory.vue'

@Component({
  components: { SelectCategory, ConfirmModal }
})
export default class CategoryForm extends Vue {
  @Ref('form')
  form!: ElForm

  @Ref('confirmModal')
  confirmModal!: ConfirmModal

  @Prop({ type: Object })
  editCategory!: Category

  category = {
    id: 0,
    name: '',
    color: '#FFFFFF',
    status: 0
  }

  defaultCategory = {
    id: 0,
    name: '',
    color: '#FFFFFF',
    status: 0
  }

  rules = {
    name: [
      { required: true, message: 'カテゴリー名を入力してください', trigger: 'submit' }
    ],
    color: [
      { required: true, message: 'カラーを選択してください', trigger: 'submit' }
    ]
  }

  tabName = 'add'
  deleteConfirm = {
    title: 'カテゴリーを削除しますか？',
    description: 'カテゴリーに関連したタスクも削除されます'
  }

  @Watch('editCategory')
  watchEditCategory (): void {
    if (this.editCategory.id) {
      this.category = { ...this.editCategory }
      this.tabName = 'edit'
    } else {
      this.category = { ...this.defaultCategory }
      this.tabName = 'add'
    }
  }

  @Watch('tabName')
  modeChange (): void {
    if (this.tabName === 'edit') {
      this.category = { ...this.editCategory }
    } else {
      this.category = { ...this.defaultCategory }
    }
  }

  async submit (): Promise<void> {
    if (this.tabName === 'edit') {
      const response = await axios.put('/api/categories', this.category)
      if (response.data) {
        this.emitUpdate(this.category)
        this.clear()
      }
    } else {
      const response = await axios.post('/api/categories', this.category)
      if (response.data) {
        this.emitUpdate(this.category)
        this.clear()
      }
    }
  }

  @Emit('update')
  emitUpdate (category: Category): Category {
    return { ...category }
  }

  async deleteCategory (id: number): Promise<void> {
    try {
      await this.confirmModal.open(this.deleteConfirm.title, this.deleteConfirm.description)
      const response = await axios.delete(`/api/categories/${id}`)
      if (response.data) {
        this.emitDelete(id)
        this.clear()
      }
    } catch {}
  }

  @Emit('delete')
  emitDelete (id: number): number {
    console.log(id)
    return id
  }

  @Emit('clear')
  clear (): string {
    this.category = { ...this.defaultCategory }
    return this.tabName
  }

  validate (): void {
    this.form.validate((valid) => {
      if (valid) {
        this.submit()
      }
    })
  }
}
</script>

<style scoped>
  .button-field {
    display: flex;
    justify-content: flex-end;
  }

  .form-color >>> .el-form-item__content {
    line-height: initial;
  }
</style>
