<template>
  <div class="procurement-task table">
    <div class="down-content">
      <!--时间选择-->
      <span class="down-tip">建单时间</span>
      <div class="down-item">
        <base-date-select placeHolder="请选择建单时间" :dateInfo="dateInfo" @getTime="changeStartTime"></base-date-select>
      </div>
      <span class="down-tip">异常状态</span>
      <div class="down-item">
        <base-drop-down :select="errorObj" @setValue="checkErr"></base-drop-down>
      </div>
      <span class="down-tip">入库类型</span>
      <div class="down-item">
        <base-drop-down :select="enterType" @setValue="changeType"></base-drop-down>
      </div>
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search placeHolder="入库单号、采购单号或商品提供方" :width="277" :infoText="enterFilter.keyword" @search="changeKeyword"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-warehousing@2x.png" class="identification-icon">
          <p class="identification-name">入库列表</p>
          <base-status-tab :statusList="dispatchSelect" :infoTabIndex="statusTab" @setStatus="setValue"></base-status-tab>
        </div>
        <router-link tag="a" append to="new-enter-document" class="btn-main">新建入库单</router-link>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-if="enterList.length">
            <div v-for="(item, index) in enterList" :key="index" class="list-content list-box">
              <div class="list-item">{{item.build_time}}</div>
              <div class="list-item">{{item.order_sn}}</div>
              <div class="list-item">{{item.supplier}}</div>
              <router-link tag="a" target="_blank" :to="{path: `purchase-order/purchase-order-detail/${item.source_order_id}`}" class="list-item list-operation">{{item.out_order_sn}}</router-link>
              <div class="list-item">￥{{item.total}}</div>
              <div class="list-item">
                <span class="list-status" :class="{'list-status-success': item.status === 1}"></span>{{item.status_str}}
                <div v-if="item.is_exception" class="list-item-img"></div>
              </div>
              <div class="list-item">{{item.type || '---'}}</div>
              <div class="list-item list-operation-box">
                <router-link v-if="item.status === 1" tag="span" :to="{path: `enter-detail/${item.entry_order_id}`}" append class="list-operation">详情</router-link>
                <div class="list-operation" @click="entryOrdersExport(item)">导出</div>
                <router-link v-if="item.status === 0 || item.status === 2 || item.status === 3" tag="span" :to="{path: `enter-detail/${item.entry_order_id}`}" append class="list-operation-strong">入库</router-link>
                <!--<div v-if="item.status === 1" class="list-operation" @click="difference(item)">导出</div>-->
              </div>
            </div>
          </div>
          <base-blank v-else></base-blank>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination" :pagination="enterFilter.page" :pageDetail="statePageTotal" @addPage="addPage"></base-pagination>
      </div>
      <default-confirm ref="confirm" @confirm="sendAllocationStock"></default-confirm>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import _ from 'lodash'
  import API from '@api'
  import {productComputed, authComputed, productMethods} from '@state/helpers'
  import DefaultConfirm from '@components/default-confirm/default-confirm'

  const PAGE_NAME = 'PROCUREMENT_TASK'
  const TITLE = '成品入库'
  const COMMODITIES_LIST = ['建单时间', '入库单号', '商品提供方', '采购单号', '入库金额', '状态', '入库类型', '操作']
  const ENTRY_ORDERS_EXPORT = '/scm/api/backend/warehouse/entry-orders-export/'
  const DISS_EXPORT = '/scm/api/backend/warehouse/entry-orders-diff-export/'
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultConfirm
    },
    data() {
      return {
        commodities: COMMODITIES_LIST,
        productEnterList: [],
        pageTotal: {},
        status: 0,
        startTime: this.$route.query.start_time || '',
        endTime: this.$route.query.end_time || '',
        exceptionStatus: this.$route.query.exception_status || '',
        keyWord: '',
        goodsPage: 1,
        dispatchSelect: [
          {name: '全部', value: '', key: 'all', num: 0},
          {name: '待进库', value: 0, key: 'wait_submit', num: 0},
          {name: '待理货', value: 1, key: 'success', num: 0},
          {name: '待上架', value: 1, key: 'success', num: 0},
          {name: '已完成', value: 1, key: 'success', num: 0}
        ],
        statistic: {
          all: 0,
          wait_submit: 0,
          success: 0
        },
        accurateStart: '',
        accurateEnd: '',
        statusTab: 1,
        time: [this.$route.query.start_time || '', this.$route.query.end_time || '',],
        errorObj: {
          check: false,
          show: false,
          content: '全部',
          type: 'default',
          data: [{name: '全部', status: ''}, {name: '正常', status: '0'}, {name: '异常', status: '1'}] // 格式：{name: '55'}
        },
        enterType: {
          check: false,
          show: false,
          content: '全部',
          type: 'default',
          data: [{name: '全部', status: ''}, {name: '人工补录', status: '0'}, {name: '系统补货', status: '1'}, {name: '系统销售', status: '2'}] // 格式：{name: '55'}
        }
      }
    },
    computed: {
      ...productComputed,
      ...authComputed,
      dateInfo() {
        return [this.enterFilter.start_time, this.enterFilter.end_time]
      }
    },
    async created() {
      this._setErrorStatus()
      await this._statistic()
      this.statusTab = this.dispatchSelect.findIndex((item) => item.status === this.enterFilter.status)
    },
    methods: {
      ...productMethods,
      async checkErr(item) {
        this._updateList({exception_status: item.status, page: 1})
      },
      changeType(item) {
        console.log(item.status)
      },
      _setErrorStatus() {
        let item = this.errorObj.data.find((item) => item.status === this.enterFilter.exception_status)
        this.errorObj.content = item.name || '全部'
      },
      // 完成单日收货
      // async allocationStock() {
      //   if (this.productEnterList.length) {
      //     this.$refs.confirm.show('有入库单还未完成入库，是否确认完成收货')
      //     return
      //   }
      //   await this.sendAllocationStock()
      // },
      async sendAllocationStock() {
        let res = await API.Store.stopAllocationStock()
        this.$toast.show(res.message, 600)
        if (res.error === this.$ERR_OK) {
          setTimeout(() => {
            this.$router.push('/home/product-out')
          }, 800)
        }
      },
      _setDownUrl(item, excelUrl) {
        let currentId = this.getCurrentId()
        let data = {
          current_corp: currentId,
          current_shop: process.env.VUE_APP_CURRENT_SHOP,
          access_token: this.currentUser.access_token
        }
        let search = []
        for (let key in data) {
          search.push(`${key}=${data[key]}`)
        }
        let url = process.env.VUE_APP_SCM_API + excelUrl + item.id + '?' + search.join('&')
        window.open(url)
      },
      // 导出入库单通知
      entryOrdersExport(item) {
        this._setDownUrl(item, ENTRY_ORDERS_EXPORT)
      },
      // 导出差异化报告
      difference(item) {
        this._setDownUrl(item, DISS_EXPORT)
      },
      async _statistic() {
        let res = await API.Store.entryOrdersStatistic({
          start_time: this.enterFilter.start_time,
          end_time: this.enterFilter.end_time,
          keyword: this.enterFilter.keyword,
          exception_status: this.enterFilter.exception_status
        })
        if (res.error === this.$ERR_OK) {
          this.dispatchSelect = res.data.status.map((item) => {
            item.name = item.status_str
            item.num = item.statistic
            item.value = item.status
            return item
          })
        }
      },
      getProductListData() {
        let data = {
          status: this.status,
          page: this.goodsPage,
          limit: 10,
          start_time: this.time[0],
          end_time: this.time[1],
          keyword: this.keyWord,
          exception_status: this.exceptionStatus
        }
        API.Store.getEnterList(data, false).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.productEnterList = res.data
            let statePageTotal = {
              total: res.meta.total,
              per_page: res.meta.per_page,
              total_page: res.meta.last_page
            }
            this.pageTotal = statePageTotal
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      _updateList(params, noUpdataStatus) {
        this.SET_ENTER_PARAMS(params)
        this.getEnterData({loading: false})
        if (!noUpdataStatus) {
          this._statistic()
        }
        if (params.page === 1) {
          this.$refs.pagination.beginPage()
        }
      },
      async changeKeyword(keyword) {
        this._updateList({keyword, page: 1})
      },
      async changeStartTime(value) {
        this._updateList({start_time: value[0], end_time: value[1], page: 1})
      },
      async setValue(item) {
        this._updateList({status: item.value, page: 1})
      },
      addPage(page) {
        this._updateList({page}, true)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .procurement-task
    .list-box
      .list-item
        padding-right: 14px
        &:last-child
          max-width: 120px
        &:nth-child(8), &:nth-child(1)
          flex: 1.5
        &:nth-child(4), &:nth-child(2)
          flex: 1.7
  .list-item-progress
    display: flex
    align-items: flex-end
    .progress-content
      .progress-num
        font-size: $font-size-10
        color: $color-text-main
        line-height: 1
        margin-bottom: 5px
        font-family: $font-family-regular
      .progress-bar
        margin: 0
        width: 100px
        height: 5px
        border-radius: 3px
        background: #EBEBEB
        position: relative
        .progress-bar-active
          height: 100%
          position: absolute
          top: 0
          left: 0
          border-radius: 3px
          background: $color-main
          width: 50%
    .progress-percentage
      margin-left: 8px
      line-height: 1
      font-size: $font-size-14

  .tip
    margin: 0 2px
    font-size: $font-size-14

  .list-item-img
    icon-image('icon-unusual_list')
    width: 16px
    height: 15px
    margin-top: 2px
    margin-left: 1px
    background-size: 16px 15px
</style>
