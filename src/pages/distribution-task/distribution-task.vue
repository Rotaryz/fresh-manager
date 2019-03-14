<template>
  <div class="distribution-task table">
    <base-tab-select :infoTabIndex="infoTabIndex" :tabStatus="tabStatus" :lineWidth="104" @getStatusTab="changeStatus"></base-tab-select>
    <div class="down-content">
      <span class="down-tip">建单时间</span>
      <date-picker
        class="edit-input-box" type="date"
        placeholder="选择下单日期"
        style="width: 187px;height: 28px;border-radius: 1px"
      ></date-picker>
      <!--@on-change="_getStartTime"-->
      <div class="time-tip">~</div>
      <div class="down-item">
        <date-picker
          class="edit-input-box edit-input-right"
          type="date"
          placeholder="选择下单日期"
          style="width: 187px;height: 28px;border-radius: 1px"
        ></date-picker>
      </div>
      <div v-if="infoTabIndex === 0" class="distribution-down">
        <span class="down-tip">搜索</span>
        <div class="down-item">
          <base-search placeHolder="订单号或商品名称"></base-search>
        </div>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-driver@2x.png" class="identification-icon">
          <p class="identification-name">{{tabStatus[infoTabIndex].text}}</p>
        </div>
        <div class="function-btn">
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item" :style="{flex: item.flex}">{{item.title}}</div>
        </div>
        <div class="list">
          <div class="list-content list-box">
            <div v-for="(item,index) in commodities" :key="index" class="list-item" :style="{flex: item.flex}">
              {{item.operation ? '' : 'item'}}
              <div v-if="item.operation" class="list-operation">{{item.operation}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pages"></base-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {DatePicker} from 'iview'

  const PAGE_NAME = 'DISTRIBUTION_TASK'
  const TITLE = '配送任务'
  const COMMODITIES_LIST = [
    {title: '建单时间', key: '', flex: 1},
    {title: '配送单号', key: '', flex: 1},
    {title: '关联订单号', key: '', flex: 1},
    {title: '路线', key: '', flex: 1},
    {title: '商户名称', key: '', flex: 1},
    {title: '配送地址', key: '', flex: 1},
    {title: '收货时间', key: '', flex: 1},
    {title: '司机', key: '', flex: 1},
    {title: '操作', key: '', operation: '导出', flex: 0.3}
  ]
  const COMMODITIES_LIST2 = [
    {title: '司机', key: '', flex: 1},
    {title: '线路名称', key: '', flex: 1},
    {title: '配送商户数', key: '', flex: 1},
    {title: '订单数', key: '', flex: 1},
    {title: '操作', key: '', operation: '导出', flex: 0.145}
  ]
  const ORDERSTATUS = [{text: '订单任务列表', status: ''}, {text: '司机任务列表', status: 0}]
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
        tabStatus: ORDERSTATUS,
        commodities: COMMODITIES_LIST,
        infoTabIndex: 0
      }
    },
    methods: {
      changeStatus(item, index) {
        this.infoTabIndex = index
        this.commodities = this.infoTabIndex === 0 ? COMMODITIES_LIST : COMMODITIES_LIST2
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .distribution-down
    display: flex
    align-items: center
</style>
