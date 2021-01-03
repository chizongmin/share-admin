<template>
  <div>
    <el-table
      v-loading="listLoading"
      :data="list"
      :stripe="true"
      element-loading-text="Loading"
      border
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
      <el-table-column label="排序" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click.native="updateCategory(scope.row)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <UpdateCategory
      :update-dialog-visible.sync="updateDialogVisible"
      :category="currentRow"
      @closeUpdateDialogVisible="closeUpdateDialogVisible"
    />
  </div>
</template>

<script>
import { goodsList, categoryList } from '@/api/goods/index'
import UpdateCategory from '@/views/goods/updateCategory'
export default {
  components: {
    UpdateCategory
  },
  data() {
    return {
      list: null,
      listLoading: true,
      currentRow: null,
      updateDialogVisible: false,
      addDialogVisible: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      categoryList({}).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    updateCategory(category) {
      this.currentRow = category
      this.updateDialogVisible = true
    },
    closeUpdateDialogVisible(visable) {
      this.updateDialogVisible = false
      this.fetchData()
    },
    search() {
      goodsList().then(response => {
        this.list = response.data.items
        this.totalCount = response.data.totalCount
        this.listLoading = false
        this.searchLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
