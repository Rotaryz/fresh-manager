<template>
  <div class="quality-data">
    <div class="tab">
      <div
        v-for="(item, index) in tabArr"
        :key="index"
        :class="['tab-item', {'active': +tabIndex === index}, {'no-after': tabIndex-1 === index}]"
        @click="changeTab(index)"
      >
        <span class="num">{{item.value}}</span>
        <span class="text">{{item.name}}</span>
      </div>
    </div>
    <div class="data-content">
      <div class="alone-data">
        <span class="num">2000</span>
        <span class="text">浏览数(PV)</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const TAB_ARR = [
    {
      value: 2500,
      name: '浏览数(PV)'
    },
    {
      value: 200,
      name: '主力客户'
    },
    {
      value: 100,
      name: '支付订单'
    }
  ]
  export default{
    props: {

    },
    data() {
      return {
        tabArr: TAB_ARR,
        tabIndex: 0
      }
    },
    methods: {
      changeTab(index) {
        this.tabIndex = index
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .quality-data
    width: 100%
    flex: 1
    display: flex
    flex-direction: column
  .tab
    height: 60px
    background: #F5F7FA
    display: flex
    .tab-item
      flex: 1
      display: flex
      flex-direction: column
      justify-content: center
      align-items: center
      transition: all 0.3s
      position: relative
      border: 0.5px solid #E6EAED
      border-right: 0.5px solid transparent
      border-left: 0.5px solid transparent
      &:after
        content: ""
        position: absolute
        height: 27px
        width: 1px
        border-right: 0.5px solid #E6EAED
        right: 0
        col-center()
      &:before
        content: ""
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 2px
        background-color: transparent
        transition: all 0.3s
      .num
        font-family: $font-family-din-bold
        font-size: $font-size-20
        color: $color-text-main
        line-height: 20px
      .text
        font-family: $font-family-regular
        font-size: $font-size-12
        color: $color-text-main
        line-height: 12px
        margin-top: 5px
    .tab-item:last-child:after
      border-right: 0
    .active
      background: #FFF
      border-right: 0.5px solid #E6EAED
      border-left: 0.5px solid #E6EAED
      border-bottom: 0.5px solid transparent
      &:before
        background-color: $color-positive
      &:after
        border-right: 0.5px solid transparent
    .active:first-child
      border-left: 0.5px solid transparent
    .active:last-child
      border-right: 0.5px solid transparent
    .no-after:after
      border-right: 0.5px solid transparent
  .data-content
    flex: 1
    .alone-data
      width: 100%
      height: 100%
      display: flex
      flex-direction: column
      align-items: center
      justify-content: center
      color: $color-text-main
      .num
        font-size: 60px
        line-height: 60px
        font-family: $font-family-din-bold
      .text
        margin-top: 10px
        font-size: $font-size-14
        font-family: $font-family-regular
</style>
