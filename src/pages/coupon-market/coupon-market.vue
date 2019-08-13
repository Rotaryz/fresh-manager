<template>
  <div class="coupon-market table">
    <base-tab-select :infoTabIndex="defaultTab" :tabStatus="topBtn" @getStatusTab="tabChange"></base-tab-select>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-coupon_list@2x.png" class="identification-icon">
          <p class="identification-name">营销计划列表</p>
          <base-status-tab :statusList="statusTab" :infoTabIndex="statusIndex" @setStatus="changeStatus"></base-status-tab>
        </div>
        <div class="function-btn" @click="newMarket(defaultTab)">
          <div class="btn-main" style="margin-right:0">新建计划<span class="add-icon"></span></div>
        </div>
      </div>
      <article class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in marketTitle" :key="index" class="list-item" :style="{flex: item.flex}">{{item.name}}</div>
        </div>
        <div v-if="marketList.length" class="list">
          <div v-for="(item, index) in marketList" :key="index" class="list-content list-box">
            <div v-for="(val, ind) in marketTitle" :key="ind" :style="{flex: val.flex}" class="list-item" :class="{'list-about':val.type === 2}">
              <div v-if="+val.type === 1" :style="{flex: val.flex}" class="item">
                {{item[val.value] || '---'}}
              </div>
              <div v-if="+val.type === 2" :style="{flex: val.flex}" class="item hand">
                <span class="context">{{couponHandle(item.common_coupons[0]) || '---'}}</span>
                <div v-if="item.common_coupons.length > 1" class="show-tip" @mouseenter="showTip(index)" @mouseleave="hideTip">
                  <em class="icon"></em>
                  <transition name="fade">
                    <div v-if="tipShow === index" class="tip-content">
                      <span v-for="(coupon, i) in item.common_coupons" :key="i" class="text">{{couponHandle(coupon)}}</span>
                    </div>
                  </transition>
                </div>

              </div>
              <div v-if="+val.type === 4" :style="{flex: val.flex}" class="list-double-row item">
                <p v-if="item.start_at" class="item-dark">{{item.start_at}}</p>
                <p v-if="item.start_at" class="item-dark">{{item.end_at}}</p>
                <p v-else class="item-dark">---</p>
              </div>
              <div v-if="+val.type === 5" :style="{flex: val.flex}" class="list-operation-box item">
                <router-link v-if="item.type === 7" tag="span" :to="'marketing-statistics?id=' + item.id" append class="list-operation">统计</router-link>
                <router-link v-if="+item.status === 1 || +item.status === 0" tag="span" :to="'new-market?editId=' + item.id + '&index='+defaultTab" append class="list-operation">编辑</router-link>
                <router-link v-if="+item.status === 2" tag="span" :to="'new-market?id=' + item.id + '&index='+defaultTab" append class="list-operation">查看</router-link>
                <span v-if="+item.status === 1 || +item.status === 0" class="list-operation" @click="_stopMarket(item)">停止</span>
                <span v-if="+item.status === 2" class="list-operation" @click="_deleteMarket(item)">删除</span>
              </div>
            </div>
          </div>
        </div>
        <base-blank v-else blackStyle="margin-top:15%"></base-blank>
      </article>
      <div class="pagination-box">
        <base-pagination ref="pages" :pagination="requestData.page" :pageDetail="marketPageDetail" @addPage="addPage"></base-pagination>
      </div>
    </div>
    <market-confirm ref="confirm" @confirm="_sureConfirm"></market-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import MarketConfirm from './market-confirm/market-confirm'
  // import MarketTabs from './market-tabs/market-tabs'
  import {marketComputed, marketMethods} from '@state/helpers'
  import API from '@api'

  const PAGE_NAME = 'COUPON_MARKET'
  const TITLE = '营销计划'
  const MARKET_TITLE = [
    {name: '活动时间', flex: 1.4, value: 'time', type: 4},
    {name: '营销名称', flex: 1.1, value: 'title', type: 1},
    {name: '优惠券', flex: 1.5, value: 'coupons_str', type: 2},
    {name: '状态', flex: 1, value: 'status_str', type: 1},
    {name: '操作', flex: 1, value: '', type: 5}
  ]

  const TOP_BTN = [
    {
      text: '新客有礼',
      icon: 'icon-new_courtesy',
      type: 1
    },
    {
      text: '复购有礼',
      icon: 'icon-complex_courtesy',
      type: 2
    },
    {
      text: '召回有礼',
      icon: 'icon-recall_courtesy',
      type: 3
    },
    {
      text: '定向营销',
      icon: 'icon-directional_courtesy',
      type: 9
    },
    {
      text: '邀请有礼',
      icon: 'icon-invitation_courtesy',
      type: 7
    },
    {
      text: '社群营销',
      icon: 'icon-community_courtesy',
      type: 4
    }
  ]
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      MarketConfirm,
      // MarketTabs
    },
    data() {
      return {
        statusTab: [
          {name: '全部', value: '', num: 0},
          {name: '进行中', value: 1, num: 0},
          {name: '未开始', value: 1, num: 0},
          {name: '已结束', value: 1, num: 0}
        ],
        marketTitle: MARKET_TITLE,
        topBtn: TOP_BTN,
        type: ['未知', '新客有礼', '复购有礼', '唤醒流失客户', '社群福利券'],
        iconArr: ['icon-new_courtesy', 'icon-complex_courtesy', 'icon-awaken'],
        iconArr2: ['icon-group'],
        // statusTab: [
        //   {name: '全部', value: '', num: 0},
        //   {name: '开启', value: 1, num: 0},
        //   {name: '关闭', value: 0, num: 0}
        // ],
        curentItem: {},
        // statusArr: new Array(10).fill(undefined),
        currentItem: {},
        toastType: '',
        tipShow: '',
        timer: ''
      }
    },
    computed: {
      ...marketComputed
    },
    watch: {
      marketList() {
        // todo
        console.log('markList')
        this._getStatus()
      }
    },
    created() {
      // this.getMarketStatus()
    },
    mounted() {},
    methods: {
      ...marketMethods,
      newMarket(index) {
        this.$router.push(`/home/coupon-market/new-market?index=${index}`)
      },
      // 切换状态栏 todo
      changeStatus(selectStatus, index) {
        console.log(selectStatus, index, 'status')
        this['SET_STATUS_INDEX'](index)
        this.$refs.pages.beginPage()
        this._getStatus()
        // this.setDefaultIndex({status: selectStatus.status, index})
        // this.statusArr = new Array(10).fill(undefined)
      },
      // todo
      _getStatus() {

      },
      // getMarketStatus() {
      //   API.Market.getMarketStatus().then((res) => {
      //     if (res.error !== this.$ERR_OK) {
      //       this.$toast.show(res.message)
      //       return
      //     }
      //     this.statusTab = res.data.map((item, index) => {
      //       return {
      //         name: item.status_str,
      //         status: item.status,
      //         num: item.statistic
      //       }
      //     })
      //   })
      // },
      // statusHandle(item, index) {
      //   let status = 0
      //   if (typeof this.statusArr[index] === 'number') {
      //     status = this.statusArr[index]
      //   } else {
      //     status = item.status
      //   }
      //   return status
      // },
      // 顶部tab切换
      tabChange(item, index) {
        this.$refs.pages.beginPage()
        this.setDefaultTab(index)
        this.setRequestData({page: 1, type: item.type})
      },
      // switchBtn(item, index) {
      //   let status = 1
      //   if (typeof this.statusArr[index] === 'number') {
      //     status = +this.statusArr[index] === 0 ? 1 : 0
      //   } else {
      //     status = item.status ? 0 : 1
      //   }
      //   let data = {
      //     status: status,
      //     id: item.id
      //   }
      //   API.Market.switchMarket(data).then((res) => {
      //     if (res.error !== this.$ERR_OK) {
      //       this.$toast.show(res.message)
      //       return
      //     }
      //     this.statusArr = this.statusArr.map((item, ind) => {
      //       if (index === ind) {
      //         item = status
      //       }
      //       return item
      //     })
      //     // this.getMarketList({page: this.page, status: this.status})
      //     // this.getMarketStatus()
      //   })
      // },
      addPage(page) {
        this.setRequestData({page})
      },
      showTip(index) {
        clearTimeout(this.timer)
        this.tipShow = index
      },
      hideTip() {
        this.timer = setTimeout(() => {
          this.tipShow = ''
        }, 300)
      },
      _stopMarket(item) {
        this.currentItem = item
        this.toastType = 'stop'
        this.$refs.confirm.show(`停止“${item.title || ''}”营销计划无法再发放优惠券，确定停止吗？`)
      },
      _deleteMarket(item) {
        this.curentItem = item
        this.toastType = 'del'
        this.$refs.confirm.show(`确定删除“${item.title || ''}”营销计划？`)
      },
      async _sureConfirm() {
        if (this.toastType === 'del') {
          let res = await API.Market.deleteMarket(this.curentItem.id)
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
            return
          }
          this.$toast.show('删除成功')
          // this.getMarketStatus()
          if (+this.marketPageDetail.total%10 === 1 && +this.requestData.page === +this.marketPageDetail.total_page) {
            this.setRequestData({page: this.marketPageDetail.total_page - 1})
          } else {
            this.getMarketList()
          }
        } else {
          API.Market.stopMarket(this.currentItem.id)
            .then(res => {
              if (res.error !== this.$ERR_OK) {
                this.$toast.show(res.message)
                return
              }
              this.$toast.show('停止成功')
              this.getMarketList()
              // this.getMarketStatus()
            })
        }
      },
      couponHandle(coupon) {
        if (coupon.tag_type === 2) {
          return `【${coupon.coupon_name}】${coupon.condition_str}`
        }
        let lastText = ''
        if (+coupon.tag_type === 1) {
          lastText = '使用'
        } else {
          lastText = +coupon.preferential_type === 1 ? coupon.denomination+'折' : '减'+coupon.denomination+'元'
        }
        return `【${coupon.coupon_name}】${coupon.condition > 0 ? '满'+coupon.condition+'元' : '无门槛'}${lastText}`
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .list-box
    .list-item
      font-size: $font-size-14
      &:last-child
        padding-right: 0
        max-width: 120px
      .item
        text-overflow: ellipsis
        overflow: hidden
        white-space: nowrap
        font-size: 14px

  .list .list-box
    >.list-about
      overflow: inherit
      .item
        overflow: inherit
        display: flex
        align-items: center
  .btn-main
    margin-right: 10px
  .list-item
    font-size: $font-size-14
    .item
      text-overflow: ellipsis
      overflow: hidden
      white-space: nowrap
      font-size: 14px
      .context
        margin-right: 5px
        white-space: pre-wrap
        word-break: break-all
      .show-tip
        width: 25px
        height: 40px
        display: flex
        align-items: center
        position: relative
        .icon
          position: relative
          width: 14px
          height: 14px
          margin-left: 5px
          display: block
          border-radius: 50%
          background: url("./icon-more_list.png")
          background-size: 100% 100%
    .tip-content
      position: absolute
      left: 31px
      bottom: 6px
      border-radius: 4px
      padding: 0 5px
      box-shadow: 0 0 8px 0 #E9ECEE
      border: 1px solid #E9ECEE
      background: rgba(50,50,50,0.8)
      z-index: 10
      &:before
        content: ""
        width: 9px
        height: 10px
        border: 5px solid rgba(50,50,50,0.8)
        border-top: 4px solid transparent
        border-bottom: 5px solid transparent
        border-left: 4px solid transparent
        position: absolute
        bottom: 7px
        left: -9px
      .text
        font-size: $font-size-12
        color: #FFF
        font-family: $font-family-regular
        line-height: 24px
        height: 24px
        display: block
  .down-content
    height: 138px
    .down-title
      font-size: $font-size-16
      line-height: 1
      color: $color-text-main
      font-family: $font-family-regular
    .down-item
      .top-btn
        width: 60px
        height: 84px
        text-align: center
        margin-right: 50px
        overflow: hidden
        color: $color-text-main
        font-size: $font-size-14
        font-family: $font-family-regular
        cursor: pointer
        .icon
          width: 56px
          height: 56px
          margin: 0 auto
          border-radius: 4px
          display: block
          transition: all 0.3s
        .text
          margin-top: 10px
          display: block
          transition: all 0.3s
        &:hover
          .icon
            opacity: 0.9
          .icon-0
            box-shadow: 0 2px 8px 0 rgba(159, 213, 198, 0.40)
          .icon-1
            box-shadow: 0 2px 8px 0 rgba(159, 170, 213, 0.40)
          .icon-2
            box-shadow: 0 2px 8px 0 rgba(199, 159, 213, 0.40)
          .icon-3
            box-shadow: 0 2px 8px 0 rgba(159, 170, 213, 0.40)
          .text
            text-decoration: underline

</style>
