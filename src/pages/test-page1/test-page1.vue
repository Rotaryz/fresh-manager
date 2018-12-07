<template>
  <base-panel>
    <div slot="content" class="test-page1">
      test-page1
    </div>
  </base-panel>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'TEST_PAGE1'

  export default {
    name: PAGE_NAME,
    data() {
      return {}
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .test-page1
    width: 100%
</style>
