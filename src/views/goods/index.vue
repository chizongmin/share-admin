<template>
  <div>
    <el-table
      v-loading="listLoading"
      :data="list"
      :stripe="true"
      element-loading-text="Loading"
      row-key="id"
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          {{ scope.row.strStatus }}
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click.native="openUpdateCategory(scope.row)" type="text" size="small">编辑</el-button>
          <el-button  type="text" size="small" class="sortable">拖拽</el-button>
        </template>
      </el-table-column>
    </el-table>
    <UpdateCategory
      :update-dialog-visible.sync="updateDialogVisible"
      :category="currentRow"
      @closeUpdateDialogVisible="closeUpdateCategory"
      v-if="updateDialogVisible"
    />
  </div>
</template>

<script>
import { categoryList, updateCategorySort } from '@/api/goods/index'
import UpdateCategory from '@/views/goods/updateCategory'
import Sortable from 'sortablejs'
export default {
  components: {
    UpdateCategory
  },
  data() {
    return {
      list: [],
      listLoading: true,
      currentRow: null,
      updateDialogVisible: false,
      addDialogVisible: false
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {
    const table = document.querySelector('.el-table__body-wrapper tbody')
    const self = this
    Sortable.create(table, {
      animation: 500,
      handle: '.sortable',
      onEnd({ newIndex, oldIndex }) {
        const targetRow = self.list.splice(oldIndex, 1)[0]
        self.list.splice(newIndex, 0, targetRow)
        self.drag()
      }
    })
  },
  methods: {
    fetchData() {
      this.listLoading = true
      categoryList({}).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    openUpdateCategory(category) {
      this.currentRow = category
      this.updateDialogVisible = true
    },
    closeUpdateCategory(visable) {
      this.updateDialogVisible = false
      this.fetchData()
    },
    drag() {
      updateCategorySort({ list: this.list })
    }
  }
}
</script>

<style scoped>

</style>
