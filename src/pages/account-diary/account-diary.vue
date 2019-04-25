<template>
  <div class="account-diary table">
    <div class="down-content">
      <span class="down-tip">操作时间</span>
      <div class="down-item">
        <base-date-select placeHolder="选择操作时间" @getTime="_setTime"></base-date-select>
      </div>
      <div class="distribution-down">
        <span class="down-tip">搜索</span>
        <div class="down-item">
          <base-search :infoText="orderKeyword" placeHolder="请输入员工姓名" @search="changeKeyword"></base-search>
        </div>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-operation@2x.png" class="identification-icon">
          <p class="identification-name">操作日记</p>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item" :style="{flex: item.flex}">{{item.title}}</div>
        </div>
        <div class="list">
          <!--<div v-for="(item, index) in orderList" :key="index" class="list-content list-box">-->
          <div class="list-content list-box">
            <div class="list-item" :style="{flex: commodities[0].flex}">导出</div>
            <div class="list-item" :style="{flex: commodities[1].flex}">导出</div>
            <div class="list-item" :style="{flex: commodities[2].flex}">导出1</div>
            <div class="list-item" :style="{flex: commodities[3].flex}">导出</div>
            <div class="list-item" :style="{flex: commodities[4].flex}">导出</div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination" :pageDetail="accountPageDetail" :pagination="accountPage" @addPage="setOrderPage"></base-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'ACCOUNT_DIARY'
  const TITLE = '操作日记'
  const ACCOUNT_LIST = [
    {title: '编号', key: 'created_at', flex: 0.9},
    {title: '操作者', key: 'order_sn', flex: 0.7},
    {title: '操作日记', key: 'sale_order_sn', flex: 1},
    {title: '操作模块', key: 'road_name', flex: 1},
    {title: '操作事项', key: 'receiver', flex: 1.3}
  ]

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        orderKeyword: '',
        commodities: ACCOUNT_LIST,
        accountPageDetail: {},
        accountPage: 1
      }
    },
    methods: {
      _setTime() {},
      setOrderPage() {},
      changeKeyword() {}
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .account-diary
    width: 100%
  .distribution-down
    display: flex
    align-items: center
</style>
