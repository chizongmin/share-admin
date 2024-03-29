<template>
  <div>
    <div>
      <el-tabs v-model="defaultTabName" type="border-card">
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
            <el-button type="text" size="small" @click.native="openUpdateGoodsDialog(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click.native="changeNumber(scope.row)">修改库存</el-button>
            <el-popconfirm
              :title="'确认删除'+scope.row.name"
              @onConfirm="deleteGoodsFromCategory(scope.row.id)"
            >
              <el-button slot="reference" type="text" size="small" style="color: red;margin-left: 10px">
                删除
              </el-button>
            </el-popconfirm>
            <el-button type="text" size="small" class="sortable" style="margin-left: 10px">拖拽</el-button>
          </template>
        </el-table-column>
      </el-table>
      <addGoods
        v-if="dialogVisible"
        :dialog-visible.sync="dialogVisible"
        :index="defaultTabName"
        @closeDialog="closeDialog"
      />
      <upsertGood
        v-if="updateGoodsDialogVisible"
        :dialog-visible.sync="updateGoodsDialogVisible"
        :item="currentRow"
        action="update"
        @closeDialog="closeDialog"
      />
    </div>
  </div>
</template>
<script>
import { Loading } from 'element-ui'
import addGoods from '@/views/goods/addGoods'
import { categoryList, deleteGoodsFromCategory, updateGoodsSort, changeNumber } from '@/api/goods/index'
import Sortable from 'sortablejs'
import upsertGood from '@/views/goods/upsertGood'
export default {
  components: {
    addGoods,
    upsertGood
  },
  data() {
    return {
      defaultTabName: null,
      listLoading: true,
      currentRow: {},
      dialogVisible: false,
      updateGoodsDialogVisible: false,
      action: null,
      tabList: []
    }
  },
  computed: {
    list() {
      const currentList = this.tabList.find(item => item.id === this.defaultTabName)
      if (currentList) {
        return currentList.goods
      } else {
        return []
      }
    }
  },
  mounted() {
    this.setSortable()
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
        }
        this.listLoading = false
      })
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
    openUpdateGoodsDialog(item) {
      this.currentRow = item
      this.updateGoodsDialogVisible = true
    },
    closeDialog(visable) {
      this.dialogVisible = false
      this.updateGoodsDialogVisible = false
      this.fetchData()
    },
    deleteGoodsFromCategory(goodsId) {
      deleteGoodsFromCategory({ id: this.defaultTabName, goodsId: goodsId }).then(response => {
        this.fetchData()
      })
    },
    setSortable() {
      const table = document.querySelector('.el-table__body-wrapper tbody')
      const self = this
      Sortable.create(table, {
        animation: 500,
        handle: '.sortable',
        onEnd({ newIndex, oldIndex }) {
          const targetRow = self.list.splice(oldIndex, 1)[0]
          self.list.splice(newIndex, 0, targetRow)
          self.updateGoodsSort()
        }
      })
    },
    updateGoodsSort() {
      updateGoodsSort({ id: this.defaultTabName, goods: this.list }).then(response => {
        // this.fetchData()
      })
    },
    changeNumber(item) {
      this.$prompt('请输入当前库存，减少输入负数', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        const loadingInstance = Loading.service({ fullscreen: false })
        changeNumber({ id: item.id, number: value }).then(response => {
          if (response.code === 200) {
            loadingInstance.close()
            this.$message.info(response.message)
          } else {
            loadingInstance.close()
          }
        })
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
