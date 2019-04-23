<template>
  <div class="sorting-task-detail">
    <ul class="top-wrap">
      <li v-for="item in topListTilte" :key="item.id">
        <span>{{item.name}}</span><span :class="{number:item.type === 'number'}">{{sortingTaskDetail.pickingDetail[item.id]}}</span><span v-if="item.after">{{item.after}}</span>
      </li>
    </ul>

    <ul class="content-wrap">
      <li v-for="(item,index) in sortingTaskDetail.deliveryDetail" :key="index" class="item-wrap">
        <div class="index">{{item.sort|format}}</div>
        <div class="name">{{item.name}}</div>
        <div class="num">{{item.num}}</div>
      </li>
    </ul>
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
          name: '商品名称:', id: 'goods_name'
        }, {
          name: '商品编码:', id: 'goods_sku_code'
        }, {
          name: '存放库位:', id: 'position_name'
        }, {
          name: '配给商户数:', id: 'merchant_num'
        }, {
          name: '待配货数:', id: 'base_wait_pick_num', type: 'number', after: '件'
        }]
      }
    },

    computed: {
      ...sortingComputed
    },
    created() {
      console.log(this.sortingTaskDetail.pickingDetail, 'sorting-task/sorting-task-detail/sorting-task/sorting-task-detail/')
      // this.SET_CURRENT_TITLES(TITLE_GUIDE)
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
    height: 72px
    background-color #fff
    padding: 0px 20px
    margin-bottom: 20px
    display flex
    align-items center
    justify-content space-between
    color: #333333

    li
      .number
        color: #f84e3c

  ul.content-wrap
    flex:1
    min-width: 1120px
    padding: 20px 0px 0px 20px
    background-color #fff
    display flex
    flex-wrap wrap
    align-content: flex-start
    .item-wrap
      box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04)
      padding: 20px
      border-radius: 2px
      width: 250px
      height: 144px
      margin-right: 20px
      margin-bottom 20px

      .index
        display inline-block
        padding: 0px 5px
        heigth: 20px
        line-height 20px
        text-align center
        background: #888888
        border-radius: 10px
        border-radius: 10px
        font-family: PingFangSC-Medium
        font-size: 16px
        color: #FFFFFF

      .name
        font-size: 14px
        color: #333333
        margin: 20px 0px

      .num
        font-family: PingFangSC-Medium
        font-size: 20px
        color: #00C15A


</style>
