<template>
  <div class="purchase-management table">
    <div class="tab-list">
      <status-tab :infoTabIndex="infoTabIndex" :tabStatus="tabStatus" @getStatusTab="changeStatus"></status-tab>
    </div>
    <div class="search-warp">
      <div class="ac-tab">
        <base-drop-down :select="socialSelect" @setValue="changeShopId"></base-drop-down>
        <base-date-select :placeHolder="datePlaceHolder" :dateInfo="time" @getTime="changeTime"></base-date-select>
        <base-search :infoText="keyword" :placeHolder="searchPlaceHolder" @search="changeKeyword"></base-search>
      </div>
      <div class="btn-main hand" @click="exportExcel">导出Excel</div>
    </div>
    <div class="list-header list-box">
      <div v-for="(item,index) in listTitle" :key="index" class="list-item">{{item}}</div>
    </div>
    <div class="list">
      <div v-for="(item, index) in list" :key="index" class="list-content list-box">
        <div class="list-item list-double-row">
          <p class="item-dark">{{item.order_sn}}</p>
          <p class="item-sub">{{item.created_at}}</p>
        </div>
        <div class="list-item list-text">
          <div class="list-text-name">{{item.nickname}}</div>
        </div>
        <div class="list-item list-text">￥{{item.price}}</div>
        <div class="list-item list-text">￥{{item.total}}</div>
        <div class="list-item list-text">{{item.delivery_at}}</div>
        <div class="list-item list-text" :title="item.social_name">{{item.social_name}}</div>
        <div class="list-item list-text">{{item.status_text}}</div>
        <div class="list-item list-use">
          <router-link tag="span" :to="{path: `/home/order-detail/${item.order_id}`}" append class="list-operation">详情</router-link>
        </div>
      </div>
    </div>
    <div class="pagination-box">
      <base-pagination ref="pagination" :pageDetail="pageDetail" :pagination="page" @addPage="setPage"></base-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import StatusTab from '@components/status-tab/status-tab'
  import API from '@api'
  import {authComputed, orderComputed, orderMethods} from '@state/helpers'

  const PAGE_NAME = 'ORDER_LIST'
  const TITLE = '订单列表'
  const DATE_PLACE_HOLDER = '选择下单日期'
  const SEARCH_PLACE_HOLDER = '订单号/会员名称/会员手机'
  const EXCEL_URL = '/social-shopping/api/backend/order-excel'

  const LIST_TITLE = ['订单号', '会员名称', '订单总价', '实付金额', '发货日期', '社区名称', '订单状态', '操作']
  const ORDERSTATUS = [
    {text: '全部', status: ''},
    {text: '待付款', status: 0},
    {text: '待提货', status: 1},
    {text: '已完成', status: 2},
    {text: '已关闭', status: 3}
  ]
  const SOCIAL_SELECT = {
    check: false,
    show: false,
    content: '全部社区',
    type: 'default',
    data: []
  }

  export default {
    name: PAGE_NAME,
    components: {
      StatusTab
    },
    page: {
      title: TITLE
    },
    data() {
      return {
        tabStatus: ORDERSTATUS,
        listTitle: LIST_TITLE,
        searchPlaceHolder: SEARCH_PLACE_HOLDER,
        datePlaceHolder: DATE_PLACE_HOLDER,
        socialSelect: SOCIAL_SELECT,
        downUrl: ''
      }
    },
    computed: {
      ...authComputed,
      ...orderComputed,
      infoTabIndex() {
        return this.tabStatus.findIndex((item) => item.status === this.status)
      },
      orderExportUrl() {
        let data = {
          current_corp: process.env.VUE_APP_CURRENT_CORP,
          current_shop: process.env.VUE_APP_CURRENT_SHOP,
          access_token: this.currentUser.access_token,
          status: this.status,
          shop_id: this.shopId,
          start_time: this.time[0] || '',
          end_time: this.time[1] || '',
          keyword: this.keyword
        }
        let search = []
        for (let key in data) {
          search.push(`${key}=${data[key]}`)
        }
        return process.env.VUE_APP_API + EXCEL_URL + '?' + search.join('&')
      }
    },
    created() {
      this._getShopList()
    },
    methods: {
      ...orderMethods,
      _getShopList() {
        API.Leader.shopDropdownList().then((res) => {
          if (res.error !== this.$ERR_OK) {
            return
          }
          let selectData = res.data.map((item) => {
            item.name = item.social_name
            return item
          })
          selectData.unshift({name: '全部社区', id: ''})
          this.socialSelect.data = selectData
        })
      },
      exportExcel() {
        window.open(this.orderExportUrl, '_blank')
      },
      changeStatus(selectStatus) {
        this.setStatus(selectStatus)
        this.$refs.pagination.beginPage()
      },
      changeShopId(shop) {
        this.setShopId(shop)
        this.$refs.pagination.beginPage()
      },
      changeTime(time) {
        this.setTime(time)
        this.$refs.pagination.beginPage()
      },
      changeKeyword(keyword) {
        this.setKeyword(keyword)
        this.$refs.pagination.beginPage()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .search-warp
    layout(row)
    height: 80px
    align-items: center
    justify-content: space-between
    .ac-tab
      layout(row)
      align-items: center
      .base-date-select
        padding: 0 10px
    .excel
      display: block
      height: 28px
      width: 84px
      line-height: 28px
      background: $color-positive
      border: 1px solid $color-positive
      border-radius: 4px
      font-family: $font-family-regular
      font-size: $font-size-12
      color: $color-white
      text-align: center

  .list-text-name
    no-wrap()
    font-family: $font-family-regular
    font-size: $font-size-14

</style>
