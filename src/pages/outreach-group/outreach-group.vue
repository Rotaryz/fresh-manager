<template>
  <div class="outreach-group">
    outreach-group
    <router-link to="/home/outreach-group/outreach-group-staff">去详情</router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'OUTREACH_GROUP'
  const TITLE = '拓展团队'

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {

      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .outreach-group
    width: 100%
</style>
