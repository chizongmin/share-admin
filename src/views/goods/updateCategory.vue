<template>
  <el-dialog title="修改分类" :visible.sync="updateDialogVisible" :before-close="close">
    <el-form ref="form" :model="category" :rules="rules">
      <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
        <el-input v-model="category.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
        <template>
          <el-radio v-model="category.status" label="ENABLE">已启用</el-radio>
          <el-radio v-model="category.status" label="DISABLE">已禁用</el-radio>
        </template>
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth"  prop="desc">
        <el-input v-model="category.desc" autocomplete="off" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="排序" :label-width="formLabelWidth" prop="sort">
        <el-input-number v-model="category.sort" label="描述文字"></el-input-number>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateCategory } from '@/api/goods/index'
export default {
  name: 'UpdateCategory',
  // eslint-disable-next-line vue/require-prop-types
  props: ['category', 'updateDialogVisible'],
  data() {
    return {
      rules: {
        name: [{ required: true, trigger: 'blur', message: '名称不能为空' }],
        desc: [{ required: true, trigger: 'blur', message: '描述不能为空' }]
      },
      formLabelWidth: '120px',
      loading: false
    }
  },
  methods: {
    confirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          updateCategory(this.category).then(response => {
            if (response.code === 200) {
              this.$message.success('修改成功')
              this.$emit('closeUpdateDialogVisible', false)
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
      this.$emit('update:updateDialogVisible', false)
    }
  }
}
</script>

<style scoped>

</style>
