<template>
  <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :before-close="close">
    <el-form ref="form" :model="item" :rules="rules">
      <el-form-item label="ID" :label-width="formLabelWidth" prop="id">
        <el-input v-model="item.id" autocomplete="off" v-if="action === 'update'" :disabled="true" ></el-input>
        <el-input v-model="item.id" autocomplete="off" v-else></el-input>
      </el-form-item>
      <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
        <el-input v-model="item.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="父级" :label-width="formLabelWidth" prop="strFid" v-if="item.fid !== '0'">
        <el-input v-model="item.strFid" autocomplete="off" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="状态" :label-width="formLabelWidth" prop="status" size="medium">
        <template>
          <el-radio-group v-model="item.status">
            <el-radio-button label="ENABLE">已启用</el-radio-button>
            <el-radio-button label="DISABLE">已禁用</el-radio-button>
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
import { upsertAddress } from '@/api/address'
export default {
  name: 'UpsertAddress',
  // eslint-disable-next-line vue/require-prop-types
  props: ['item', 'dialogVisible', 'action'],
  data() {
    return {
      rules: {
        name: [{ required: true, trigger: 'blur', message: '名称不能为空' }],
        id: [{ required: true, trigger: 'blur', message: 'ID不能为空' }],
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
      this.dialogTitle = '添加地址'
      this.successTitle = '添加成功'
    } else {
      this.dialogTitle = '修改地址'
      this.successTitle = '修改成功'
    }
  },
  methods: {
    confirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          this.item.action = this.action
          upsertAddress(this.item).then(response => {
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
