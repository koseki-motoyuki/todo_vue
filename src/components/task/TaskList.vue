<template>
  <el-row class="row" :gutter="20">
  <el-col class="col" :span="9" :offset="3">
    <div :class="['list-flame', mode]">
      <div class="btn-field">
        <SearchButton type="all" :mode="mode" icon="el-icon-receiving" :value="listByCategory.length" @click="setMode('all')">すべて</SearchButton>
        <SearchButton type="due" :mode="mode" icon="el-icon-date" :value="ListByDue.length" @click="setMode('due')">{{selectedDate? formatDate(selectedDate) : '日付あり'}}</SearchButton>
        <SearchButton type="flag" :mode="mode" icon="el-icon-s-flag" :value="ListByFlag.length" @click="setMode('flag')">フラグあり</SearchButton>
      </div>
      <SelectCategory ref="selectCategory" :categoryList="categoryList">
        <template v-slot:flameRight="{ selectedCategory }">
          <el-link
            class="edit-icon" v-if="selectedCategory"
            icon="el-icon-edit" type="info"
            @click="setEditCategory(selectedCategory)"
          />
        </template>
      </SelectCategory>
      <TaskListCollapse
        v-if="selectedTaskList.length" :taskList="selectedTaskList"
        @changeCompletedFlg="updateCompletedFlg" @delete="deleteTask" @edit="setEditTask"
      />
      <div v-else class="empty">
        <el-empty description="やることはありません"></el-empty>
      </div>
    </div>
  </el-col>
  <el-col :span="9">
    <el-tabs v-model="tabName">
    <el-tab-pane label="カレンダー" name="calender">
      <DueCalender :taskList="listByCategory" @click="setSelectedDate" />
    </el-tab-pane>
    <el-tab-pane label="タスク管理" name="taskManagement">
      <TaskForm
        :categoryList="categoryList" :editTask="editTask"
        @update="updateTaskList" @clear="resetEditTask"
      />
    </el-tab-pane>
    <el-tab-pane label="カテゴリー管理" name="categoryManagement">
      <CategoryForm
        :editCategory="editCategory"
        @update="updateCategoryList" @delete="deleteCategory" @clear="resetEditCategory"
      />
    </el-tab-pane>
  </el-tabs>
  </el-col>
</el-row>
</template>

<script lang="ts">
import { Component, Mixins, Ref } from 'vue-property-decorator'
import axios from 'axios'

import DueCalender from './DueCalender.vue'
import TaskListCollapse, { CompletedFlg } from './TaskListCollapse.vue'
import SearchButton from './SearchButton.vue'
import SelectCategory from '../category/SelectCategory.vue'
import CategoryForm from '../category/CategoryForm.vue'

import MixinCommon from '../common/mixinCommon'
import TaskForm from './TaskForm.vue'

export interface Task {
  id: number
  categoryId: number | null
  name: string
  description: string | null
  isCompleted: boolean
  status: number
  dueDate: string | null
}

export interface Category {
  id: number
  name: string
  color: string
  status: number
}

@Component({
  components: { DueCalender, TaskListCollapse, SearchButton, SelectCategory, TaskForm, CategoryForm }
})
export default class TaskList extends Mixins(MixinCommon) {
  @Ref('selectCategory')
  selectCategory!: SelectCategory

  taskList: Task[] = []
  categoryList: Category[] = []
  mode = 'all'
  selectedDate = ''
  tabName = 'calender'

  editTask: Task = {
    id: 0,
    categoryId: null,
    name: '',
    description: null,
    isCompleted: false,
    status: 0,
    dueDate: null
  }

  editCategory = {
    id: 0,
    name: '',
    color: ''
  }

  get selectedTaskList (): Task[] {
    if (this.mode === 'due') {
      return this.ListByDue
    } else if (this.mode === 'flag') {
      return this.ListByFlag
    }
    return this.listByCategory
  }

  get listByCategory (): Task[] {
    if (this.selectCategory && this.selectCategory.selectedCategoryId) {
      return this.taskList.filter((task) => {
        return task.categoryId === this.selectCategory.selectedCategoryId
      })
    } else {
      return this.taskList
    }
  }

