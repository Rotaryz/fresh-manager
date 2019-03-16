<template>
  <div class="demo">
    demo
    <add-goods ref="addg" @batchAddition="_batchAddition"></add-goods>
    <span @click="deleteGoods()">sahNGV</span>
  </div>
</template>

<script type="text/ecmascript-6">
  import AddGoods from '@components/add-goods/add-goods'

  const PAGE_NAME = 'DEMO'
  const TITLE = '模板'
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      AddGoods
    },
    data() {
      return {}
    },
    methods: {
      _batchAddition(list) {
        console.log(list)
      },
      deleteGoods() {
        this.$refs.addg._delGoods(160)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .demo
    width: 100%
</style>
