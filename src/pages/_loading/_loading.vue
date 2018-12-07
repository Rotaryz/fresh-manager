<template>
  <div class="loading">
    加载中...
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'LOADING'

  export default {
    name: PAGE_NAME,
    page: {
      title: 'Loading page...',
      meta: [{name: 'description', content: 'Loading page...'}]
    }
  }
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
</style>
