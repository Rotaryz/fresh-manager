<template>
  <div class="activity-manage table">
    <base-tab-select :infoTabIndex="infoTabIndex" :tabStatus="tabStatus" @getStatusTab="changeTab"></base-tab-select>
    <flash-sale v-if="+infoTabIndex === 0"></flash-sale>
    <popular-today v-else-if="+infoTabIndex === 1"></popular-today>
    <new-preference v-else-if="+infoTabIndex === 2"></new-preference>
    <collage-return v-else-if="+infoTabIndex === 3"></collage-return>
  </div>
</template>

<script type="text/ecmascript-6">
  import FlashSale from './flash-sale/flash-sale'
  import PopularToday from './popular-today/popular-today'
  import NewPreference from './new-preference/new-preference'
  import CollageReturn from './collage-return/collage-return'
  import { activityMethods, activityComputed, saleMethods } from '@state/helpers'

  const PAGE_NAME = 'ACTIVITY_MANAGE'
  const TITLE = '活动管理'

  const ORDERSTATUS = [
    {text: '限时抢购', status: 'one'},
    {text: '今日爆款', status: 'two'},
    {text: '新人特惠', status: 'three'},
    {text: '拼团返现', status: 'four'},
  ]
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      FlashSale,
      PopularToday,
      NewPreference,
      CollageReturn
    },
    data() {
      return {
        tabStatus: ORDERSTATUS,
        defaultStatus: 'one'
      }
    },
    computed: {
      ...activityComputed,
      infoTabIndex() {
        return this.tabStatus.findIndex((item) => item.status === this.defaultStatus)
      }
    },
    created() {
      this.defaultStatus = this.tabStatus[this.activityTab].status
    },
    methods: {
      ...activityMethods,
      ...saleMethods,
      changeTab(selectStatus) {
        this.defaultStatus = selectStatus.status
        this.setActivityTab(this.infoTabIndex)
        if (selectStatus.status === 'one') {
          this.getSaleList({page: 1, status: ''})
        }
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
</style>
