<template>
  <div class="purchase-management table">
    <base-tab-select :infoTabIndex="infoTabIndex" :tabStatus="tabStatus" @getStatusTab="changeStatus"></base-tab-select>
    <div class="down-content">
      <span class="down-tip">筛选</span>
      <div class="down-item-small">
        <base-drop-down :select="socialSelect" :isInput="true" @setValue="changeShopId" @changeText="_searchShop"></base-drop-down>
      </div>
      <div class="down-item">
        <!--<base-date-select :width="292" dataPickerType="datetimerange" :placeHolder="datePlaceHolder" :dateInfo="time" @getTime="changeTime"></base-date-select>-->
        <!--  eslint-disable -->
        <date-picker
          v-model="timeDatePicker"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
        >
        </date-picker>
        <!--  eslint-disable-end -->
      </div>
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search ref="search" :infoText="keyword" :placeHolder="searchPlaceHolder" @search="changeKeyword"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-order_list@2x.png" class="identification-icon">
          <p class="identification-name">订单列表</p>
          <base-status-nav :statusList="statusTab" :value="orderStatus" valueKey="status" labelKey="status_str" numKey="statistic" @change="changeTab"></base-status-nav>
        </div>
        <div class="function-btn">
          <div class="btn-main" @click="exportExcel(0)">导出Excel</div>
        </div>
      </div>
      <div class="big-list">
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
            <!--<div class="list-item list-text">{{item.delivery_at}}</div>-->
            <div class="list-item list-text list-item-double" :title="item.social_name">{{item.social_name}}</div>
            <div class="list-item list-text">{{item.status_text}}</div>
            <div class="list-item list-use">
              <router-link tag="span" :to="{path: `order-detail/${item.order_id}?freeShipping=${status === 'c_freeShipping' ? '1' : '0'}`}" append class="list-operation">详情</router-link>
            </div>
          </div>
        </div>
      </div>

      <default-modal ref="downModal">
        <div slot="content" class="shade-box">
          <div class="title-box">
            <div class="title">
              提示
            </div>
            <span class="close hand" @click="closeDownModal"></span>
          </div>
          <div class="context">{{downloadUrl}}</div>
          <div class="btn-group">
            <span class="btn cancel" @click="download">下载</span>
            <span class="btn confirm" @click="exportExcel(1)">重新生成</span>
          </div>
        </div>
      </default-modal>

      <div class="pagination-box">
        <base-pagination ref="pagination" :pageDetail="pageDetail" :pagination="page" @addPage="setPage"></base-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import {DatePicker} from 'element-ui'
  import DefaultModal from '@components/default-modal/default-modal'
  import {authComputed, orderComputed, orderMethods} from '@state/helpers'
  import moment from 'moment'

  const PAGE_NAME = 'ORDER_LIST'
  const TITLE = '订单列表'
  const DATE_PLACE_HOLDER = '选择下单日期'
  const SEARCH_PLACE_HOLDER = '订单号/会员名称/会员手机'
  const EXCEL_URL = '/social-shopping/api/backend/order-excel'

  const LIST_TITLE = ['订单号', '会员名称', '订单总价', '实付金额', '社区名称', '订单状态', '操作']
  const ORDERSTATUS = [{text: '商城订单', status: 'c_shop'}, {text: '拓展订单', status: 'c_offline'}, {text: '全国包邮订单', status: 'c_freeShipping'}]
  const SOCIAL_SELECT = {check: false, show: false, content: '全部社区', type: 'default', data: []}

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DatePicker,
      DefaultModal
    },
    data() {
      return {
        tabStatus: ORDERSTATUS,
        listTitle: LIST_TITLE,
        searchPlaceHolder: SEARCH_PLACE_HOLDER,
        datePlaceHolder: DATE_PLACE_HOLDER,
        socialSelect: SOCIAL_SELECT,
        statusTab: [
          {status_str: '全部', status: 'all', statistic: 0},
          {status_str: '待付款', status: 'wait_submit', statistic: 0},
          {status_str: '待提货', status: 'success', statistic: 0},
          {status_str: '已完成', status: 'success', statistic: 0},
          {status_str: '已关闭', status: 'success', statistic: 0}
        ],
        downUrl: '',
        defaultStatus: 'c_shop',
        timer: '',
        downloadUrl: '',
        downTime: 1000
      }
    },
    computed: {
      ...authComputed,
      ...orderComputed,
      infoTabIndex() {
        return this.tabStatus.findIndex((item) => item.status === this.status)
      },
      orderExportUrl() {
        let currentId = this.getCurrentId()
        let data = {
          current_corp: currentId,
          current_shop: process.env.VUE_APP_CURRENT_SHOP,
          access_token: this.currentUser.access_token,
          status: this.orderStatus,
          source: this.status,
          shop_id: this.shopId,
          start_time: this.time[0] || '',
          end_time: this.time[1] || '',
          keyword: this.keyword,
          socialSelectList: []
        }
        // // source_type=2代表全国包邮
        if (this.status === 'c_freeShipping') {
          data.source_type = 2
          delete data.source
        }
        let search = []
        for (let key in data) {
          search.push(`${key}=${data[key]}`)
        }
        return process.env.VUE_APP_API + EXCEL_URL + '?' + search.join('&')
      },
      timeDatePicker: {
        get() {
          return this.time
        },
        set(val) {
          if (!val) {
            val = ['', '']
          }
          let time = val.map((item) => {
            return item ? moment(item).format('YYYY-MM-DD HH:mm:ss') : ''
          })
          this.changeTime(time)
          return time
        }
      }
    },
    created() {

      if (!this.shopId) {
        this.socialSelect.content = '全部社区'
      }
      this._getShopList()
      this.getOrderStatus()
    },
    beforeDestroy() {
      clearTimeout(this.timer)
      // this.setTime(['', ''])
    },
    methods: {
      ...orderMethods,
      changeTab(selectStatus, index) {
        // this.setDefaultIndex(index)
        this.setOrderStatus(selectStatus)
        this.getOrderStatus()
      },
      getOrderStatus(startTime, endTime) {
        let params = {
          source: this.status,
          start_time: this.startTime,
          end_time: this.endTime,
          shop_id: this.shopId,
          keyword: this.keyword
        }
        if (this.status === 'c_freeShipping') {
          // 全国包邮不传source，source_type=2代表全国包邮
          params.source_type = 2
          delete params.source
        }
        API.Order.getOrderStatus(params).then((res) => {
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
            return
          }
          this.statusTab = res.data
        })
      },
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
          this.socialSelectList = selectData
        })
      },
      exportExcel(num) {
        // window.open(this.orderExportUrl, '_blank')
        clearTimeout(this.timer)
        this.downTime = 1000
        this.closeDownModal()
        let data = {
          status: this.orderStatus,
          shop_id: this.shopId,
          start_time: this.time[0] || '',
          end_time: this.time[1] || '',
          keyword: this.keyword,
          is_rebuild: num
        }
        API.Order.exportOffLine(data)
          .then(res => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message, 2000)
              return
            }
            if (+res.data.status !== 3) {
              this.$toast.show(res.data.status_message, 2000)
              this.setRequestTimer(data)
            } else {
              this.downloadUrl = res.data.download_url
              this.$refs.downModal.showModal()
            }
          })
      },
      setRequestTimer(data) {
        let newData = JSON.parse(JSON.stringify(data))
        newData.is_rebuild = 0
        this.timer = setTimeout(() => {
          if (this.downTime < 5000) {
            this.downTime += 2000
          } else {
            this.downTime = this.downTime * 2
          }
          API.Order.exportOffLine(newData)
            .then(res => {
              if (res.error !== this.$ERR_OK) {
                this.$toast.show(res.message, 2000)
                clearTimeout(this.timer)
                this.downTime = 1000
                return
              }
              if (+res.status === 3) {
                clearTimeout(this.timer)
                this.downTime = 1000
                this.downloadUrl = res.data.download_url
                this.$refs.downModal.showModal()
              } else {
                this.setRequestTimer(data)
              }
            })
        }, this.downTime)
        console.log(this.downTime, 1)
      },
      download() {
        window.open(this.downlaodUrl)
        this.closeDownModal()
      },
      closeDownModal() {
        this.$refs.downModal.hideModal()
      },
      changeStatus(selectStatus) {
        this.setStatus(selectStatus)
        this.socialSelect.content = '全部社区'
        this.$refs.search._setText('')
        this.getOrderStatus()
        this.$refs.pagination.beginPage()
      },
      changeShopId(shop) {
        this.setShopId(shop)
        this.getOrderStatus()
        this.$refs.pagination.beginPage()
      },
      _searchShop(text) {
        if (text.length === 0) {
          this.socialSelect.data = this.socialSelectList
          return
        }
        let arr = []
        this.socialSelectList.forEach((item) =>{
          if (item.name.toLowerCase().includes(text.toLowerCase())) {
            arr.push(item)
          }
        })
        this.socialSelect.data = arr
      },
      changeTime(time) {
        this.setTime(time)
        let startTime = time[0]
        let endTime = time[1]
        this.getOrderStatus(startTime, endTime)
        this.$refs.pagination.beginPage()
      },
      changeKeyword(keyword) {
        this.setKeyword(keyword)
        this.getOrderStatus()
        this.$refs.pagination.beginPage()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "../../design/date-picker.css"

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
      border-radius: 2px
      font-family: $font-family-regular
      font-size: $font-size-12
      color: $color-white
      text-align: center

  .list-text-name
    no-wrap()
    font-family: $font-family-regular
    font-size: $font-size-14

  .list-box
    .list-item
      box-sizing: border-box
      flex: 0.7
      &:nth-child(1)
        flex: 1.2
      &:nth-child(5)
        flex: 1.5
      &:last-child
        padding: 0
        max-width: 28px

  //  弹窗
  .shade-box
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.60)
    border-radius: 2px
    background: $color-white
    width: 380px
    position: relative
    overflow-x: hidden
    overflow-y: auto
    flex-wrap: wrap
    padding: 0 20px 20px
    box-sizing: border-box
    .title-box
      display: flex
      box-sizing: border-box
      padding: 23px 0
      align-items: center
      justify-content: space-between
      .title
        font-size: $font-size-16
        font-family: $font-family-medium
        line-height: 1
        color: $color-text-main
      .close
        width: 12px
        height: @width
        icon-image('icon-close')
    .back
      border-top-1px($color-line)
      position: absolute
      left: 0
      right: 0
      bottom: 0
      background: $color-white
      justify-content: flex-end
      height: 70px

    .context
      padding: 20px
      text-align: center
      word-break: break-all
    .btn-group
      position: relative
      left: 0
      top: 0
      padding: 0
      margin-top: 20px

</style>
