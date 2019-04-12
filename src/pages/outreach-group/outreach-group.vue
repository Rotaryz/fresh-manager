<template>
  <div class="outreach-group">
    <group-header></group-header>
    <section class="container" @click="test">
      <group-tab></group-tab>
      <group-content></group-content>
    </section>
    <change-model ref="addChildren" useType="addChildren"></change-model>
    <change-model ref="editorChildren" useType="editorChildren"></change-model>
  </div>
</template>

<script type="text/ecmascript-6">
  import GroupHeader from './group-header/group-header'
  import GroupTab from './group-tab/group-tab'
  import GroupContent from './group-content/group-content'
  import changeModel from './change-model/change-model'
  const PAGE_NAME = 'OUTREACH_GROUP'
  const TITLE = '拓展团队'

  export default {
    name: PAGE_NAME,
    components: {
      GroupHeader,
      GroupTab,
      GroupContent,
      changeModel
    },
    page: {
      title: TITLE
    },
    data() {
      return {

      }
    },
    methods: {
      test() {
        // this.$refs.addChildren.show()
        // this.$refs.editorChildren.show()
        // this.$refs.changeModel.show('修改商品分类', {
        //   name: 13,
        //   sort: 123,
        //   type: 12
        // })
      },
      eidtConfirm() {

      }
    }
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
