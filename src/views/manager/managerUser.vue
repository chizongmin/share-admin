<template>
  <el-dialog title="修改密码" :visible.sync="dialogVisible" :before-close="close">
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="原始密码" :label-width="formLabelWidth" prop="oldPassword">
        <el-input v-model="form.oldPassword" autocomplete="off" show-password></el-input>
      </el-form-item>
      <el-form-item label="新密码" :label-width="formLabelWidth" prop="newPassword">
        <el-input v-model="form.newPassword" autocomplete="off" show-password></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" :label-width="formLabelWidth" prop="newPasswordAgain">
        <el-input v-model="form.newPasswordAgain" autocomplete="off" show-password></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>

</template>

<script>
import { changePassword } from '@/api/manager/managerUser'
export default {
  name: 'ChangePwd',
  // eslint-disable-next-line vue/require-prop-types
  props: ['dialogVisible'],
  data() {
    const validatePasswordAgain = (rule, value, callback) => {
      if (!value || value !== this.form.newPassword) {
        callback(new Error('两次密码输入不一致'))
      } else {
        callback()
      }
    }
    return {
      form: {
        oldPassword: '',
        newPassword: '',
        newPasswordAgain: ''
      },
      rules: {
        oldPassword: [{ required: true, trigger: 'blur', message: '原始密码不能为空' }],
        newPassword: [{ required: true, trigger: 'blur', message: '新密码长度不能小于6', min: 6, mxa: 20 }],
        newPasswordAgain: [{ required: true, trigger: 'blur', validator: validatePasswordAgain }]
      },
      formLabelWidth: '120px',
      loading: false
    }
  },
  // watch: {
  //   dialogVisible(oldValue, newValue) {
  //     if (newValue === false) {
  //       this.form.oldPassword = ''
  //       this.form.newPassword = ''
  //       this.form.newPasswordAgain = ''
  //       this.loading = false
  //     }
  //   }
  // },
  methods: {
    confirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          changePassword(this.form).then(response => {
            if (response.code === 20000) {
              this.$message.success('修改成功，请重新登录')
              this.close()
              this.logout()
            } else {
              // this.loading = false
              this.$message.error(response.message)
            }
          })
        }
      })
    },
    close() {
      this.$emit('update:dialogVisible', false)
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>
<style scoped>

</style>
