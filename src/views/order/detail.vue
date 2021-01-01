<template>
  <div class="app-container">
    <div class="filterDiv">
      <div class="statusDiv">
        <el-select v-model="params.status" clearable placeholder="请选择">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="dateDiv">
        <el-date-picker
          v-model="filterDateRange"
          type="daterange"
          :clearable="false"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div class="searchDiv">
        <el-button type="primary" @click="search" :loading="searchLoading">搜索</el-button>
      </div>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="订单编号">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column label="订单日期" align="center">
        <template slot-scope="scope">
          {{ scope.row.dateCreated }}
        </template>
      </el-table-column>
      <el-table-column label="单品名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单品数量" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单品金额" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单品类型" align="center">
        <template slot-scope="scope">
          {{ scope.row.user.phone }}
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        class="pagination"
        background
        :current-page.sync="params.pageNumber"
        :page-sizes="[10, 20, 50, 100]"
        :page-size.sync="params.pageSize"
        :total="totalCount"
        layout="sizes, prev, pager, next"
        @size-change="fetchData"
        @current-change="fetchData"
      />
    </div>
  </div>
</template>

<script>
import { list } from '@/api/order/order'
import { formatDate } from 'element-ui/src/utils/date-util'
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      searchLoading: false,
      totalCount: null,
      params: {
        pageSize: 10,
        pageNumber: 1,
        status: 'wait',
        startDate: null,
        endDate: null
      },
      statusOptions: [
        {
          value: 'wait',
          label: '待处理'
        },
        {
          value: 'sending',
          label: '派送中'
        },
        {
          value: 'finish',
          label: '已完成'
        },
        {
          value: 'cancel',
          label: '已退货'
        }
      ],
      filterDateRange: null
    }
  },
  watch: {
    filterDateRange(val) {
      this.params.startDate = val[0]
      this.params.endDate = val[1]
    }
  },
  created() {
    const end = formatDate(new Date(), 'yyyy-MM-dd')
    const start = formatDate(new Date().getTime() - 3600 * 1000 * 24 * 1, 'yyyy-MM-dd')
    this.filterDateRange = [start, end]
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      list(this.params).then(response => {
        this.list = response.data.items
        this.totalCount = response.data.totalCount
        this.listLoading = false
        this.searchLoading = false
      })
    },
    search() {
      this.searchLoading = true
      this.params.pageNumber = 1
      this.fetchData()
    }
  }
}
</script>
<style scoped>
  .pagination {
    margin : 16px 0px 0px -10px;
  }
  .filterDiv {
    margin-bottom: 30px;
  }
  .statusDiv {
    display: inline;
  }
  .dateDiv {
    display: inline;
    margin-left: 20px;
  }
  .searchDiv {
    float:right;
    margin-right: 60px;
  }
</style>

