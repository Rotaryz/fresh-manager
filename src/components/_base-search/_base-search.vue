<template>
  <div class="base-search">
    <input v-model="searchText" type="text" class="search-input" :placeholder="placeHolder">
    <div class="search-icon-box">
      <span class="search-icon hand"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'BASE_SEARCH'

  export default {
    name: COMPONENT_NAME,
    props: {
      placeHolder: {
        type: String,
        default: '退款单号/会员名称'
      },
      infoText: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        searchText: this.infoText,
        isFocus: false
      }
    },
    methods: {
      _isFocus(status) {
        this.isFocus = status
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .base-search
    display: flex
    height: 28px
    width: 244px
    overflow: hidden

  .search-input
    flex: 1
    color: $color-text-main
    font-family: $font-family-regular
    font-size: $font-size-12
    height: 100%
    width: 100%
    box-sizing: border-box
    border: 1px solid $color-line
    border-right: none
    border-radius: 4px 0px 0px 4px
    padding-left: 14px
    transition: all 0.2s
    &:hover
      border: 1px solid #ACACAC
      border-right: none
    &::placeholder
      font-family: $font-family-regular
      color: $color-text-assist
    &:focus
      border: 1px solid $color-sub !important
      border-right: none !important

  .search-icon-box
    width: 47px
    height: 100%
    overflow: hidden
    border-radius: 0px 4px 4px 0px
    .search-icon
      width: 47px
      height: 100%
      transition: all 0.3s
      icon-image('icon-search')
      &:active
        transform: scale(1.1)
</style>
