<template>
  <div class="goods-manage table">
    <template>
      <div class="down-content">
        <span class="down-tip">类目筛选</span>
        <div class="down-item-small">
          <base-drop-down :select="stairSelect" @setValue="setStairValue"></base-drop-down>
        </div>
        <div class="down-item-small">
          <base-drop-down :select="stairSelect" @setValue="setStairValue"></base-drop-down>
        </div>
        <div class="down-item">
          <base-drop-down :select="stairSelect" @setValue="setStairValue"></base-drop-down>
        </div>
        <span class="down-tip">资料状态</span>
        <div class="down-item">
          <base-drop-down :select="stairSelect" @setValue="setStairValue"></base-drop-down>
        </div>
        <div class="distribution-down">
          <span class="down-tip">搜索</span>
          <div class="down-item">
            <base-search placeHolder="商品名称或编码" @search="changeKeyword"></base-search>
          </div>
        </div>
      </div>
      <div class="table-content">
        <div class="identification">
          <div class="identification-page">
            <img src="./icon-product_list@2x.png" class="identification-icon">
            <p class="identification-name">商品列表</p>
          </div>
          <div class="function-btn">
            <router-link to="edit-franchise" append class="btn-main btn-main-end">
              新建商品<span class="add-icon"></span>
            </router-link>
            <div class="show-more-box g-btn-item" :class="{'show-more-active': showIndex}" @mouseenter="_showTip" @mouseleave="_hideTip">
              <div class="show-more-text">
                <div class="show-text">更多</div>
                <div class="show-icon"></div>
              </div>
              <div v-show="showIndex" class="big-hide-box"></div>
              <transition name="fade">
                <div v-show="showIndex" class="show-hide-box">
                  <div class="show-all-item">
                    <div class="show-hide-item">
                      批量新建
                      <input
                        type="file"
                        class="stock-file hand"
                        @change="importStock($event, 1)"
                      >
                    </div>
                    <div class="show-hide-item">
                      批量上架
                      <input
                        type="file"
                        class="stock-file hand"
                        @change="importStock($event, 0)"
                      >
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
        <div class="big-list">
          <div class="list-header list-box">
            <div v-for="(item,index) in listTitle" :key="index" class="list-item">{{item}}</div>
          </div>
          <div class="list">
            <!--<div v-for="(item, index) in goodsList" :key="index" class="list-content list-box">-->
            <div class="list-content list-box">
              <div class="list-item">
                <img class="pic-box" src="http://social-shopping-api-1254297111.picgz.myqcloud.com/corp1%2F2019%2F05%2F24%2F1558702375284-1557569666141-20190511_153817_087.jpg" alt="">
              </div>
              <div class="list-item list-double-row">
                <!--<div class="item-dark">{{item.name}}</div>-->
                <!--<div class="item-dark">{{item.goods_sku_encoding}}</div>-->
                <div class="item-dark">5-22雀巢咖啡</div>
                <div class="item-dark">QW20190531</div>
              </div>
              <!--<div class="list-item">{{item.goods_category_name}}</div>-->
              <div class="list-item">休闲零食</div>
              <div class="list-item">休闲零食</div>
              <div class="list-item">休闲零食</div>
              <div class="list-item">休闲零食</div>
              <div class="list-item">休闲零食</div>
              <div class="list-item">休闲零食</div>
              <div class="list-item list-operation-box">
                <router-link tag="span" :to="'edit-goods?id='" append class="list-operation list-operation-all">完善资料</router-link>
                <!--<router-link tag="span" :to="'edit-goods?id='" append class="list-operation">编辑</router-link>-->
                <span class="list-operation">删除</span>
              </div>
            </div>
          </div>
        </div>
        <div class="pagination-box">
          <!--<base-pagination ref="pagination" :pageDetail="pageTotal" @addPage="addPage"></base-pagination>-->
        </div>
      </div>
    </template>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'GOODS_MANAGE'
  const TITLE = '商品管理'
  const LIST_TITLE = ['图片', '商品名称', '类目', '供应商', '基本单位', '销售规格', '采购规格', '类型', '操作']

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        stairSelect: {
          check: false,
          show: false,
          content: '一级分类',
          type: 'default',
          data: []
        },
        listTitle: LIST_TITLE,
        dispatchSelect: [{name: '全部', value: '', key: 'all', num: 0}, {name: '支付', key: 'wait_release', num: 0}, {name: '退款', key: 'wait_purchase', num: 0}],
        showIndex: false
      }
    },
    methods: {
      changeKeyword() {},
      setStairValue() {},
      _showTip() {
        this.showIndex = true
      },
      _hideTip() {
        this.showIndex = false
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .goods-manage
    width: 100%
  .distribution-down
    display: flex
    align-items: center
  .list-box
    .list-item
      box-sizing: border-box
      flex: 1

      &:nth-child(1)
        flex: 0.55

      &:nth-child(2)
        flex: 1.5

      &:nth-child(3)
        flex: 1.1

      &:nth-child(7)
        flex: 0.8

      &:last-child
        padding: 5px
        max-width: 130px
        min-width: 130px
        flex: 1
  .product-list
    width: 100%
  .show-more-box
    position: relative
    cursor: pointer

    .big-hide-box
      position: absolute
      z-index: 1
      width: 106px
      height: 20px
      right: 0

    .show-more-text
      width: 80px
      height: 28px
      line-height: 26px
      color: $color-white
      border: 1px solid $color-main
      border-radius: $radius-main
      layout(row)
      align-items: center
      justify-content: center

      .show-text
        font-size: $font-size-12
        color: $color-main
        font-family: $font-family-regular

      .show-icon
        width: 8px
        height: 6px
        margin-left: 6px
        position: relative
        transform: translateY(-1px) rotate(0deg)
        transition: all 0.4s

        &:after
          content: ''
          position: absolute
          z-index: 99
          top: 0
          right: 0
          width: 0
          height: 0
          border-left: 4px solid transparent
          border-right: 4px solid transparent
          border-top: 6px solid $color-main
    .show-hide-box
      position: absolute
      width: 106px
      top: 38px
      right: 0
      z-index: 11
      color: $color-text-main
      font-family: $font-family-regular
      font-size: $font-size-14
      background: $color-white
      box-shadow: 0 0 8px 0 #EBEBEB
      border-radius: 4px

      .show-hide-item
        height: 50px
        line-height: 50px
        color: $color-text-main
        font-family: $font-family-regular
        font-size: $font-size-14
        padding-left: 16px
        display: block
        position: relative
        border-bottom-1px($color-line)

    .show-hide-item:hover
      color: $color-main

  .list-operation-all
    border: 1px solid #4D77BD
    width: 76px
    height: 28px
    text-align: center
    line-height: 26px
    border-radius: 2px
    &:after
      top: 7px
  .show-more-active
    .show-more-text
      background: $color-main
      .show-text
        color: $color-white
      .show-icon
        transform: translateY(-1px) rotate(180deg)
        &:after
          border-top: 6px solid $color-white
  .stock-file
    position: absolute
    top: 0
    left: 0
    font-size: 0
    opacity: 0
    height: 100%
    width: 100%
  .pic-box
    height: 40px
    width: 40px
    border-radius: 2px
    object-fit: cover
    background-repeat: no-repeat
    background-size: cover
    background-position: center
</style>
