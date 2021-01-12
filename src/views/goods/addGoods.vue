<template>
  <el-dialog title="添加商品" :visible.sync="dialogVisible" :before-close="close" width="70%" top="10vh">
    <div>
      <div>
        <el-tabs v-model="defaultTabName" type="border-card">
          <el-tab-pane
            v-for="item in tabList"
            :key="item.name"
            :label="item.label"
            :name="item.name"
          >
            <div>
              <i>{{ item.label }}</i>
              <div class="toolbar">
                <el-input v-model="search" placeholder="请输入要搜索商品名称" size="small" />
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
          height="360"
          highlight-current-row
          @selection-change="handleSelectionChange"
        >
          >
          <el-table-column
            type="selection"
            width="55"
          />
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
        </el-table>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { addToCategoryList, addGoodsToCategory} from '@/api/goods/index'
import { goodsTabList } from '@/api/cacheMap'
export default {
  name: 'AddGoods',
  props: ['dialogVisible', 'index'],
  data() {
    return {
      defaultTabName: 'vegetables',
      search: null,
      listLoading: true,
      loading: false,
      currentRow: {},
      tabList: null,
      goodsDataMap: {},
      itemChecked: []
    }
  },
  computed: {
    list() {
      if (this.goodsDataMap) {
        const currentList = this.goodsDataMap[this.defaultTabName]
        if (this.search != null) {
          return currentList.filter(item => item.name.indexOf(this.search) !== -1)
        } else {
          return currentList
        }
      } else {
        return []
      }
    }
  },
  created() {
    this.tabList = goodsTabList
    this.fetchData()
  },
  methods: {
    handleSelectionChange(val) {
      this.itemChecked = val
    },
    confirm() {
      addGoodsToCategory({ id: this.index, goods: this.itemChecked }).then(response => {
        if (response.code === 200) {
          this.$message.success('添加成功')
          this.$emit('closeDialog', false)
          this.loading = false
        } else {
          this.loading = false
          this.$message.error(response.message)
        }
      })
    },
    fetchData() {
      this.listLoading = true
      addToCategoryList({ index: this.index }).then(response => {
        this.goodsDataMap = response.data
        this.listLoading = false
      })
    },
    close() {
      this.loading = false
      this.$emit('update:dialogVisible', false)
    }
  }
}
</script>
<style scoped>
  .toolbar {
    float:right;
    margin-right: 15px;
  }
</style>
