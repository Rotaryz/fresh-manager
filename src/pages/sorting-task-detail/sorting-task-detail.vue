<template>
  <div class="sorting-task-detail">
    <ul class="top-wrap">
      <li v-for="item in topListTilte" :key="item.id">
        <span>{{item.name}}</span>
        <span :class="{number:item.type === 'number'}">{{sortingTaskDetail.pickingDetail[item.id]}}</span>
        <span v-if="item.after">{{sortingTaskDetail.pickingDetail[item.after]}}</span>
      </li>
    </ul>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="icon-inventory@2x.png" class="identification-icon">
          <p class="identification-name">配货明细</p>
        </div>
      </div>
      <ul class="content-wrap">
        <li v-for="(item,index) in sortingTaskDetail.deliveryDetail" :key="index" class="item-wrap">
          <div class="index">{{item.sort|format}}</div>
          <div class="name">{{item.name}}</div>
          <div class="num">{{item.num}}{{item.unit}}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {sortingComputed} from '@state/helpers'

  const PAGE_NAME = 'SORTING_TASK_DETAIL'
  const TITLE = '分拣任务明细'
  // const TITLE_GUIDE =[]
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    filters: {
      format(str) {
        let arr = str.split('#')
        if (arr[1]) {
          return arr[1]
        } else {
          return str
        }
      }
    },
    data() {
      return {
        topListTilte: [{
          name: '商品名称：', id: 'goods_name'
        }, {
          name: '商品编码：', id: 'goods_sku_encoding'
        }, {
          name: '存放库位：', id: 'position_name'
        }, {
          name: '配给商户数：', id: 'merchant_num'
        }, {
          name: '待配货数：', id: 'wait_allocation_num', type: 'number', after: 'sale_unit'
        }]
      }
    },
    computed: {
      ...sortingComputed
    },
    created() {
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .sorting-task-detail
    display flex
    flex-direction column
    width: 100%
    font-family: PingFangSC-Regular

  .top-wrap
    min-width:1414px
    background-color #fff
    padding:30px 20px 10px 20px
    color: #333333
    margin-bottom: 20px
    li
      display inline-block
      margin:0px 130px 20px 0px
      .number
        color: #f84e3c

  .identification
    padding:20px 20px 0px

  ul.content-wrap
    flex: 1
    padding: 20px 0px 0px 20px
    background-color #fff
    display flex
    flex-wrap wrap
    align-content: flex-start

    .item-wrap
      padding: 20px
      border-radius: 2px
      width: 250px
      height: 144px
      margin-right: 20px
      margin-bottom 20px
      position: relative
      box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04)
      display flex
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      &:hover
        box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.04)
        &:after
          border: 1px solid #ccc
      &:after
        content: ""
        pointer-events: none // 解决iphone上的点击无效Bug
        display: block
        position: absolute
        left: 0
        top: 0
        transform-origin: 0 0
        border: 1px solid #E6EAED
        border-radius: 2px
        width 200%
        height 200%
        transform: scale(0.5) translateZ(0)
        @media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3)
          width: 300%
          height: 300%
          border-radius: 2px * 3
          transform: scale(1 / 3) translateZ(0)
      .index
        display inline-block
        padding: 0px 5px
        heigth: 20px
        line-height 20px
        text-align center
        background: #888888
        border-radius: 10px
        font-family: PingFangSC-Medium
        font-size: 16px
        color: #FFFFFF

      .name
        font-size: 14px
        color: #333333
        line-height: 18px
        overflow: hidden
        text-overflow:ellipsis
        display: -webkit-box
        -webkit-box-orient: vertical
        -webkit-line-clamp: 2

      .num
        font-family: PingFangSC-Medium
        font-size: 20px
        color: #00C15A


</style>
