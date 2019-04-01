<template>
  <div class="404">
    <h1 class="title">
      404 Not Found
    </h1>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'error'

  export default {
    name: PAGE_NAME,
    page: {
      title: '404'
    },
    props: {
      resource: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .title
    text-align: center
</style>
