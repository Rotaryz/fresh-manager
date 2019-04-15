<template>
  <div class="outreach-activity-staff table">
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-team@2x.png" class="identification-icon">
          <p class="identification-name">{{memberData.social_name}}线下拓展团队</p>
        </div>
        <div class="top-data">
          <div v-for="(item, index) in topItem" :key="index" class="top-item">
            <img class="img" :src="require('./'+ item.icon +'@2x.png')" alt="">
            <span class="name">{{item.name}}</span>
            <span class="num">{{item.icon === 'icon-deal' ? '¥' : ''}}{{memberData[item.value]}}</span>
          </div>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in activityTitle" :key="index" class="list-item" :style="{flex: item.flex}">{{item.name}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in memberList" :key="index" class="list-content list-box">
            <div v-for="(val, ind) in activityTitle" :key="ind" :style="{flex: val.flex}" class="list-item" :class="{'list-about': val.type === 2}">
              <div v-if="+val.type === 1" :style="{flex: val.flex}" class="item">
                {{val.value === 'pay_amount' ? '¥' : ''}}{{(val.value === 'pay_num' || val.value === 'pay_amount') ? (item[val.value] || '0') : (item[val.value] || '---')}}
              </div>

              <!--二维码-->
              <div v-if="+val.type === 2" :style="{flex: val.flex}" class="code-box">
                <div class="code-main" @mouseenter="showCode(index)" @mouseleave="hideCode">
                  <img src="./icon-qr@2x.png" class="small-code">
                  <transition name="fade">
                    <div v-if="codeShow === index" class="code-content">
                      <img :src="item.qrcode_url + '?imageView2/format/jpg'" alt="" class="code">
                    </div>
                  </transition>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pages" :pageDetail="outreachPage" @addPage="addPage"></base-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {outreachComputed, outreachMethods} from '@state/helpers'

  const PAGE_NAME = 'OUTREACH_ACTIVITY_STAFF'
  const TITLE = '拓展活动-团队成员'

  const ACTIVITI_TITLE = [
    {name: '姓名', flex: 1.2, value: 'member_name', type: 1},
    {name: '手机号', flex: 1.2, value: 'member_mobile', type: 1},
    {name: '订单', flex: 1.2, value: 'pay_num', type: 1},
    {name: '交易额(元)', flex: 1, value: 'pay_amount', type: 1},
    {name: '复购率(15天)', flex: 1, value: 'repeat_rate', type: 1},
    {name: '二维码', flex: 1, value: 'qrcode_url', type: 2}
  ]
  const TOP_ITEM = [
    {name: '订单', icon: 'icon-order', value: 'order_counts'},
    {name: '交易额', icon: 'icon-deal', value: 'total_sum'},
    {name: '复购率', icon: 'icon-repeat', value: 'repurchase_rate'}
  ]
  const ICON = ['icon-rising', 'icon-up_hover', 'icon-flat']
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
    },
    data() {
      return {
        activityTitle: ACTIVITI_TITLE,
        iconArr: ICON,
        topItem: TOP_ITEM,
        page: 1,
        status: 0,
        codeShow: '',
        qrUrl: process.env.VUE_APP_API
      }
    },
    computed: {
      ...outreachComputed
    },
    methods: {
      ...outreachMethods,
      showCode(index) {
        clearTimeout(this.timer)
        this.codeShow = index
      },
      hideCode() {
        this.timer = setTimeout(() => {
          this.codeShow = ''
        }, 500)
      },
      addPage(page) {
        this.page = page
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .identification
    height: 106px
    padding: 22px 0 26px
    display: block
    .top-data
      margin-top: 24px
      display: flex
      align-items: center
    .top-item
      display: flex
      align-items: center
    .img
      height: 12px
      object-fit: cover
    .name
      font-size: $font-size-12
      font-family: $font-family-regular
      color: $color-text-main
      margin-left: 5px
      line-height: 14px
    .num
      font-size: $font-size-16
      color: #FF8282
      line-height: 16px
      font-family: $font-family-din-bold
      margin-left: 8px
      margin-right: 88px

  .list
    flex: 1
    .list-item
      font-size: $font-size-14
      .item
        text-overflow: ellipsis
        overflow: hidden
        white-space: nowrap
        font-size: 14px
      .code-box
        position: relative
        display: flex
        align-items: center
        .code-main
          margin-left: -15px
          padding-left: 15px
          height: 16px
      .small-code
        width: 16px
        height: 16px
        object-fit: cover
        cursor: pointer
      .code-bg
        padding-right: 10px
      .code-content
        position: absolute
        left: -170px
        top: -68px
        width: 160px
        height: 160px
        border-radius: 2px
        overflow: hidden
        box-shadow: 0 0 8px 0 #E9ECEE
        border: 1px solid #E9ECEE
        background: #FFF
        z-index: 1
        .code
          width: 120px
          height: 120px
          margin: 20px auto
          display: block
        .text
          font-size: $font-size-16
          color: #4DBD65
          font-family: $font-family-regular
          text-align: center
          line-height: 40px
          height: 40px
          background: #F5F7FA
          display: block
          border-top: 1px solid #E9ECEE
          cursor: pointer
    .list-content .list-about
      overflow: inherit


  .list-box
    .list-item
      box-sizing: border-box
      flex: 1
      &:last-child
        padding: 0
        max-width: 122px
</style>
