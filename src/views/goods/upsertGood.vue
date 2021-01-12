<template>
  <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :before-close="close">
    <el-form ref="form" :model="item" :rules="rules">
      <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
        <el-input v-model="item.name" autocomplete="off"></el-input>
      </el-form-item>
      <div style="float: left;position: absolute">
        <el-form-item label="价格" :label-width="formLabelWidth" prop="sum">
          <el-input-number v-model="item.sum" :min="0" :max="10000"></el-input-number>
        </el-form-item>
      </div>
      <div style="margin-left: 300px">
        <el-form-item label="库存" :label-width="formLabelWidth" prop="number">
          <el-input-number v-model="item.number" :min="0" :max="10000"></el-input-number>
        </el-form-item>
      </div>
      <el-form-item label="状态" :label-width="formLabelWidth" prop="status" size="medium">
        <template>
          <el-radio-group v-model="item.status">
            <el-radio-button label="ENABLE">已启用</el-radio-button>
            <el-radio-button label="DISABLE">已禁用</el-radio-button>
          </el-radio-group>
        </template>
      </el-form-item>
      <el-form-item label="属性" :label-width="formLabelWidth" prop="nature" size="medium">
        <template>
          <el-radio-group v-model="item.nature">
            <el-radio-button label="normal">正常</el-radio-button>
            <el-radio-button label="fragile">易碎</el-radio-button>
            <el-radio-button label="overweight">超重</el-radio-button>
          </el-radio-group>
        </template>
      </el-form-item>
      <el-form-item label="类别" :label-width="formLabelWidth" prop="category" size="medium">
        <template>
          <el-radio-group v-model="item.category">
            <el-radio-button v-for="c in tabList" :key="c.name" :label="c.name">{{c.label}}</el-radio-button>
          </el-radio-group>
        </template>
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth"  prop="desc">
        <el-input v-model="item.desc" autocomplete="off" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { upsertGoods } from '@/api/goods/index'
import { goodsTabList } from '@/api/cacheMap'
export default {
  name: 'UpsertGood',
  // eslint-disable-next-line vue/require-prop-types
  props: ['item', 'dialogVisible', 'action'],
  data() {
    return {
      rules: {
        name: [{ required: true, trigger: 'blur', message: '名称不能为空' }],
        desc: [{ required: true, trigger: 'blur', message: '描述不能为空' }],
        sum: [{ required: true, trigger: 'blur', message: '价格不能为空' }]
      },
      formLabelWidth: '120px',
      loading: false,
      dialogTitle: null,
      successTitle: null,
      tabList: null
    }
  },
  created() {
    if (this.action === 'save') {
      this.dialogTitle = '添加商品'
      this.successTitle = '添加成功'
    } else {
      this.dialogTitle = '修改商品'
      this.successTitle = '修改成功'
    }
    this.tabList = goodsTabList
  },
  methods: {
    confirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          upsertGoods(this.item).then(response => {
            if (response.code === 200) {
              this.$message.success(this.successTitle)
              this.$emit('closeDialog', false)
              this.loading = false
            } else {
              // this.loading = false
              this.$message.error(response.message)
            }
          })
        }
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

</style>
