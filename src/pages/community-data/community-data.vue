<template>
  <div class="community-data">
    <div class="data-header">
      <div class="data-caption data-caption-line">
        <img src="./icon-qundata@2x.png" alt="" class="title-icon">
        <div class="data-title">微信群运营数据概况</div>
        <!--<base-option-box @checkTime="_orderMore"></base-option-box>-->
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {communityComputed, communityMethods} from '@state/helpers'

  const PAGE_NAME = 'COMMUNITY-DATA'
  const TITLE = '社群数据'
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {

      }
    },
    computed: {
      ...communityComputed
    },
    created() {

    },
    destroyed() {
    },
    methods: {
      ...communityMethods,
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .community-data
    overflow: hidden
    flex: 1
    display: flex
    box-sizing: border-box
    padding: 20px
    flex-direction: column
    padding: 20px

  .data-header
    height: 260px
    border-radius: 2px
    background: $color-white
    box-sizing: border-box

  .data-caption
    padding: 20px
    display: flex
    justify-content: space-between
    align-items: center
    box-sizing: border-box
    .title-icon
      width: 14px
      height: 14px
    .data-title
      font-family: $font-family-regular
      color: $color-text-main
      font-size: $font-size-16

</style>
