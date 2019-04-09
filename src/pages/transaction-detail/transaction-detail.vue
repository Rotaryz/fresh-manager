<template>
  <div class="transaction-detail table">
    <div class="down-content">
      <span class="down-tip">下单时间</span>
      <div class="down-item">
        <date-picker
          class="edit-input-box" type="date"
          placeholder="选择下单日期"
          style="width: 187px;height: 28px;border-radius: 1px"
          :value="startTime"
          @on-change="changeStartTime"
        ></date-picker>
        <div v-if="startTime" class="down-time-text">{{timeStart}}</div>
      </div>
      <!--搜索-->
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search :infoText="keyword" placeHolder="订单号" @search="changeKeyword"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-order_list2@2x.png" class="identification-icon">
          <p class="identification-name">交易明细</p>
          <base-status-tab :statusList="dispatchSelect" @setStatus="changeStatus"></base-status-tab>
        </div>
        <div class="function-btn">
          <div class="btn-main" @click="exportExcel">导出</div>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in listTitle" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in list" :key="index" class="list-content list-box">
            <div class="list-item list-text">1</div>
            <div class="list-item list-use">
              <router-link tag="span" :to="{path: `order-detail/${item.order_id}`}" append class="list-operation">2</router-link>
            </div>
            <div class="list-item list-text">3</div>
            <div class="list-item list-text">4</div>
            <div class="list-item list-text">5</div>
            <div class="list-item list-text">6</div>
            <div class="list-item list-text">7</div>
            <div class="list-item list-text"><span class="list-status" :class="{'list-status-success': item.status === 3, 'list-status-warn': item.status === 2}"></span>8</div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination" :pageDetail="pageDetail" :pagination="page" @addPage="setPage"></base-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {DatePicker} from 'iview'

  const PAGE_NAME = 'TRANSACTION_DETAIL'
  const TITLE = '交易明细'

  const DISPATCH_SELECT = [
    {name: '全部', value: '', num: 0},
    {name: '已入账', value: 0, num: 0},
    {name: '待入账', value: 1, num: 0}
  ]
  const LIST_TITLE = ['下单时间', '订单号', '交易金额', '服务费', '团长佣金', '入账资金', '入账时间', '状态']

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DatePicker
    },
    data() {
      return {
        dispatchSelect: DISPATCH_SELECT,
        listTitle: LIST_TITLE,
        list: [{}]
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .transaction-detail
    .list-box
      .list-item
        padding-right: 14px
        &:last-child
          flex: 0.5
</style>
