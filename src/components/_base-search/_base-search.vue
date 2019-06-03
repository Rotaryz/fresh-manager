<template>
  <div class="base-search">
    <input v-model="searchText" :style="{'width': width + 'px'}" type="text" class="search-input"
           :placeholder="placeHolder" @keydown="_enter"
    >
    <div class="search-icon-box hand" @click="_search">
      搜索
      <!--<span class="search-icon hand"></span>-->
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
      },
      width: {
        type: Number,
        default: 187
      }
    },
    data() {
      return {
        searchText: this.infoText
      }
    },
    methods: {
      infoTextMethods() {
        this.searchText = ''
      },
      _search() {
        this.$emit('search', this.searchText)
      },
      _enter(e) {
        if (e.keyCode === 13) {
          this.$emit('search', this.searchText)
        }
      },
      _setText(text) {
        this.searchText = text || ''
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .base-search
    display: flex
    height: 28px
    overflow: hidden

  .search-input
    flex: 1
    color: $color-text-main
    font-family: $font-family-regular
    font-size: $font-size-12
    height: 100%
    width: 100%
    box-sizing: border-box
    border: 0.5px solid $color-line
    border-radius: 2px
    padding-left: 10px
    transition: all 0.2s
    &:hover
      border: 0.5px solid #ACACAC
    &::placeholder
      font-family: $font-family-regular
      color: $color-text-assist
    &:focus
      border: 1px solid $color-main !important

  .search-icon-box
    width: 50px
    margin-left: 10px
    overflow: hidden
    height: 28px
    border-radius: 2px
    background: $color-main
    text-align: center
    line-height: 28px
    font-size: $font-size-12
    color: $color-white
    transition: 0.3s all
    &:hover
      opacity: 0.8
</style>
