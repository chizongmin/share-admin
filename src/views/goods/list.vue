<template>
  <div>
    <div>
      <el-tabs v-model="defaultTabName" type="border-card" @tab-click="changeList">
        <el-tab-pane
          v-for="item in tabList"
          :key="item.id"
          :label="item.name"
          :name="item.id"
        >
          <div>
            <i>{{ item.name }}</i>
            <div class="toolbar">
              <el-button type="primary" @click="openDialog()">新增</el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
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
        <el-table-column label="价格" align="center">
          <template slot-scope="scope">
            {{ scope.row.sum }}
          </template>
        </el-table-column>
        <el-table-column label="库存" align="center">
          <template slot-scope="scope">
            {{ scope.row.number }}
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.desc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="属性" align="center">
          <template slot-scope="scope">
            {{ scope.row.strNature }}
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            {{ scope.row.strStatus }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.native="openDialog({item:scope.row,action:'update'})">编辑</el-button>
            <el-popconfirm
              :title="'确认删除'+scope.row.name"
              @onConfirm="deleteGoods(scope.row.id)"
            >
              <el-button slot="reference" type="text" size="small" style="color: red;margin-left: 10px">
                删除
              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <addGoods
        v-if="dialogVisible"
        :dialog-visible.sync="dialogVisible"
        :index="defaultTabName"
        @closeDialog="closeDialog"
      />
    </div>
  </div>
</template>
<script>
import addGoods from '@/views/goods/addGoods'
import { categoryList, deleteGoods } from '@/api/goods/index'

export default {
  components: {
    addGoods
  },
  data() {
    return {
      defaultTabName: null,
      listLoading: true,
      currentRow: {},
      dialogVisible: false,
      action: null,
      tabList: [],
      list: []
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      categoryList({ status: 'ENABLE' }).then(response => {
        this.tabList = response.data
        if (this.tabList) {
          this.defaultTabName = this.tabList[0].id
          this.list = this.tabList[0].goods
        }
        this.listLoading = false
      })
    },
    changeList() {
      const currentList = this.tabList.find(item => item.id === this.defaultTabName)
      this.list = currentList.goods
    },
    fetchData() {
      this.listLoading = true
      categoryList({ status: 'ENABLE' }).then(response => {
        this.tabList = response.data
        this.listLoading = false
      })
    },
    openDialog() {
      this.dialogVisible = true
    },
    closeDialog(visable) {
      this.dialogVisible = false
      this.fetchData()
    },
    deleteGoods(id) {
      deleteGoods({ id: id }).then(response => {
        this.fetchData()
      })
    }
  }
}
</script>
<style scoped>
  .toolbar {
    float:right;
    margin-right: 60px;
  }
</style>
