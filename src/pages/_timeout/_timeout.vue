<template>
  <div class="time-out">
    <h1 :class="$style.title">
      The page timed out while loading. Are you sure you're still connected to the Internet?
    </h1>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'TIMEOUT'

  export default {
    name: PAGE_NAME,
    page: {
      title: 'Page timeout',
      meta: [{name: 'description', content: 'The page timed out while _loading.'}]
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .title
    text-align: center
</style>
