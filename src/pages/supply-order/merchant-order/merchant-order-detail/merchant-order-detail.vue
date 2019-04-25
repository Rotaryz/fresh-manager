<template>
  <div class="sorting-task-detail table">
    <ul class="top-wrap">
      <li v-for="item in topListTilte" :key="item.id">
        <span>{{item.name}}</span><span>{{merchantDetail[item.key]}}</span>
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
        <div v-for="(row, key) in merchantDetail.details" :key="key" class="list-content list-box">
          <div v-for="item in commodities" :key="item.title" :style="{flex: item.flex}" class="list-item">
            <template v-if="item.key" name="name">
              <div v-if="isLine && item.line" style="border-top:1px solid #333;width:30px;">
              </div>
              <div v-else :class="{red:item.key==='sale_out_of_num' && row.is_lack}">
                {{row[item.key]}}
              </div>
            </template>
            <template v-else name="operation">
              <router-link class="list-operation" :to="goTo(row)">{{item.operation}}</router-link>
            </template>
          </div>
        </div>
      </div>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  import {merchantOrderComputed} from '@state/helpers'
  // 0=待调度，1=待分拣，2=待配送，3=已完成，4=已取消, 5=锁定中
  const PAGE_NAME = 'MERCHANT_OREDER_DETAIL'
  const TITLE = '订单详情'
  let commodities = [
    {title: '商品', key: 'goods_name', flex: 2},
    {title: '分类', key: 'goods_category', flex: 1},
    {title: '下单数量', key: 'sale_num', flex: 1},
    {title: '配货数量', key: 'sale_wait_pick_num', flex: 1,line:true},// 待配送 已完成
    {title: '缺货数量', key: 'sale_out_of_num', flex: 1,line:true},
    {title: '操作', key: '', operation: '消费者详情', flex: 1}
  ]
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        commodities: commodities,
        topListTilte: [{
          name: '商户名称：', key: 'buyer_name'
        }, {
          name: '订单号：', key: 'order_sn'
        }, {
          name: '下单时间：', key: 'created_at'
        }, {
          name: '状态：', key: 'status_str'
        }, {
          name: '品类数：', key: 'type_count'
        }, {
          name: '类型：', key: 'type_str'
        }]
      }
    },

    computed: {
      ...merchantOrderComputed,
      isLine() {
        if (this.merchantDetail.status === 0 || this.merchantDetail.status === 5) {
          return true
        }
        return false
      }
    },
    created() {
      if (this.merchantDetail.status === 0 || this.merchantDetail.status === 5) {
        this.commodities = commodities.slice(0, -2)
      }
    },
    methods: {
      goTo(item) {
        console.log('merchantDetail', this.$route, 999)
        let cont = {
          name: 'consumer-order-detail',
          params: {
            id: item.id || 0,
            goods_sku_code: item.goods_sku_code || 0,
            parent_order_id: this.$route.params.id
          }
        }
        return cont
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
    background-color #fff
    padding: 30px 20px 10px 20px
    color: #333333
    margin-bottom: 20px

    li
      display inline-block
      margin: 0px 130px 20px 0px

      .number
        color: #f84e3c


</style>
