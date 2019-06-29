<template>
  <div class="basics-set table">
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-foundation_setup@2x.png" class="identification-icon">
          <p class="identification-name">基础设置</p>
        </div>
        <div class="function-btn">
        </div>
      </div>
      <ul class="set-list">
        <router-link
          v-for="(item, index) in setup"
          :key="index"
          tag="li"
          :to="item.url"
          append
          class="hand setup-item"
        >
          <div class="setup-icon" :class="item.className"></div>
          <p class="setup-name">{{item.name}}</p>
          <div class="icon-arrow"></div>
        </router-link>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'BASICS_SET'
  const TITLE = '基础设置'
  const SETUP = [
    {
      className: 'buy',
      name: '采购员',
      url: 'buyer'
    },
    {
      className: 'supplier',
      name: '供应商',
      url: 'supplier'
    }
  ]

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        setup: SETUP
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .set-list
    layout(row)
    .setup-item
      display: flex
      flex-direction: row
      align-items: center
      border-radius: 4px
      border-1px(rgba(0, 0, 0, 0.04), 4px)
      padding-left: 30px
      box-sizing: border-box
      margin-right: 20px
      height: 180px
      width: 260px
      transition: all 0.3s
      .setup-icon
        width: 44px
        height: @width
        margin-right: 20px
      .buy
        icon-image('icon-buy')
      .supplier
        icon-image('icon-supplier')
      .setup-name
        font-size: $font-size-22
        color: $color-text-main
        font-family: $font-family-regular
        margin-right: 10px
      .icon-arrow
        width: 6px
        height: 12px
        margin-top: 3px
        icon-image('icon')
      &:hover
        box-shadow: 0 5px 22px 0 rgba(0,0,0,0.07)
</style>
