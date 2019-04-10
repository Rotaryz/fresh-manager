<template>
  <div class="community-data">
    <div class="data-caption data-caption-line">
      <div class="content-title">
        <img src="./icon-qundata@2x.png" alt="" class="title-icon">
        <div class="data-title">微信群运营数据概况</div>
      </div>
      <base-option-box @checkTime="_getData"></base-option-box>
    </div>
    <div class="data-content">
      <left-tab :tabArr="tabArr"></left-tab>
      <div class="right-data">
        <div class="top-sec">
          <section class="data-sec quality-data">
            <div class="sec-title">
              <p class="text">群质量数据<span>(当前等级Lv4)</span></p>
              <p class="right-text">等级说明 <img class="text-icon" src="./icon-help_lv@2x.png" alt=""></p>
            </div>
            <quality-data></quality-data>
          </section>
          <section class="data-sec business-data">
            <div class="sec-title">
              <p class="text">群运营数据</p>
            </div>
            <business-data></business-data>
          </section>
        </div>
        <div class="bottom-sec">
          <section class="data-sec group-data">
            <div class="sec-title">
              <p class="text">群用户分组<span>(群总人数500)</span></p>
            </div>
            <quality-data></quality-data>
          </section>
          <section class="data-sec goods-list">
            <div class="sec-title">
              <p class="text">最受欢迎商品Top10</p>
            </div>
            <goods-list></goods-list>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {communityComputed, communityMethods} from '@state/helpers'
  import LeftTab from './left-tab/left-tab'
  import QualityData from './quality-data/quality-data'
  import GoodsList from './goods-list/goods-list'
  import BusinessData from './business-data/business-data'

  const PAGE_NAME = 'COMMUNITY-DATA'
  const TITLE = '社群数据'
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      LeftTab,
      QualityData,
      GoodsList,
      BusinessData
    },
    data() {
      return {
        letTab: 0,
        tabArr: []
      }
    },
    computed: {
      ...communityComputed
    },
    created() {

    },
    methods: {
      ...communityMethods,
      _getData(value) {
        if (typeof value === 'string') {
          this.getOrderDetail({startTime: '', endTime: '', time: value, loading: true})
          return
        }
        this.getOrderDetail({startTime: value[0], endTime: value[1], time: '', loading: true})
      },
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
    flex-direction: column
    background: #FFF
    border: 0.5px solid $color-line
  .data-caption
    padding: 20px
    display: flex
    justify-content: space-between
    align-items: center
    box-sizing: border-box
    .content-title
      display: flex
      align-items: center
    .title-icon
      width: 14px
      height: 14px
      margin-right: 5px
    .data-title
      font-family: $font-family-regular
      color: $color-text-main
      font-size: $font-size-16
  .data-caption-line
    border-bottom-1px($color-line)
  .data-content
    display: flex
  .right-data
    margin-left: 20px
    margin-bottom: 20px
    flex: 1
    display: flex
    flex-wrap: wrap
    .top-sec
      width: 100%
      display: flex
    .bottom-sec
      width: 100%
      display: flex
    .data-sec
      width: 50%
      margin-right: 20px
      margin-top: 20px
      border: 1px solid #E6EAED
      height: 405px
      display: flex
      flex-direction: column
      .sec-title
        height: 60px
        display: flex
        padding: 0 20px
        justify-content: space-between
        align-items: center
        font-family: $font-family-regular
        .text
          font-size: $font-size-16
          color: $color-text-main
        .right-text
          display: flex
          align-items: center
          font-size: $font-size-14
          color: #666
          .text-icon
            width: 14px
            height: 14px
            margin-left: 4px
    .bottom
      height: 0


</style>
