<template>
  <div class="coupon-market table">
    <div class="down-content">
      <div v-for="(item, index) in topBtn" :key="index" class="down-main">
        <span class="down-title">{{item.name}}</span>
        <div class="down-item">
          <div v-for="(val, ind) in item.child" :key="ind" class="top-btn" @click="newMarket(val.value)">
            <img :src="require(`./${val.icon}@2x.png`)" alt="" class="icon" :class="'icon-'+val.value">
            <span class="text">{{val.name}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-marketing_list@2x.png" class="identification-icon">
          <p class="identification-name">营销列表</p>
          <base-status-tab :infoTabIndex="defaultIndex" :statusList="statusTab" @setStatus="changeStatus"></base-status-tab>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in marketTitle" :key="index" class="list-item" :style="{flex: item.flex}">{{item.name}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in marketList" :key="index" class="list-content list-box">
            <div v-for="(val, ind) in marketTitle" :key="ind" :style="{flex: val.flex}" class="list-item">
              <div v-if="+val.type === 1 || +val.type === 2" :style="{flex: val.flex}" class="item">
                {{item[val.value] || '---'}}
              </div>
              <div v-if="+val.type === 4" :style="{flex: val.flex}" class="item">
                {{item[val.value] || 0}}
              </div>
              <!--状态-->
              <div v-if="+val.type === 3" class="list-item-btn" @click="switchBtn(item, index)">
                <base-switch :status="statusHandle(item, index)" confirmText="开启" cancelText="关闭"></base-switch>
              </div>
              <div v-if="+val.type === 5" :style="{flex: val.flex}" class="list-operation-box item">
                <router-link v-if="item.type === 7" tag="span" :to="'marketing-statistics?id=' + item.id" append class="list-operation">统计</router-link>
                <router-link tag="span" :to="'new-market?id=' + item.id + '&index=' + (+item.type === 7 ? 4 : item.type -1)" append class="list-operation">查看</router-link>
                <span class="list-operation" @click="_deleteMarket(item)">删除</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pages" :pagination="requestData.page" :pageDetail="marketPageDetail" @addPage="addPage"></base-pagination>
      </div>
    </div>
    <default-confirm ref="confirm" @confirm="_sureConfirm"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import {marketComputed, marketMethods} from '@state/helpers'
  import API from '@api'

  const PAGE_NAME = 'COUPON_MARKET'
  const TITLE = '营销计划'
  const MARKET_TITLE = [
    {name: '营销名称', flex: 1.6, value: 'title', type: 1},
    {name: '类型', flex: 1, value: 'type_str', type: 2},
    {name: '领取数', flex: 1, value: 'take_count', type: 4},
    {name: '状态', flex: 1, value: 'status', type: 3},
    {name: '操作', flex: 1, value: '', type: 5}
  ]
  const TOP_BTN = [
    {
      name: '平台发放',
      child: [
        {
          name: '新客有礼',
          value: 0,
          icon: 'icon-new_courtesy'
        },
        {
          name: '复购有礼',
          value: 1,
          icon: 'icon-complex_courtesy'
        },
        {
          name: '唤醒流失客户',
          value: 2,
          icon: 'icon-awaken'
        },
        {
          name: '邀请有礼',
          value: 4,
          icon: 'icon-invite_courtesy'
        }
      ]
    },
    {
      name: '团长发放',
      child: [
        {
          name: '社群福利券',
          value: 3,
          icon: 'icon-group'
        }
      ]
    }
  ]
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
        marketTitle: MARKET_TITLE,
        topBtn: TOP_BTN,
        type: ['未知', '新客有礼', '复购有礼', '唤醒流失客户', '社群福利券'],
        iconArr: ['icon-new_courtesy', 'icon-complex_courtesy', 'icon-awaken'],
        iconArr2: ['icon-group'],
        statusTab: [
          {name: '全部', value: '', num: 0},
          {name: '开启', value: 1, num: 0},
          {name: '关闭', value: 0, num: 0}
        ],
        delId: 0,
        statusArr: new Array(10).fill(undefined)
      }
    },
    computed: {
      ...marketComputed
    },
    created() {
      this.getMarketStatus()
    },
    mounted() {},
    methods: {
      ...marketMethods,
      newMarket(index) {
        this.$router.push(`/home/coupon-market/new-market?index=${index}`)
      },
      changeStatus(selectStatus, index) {
        this.$refs.pages.beginPage()
        this.defaultIndex({status: selectStatus.status, index})
        this.statusArr = new Array(10).fill(undefined)
      },
      getMarketStatus() {
        API.Market.getMarketStatus().then((res) => {
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
            return
          }
          this.statusTab = res.data.map((item, index) => {
            return {
              name: item.status_str,
              status: item.status,
              num: item.statistic
            }
          })
        })
      },
      statusHandle(item, index) {
        let status = 0
        if (typeof this.statusArr[index] === 'number') {
          status = this.statusArr[index]
        } else {
          status = item.status
        }
        return status
      },
      switchBtn(item, index) {
        let status = 1
        if (typeof this.statusArr[index] === 'number') {
          status = +this.statusArr[index] === 0 ? 1 : 0
        } else {
          status = item.status ? 0 : 1
        }
        let data = {
          status: status,
          id: item.id
        }
        API.Market.switchMarket(data).then((res) => {
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
            return
          }
          this.statusArr = this.statusArr.map((item, ind) => {
            if (index === ind) {
              item = status
            }
            return item
          })
          // this.getMarketList({page: this.page, status: this.status})
          this.getMarketStatus()
        })
      },
      addPage(page) {
        this.setRequestData({page})
      },
      _deleteMarket(item) {
        this.delId = item.id
        this.$refs.confirm.show(`删除${item.title || ''}营销计划`)
      },
      async _sureConfirm() {
        let res = await API.Market.deleteMarket(this.delId)
        if (res.error !== this.$ERR_OK) {
          this.$toast.show(res.message)
          return
        }
        this.$toast.show('删除成功')
        this.getMarketStatus()
        if (+this.marketPageDetail.total%10 === 1 && +this.requestData.page === +this.marketPageDetail.total_page) {
          this.setRequestData({page: this.marketPageDetail.total_page - 1})
        } else {
          this.getMarketList()
        }
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
  .btn-main
    margin-right: 10px
  .list-item
    font-size: $font-size-14
    .item
      text-overflow: ellipsis
      overflow: hidden
      white-space: nowrap
      font-size: 14px
  .down-content
    height: 170px
    .down-main
      &:first-child
        .top-btn:nth-child(2)
          margin-right: 22px
      &:last-child
        .top-btn:first-child
          width: 84px
          margin-left: -14px
    .down-title
      font-size: $font-size-16
      line-height: 1
      color: $color-text-main
      font-family: $font-family-regular
    .down-item
      margin-top: 22px
      .top-btn
        width: 84px
        height: 84px
        text-align: center
        margin-right: 36px
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
        &:first-child
          width: 60px
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
