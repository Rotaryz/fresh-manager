<template>
  <div class="dispatching-list table" @click="_hideAllDownBox">
    <div class="down-content">
      <span class="down-tip">配送单筛选</span>
      <div class="down-item">
        <base-drop-down :select="dispatchSelect" @setValue="_getShop"></base-drop-down>
      </div>
      <span class="down-tip">筛选</span>
      <div class="down-item">
        <base-date-select placeHolder="选择配送日期" @getTime="_selectTime"></base-date-select>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-bandit_list@2x.png" class="identification-icon">
          <p class="identification-name">团长配送单</p>
        </div>
        <div class="function-btn">
          <div class="btn-main" @click="deliveryExcel">导出配送单</div>
          <div class="btn-main g-btn-item" @click="orderExcel">导出消费者清单</div>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in dispatTitle" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in deliveryOrder" :key="index" class="list-content list-box">
            <div class="list-item list-double-row">
              <p class="item-dark">{{item.order_sn}}</p>
              <p class="item-sub">{{item.created_at}}</p>
            </div>
            <div class="list-item">{{item.social_name}}</div>
            <div class="list-item">{{item.name}}</div>
            <div class="list-item">{{item.total}}</div>
            <div class="list-item">{{item.delivery_at}}</div>
            <div class="list-operation-box">
              <router-link tag="span" :to="'dispatching-detail?id='+item.id" append class="list-operation">
                详情
              </router-link>
              <div class="list-operation select-type-box" @click.stop="_selectFileType(index)">
                导出
                <transition name="fade">
                  <ul v-if="item.select" class="select-type" @click.stop="">
                    <li v-for="(type, idx) in typeList" :key="idx" class="select-item" @click="_hideSelectType(index,type, idx)">
                      <a class="select-item-text" target="_blank" :href="item['url'+ idx] + item.id + excelParams">{{type}}</a>
                    </li>
                  </ul>
                </transition>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pages" :pageDetail="pageTotal" @addPage="_addPage"></base-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {leaderComputed, leaderMethods} from '@state/helpers'
  import API from '@api'
  import _ from 'lodash'

  const PAGE_NAME = 'DISPATCHING_LIST'
  const TITLE = '团长配送单'
  const DISPATCHING_LIST = ['配送单号', '社区名称', '团长名称', '配送金额', '配送日期', '操作']
  const TYPE_LIST = ['团长配送订单', '消费者订单']
  const DOWNLOAD_ORDER_EXCEL = '/social-shopping/api/backend/user-order-exports'
  const DELIVERY_ORDER_EXCEL = '/social-shopping/api/backend/store-delivery-exports'

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        typeList: TYPE_LIST,
        dispatTitle: DISPATCHING_LIST,
        dispatchSelect: {
          check: false,
          show: false,
          content: '全部社区',
          type: 'default',
          data: [] // 格式：{title: '55'}
        },
        page: 1,
        orderSn: '',
        status: '',
        excelParams: '',
        startTime: '',
        endTime: ''
      }
    },
    computed: {
      ...leaderComputed
    },
    async created() {
      let currentId = this.getCurrentId()
      let token = this.$storage.get('auth.currentUser', '')
      this.excelParams = token ? `?access_token=${token.access_token}&current_corp=${currentId}` : ''
      await this._getdropdownList()
    },
    methods: {
      ...leaderMethods,
      orderExcel() {
        window.open(this._getUrl(DOWNLOAD_ORDER_EXCEL))
      },
      deliveryExcel() {
        window.open(this._getUrl(DELIVERY_ORDER_EXCEL))
      },
      _selectTime(value) {
        this.$refs.pages.beginPage()
        this.page = 1
        this.startTime = value[0]
        this.endTime = value[1]
        this.getDeliveryOrder({page: this.page, shopId: this.status, startTime: this.startTime, endTime: this.endTime, loading: false})
      },
      _getUrl(url) {
        let currentId = this.getCurrentId()
        let token = this.$storage.get('auth.currentUser', '')
        let data = {
          current_corp: currentId,
          current_shop: process.env.VUE_APP_CURRENT_SHOP,
          access_token: token.access_token,
          start_time: this.startTime || '',
          end_time: this.endTime || '',
          shop_id: this.status,
          order_sn: ''
        }
        let search = []
        for (let key in data) {
          search.push(`${key}=${data[key]}`)
        }
        return process.env.VUE_APP_API + url + '?' + search.join('&')
      },
      _hideAllDownBox() {
        let arr = _.cloneDeep(this.deliveryOrder)
        arr = arr.map((item) => {
          item.select = false
          return item
        })
        this.setDeliveryOrder(arr)
      },
      async _getdropdownList() {
        let res = await API.Leader.shopDropdownList()
        if (res.error !== this.$ERR_OK) {
          return
        }
        this.dispatchSelect.data = res.data.map((item) => {
          item.name = item.social_name
          return item
        })
        this.dispatchSelect.data.unshift({name: '全部社区', id: ''})
        this.$forceUpdate()
      },
      _getShop(item) {
        this.$refs.pages.beginPage()
        this.page = 1
        this.status = item.id
        this.getDeliveryOrder({page: this.page, shopId: this.status, startTime: this.startTime, endTime: this.endTime, loading: false})
      },
      _selectFileType(index) {
        let arr = _.cloneDeep(this.deliveryOrder)
        arr = arr.map((item, itemIdx) => {
          if (itemIdx === index) {
            item.select = !item.select
          } else {
            item.select = false
          }
          return item
        })
        this.setDeliveryOrder(arr)
      },
      _hideSelectType(index, item, idx) {
        let arr = _.cloneDeep(this.deliveryOrder)
        arr[index].select = false
        this.setDeliveryOrder(arr)
      },
      _addPage(page) {
        this.page = page
        this.getDeliveryOrder({page: this.page, shopId: this.status, startTime: this.startTime, endTime: this.endTime, loading: false})
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .dispatching-list
    overflow: hidden
    flex: 1
    display: flex
    flex-direction: column

  .line
    width: 10px

  .tab-header
    height: 80px
    display: flex
    align-items: center
    box-sizing: border-box

  .list-box
    .list-item
      &:nth-child(1)
        flex :1.4
        min-width: 208px
      &:nth-child(2)
        flex :1.4
      &:last-child
        flex: 0.6
        max-width: 76px
        padding: 0

  .pagination-box
    height: 60px
    align-items: center
    display: flex

  .select-type-box
    position: relative
    overflow: visible
    .select-type
      top: 19px
      z-index: 1000
      right: 0
      background: $color-white
      box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.20)
      border-radius: 2px
      position: absolute
      &.fade-enter, &.fade-leave-to
        opacity: 0
      &.fade-enter-to, &.fade-leave-to
        transition: opacity .3s ease-in-out
      .select-item
        width: 140px
        line-height: 42px
        height: 42px
        border-bottom: 0.5px solid $color-line
        box-sizing: border-box
        text-indent: 11px
        transition: all 0.3s
        &:last-child
          border: none
        .select-item-text
          font-size: $font-size-14
          font-family: $font-family-regular
          color: $color-text-main
          transition: all 0.3s
          &:hover
            color: $color-main
        .select-item-active
          color: $color-sub

</style>
