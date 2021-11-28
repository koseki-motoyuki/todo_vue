<template>
  <div>
    <el-tabs v-model="tabName">
      <el-tab-pane label="追加" name="add"></el-tab-pane>
      <el-tab-pane v-if="editTask.id" label="編集" name="edit"></el-tab-pane>
    </el-tabs>
    <el-form :model="task" :rules="rules" ref="form" label-width="85px">
      <el-form-item label="タイトル" prop="name">
        <el-input v-model="task.name"></el-input>
      </el-form-item>
      <el-form-item label="カテゴリー">
        <el-select v-model="task.categoryId" placeholder="カテゴリー">
          <el-option v-for="category in categoryList" :label="category.name" :value="category.id" :key="category.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="メモ">
        <el-input type="textarea" v-model="task.description"></el-input>
      </el-form-item>
      <el-form-item label="日付">
        <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="日付" v-model="task.dueDate"></el-date-picker>
      </el-form-item>
      <el-form-item label="フラグ">
        <el-switch
          v-model="task.status"
          :inactive-value="0" :active-value="1"
          active-color="#eeaa33"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="clear">キャンセル</el-button>
        <el-button type="primary" @click="validate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import { Component, Vue, Prop, Watch, Emit, Ref } from 'vue-property-decorator'
import { ElForm } from 'element-ui/types/form'
import { Category, Task } from '../task/TaskList.vue'

@Component({
  components: {}
})
export default class TaskForm extends Vue {
  @Ref('form')
  form!: ElForm

  @Prop({ type: Array })
  categoryList!: Category[]

  @Prop({ type: Object })
  editTask!: Task

  task: Task = {
    id: 0,
    categoryId: null,
    name: '',
    description: '',
    isCompleted: false,
    status: 0,
    dueDate: ''
  }

  defaultTask = {
    id: 0,
    categoryId: null,
    name: '',
    description: '',
    isCompleted: false,
    status: 0,
    dueDate: ''
  }

  rules = {
    name: [
      { required: true, message: 'タイトルを入力してください', trigger: 'submit' }
    ]
  }

  tabName = 'add'

  @Watch('editTask')
  changeTab (): void {
    if (this.editTask.id) {
      this.task = { ...this.editTask }
      this.tabName = 'edit'
    } else {
      this.task = { ...this.defaultTask }
      this.tabName = 'add'
    }
  }

  @Watch('tabName')
  modeChange (): void {
    if (this.tabName === 'edit') {
      this.task = { ...this.editTask }
    } else {
      this.task = { ...this.defaultTask }
    }
  }

  async submit (): Promise<void> {
    if (this.tabName === 'edit') {
      const response = await axios.put('/api/tasks', this.task)
      if (response.data) {
        this.emitTask(this.task)
        this.clear()
      }
    } else {
      const response = await axios.post('/api/tasks', this.task)
      if (response.data) {
        this.emitTask(this.task)
        this.clear()
      }
    }
  }

  @Emit('update')
  emitTask (task: Task): Task {
    return { ...task }
  }

  @Emit('clear')
  clear (): string {
    this.task = { ...this.defaultTask }
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
</style>
