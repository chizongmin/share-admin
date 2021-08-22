<template>
  <div>
    <div>
      <el-form :inline="true" :model="config.service" v-loading="loading" class="middle">
        <el-form-item label="服务开启" prop="serviceSwitch">
          <el-switch v-model="config.service.switch"></el-switch>
        </el-form-item>
        <el-form-item label="提示信息" prop="serviceMssage">
          <el-input v-model="config.service.message"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('service')">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-form :inline="true" :model="config" v-loading="loading" class="middle">
        <el-form-item label="积分比例" prop="serviceMssage">
          <el-input-number v-model="config.scorePercent"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('scorePercent')">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { index, updateConfig } from '@/api/config'
export default {
  created() {
    this.fetchData()
  },
  data() {
    return {
      loading: false,
      config: {
        service: {},
        scorePercent: 1
      }
    }
  },
  methods: {
    onSubmit(key) {
      this.update(key, this.config[key])
    },
    fetchData() {
      index().then(response => {
        this.config = response.data
      })
    },
    update(key, value) {
      this.loading = true
      updateConfig({ key: key, value: value }).then(response => {
        this.loading = false
        this.$message.info('保存成功！')
      })
    }
  }
}
</script>
<style scoped>
  .middle {
    margin: 30px 0 0 30px;
  }
</style>
