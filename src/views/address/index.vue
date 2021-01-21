<template>
  <div>
    <div class="toolDiv">
      <el-button type="primary" @click="openDialog({action:'save',item:{fid:'0',status:'ENABLE'}})" size="small" style="float: right;margin: 10px 90px 10px 0">新增</el-button>
    </div>
    <div>
      <el-tree
        :data="list"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        draggable
        :allow-drop="allowDrop"
        @node-drop="handleDrop">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span v-if="data.status === 'ENABLE'" style="font-size: medium">{{ data.name+'('+data.id+')' }}</span>
          <span v-else style="color: lightsteelblue;font-size: medium">{{ data.name+'('+data.id+')---已禁用'}}</span>
          <span>
            <el-button
              v-if="data.fid === '0'"
              type="text"
              size="smaill"
              @click="() => openDialog({action:'save',item:{fid:data.id,strFid:data.name,status:'ENABLE'}})">
              新增
            </el-button>
            <el-button
              type="text"
              size="smaill"
              @click="() => openDialog({action:'update',item:data})">
              编辑
            </el-button>
          </span>
        </span>
      </el-tree>
      <upsertAddress
        v-if="dialogVisible"
        :dialog-visible.sync="dialogVisible"
        :item="currentRow"
        :action="action"
        @closeDialog="closeDialog"
      />
    </div>
  </div>
</template>

<script>
import { addressList, updateSort } from '@/api/address'
import upsertAddress from '@/views/address/upsertAddress'

export default {
  components: {
    upsertAddress
  },
  created() {
    this.fetchData()
  },
  data() {
    return {
      listLoading: false,
      dialogVisible: false,
      currentRow: {},
      action: null,
      strFid: null,
      list: []
    }
  },
  methods: {
    fetchData() {
      this.listLoading = true
      addressList(this.params).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    openDialog(dialogParams) {
      this.action = dialogParams.action
      this.currentRow = dialogParams.item
      this.dialogVisible = true
    },
    closeDialog(visable) {
      this.dialogVisible = false
      this.fetchData()
    },
    allowDrop(draggingNode, dropNode, type) {
      if (draggingNode.data.fid === dropNode.data.fid && type !== 'inner') {
        return true
      } else {
        return false
      }
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      let sortList = this.list
      if (draggingNode.data.fid !== '0') { // 根节点数据
        sortList = this.list.find(item => item.id === draggingNode.data.fid).children
      }
      updateSort({ list: sortList })
    }
  }
}
</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 50px;
  }
  .toolDiv {
    height: 30px;
    margin-bottom: 30px;
  }
</style>
