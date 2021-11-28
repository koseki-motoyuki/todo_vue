import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import TaskList from '../components/task/TaskList.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'TaskList',
    component: TaskList
  }
]

const router = new VueRouter({
  routes
})

export default router
