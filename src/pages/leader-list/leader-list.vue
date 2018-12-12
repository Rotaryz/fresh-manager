<template>
  <div class="leader-list">
    leader-list
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'LEADER_LIST'
  const TITLE = '团长列表'

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {}
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .leader-list
    width: 100%
</style>
