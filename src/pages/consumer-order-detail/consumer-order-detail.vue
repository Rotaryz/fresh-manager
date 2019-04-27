<template>
  <div class="sorting-task-detail table">
    <ul class="top-wrap">
      <li v-for="item in topListTilte" :key="item.id">
        <span>{{item.name}}</span><span>{{consumerDetail.detail.baseData[item.key]}}</span>
      </li>
    </ul>

    <div class="content-wrap table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-inventory@2x.png" class="identification-icon">
          <p class="identification-name">消费者订单</p>
        </div>
      </div>
      <div class="list-header list-box">
        <div v-for="(item,index) in commodities" :key="index" class="list-item" :style="{flex: item.flex}" :class="['list-item',item.class]">{{item.title}}</div>
      </div>
      <div class="list">
        <tempalte v-if="consumerDetail.detail.details.length">
          <div v-for="(row, key) in consumerDetail.detail.details" :key="key" class="list-content list-box">
            <div v-for="item in commodities" :key="item.title" :style="{flex: item.flex}" class="list-item" :class="['list-item',item.class]">
              <div :class="{red:item.key==='status_str'&& row.status || item.key==='sale_out_of_num'&& row.is_lack}">
                {{row[item.key]}}
              </div>
            </div>
          </div>
        </tempalte>
        <base-blank v-else></base-blank>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination" :pageDetail="consumerDetail.pageTotal" @addPage="setPage"></base-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {merchantOrderComputed, merchantOrderMethods} from '@state/helpers'
  // 0=待调度，1=待分拣，2=待配送，3=已完成，4=已取消, 5=锁定中
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
          {title: '订单号', key: 'out_order_sn', flex: 1.8},
          {title: '会员名称', key: 'nickname', flex: 1},
          {title: '下单数量', key: 'sale_num', flex: 1},
          {title: '配货数量', key: 'sale_wait_pick_num', flex: 1},
          {title: '缺货数量', key: 'sale_out_of_num', flex: 1},
          {title: '处理结果', key: 'status_str', flex: 1, class: "last-child"}
        ],
        topListTilte: [{
          name: '商品名称：', key: 'goods_name'
        }, {
          name: '商品编号：', key: 'goods_sku_encoding'
        }, {
          name: '分类：', key: 'goods_category'
        }, {
          name: '下单数量：', key: 'sale_num'
        }, {
          name: '配货数量：', key: 'sale_wait_pick_num'
        }, {
          name: '缺货数量；', key: 'sale_out_of_num'
        }]
      }
    },

    computed: {
      ...merchantOrderComputed,
      isLine() {
        // 待调度0和锁定5
        if (this.merchantDetail.status === 0 || this.merchantDetail.status === 5) {
          return true
        }
        return false
      }
    },
    created() {

    },
    methods: {
      ...merchantOrderMethods,
      setPage(page) {
        this.SET_CONSUMER_PAGE(page)
        this.getConsumerOrderDetail()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .last-child
    max-width: 80px

  .top-wrap
    min-width: 1414px
    background-color #fff
    padding: 30px 20px 10px 20px
    color: #333333
    margin-bottom: 20px

    li
      display inline-block
      margin: 0px 130px 20px 0px

  .red
    color: #f84e3c


</style>
