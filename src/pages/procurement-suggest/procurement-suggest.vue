<template>
  <div class="procurement-suggest table">
    <div class="down-content">
      <!--下拉选择-->
      <span class="down-tip">供应商</span>
      <div class="down-item">
        <base-drop-down :select="supplyTask" @setValue="_setValue"></base-drop-down>
      </div>
      <!--搜索-->
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search placeHolder="商品名称搜索" @search="_search"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-order_list2@2x.png" class="identification-icon">
          <p class="identification-name">采购任务列表</p>
          <div class="identification-text">2019.05.29</div>
        </div>
        <div class="function-btn">
          <div class="btn-main g-btn-item" @click="_sendPublish">查询</div>
          <a :href="downUrl" class="btn-main g-btn-item" target="_blank">导出</a>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box list-box-goods">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-if="purchaseTaskList.length">
            <div v-for="(item, index) in purchaseTaskList" :key="index" class="list-content list-box list-box-goods">
              <!--<div class="pro-select-icon hand" :class="{'pro-select-icon-active': item.select, 'pro-select-icon-disable': item.status !== 1 && item.status !== 2, 'pro-select-icon-disable': status !== 1 && status !== 2}" @click="selectPurchase({type: index, status: status})"></div>-->
              <div class="list-item list-double-row">
                <div class="item-dark">{{item.goods_name}}</div>
                <div class="item-dark">{{item.goods_sku_encoding}}</div>
              </div>
              <div class="list-item">{{item.goods_category}}</div>
              <div class="list-item">{{item.supplier}}</div>
              <div class="list-item">{{item.purchase_user}}</div>
              <div class="list-item">{{item.plan_num}}{{item.purchase_unit}}({{item.plan_base_num}}{{item.base_unit}})</div>
              <div class="list-item">{{item.finish_num}}{{item.purchase_unit}}({{item.finish_base_num}}{{item.base_unit}})</div>
              <div class="list-item list-item-progress">
                <div class="progress-content">
                  <div class="progress-num">{{item.finish_num}}{{item.purchase_unit}}/{{item.plan_num}}{{item.purchase_unit}}</div>
                  <div class="progress-bar">
                    <span class="progress-bar-active" :style="{width: item.finish_percent}"></span>
                  </div>
                </div>
                <div class="progress-percentage">{{item.finish_percent}}</div>
              </div>
              <div class="list-item">{{item.publish_at}}</div>
              <div class="list-item"><span class="list-status" :class="{'list-status-success': item.status === 3, 'list-status-warn': item.status === 2}"></span>{{item.status_str}}</div>
            </div>
          </div>
          <base-blank v-else></base-blank>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pages" :pageDetail="pageTotal" @addPage="_getMoreList"></base-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'PROCUREMENT_SUGGEST'
  const TITLE = '预采建议'
  const COMMODITIES_LIST = ['商品', '分类', '供应商', '采购员', '商品销售数', '库存数', '建议采购数', '创建时间']

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        commodities: COMMODITIES_LIST,
        supplyTask: [],
        pageTotal: {},
        pages: {},
        purchaseTaskList: []
      }
    },
    methods: {
      _setValue() {},
      _search() {},
      _getMoreList() {},
      _sendPublish() {}
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .procurement-suggest
    width: 100%
  .identification-text
    font-size: $font-size-16
    color: $color-text-main
    font-family: $font-family-regular
    margin-left: 30px
</style>
