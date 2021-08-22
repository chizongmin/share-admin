<template>
  <div>
    <div class="right-tabbox-newnotice">
      <el-tabs v-model="defaultTabName" type="border-card" @tab-click="fetchData">
        <el-tab-pane
          v-for="item in tabList"
          :key="item.name"
          :label="item.label"
          :name="item.name"
        >
          <div>
            <i>{{ item.label }}</i>
            <div class="toolbar">
              <el-input v-model="search" placeholder="请输入商品名称" style="width: 300px; margin-right: 20px" />
              <el-button type="primary" style="margin-right: 10px" @click="fetchData">搜索</el-button>
              <el-button type="primary" @click="openDialog({action:'save',item:{category:defaultTabName,tags:[],nature:'normal',status:'ENABLE'}})">新增</el-button>
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
        <el-table-column label="缩略图" align="center">
          <template slot-scope="scope">
            <img v-if="scope.row.indexImage" :src="scope.row.indexImage" class="avatar">
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
        <el-table-column label="商品特色" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标签" align="center" >
          <template slot-scope="scope">
            <el-tag
              v-for="tag in scope.row.tags"
              :key="tag"
            >
              {{ tag }}
            </el-tag>
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
      <upsertGood
        v-if="dialogVisible"
        :dialog-visible.sync="dialogVisible"
        :item="currentRow"
        :action="action"
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
.avatar {
  width: 88px;
  height: 88px;
  display: block;
}
</style>
