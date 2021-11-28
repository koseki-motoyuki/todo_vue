<template>
  <div class="selected-category-flame" :style="selectedCategory? {borderBottom: `solid 2px ${selectedCategory.color}`} : {}">
    <el-dropdown class="dropdown" placement="bottom" @command="setCategoryId">
      <div class="selected-category">
        <span  class="color-badge" v-if="selectedCategory" :style="{backgroundColor: selectedCategory.color}" />
        <i class="el-icon-menu" v-else></i>
        <p class="category-name">{{ selectedCategory? selectedCategory.name : 'カテゴリー' }}</p>
        <span  class="color-badge" v-if="selectedCategory" :style="{backgroundColor: selectedCategory.color}" />
        <i class="el-icon-menu" v-else></i>
      </div>
      <template v-slot:dropdown>
        <el-dropdown-menu>
        <template v-if="categoryList.length">
          <el-dropdown-item  v-for="category in categoryList" :key="category.id" :command="category.id">
            <span class="list-item">
              <span  class="color-badge" :style="{backgroundColor: category.color}" />
              <p class="category-name">{{category.name}}</p>
              <span  class="color-badge" :style="{backgroundColor: category.color}" />
            </span>
          </el-dropdown-item>
          <el-dropdown-item :command="0">
            <span class="list-item">
              <p class="clear">クリア</p>
            </span>
          </el-dropdown-item>
        </template>
        <template v-else>
          <el-dropdown-item>カテゴリーなし</el-dropdown-item>
        </template>
      </el-dropdown-menu>
      </template>
    </el-dropdown>
    <slot name="flameRight" :selectedCategory="selectedCategory"></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Category } from '../task/TaskList.vue'

@Component({
  components: {}
})
export default class SelectCategory extends Vue {
  @Prop({ type: Array })
  categoryList!: Category[]

  selectedCategoryId = 0

  get selectedCategory (): Category|undefined {
    const category = this.categoryList.find((category) => {
      return category.id === this.selectedCategoryId
    })
    return category
  }

  setCategoryId (id: number): void {
    this.selectedCategoryId = id
  }

  clearCategoryId (): void {
    this.selectedCategoryId = 0
  }
}
</script>

<style scoped>
  .selected-category-flame {
    display: flex;
    align-items: center;
    height: 25px;
    border-bottom: solid 2px transparent;
    position: relative;
  }
  .dropdown {
    flex-grow: 1;
  }
  .selected-category {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .category-name {
    margin: 0 10px;
    padding-top: 1px;
  }
  .el-icon-arrow-down {
    padding-left: 10px;
  }
  .list-item {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .color-badge {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 25%;
  }

  .clear {
    color: #F56C6C;
  }

  .edit-icon >>> .el-icon-edit {
    font-size: 20px;
  }
</style>
