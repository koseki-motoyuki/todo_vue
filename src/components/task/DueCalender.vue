<template>
  <el-calendar>
    <template v-slot:dateCell="{ data }">
      <div :class="['date', {'is-selected': selectedDate===data.day}]" @click="selectDate(data.day)">
        <span>
          {{ data.day.split('-')[2] }}
        </span>
        <span v-if="isDueDate(data.day)" class="is-duedate"><i class="el-icon-date"></i></span>
      </div>
    </template>
  </el-calendar>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'

import { Task } from './TaskList.vue'

@Component({
  components: {}
})
export default class DueCalender extends Vue {
  @Prop({ type: Array })
  taskList!: Task[]

  selectedDate = ''

  isDueDate (day: string): boolean {
    return this.taskList.some((task) => {
      return task.dueDate === day
    })
  }

  @Emit('click')
  selectDate (date: string): string {
    if (this.selectedDate === date) {
      this.selectedDate = ''
    } else {
      this.selectedDate = date
    }
    return this.selectedDate
  }
}
</script>

<style scoped>
  .date {
    height: 100%;
    padding: 8px;
    display: flex;
    justify-content: space-between
  }
  .date.is-selected {
    background-color: #fcebe8;
  }
  .is-duedate {
    color: #ff6347;
  }
</style>

<style>
  .el-calendar-table .el-calendar-day {
    padding: initial;
  }

  .el-calendar-table td.is-selected {
    background-color: initial;
  }
</style>
