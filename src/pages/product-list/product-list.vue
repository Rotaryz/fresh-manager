<template>
  <div class="product-list">
    <div class="product-top">
      <div class="product-left">
        <router-link tag="span" to="edit-goods" append class="btn-main">新建商品 +</router-link>
        <base-drop-down :select="dispatchSelect"></base-drop-down>
        <div class="search-left">
          <base-search></base-search>
        </div>
      </div>
      <div class="product-right">
        <div class="btn-main">导出Excel</div>
      </div>
    </div>
    <div class="list-header list-box">
      <div v-for="(item, index) in productTitleList" :key="index" class="list-item">{{item}}</div>
    </div>
    <div class="list">
      <div v-for="(item, index) in productList" :key="index" class="list-content list-box">
        <div class="list-item">
          <div class="pic-box" :style="{'background-image': 'url(' + item.goods_cover_image + ')'}"></div>
        </div>
        <div class="list-item">{{item.name}}</div>
        <div class="list-item">{{item.goods_units}}</div>
        <div class="list-item">{{item.store_price}}</div>
        <div class="list-item">
          <base-switch :status="item.is_online"></base-switch>
        </div>
        <div class="list-item">{{item.usable_stock}}</div>
        <div class="list-item list-operation-box">
          <router-link tag="span" :to="'edit-goods?id=' + item.id" append class="list-operation">编辑</router-link>
          <span class="list-operation">删除</span>
        </div>
      </div>
    </div>
    <div class="pagination-box">
      <base-pagination :pageDetail="pageTotal"></base-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {goodsComputed} from '@state/helpers'
  const PAGE_NAME = 'PRODUCT_LIST'
  const TITLE = '商品列表'
  const PRODUCT_TITLE_LIST = ['商品图片', '商品名称', '售卖单位', '售价', '状态', '库存', '操作']

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        productTitleList: PRODUCT_TITLE_LIST,
        dispatchSelect: {
          check: false,
          show: false,
          content: '全部',
          type: 'default',
          data: [{name: '上架'}, {name: '下架'}] // 格式：{title: '55'}
        }
      }
    },
    computed: {
      ...goodsComputed
    },
    created() {},
    methods: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .product-list
    overflow: hidden
    flex: 1
    display: flex
    flex-direction: column
  .product-top
    layout(row)
    align-items: center
    justify-content: space-between
    height: 80px
    .product-left
      layout(row)
      align-items: center
    .btn-main
      margin-right: 10px
    .search-left
      margin-left: 10px

  .tab-header
    height: 80px
    display: flex
    justify-content: space-between
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
      &:nth-child(1)
        flex: 0.6
      &:nth-child(2)
        flex: 1.5
      &:last-child
        flex: 0.8

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
  .list-operation-box
    .list-operation
      color: $color-sub
  .pic-box
    height: 40px
    width: 40px
    overflow: hidden
    background-repeat: no-repeat
    background-size: cover
    background-position: center
</style>
