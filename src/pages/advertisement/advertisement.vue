<template>
  <div class="advertisement">
    advertisement
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'ADVERTISEMENT'
  const TITLE = '轮播广告'

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

  .advertisement
    width: 100%
</style>
