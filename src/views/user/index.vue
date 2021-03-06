<template>
  <div class="app-container">
    <div class="filterDiv">
      <div class="addressDiv">
        <el-select v-model="params.country" clearable placeholder="请选择">
          <el-option
            v-for="item in address.country"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="addressDiv">
        <el-select v-model="params.villager" clearable placeholder="请选择">
          <el-option
            v-for="item in address.villager"
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
      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="编号" align="center">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="城乡" align="center">
        <template slot-scope="scope">
          {{ scope.row.strCountry }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="小区">
        <template slot-scope="scope">
          <span>{{ scope.row.strVillager }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="积分">
        <template slot-scope="scope">
          <span>{{ scope.row.score }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.dateCreated }}</span>
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
import { list, filterAddress } from '@/api/user/index'
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
        endDate: null,
        country: null,
        villager: null
      },
      address: {
        country: null,
        villager: null
      },
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
    this.filterAddress()
  },
  methods: {
    async filterAddress() {
      filterAddress().then(response => {
        this.address.country = response.data.country
        this.address.villager = response.data.villager
      })
    },
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
  .addressDiv {
    display: inline;
    margin-right: 20px;
  }
  .dateDiv {
    display: inline;
  }
  .searchDiv {
    float:right;
    margin-right: 60px;
  }
</style>

