<template>
  <div>
    <div class="right-tabbox-newnotice">
      <el-tabs v-model="defaultTabName" type="border-card" @tab-click="fetchData">
        <el-tab-pane
          :key="item.name"
          v-for="item in tabList"
          :label="item.label"
          :name="item.name"
        >
          <div>
            <i>{{ item.label }}</i>
            <div class="toolbar">
              <el-input v-model="search" placeholder="请输入商品名称" style="width: 300px; margin-right: 20px" />
              <el-button type="primary" @click="fetchData" style="margin-right: 10px">搜索</el-button>
              <el-button type="primary" @click="openDialog({action:'save',item:{category:defaultTabName,nature:'normal',status:'ENABLE'}})">新增</el-button>
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
        height="550"
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
              <el-button type="text" size="small" slot="reference" style="color: red;margin-left: 10px">
                删除
              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <upsertGood
        v-if="dialogVisible"
        :dialog-visible.sync="dialogVisible"
        :item="currentRow"
        :action="action"
        :tab-list="tabList"
        @closeDialog="closeDialog"
      />
    </div>
  </div>
</template>
<script>
import upsertGood from '@/views/goods/upsertGood'
import { goodsList, deleteGoods } from '@/api/goods/index'
import { goodsTabList } from '@/api/cacheMap'

export default {
  components: {
    upsertGood
  },
  data() {
    return {
      defaultTabName: 'vegetables',
      search: null,
      listLoading: true,
      list: [],
      currentRow: {},
      dialogVisible: false,
      action: null,
      tabList: null
    }
  },
  created() {
    this.tabList = goodsTabList
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      goodsList({ category: this.defaultTabName, search: this.search }).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    openDialog(dialogParams) {
      this.action = dialogParams.action
      this.currentRow = dialogParams.item
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
