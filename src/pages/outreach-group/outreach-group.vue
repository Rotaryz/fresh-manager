<template>
  <div class="outreach-group">
    <group-header></group-header>
    <section class="container">
      <group-tab @beginPage="beginPage"></group-tab>
      <group-content ref="content" v-if="showContent"></group-content>
      <group-staff v-else></group-staff>
    </section>
    <change-model></change-model>
    <group-tab-tools></group-tab-tools>
  </div>
</template>

<script type="text/ecmascript-6">
  import GroupHeader from './group-header/group-header'
  import GroupTab from './group-tab/group-tab'
  import GroupContent from './group-content/group-content'
  import GroupStaff from './group-staff/group-staff'
  import changeModel from './change-model/change-model'
  import GroupTabTools from './group-tab-tools/group-tab-tools'
  import {outreachGroupComputed, outreachGroupMethods} from '@state/helpers'
  const PAGE_NAME = 'OUTREACH_GROUP'
  const TITLE = '拓展团队'

  export default {
    name: PAGE_NAME,
    components: {
      GroupHeader,
      GroupTab,
      GroupContent,
      changeModel,
      GroupTabTools,
      GroupStaff
    },
    data() {
      return {}
    },
    computed: {
      ...outreachGroupComputed
    },
    methods: {
      ...outreachGroupMethods,
      beginPage() {
        this.$refs.content.beginPage()
      }
    },
    page: {
      title: TITLE
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
