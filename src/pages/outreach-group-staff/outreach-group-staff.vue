<template>
  <div class="outreach-activity-staff table">
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-personage@2x.png" class="identification-icon">
          <p class="identification-name">陈先生的线下拓展任务详情</p>
        </div>
        <div class="top-data">
          <div v-for="(item, index) in topItem" :key="index" class="top-item">
            <img class="img" :src="require('./'+ item.icon +'@2x.png')" alt="">
            <span class="name">{{item.name}}</span>
            <span class="num">{{item.icon === 'icon-deal' ? '¥' : ''}}{{item.value}}</span>
          </div>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in activityTitle" :key="index" class="list-item" :style="{flex: item.flex}">{{item.name}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in outreachList" :key="index" class="list-content list-box">
            <div v-for="(val, ind) in activityTitle" :key="ind" :style="{flex: val.flex}" class="list-item" :class="{'list-about': val.type === 2}">
              <div v-if="+val.type === 1" :style="{flex: val.flex}" class="item">
                {{val.value === 'pay_amount' ? '¥' : ''}}{{(val.value === 'pay_num' || val.value === 'pay_amount') ? (item[val.value] || '0') : (item[val.value] || '---')}}
              </div>

              <div v-if="+val.type === 2" :style="{flex: val.flex}" class="list-double-row item">
                <p class="item-dark">{{item.start_at}}</p>
                <p class="item-sub-time">{{item.end_at}}</p>
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
    {name: '拓展任务', flex: 1.2, value: 'activity_name', type: 1},
    {name: '拓展时间', flex: 1.2, value: 'start_at', type: 2},
    {name: '拓展社区', flex: 1.2, value: 'social_name', type: 1},
    {name: '订单', flex: 1.2, value: 'start_at', type: 1},
    {name: '交易额(元)', flex: 1.2, value: 'pay_num', type: 1},
    {name: '复购率(15天)', flex: 1, value: 'repeat_rate', type: 1}
  ]
  const TOP_ITEM = [
    {name: '订单', icon: 'icon-order', value: '900'},
    {name: '交易额', icon: 'icon-deal', value: '100'},
    {name: '复购率', icon: 'icon-repeat', value: '10%'}
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
    padding: 22px 20px 26px
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
</style>
