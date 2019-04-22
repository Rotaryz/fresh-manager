<template>
  <div class="sorting-task-detail table">
    <ul class="top-wrap">
      <li v-for="item in topListTilte" :key="item.id">
        <span>{{item.name}}</span><span>{{consumerOrderDetail[item.key]}}</span>
      </li>
    </ul>

    <div class="content-wrap table-content">
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
        <div v-for="(item, key) in consumerOrderDetail.data.details" :key="key" class="list-content list-box">
          <div v-for="row in commodities" :key="row.title" :style="{flex: row.flex}" class="list-item">
            <template v-if="row.key" name="name">
              <div v-if="!row.show">
                {{item[row.key]}}
              </div>
              <div  v-if="row.show" style="border-top:1px solid #333;width:30px;">
              </div>
            </template>
            <template v-else name="operation">
              <router-link class="list-operation" :to="{name:'home'}">{{row.operation}}</router-link>
            </template>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination" :pageDetail="consumerOrderDetail.pageTotal" @addPage="setPage"></base-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {merchantOrderComputed,merchantOrderMethods} from '@state/helpers'
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
          {title: '商品', key: 'goods_name', flex: 3},
          {title: '会员名 ', key: 'nickname', flex: 1},
          {title: '下单数量', key: 'sale_num', flex: 1},
          {title: '配货数量', key: 'sale_wait_pick_num', flex: 1,show:[2,3]},// 待配送 已完成
          {title: '缺货数量', key: 'sale_out_of_num', flex: 1}
        ],
        topListTilte: [{
          name: '商户名称:', key: 'goods_name'
        }, {
          name: '商品号 :', key: 'goods_sku_code'
        }, {
          name: '分类:', key: 'goods_category'
        }, {
          name: '下单数量:', key: 'sale_num'
        }, {
          name: '配货数量:', key: 'sale_wait_pick_num'
        }, {
          name: '缺货数量:', key: 'sale_out_of_num'
        }]
      }
    },

    computed: {
      ...merchantOrderComputed
    },
    created() {

    },
    methods:{
      ...merchantOrderMethods,
      setPage(page){
        this.SET_CONSUMER_PAGE(page)
        this.getConsumerOrderDetail()
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


</style>
