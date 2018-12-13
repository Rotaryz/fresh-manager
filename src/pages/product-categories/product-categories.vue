<template>
  <div class="product-categories">
    <div class="product-top">
      <div class="btn-main">新建大类+</div>
    </div>
    <ul class="categories-box">
      <li class="big-box">
        <div class="big-box-main">
          <div class="big-main-left hand">
            <div class="icon"></div>
            <div class="text">蔬菜</div>
          </div>
          <div class="big-main-right">
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'PRODUCT_CATEGORIES'
  const TITLE = '商品分类'

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {}
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .product-top
    layout(row)
    align-items: center
    justify-content: space-between
    height: 80px
  .categories-box
    border: 1px solid #e1e1e1
    border-bottom: 0px solid #e1e1e1
    .big-box
      width: 100%
      border-bottom: 1px solid #e1e1e1
      .big-box-main
        height: 60px
        padding: 0 14px 0 22px
        box-sizing: border-box
        layout(row)
        align-items: center
        justify-content: space-between
        .big-main-left
          layout(row)
          align-items: center
          min-height: 100%
          min-width: 200px
          .icon
            width: 16px
            height: 16px
            border-radius: 50%
            background-size: 16px
            bg-image('icon-retract')
            margin-right: 5px
            &.open
              bg-image('icon-open')
          .text
            font-size: $font-size-14
            line-height: 1
            color: $color-text-main
            font-family: $font-family-medium
  .product-categories
    width: 100%
</style>
