<template>
  <el-collapse v-model="taskListCollapse">
    <el-collapse-item v-for="(task, index) in taskList" :key="task.id" :name="task.id">
      <template v-slot:title>
        <div class="collapse-title">
          <p class="name">{{task.name}}</p>
          <i class="el-icon-s-flag" v-if="task.status===1"></i>
          <span class="switch" @click="stopPropagation">
            <el-switch
              :value="task.isCompleted"
              @change="changeCompletedFlg(index, task.id, $event)"
              :inactive-value="false" :active-value="true"
              active-color="#62c5a5"
            />
          </span>
        </div>
      </template>
      <div class="collapse-info">
        <div class="top">
          <div class="description" v-if="task.description">
            <span class="title"><i class="el-icon-notebook-2"></i>メモ</span>
            <p>{{task.description}}</p>
          </div>
        </div>
        <div class="bottom">
          <div class="due-date" v-if="task.dueDate">
            <span class="title"><i class="el-icon-date"></i>日付</span>
            <p>{{formatDate(task.dueDate)}}</p>
          </div>
          <span class="button-field">
            <el-button icon="el-icon-edit" size="mini" circle @click="emitTask(task)" />
            <el-button
              type="danger" icon="el-icon-delete" size="mini" circle
              @click="deleteTask(task.id)"
            />
          </span>
        </div>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch, Emit } from 'vue-property-decorator'
import axios from 'axios'

import { Task } from './TaskList.vue'

import MixinCommon from '../common/mixinCommon'

export interface CompletedFlg {
   index: number;
   isCompleted: boolean;
}

@Component({
  components: {}
})
export default class TaskDateCollapse extends Mixins(MixinCommon) {
  @Prop({ type: Array })
  taskList!: Task[]

  taskListCollapse: number[] = []

  @Watch('taskList')
  resetCollapse (): void {
    this.taskListCollapse = []
  }

  async changeCompletedFlg (index: number, id: number, isCompleted: boolean): Promise<void> {
    this.emitCompletedFlg(index, isCompleted)
    const response = await axios.put(`/api/tasks/${id}/is_completed`, { isCompleted: isCompleted })
    console.log(response)
  }

  @Emit('changeCompletedFlg')
  emitCompletedFlg (index: number, isCompleted: boolean): CompletedFlg {
    const completedFlg = {
      index: index,
      isCompleted: isCompleted
    }
    return completedFlg
  }

  async deleteTask (id: number): Promise<void> {
    const response = await axios.delete(`/api/tasks/${id}`)
    if (response.data) {
      this.emitDelete(id)
    }
  }

  @Emit('delete')
  emitDelete (id: number): number {
    return id
  }

  @Emit('edit')
  emitTask (task: Task): Task {
    return task
  }

  stopPropagation (): void {
    arguments[0].stopPropagation()
  }
}
</script>

<style scoped>
  .collapse-title {
    width: 100%;
    display: flex;
    align-items: center;
  }

  .el-icon-s-flag {
    margin-left: 5px;
    color: #eeaa33;
  }

  .collapse-title .name {
    color: #606266;
  }
  .collapse-title .switch {
    margin: 0 15px 0 auto;
    margin-right: 15px;
  }
  .collapse-info {
    padding: 0 12px
  }
  .collapse-info .title {
    border-bottom: solid 1px
  }

  .collapse-info .bottom {
    display: flex;
    align-items: flex-end;
  }

  .collapse-info .button-field {
    margin-left: auto;
  }
</style>
