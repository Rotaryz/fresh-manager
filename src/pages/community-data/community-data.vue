<template>
  <div class="community-data">
    <div class="data-caption data-caption-line">
      <div class="content-title">
        <img src="./icon-qundata@2x.png" alt="" class="title-icon">
        <div class="data-title">微信群运营数据概况</div>
      </div>
      <base-option-box @checkTime="_getData"></base-option-box>
    </div>
    <div class="data-content">
      <div class="left-tab">全部群数据</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {communityComputed, communityMethods} from '@state/helpers'

  const PAGE_NAME = 'COMMUNITY-DATA'
  const TITLE = '社群数据'
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {

      }
    },
    computed: {
      ...communityComputed
    },
    created() {

    },
    destroyed() {
    },
    methods: {
      ...communityMethods,
      _getData(value) {
        if (typeof value === 'string') {
          this.getOrderDetail({startTime: '', endTime: '', time: value, loading: true})
          return
        }
        this.getOrderDetail({startTime: value[0], endTime: value[1], time: '', loading: true})
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .community-data
    overflow: hidden
    flex: 1
    display: flex
    box-sizing: border-box
    padding: 20px
    flex-direction: column
    padding: 20px
  .data-caption
    padding: 20px
    display: flex
    justify-content: space-between
    align-items: center
    box-sizing: border-box
    .content-title
      display: flex
      align-items: center
    .title-icon
      width: 14px
      height: 14px
      margin-right: 5px
    .data-title
      font-family: $font-family-regular
      color: $color-text-main
      font-size: $font-size-16
  .data-caption-line
    border-bottom-1px($color-line)

</style>
