<template>
  <div class="dispatching-list" @click="_hideAllDownBox">
    <div class="tab-header">
      <base-drop-down :select="dispatchSelect" @setValue="_getShop"></base-drop-down>
      <div class="line"></div>
      <!--<base-search placeHolder="社区名称/团长名称" @search="_search"></base-search>-->
    </div>
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
        <div class="list-item list-operation-box">
          <router-link tag="span" :to="'dispatching-detail?id='+item.id" append class="list-operation">
            详情
          </router-link>
          <span class="list-operation select-type-box" @click.stop="_selectFileType(index)">
            导出
            <transition name="fade">
              <ul v-if="item.select" class="select-type" @click.stop="">
                <li v-for="(type, idx) in typeList" :key="idx" class="select-item" @click="_hideSelectType(index,type, idx)">
                  <a class="select-item-text" target="_blank" :href="item['url'+ idx] + item.id + excelParams">{{type}}</a>
                </li>
              </ul>
            </transition>
          </span>
        </div>
      </div>
    </div>
    <div class="pagination-box">
      <base-pagination ref="pages" :pageDetail="pageTotal" @addPage="_addPage"></base-pagination>
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
        excelParams: ''
      }
    },
    computed: {
      ...leaderComputed
    },
    async created() {
      let token = this.$storage.get('auth.currentUser', '')
      this.excelParams = token
        ? `?access_token=${token.access_token}&current_corp=${process.env.VUE_APP_CURRENT_CORP}`
        : ''
      await this._getdropdownList()
    },
    methods: {
      ...leaderMethods,
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
        this.getDeliveryOrder({page: this.page, shopId: this.status, loading: false})
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
        this.getDeliveryOrder({page: this.page, shopId: this.status, loading: false})
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

  .list-header
    height: 50px
    font-size: $font-size-16
    font-family: $font-family-regular
    color: $color-text-main
    background: $color-list-header

  .list-box
    line-height: 1
    padding-left: 30px
    box-sizing: border-box
    border-bottom: 1px solid $color-line
    display: flex
    align-items: center
    .list-item
      box-sizing: border-box
      padding-right: 10px
      flex: 1
      &:last-child
        flex: 0.6

  .list
    flex: 1
    .list-content
      font-family: $font-family-regular
      color: $color-text-main
      height: 70px
      border-bottom: 1px solid $color-line
      .list-item
        no-wrap()
        font-size: $font-size-14
      .list-operation-box
        overflow: visible
      // 双行样式
      .list-double-row
        .item-sub
          margin-top: 8px
          font-size: $font-size-14
          color: $color-text-assist
        .item-dark
          font-size: $font-size-14

  .pagination-box
    height: 70px
    align-items: center
    display: flex

  .select-type-box
    position: relative
    overflow: visible
    .select-type
      top: 19px
      z-index: 10
      right: 0
      background: $color-white
      box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.20)
      border-radius: 4px
      position: absolute
      &.fade-enter, &.fade-leave-to
        opacity: 0
      &.fade-enter-to, &.fade-leave-to
        transition: opacity .3s ease-in-out
      .select-item
        width: 140px
        line-height: 42px
        height: 42px
        border-bottom: 1px solid $color-line
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
        .select-item-active
          color: $color-sub

</style>
