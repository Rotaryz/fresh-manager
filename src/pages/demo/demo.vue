<template>
  <div class="storehouse-management table">
    <div class="down-content">
      <!--时间选择-->
      <div class="enter-title">商户名称：{{detail.buyer_name}}</div>
      <div class="enter-title">订单号：{{detail.order_sn}}</div>
      <div class="enter-title">下单时间：{{detail.created_at}}</div>
      <div class="enter-title">状态：{{detail.status_str}}</div>
      <div class="enter-title">销售金额：<span class="enter-title-money">{{detail.total && `￥${detail.total}`}}</span></div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <!--<img src="./icon-inventory_list@2x.png" class="identification-icon">-->
          <p class="identification-name">出库列表</p>
        </div>
        <div class="function-btn">
          <div class="btn-main">清单导出</div>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div>
            <div class="list-content list-box">
              <div class="list-item">666</div>
              <div class="list-item">666</div>
              <div class="list-item">666</div>
              <div class="list-item">666</div>
              <div class="list-item">666</div>
              <div class="list-item">666</div>
            </div>
          </div>
          <!--<base-blank v-else></base-blank>-->
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination"></base-pagination>
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'STOREHOUSE_MANAGEMENT'
  const TITLE = '库位管理'
  const COMMODITIES_LIST = ['商品', '分类', '总库存', '锁定库存', '可用库存', '总库存货值', '库存均价', '库位', '操作']

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        commodities: COMMODITIES_LIST
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .storehouse-management
    width: 100%
</style>