  get ListByDue (): Task[] {
    const listByDue = this.listByCategory.filter((task) => {
      return task.dueDate
    })
    if (this.selectedDate) {
      return this.listByDate(listByDue)
    }

    return listByDue
  }

  get ListByFlag (): Task[] {
    return this.listByCategory.filter((task) => {
      return task.status === 1
    })
  }

  listByDate (taskList: Task[]): Task[] {
    return taskList.filter((task) => {
      return task.dueDate === this.selectedDate
    })
  }

  created (): void {
    this.setTaskList()
    this.setCategoryList()
  }

  async setTaskList (): Promise<void> {
    const response = await axios.get('/api/tasks')
    this.taskList = response.data
  }

  async updateTaskList (task: Task): Promise<void> {
    let index = 0
    const isExist = this.taskList.some((selectedTask, listIndex) => {
      index = listIndex
      return task.id === selectedTask.id
    })
    if (isExist) {
      this.taskList.splice(index, 1, task)
    } else {
      await this.setTaskList()
    }
    this.mode = 'all'
    if (task.categoryId) {
      this.selectCategory.setCategoryId(task.categoryId)
    } else {
      this.selectCategory.clearCategoryId()
    }
  }

  updateCompletedFlg (completedFlg: CompletedFlg): void {
    this.taskList[completedFlg.index].isCompleted = completedFlg.isCompleted
  }

  deleteTask (id: number): void {
    this.taskList = this.taskList.filter((task) => {
      return task.id !== id
    })
  }

  async setCategoryList (): Promise<void> {
    const response = await axios.get('/api/categories')
    this.categoryList = response.data
  }

  async updateCategoryList (category: Category): Promise<void> {
    let index = 0
    const isExist = this.categoryList.some((selectedCategory, listIndex) => {
      index = listIndex
      return category.id === selectedCategory.id
    })
    if (isExist) {
      this.categoryList.splice(index, 1, category)
      this.selectCategory.setCategoryId(category.id)
    } else {
      await this.setCategoryList()
      this.selectCategory.setCategoryId(this.categoryList.slice(-1)[0].id)
    }
  }

  deleteCategory (id: number): void {
    this.categoryList = this.categoryList.filter((category) => {
      return category.id !== id
    })
    this.taskList = this.taskList.filter((task) => {
      return task.categoryId !== id
    })
    if (this.selectCategory.selectedCategoryId === id) {
      this.selectCategory.clearCategoryId()
    }
  }

  setMode (type: string): void {
    this.mode = type
  }

  setSelectedDate (date:string): void {
    this.selectedDate = date
    this.mode = 'due'
  }

  setEditTask (task: Task): void {
    this.editTask = { ...task }
    this.tabName = 'taskManagement'
  }

  resetEditTask (tabName: string): void {
    if (tabName === 'edit') {
      this.editTask = {
        id: 0,
        categoryId: null,
        name: '',
        description: null,
        isCompleted: false,
        status: 0,
        dueDate: null
      }
    }
    this.tabName = 'calender'
  }

  setEditCategory (category: Category): void {
    this.editCategory = { ...category }
    this.tabName = 'categoryManagement'
  }

  resetEditCategory (tabName: string): void {
    if (tabName === 'edit') {
      this.editCategory = {
        id: 0,
        name: '',
        color: ''
      }
    }
    this.tabName = 'calender'
  }
}
</script>

<style scoped>
  .row, .col {
    height: 100%;
  }

  .list-flame {
    height: 100%;
    border-style: dashed;
    border-width: 0 3px 0;
    padding: 0 13px 0;
  }
  .list-flame.all {
    border-color: #AAA;
  }
  .list-flame.due {
    border-color: #ff6347;
  }
  .list-flame.flag {
    border-color: #eeaa33;
  }
  .btn-field {
    display: flex;
    justify-content: space-evenly;
    padding: 10px 0 20px;
  }
  .edit-icon {
    position: absolute;
    right: 0px;
  }
  .empty {
    padding-top: 100px;
  }
</style>
