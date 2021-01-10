<template>
  <div class="right-tabbox-newnotice">
    <el-tabs v-model="activeName" @tab-click="handleClick" >
      <el-tab-pane label="蔬菜" name="vegetables">蔬菜</el-tab-pane>
      <el-tab-pane label="水果" name="fruits">蔬菜</el-tab-pane>
      <el-tab-pane label="厨房常用" name="kitchen">厨房常用</el-tab-pane>
      <el-tab-pane label="生活用品" name="daily">蔬菜</el-tab-pane>
      <el-tab-pane label="二手回收" name="recycling">蔬菜</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  data() {
    return {
      defaultTabName: 'vegetables',
      search: null,
      listLoading: true,
      list: []
    }
  },
  methods: {
    newAdd(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>
<style scoped>
  .right-tabbox-newnotice >>>.el-tabs__nav-wrap::after {
    position: static !important;
  }
</style>
