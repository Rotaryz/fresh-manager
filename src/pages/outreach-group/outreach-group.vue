<template>
  <div class="outreach-group">
    <group-header></group-header>
    <section class="container">
      <group-tab></group-tab>
      <group-content></group-content>
    </section>
    <change-model></change-model>
    <group-tab-tools></group-tab-tools>
  </div>
</template>

<script type="text/ecmascript-6">
  import GroupHeader from './group-header/group-header'
  import GroupTab from './group-tab/group-tab'
  import GroupContent from './group-content/group-content'
  import changeModel from './change-model/change-model'
  import GroupTabTools from './group-tab-tools/group-tab-tools'

  const PAGE_NAME = 'OUTREACH_GROUP'
  const TITLE = '拓展团队'

  export default {
    name: PAGE_NAME,
    components: {
      GroupHeader,
      GroupTab,
      GroupContent,
      changeModel,
      GroupTabTools
    },
    page: {
      title: TITLE
    },
    data() {
      return {

      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .outreach-group
    width: 100%
    background :#fff
    layout(column,block,nowrap)
    .container
      flex: 1
      layout(row,block,nowrap)
</style>
