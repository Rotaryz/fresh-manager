<template>
  <div class="sorting-task-detail table">
    <ul class="top-wrap">
      <li v-for="item in topListTilte" :key="item.id">
        <span>{{item.name}}</span>
        <span :class="{number:item.type === 'number'}">{{sortingTaskDetailByOrder.details[item.id]}}</span>
        <span v-if="item.after">{{sortingTaskDetailByOrder.details[item.after]}}</span>
      </li>
    </ul>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-inventory@2x.png" class="identification-icon">
          <p class="identification-name">商品明細</p>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item" :style="{flex:item.flex}" :class="['list-item',item.class]">{{item.tilte}}</div>
        </div>
        <div class="list">
          <template v-if="sortingTaskDetailByOrder.list.length">
            <div v-for="(row, index) in sortingTaskDetailByOrder.list" :key="index" class="list-content list-box">
              <div v-for="item in commodities" :key="item.title" :style="{flex:item.flex}" :title="row[item.key]" :class="['list-item',item.class]">
                {{row[item.key]}}
              </div>
            </div>
          </template>
          <base-blank v-else></base-blank>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination" :pageDetail="sortingTaskDetailByOrder.pageTotal" @addPage="_getMoreList"></base-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
// import API from '@api'
  import {sortingComputed, sortingMethods} from '@state/helpers'
  const PAGE_NAME = 'SORTING_TASK_DETAIL'
  const TITLE = '分拣任务明细'
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        topListTilte: [
          {
            name: '商户名称：',
            id: 'merchant_name'
          },
          {
            name: '订单号：',
            id: 'out_order_sn'
          },
          {
            name: '下单时间：',
            id: 'build_time'
          },
          {
            name: '状态：',
            id: 'status_str'
          },
          {
            name: '销售金额：',
            id: 'sale_price',
            type: 'number',
            before: '¥'
          }
        ],
        commodities: [
          {tilte: '商品', key: 'goods_name', flex: '2', afterBr: 'goods_sku_encoding'},
          {tilte: '分类', key: 'goods_category'},
          {tilte: '订单数量 ', key: 'order_num', after: 'sale_unit'},
          {tilte: '配货数量', key: 'allocation_num', after: 'sale_unit'},
          {tilte: '存放库位', key: 'position_name', flex: '2'}
        ]
      }
    },
    computed: {
      ...sortingComputed
    },
    methods: {
      ...sortingMethods,
      _getMoreList(page) {
        this.SET_PARAMS({page, type: 'sortingTaskDetailByOrder'})
        this.getSortingTaskGoodsDetails(this.$route.params)
      }
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
