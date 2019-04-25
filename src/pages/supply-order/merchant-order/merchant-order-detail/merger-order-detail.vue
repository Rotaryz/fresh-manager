<template>
  <div class="sorting-task-detail table">
    <ul class="top-wrap">
      <li v-for="item in topListTilte" :key="item.id">
        <span>{{item.name}}</span><span>{{mergerDetail[item.id]}}</span>
      </li>
    </ul>
    <ul class="content-wrap table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-inventory@2x.png" class="identification-icon">
          <p class="identification-name">商品明细</p>
        </div>
      </div>
      <div class="list-header list-box">
        <div v-for="(item,index) in commodities" :key="index" class="list-item" :style="{flex: item.flex}">{{item.title}}</div>
      </div>
      <div class="list">
        <div v-for="(item, key) in mergerDetail.details" :key="key" class="list-content list-box">
          <div v-for="row in commodities" :key="row.title" :style="{flex: row.flex}" class="list-item">
            <div v-if="row.key" :class="{red:row.type==='red'&& item[row.key]>0}">
              {{item[row.key]}}
            </div>
          </div>
        </div>
      </div>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  import {merchantOrderComputed} from '@state/helpers'
  const PAGE_NAME = 'MERCHANT_OREDER_DETAIL'
  const TITLE = '订单详情'
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        commodities: [
          {title: '商品', key: 'goods_name', flex: 1.8},
          {title: '分类', key: 'goods_category', flex: 1},
          {title: '下单数量', key: 'sale_num', flex: 1},
          {title: '配货数量', key: 'sale_wait_pick_num', flex: 1},
          {title: '缺货数量', key: 'sale_out_of_num', type:'red',flex: 1},
        ],
        topListTilte: [{
          name: '汇总订单号：', id: 'order_sn'
        }, {
          name: '品类数：', id: 'type_count'
        }, {
          name: '下单时间：', id: 'created_at'
        }]
      }
    },

    computed: {
      ...merchantOrderComputed
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
    background-color #fff
    padding:30px 20px 10px 20px
    color: #333333
    margin-bottom: 20px
    li
      display inline-block
      margin:0px 130px 20px 0px
  .red
    color: #f84e3c


</style>
