<template>
  <div class="sorting-task-detail table">
    <ul class="top-wrap">
      <li v-for="item in topListTilte" :key="item.id">
        <span>{{item.name}}</span><span>{{afterSalesDetail.data[item.key]}}</span>
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
        <div v-for="(item,index) in commodities" :key="index" class="list-item" :style="{flex: item.flex}" :class="['list-item',item.class]">{{item.title}}</div>
      </div>
      <div class="list">
        <div v-for="(row, key) in afterSalesDetail.data.details" :key="key" class="list-content list-box">
          <div v-for="item in commodities" :key="item.title" :style="{flex: item.flex}" :class="['list-item',item.class]">
            <div>
              {{row[item.key]}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {afterSalesOrderComputed} from '@state/helpers'

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
          {title: '商品', key: 'goods_name', flex: 1.3},
          {title: '分类', key: 'goods_category', flex: 1},
          {title: '缺货数量', key: 'sale_out_of_num', flex: 1},
          {title: '状态', key: 'status_str', flex: 1,class:'last-td'},
        ],
        topListTilte: [{
          name: '商户名称：', key: 'buyer_name'
        }, {
          name: '售后订单：', key: 'order_sn'
        }, {
          name: '创建时间：', key: 'created_at'
        }, {
          name: '缺货品类数：', key: 'type_count'
        }, {
          name: '状态：', key: 'status_str'
        }]
      }
    },

    computed: {
      ...afterSalesOrderComputed
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .last-td
    max-width:50px
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


</style>
