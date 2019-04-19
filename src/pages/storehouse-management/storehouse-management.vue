<template>
  <div class="storehouse-management table">
    <div class="down-content">
      <!--时间选择-->
      <span class="down-tip">分类筛选</span>
      <div class="down-item-small">
        <base-drop-down></base-drop-down>
      </div>
      <div class="down-item">
        <base-drop-down></base-drop-down>
      </div>
      <span class="down-tip">库区筛选</span>
      <div class="down-item-small">
        <base-drop-down></base-drop-down>
      </div>
      <div class="down-item">
        <base-drop-down></base-drop-down>
      </div>
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search placeHolder="商品名称或商品编码"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-inventory_list@2x.png" class="identification-icon">
          <p class="identification-name">出库列表</p>
        </div>
        <div class="function-btn">
          <div class="btn-main">清单导出</div>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">
            {{item}}
            <div v-if="item === '可用库存' || item === '总库存货值'" class="help hand">
              <span class="help-icon"></span>
              <div class="static-explain">
                <div class="explain">{{item === '可用库存' ? '当前可用于销售的库存。' : '当前该商品所有批次货值汇总'}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="list">
          <div class="list-content list-box">
            <div class="list-item">666</div>
            <div class="list-item">666</div>
            <div class="list-item">666</div>
            <div class="list-item">666</div>
            <div class="list-item">666</div>
            <div class="list-item">666</div>
            <div class="list-item">666</div>
            <div class="list-item">666</div>
            <div class="list-item">
              <router-link to="storehouse-detail" append class="list-operation">详情</router-link>
              <router-link to="batch" append class="list-operation">批次</router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <!--:pageDetail="pageTotal" @addPage="addPage"-->
        <base-pagination ref="pagination"></base-pagination>
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'STOREHOUSE_MANAGEMENT'
  const TITLE = '库位管理'
  const COMMODITIES_LIST = ['商品', '分类', '总库存', '锁定库存', '可用库存', '总库存货值', '库存均价', '库位', '操作']

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        commodities: COMMODITIES_LIST
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .storehouse-management
    width: 100%
  .list-box
    .list-item
      align-items: center
      &:nth-child(1)
        flex: 1.7
      &:nth-child(2)
        flex: 1.3
      &:last-child
        padding: 0
        max-width: 80px
  .help
    display: flex
    align-items: center
    margin-left: 5px
    position: relative
    &:hover .static-explain
      opacity: .8
      visibility: initial
    .help-icon
      icon-image('icon-help')
      width: 14px
      height: @width
  .static-explain
    position: absolute
    display: flex
    justify-content: center
    top: 23px
    width: 200px
    left: -(@width/ 2 - 7)
    visibility: hidden
    opacity: 0
    background: #32323A
    transition: opacity .3s
    z-index: 100
    border-radius: 2px
    &:after
      position: absolute
      top: -6px
      display: block
      content: ''
      width: 0
      height: 0
      border-left: 5px solid transparent
      border-right: 5px solid transparent
      border-bottom: 6px solid #32323A
    .explain
      padding: 8px
      border-radius: 4px
      line-height: 20px
      font-family: $font-family-regular
      font-size: $font-size-14
      white-space: normal
      transition: opacity .3s
      color: $color-white
      background: #32323A
      z-index: 111

</style>
