<template>
  <div ref="leftTab" class="left-tab">
    <div ref="leftBox" class="left-box">
      <div class="category-item hand category-all" :class="{'active': +categoryIndex === 0}" @click="changeCategory('', 0, 'all')">
        <div class="left-tab-main">
          <div class="left">
            <img src="./icon-all_green@2x.png" alt="" class="category-image all-image">
            <span class="name all-data">全部商品({{categoryList.length}})</span>
          </div>
        </div>
      </div>
      <div
        v-for="(item, index) in categoryList"
        :key="index"
        class="category-item hand"
        :class="[{'active': (+categoryIndex === index+1 && !selectGoods)},{'open': (+categoryIndex === index+1 && selectGoods)}]"
        @click="changeCategory(item.id, index+1, 'category')"
      >
        <div class="left-tab-main">
          <div class="left">
            <img :src="item.image_url" alt="" class="category-image">
            <span class="name">{{item.name}}({{item.list.length}})</span>
          </div>
          <div class="right-icon" :class="[{'current': +categoryIndex === index+1}, {'open': openCategory}]"></div>
        </div>
        <div class="goods-list" :style="{height: (+categoryIndex === index+1 && openCategory) ? 48*(item.list ? item.list.length : 0) + 'px' : 0}">
          <div v-for="(goods, ind) in item.list"
               :key="ind"
               class="goods-item"
               :class="{'select': (+goodsIndex === ind && selectGoods)}"
               @click.stop="changeGoods(goods.id, ind, 'goods')"
          >
            <img :src="goods.goods_cover_image" alt="" class="goods-image">
            <span class="title">{{goods.name}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="category-item last"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {goodsDataComputed} from '@state/helpers'
  const COMPONENT_NAME = 'LEFT-TAB'
  export default{
    name: COMPONENT_NAME,
    props: {
      tabArr: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data() {
      return {
        categoryIndex: 0,
        goodsIndex: 0,
        getMore: false,
        selectGoods: false,
        openCategory: false
      }
    },
    computed: {
      ...goodsDataComputed
    },
    methods: {
      // index用于记录选中哪个， code
      changeCategory(itemId, index, code, bool) {
        if (index === this.categoryIndex && this.openCategory && !bool) {
          this.openCategory = false
        } else {
          this.openCategory = true
        }
        this.categoryIndex = index
        this.goodsIndex = ''
        this.selectGoods = false
        // boolean判断选中的是否是商品，code区分选中的类型
        this.$emit('changeTab', itemId, code) // item, selectGoods
      },
      changeGoods(itemId, index, code) {
        this.goodsIndex = index
        this.selectGoods = true
        this.$emit('changeTab', itemId, code)
      },
      height(item) {
        return (48*item.length)
      },
      selectList(categoryId, goodsId) {
        let code = ''
        let itemId = categoryId || goodsId
        if (categoryId) {
          let itemIndex = this.categoryList.findIndex(item => {
            return +item.id === +categoryId
          })
          if (itemIndex > -1) {
            code = 'category'
            this.categoryIndex = itemIndex + 1
            this.goodsIndex = ''
            this.selectGoods = false
          }
        } else if (goodsId) {
          let itemIndex = this.categoryList[this.categoryIndex - 1].list.findIndex(item => {
            return item.id === goodsId
          })
          if (itemIndex > -1) {
            code = 'goods'
            this.goodsIndex = itemIndex
            this.selectGoods = true
          }
        } else {
          return
        }
        this.openCategory = true
        this.$emit('changeTab', itemId, code)
      }
    }
  }

</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .left-tab
    width: 176px
    padding-right: 6px
    height: 852px
    overflow-y: auto
    display: flex
    flex-direction: column
    &::-webkit-scrollbar
      width: 0
      height: 0
      transition: all 0.2s
    &::-webkit-scrollbar-thumb
      background-color: rgba(0, 0, 0, .15)
      border-radius: 10px
    &:hover::-webkit-scrollbar
      width: 6px
      height: 8px
    .category-item
      width: 170px
      border-bottom: 0.5px solid $color-line
      border-right: 0.5px solid $color-line
      position: relative
      transition: all 0.3s
      flex: 0 0 auto
    .left-tab-main
      height: 60px
      width: 170px
      display: flex
      align-items: center
      position: relative
      justify-content: space-between
      padding-left: 12px
      color: $color-text-main
      font-size: $font-size-14
      font-family: $font-family-regular
      transition: color 0.3s
      &:before
        content: ''
        position: absolute
        left: 0
        top: 0
        height: 60px
        width: 3px
        background-color: transparent
        transition: all 0.3s
      .left
        display: flex
        align-items: center
        .category-image,.all-icon
          width: 28px
          height: 28px
          margin-right: 8px
          border-radius: 1px
        .all-image
          width: 18px
          height: 18px
          margin: 8px
        .category-image
          border-radius: 2px
          border: 0.5px solid #E9ECEE
        .name
          line-height: 18px
          width: 90px
          overflow: hidden
          white-space: nowrap
          text-overflow: ellipsis
        .all-data
          width: 105px
      .right-icon
        width: 16px
        height: 16px
        margin-left: 6px
        margin-right: 8px
        background-image: url('./icon-arrow_lower@2x.png')
        background-size: 100% 100%
        transition: all 0.3s
      .current
        width: 12px
        height: 12px
        background-repeat: no-repeat
        background-position: center
        background-size: cover
        margin-right: 10px
        display: block
        transform: rotate(180deg)
        background-image: url("./icon-arrow_up@2x.png")
      .open
        transform: rotate(0)
    .last
      border-bottom: 0
      min-height: 80px
      flex: 1 0 0
    .goods-list
      height: 0
      overflow: hidden
      transition: all 0.1s
      .goods-item
        height: 48px
        display: flex
        align-items: center
        padding: 0 12px 0 24px
        color: $color-text-main
        font-family: $font-family-regular
        font-size: $font-size-14
        .goods-image
          width: 28px
          height: 28px
          margin-right: 8px
          border-radius: 2px
          border: 0.5px solid #E9ECEE
        .title
          line-height: 18px
          width: 90px
          overflow: hidden
          display: -webkit-box
          -webkit-line-clamp: 2
          -webkit-box-orient: vertical
          word-break: break-all
        &:before
          content: ''
          position: absolute
          left: 0
          top: 0
          height: 48px
          width: 3px
          background-color: transparent
          transition: all 0.3s
    .category-all.active
      color: $color-positive
      background: rgba(77,189,101,0.10)
    .active
      .left-tab-main
        background: rgba(77,189,101,0.10)
        color: $color-positive
        position: relative
        &:before
          background-color: $color-positive
    .open
      .select
        color: $color-positive
        background: rgba(77,189,101,0.10)
        position: relative
        &:before
          background-color: $color-positive
</style>
