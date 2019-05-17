<template>
  <div class="foundation-setup table">
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-foundation_setup@2x.png" class="identification-icon">
          <p class="identification-name">基础设置</p>
        </div>
        <div class="function-btn">
        </div>
      </div>
      <ul class="setup">
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
        </router-link>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'FOUNDATION_SETUP'
  const TITLE = '基础设置'
  const SETUP = [
    {
      className: 'store',
      name: '库位管理',
      url: 'store-manage'
    },
    {
      className: 'bar-code',
      name: '打印条形码',
      url: 'bar-code'
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
  .setup
    margin-top: 22.9vh
    display: flex
    justify-content: center
    .setup-item
      display: flex
      flex-direction: column
      align-items: center
      justify-content: center
      border-radius: 4px
      border-1px(rgba(0, 0, 0, 0.04), 4px)
      box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04)
      margin: 0 20px
      height: 190px
      width: 290px
      transition: all 0.3s
      .setup-icon
        transition: all 0.3s
        margin-bottom: 19px
        height: 70px
        width: 70px
      .setup-name
        color: $color-text-main
        line-height: 16px
        font-size: 16px
        font-family: $font-family-regular
      .store
        icon-image('icon-library_manage')
      .bar-code
        icon-image('icon-print_barcode')
      &:hover
        border-1px(rgba(0, 0, 0, 0), 4px)
        background: #9FD5C6
        .setup-name
          color: $color-white
        .store
          icon-image('icon-library_manage2')
        .bar-code
          icon-image('icon-print_barcode2')
</style>
