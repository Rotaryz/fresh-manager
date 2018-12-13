<template>
  <div class="dispatching-list">
    <div class="tab-header">
      <base-drop-down :select="dispatchSelect"></base-drop-down>
      <div class="line"></div>
      <base-search></base-search>
    </div>
    <div class="list-header list-box">
      <div v-for="(item,index) in dispatchinglist" :key="index" class="list-item">{{item}}</div>
    </div>
    <div class="list">
      <div class="list-content list-box">
        <div class="list-item list-double-row">
          <p class="item-dark">DDH20188832770043</p>
          <p class="item-sub">2018-12-08 15:00:00</p>
        </div>
        <div class="list-item">DDH20188832770043DDH20188832770043</div>
        <div class="list-item">DDH20188832770043DDH20188832770043</div>
        <div class="list-item">DDH20188832770043DDH20188832770043</div>
        <div class="list-item">DDH20188832770043DDH20188832770043</div>
        <div class="list-item list-operation-box">
          <router-link tag="span" to="dispatching-detail" append class="list-operation">详情</router-link>
          <span class="list-operation">导出</span>
        </div>
      </div>
    </div>
    <div class="pagination-box">
      <base-pagination></base-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'DISPATCHING_LIST'
  const TITLE = '团长配送单'
  const DISPATCHING_LIST = ['配送单号', '社区名称', '团长名称', '配送金额', '配送日期', '操作']

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        dispatchinglist: DISPATCHING_LIST,
        dispatchSelect: {
          check: false,
          show: false,
          content: '全部社区',
          type: 'default',
          data: [{title: 'sdsd'}, {title: 'sds'}] // 格式：{title: '55'}
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .dispatching-list
    overflow: hidden
    flex: 1
    display: flex
    flex-direction: column

  .line
    width: 10px

  .tab-header
    height: 80px
    display: flex
    align-items: center
    box-sizing: border-box

  .list-header
    height: 50px
    font-size: $font-size-16
    font-family: $font-family-regular
    color: $color-text-main
    background: $color-list-header

  .list-box
    line-height: 1
    padding-left: 30px
    box-sizing: border-box
    border-bottom: 1px solid $color-line
    display: flex
    align-items: center
    .list-item
      box-sizing: border-box
      padding-right: 10px
      flex: 1
      &:last-child
        flex: 0.6

  .list
    flex: 1
    .list-content
      font-family: $font-family-regular
      color: $color-text-main
      height: 70px
      border-bottom: 1px solid $color-line
      .list-item
        no-wrap()
        font-size: $font-size-14
      // 双行样式
      .list-double-row
        .item-sub
          margin-top: 8px
          font-size: $font-size-14
          color: $color-text-assist
        .item-dark
          font-size: $font-size-14

  .pagination-box
    height: 70px
    align-items: center
    display: flex
</style>
