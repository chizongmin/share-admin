<template>
  <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :before-close="close" width="51%">
    <el-form ref="form" :model="item" :rules="rules">
      <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
        <el-input v-model="item.name" autocomplete="off" />
      </el-form-item>
      <div style="float: left;position: absolute">
        <el-form-item label="价格" :label-width="formLabelWidth" prop="sum">
          <el-input-number v-model="item.sum" :min="0" :max="10000" />
        </el-form-item>
      </div>
      <div style="margin-left: 300px">
        <el-form-item label="原价" :label-width="formLabelWidth" prop="oldSum">
          <el-input-number v-model="item.oldSum" :min="0" :max="10000" />
        </el-form-item>
      </div>
      <div style="float: left;position: absolute">
        <el-form-item label="状态" :label-width="formLabelWidth" prop="status" size="medium">
          <template>
            <el-radio-group v-model="item.status">
              <el-radio-button label="ENABLE">已启用</el-radio-button>
              <el-radio-button label="DISABLE">已禁用</el-radio-button>
            </el-radio-group>
          </template>
        </el-form-item>
      </div>
      <div style="margin-left: 300px">
        <el-form-item label="配送佣金" :label-width="formLabelWidth" prop="commission">
          <el-input-number v-model="item.commission" :min="0" :max="10000" />
        </el-form-item>
      </div>
      <div style="float: left;position: absolute">
        <el-form-item label="属性" :label-width="formLabelWidth" prop="nature" size="medium">
          <template>
            <el-radio-group v-model="item.nature">
              <el-radio-button label="normal">正常</el-radio-button>
              <el-radio-button label="zero">免付</el-radio-button>
              <el-radio-button label="scorePay">积分支付</el-radio-button>
            </el-radio-group>
          </template>
        </el-form-item>
      </div>
      <div style="margin-left: 300px">
        <el-form-item label="库存" :label-width="formLabelWidth" prop="number">
          <el-input-number v-model="item.number" v-if="item.id" :min="0" :max="10000" :disabled="true" />
          <el-input-number v-model="item.number" v-else :min="0" :max="10000" />
        </el-form-item>
      </div>
      <el-form-item label="标签" :label-width="formLabelWidth" prop="tag" size="medium">
        <template>
          <el-tag
            v-for="tag in item.tags"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="tagHandleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-popover
            ref="popover4"
            placement="top"
            width="800"
            trigger="click"
            @show="popoverShow"
          >
            <div>
              <div class="toolbar">
                <el-input v-model="searchTagInputValue" placeholder="请输入标签名称" style="width: 370px; margin-right: 20px" @input="searchTags" />
                <el-button type="primary" style="margin-right: 10px" @click="addNewTag">新增</el-button>
              </div>
              <div style="margin-top:20px">
                <el-tag
                  v-for="tag in this.dynamicTags"
                  :key="tag"
                  @click="addToGoods(tag)"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
            <el-button slot="reference" class="button-new-tag">添加</el-button>
          </el-popover>
        </template>
      </el-form-item>
      <el-form-item label="列表缩略图" :label-width="formLabelWidth" prop="indexImage">
        <el-upload
          class="avatar-uploader"
          action="#"
          :http-request="uploadIndexImage"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="item.indexImage" :src="item.indexImage" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item label="商品详情图" :label-width="formLabelWidth" prop="detailImage">
        <el-upload
          action="#"
          :http-request="uploadDetailImage"
          list-type="picture-card"
          :file-list="item.detailFileList"
          :limit="3"
          :before-upload="beforeDetailUpload"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus" />
        </el-upload>
      </el-form-item>
      <el-form-item label="商品特色" :label-width="formLabelWidth" prop="remark">
        <el-input v-model="item.remark" autocomplete="off" type="textarea" />
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth" prop="desc">
        <el-input v-model="item.desc" autocomplete="off" type="textarea" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { upsertGoods, addTag, nameLike } from '@/api/goods/index'
import { goodsTabList } from '@/api/cacheMap'
// import { upload } from '@/api/file'
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
      tabList: null,
      fileList: [],
      dynamicTags: [],
      searchTagInputValue: ''
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
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt10Kb = file.size / 1024 < 40
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt10Kb) {
        this.$message.error('上传头像图片大小不能超过 40kb!')
      }
      return isJPG && isLt10Kb
    },
    uploadIndexImage(data) {
      const _this = this
      const rd = new FileReader() // 创建文件读取对象
      const file = data.file
      rd.readAsDataURL(file) // 文件读取装换为base64类型
      rd.onloadend = function(e) {
        // this指向当前方法onloadend的作用域
        // 更新对象中的属性值使v-if生效
        _this.$set(_this.item, 'indexImage', this.result)
      }
    },
    beforeDetailUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt50Kb = file.size / 1024 < 100
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt50Kb) {
        this.$message.error('上传头像图片大小不能超过 50kb!')
      }
      return isJPG && isLt50Kb
    },
    uploadDetailImage(fileData) {
      const _this = this
      const rd = new FileReader() // 创建文件读取对象
      const file = fileData.file
      rd.readAsDataURL(file) // 文件读取装换为base64类型
      rd.onloadend = function(e) {
        if (!_this.item.detailFileList) {
          _this.item.detailFileList = []
        }
        _this.item.detailFileList.push({
          'url': this.result,
          'name': file.name
        })
        // this指向当前方法onloadend的作用域
        // 更新对象中的属性值使v-if生效
        // _this.$set(_this.item, 'detailFileList', this.result)
      }
      // const formData = new FormData()
      // formData.append(file.filename, file.file, file.file.name)
      // upload(formData).then(response => {
      //   if (response.code === 200) {
      //     const id = response.data.id
      //     if (!this.item.detailFileList) {
      //       this.item.detailFileList = []
      //     }
      //     this.item.detailFileList.push({
      //       'url': '/api/file/preview?id=' + id,
      //       'name': file.file.name,
      //       'id': id
      //     })
      //   } else {
      //     // this.loading = false
      //     this.$message.error(response.message)
      //   }
      // })
    },
    handleRemove(file, fileList) {
      this.item.detailFileList = this.item.detailFileList.filter(item => item.name !== file.name)
    },
    tagHandleClose(tag) {
      this.item.tags.splice(this.item.tags.indexOf(tag), 1)
    },
    searchTags() {
      console.log(this.searchTagInputValue)
      nameLike({ keyword: this.searchTagInputValue }).then(response => {
        if (response.code === 200) {
          this.dynamicTags = response.data
        } else {
          this.$message.info(response.message)
        }
      })
    },
    addNewTag() {
      const searchTagInputValue = this.searchTagInputValue
      if (searchTagInputValue) {
        addTag({ name: searchTagInputValue }).then(response => {
          if (response.code === 200) {
            this.dynamicTags.push(searchTagInputValue)
          } else {
            this.$message.info(response.message)
          }
        })
      }
    },
    addToGoods(tag) {
      if (this.item.tags.indexOf(tag) === -1) {
        this.item.tags.push(tag)
      }
      this.$refs.popover4.showPopper = false
      console.log(tag)
    },
    popoverShow() {
      nameLike({ keyword: null }).then(response => {
        if (response.code === 200) {
          this.dynamicTags = response.data
        } else {
          this.$message.info(response.message)
        }
      })
    }
  }
}
</script>

<style scoped>
  .avatar-uploader{
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 88px;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 88px;
    height: 88px;
    line-height: 88px;
    text-align: center;
  }
  .avatar {
    width: 88px;
    height: 88px;
    display: block;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
    margin-top: 5px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
