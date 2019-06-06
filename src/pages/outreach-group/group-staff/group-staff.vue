<template>
  <div class="group-staff">
    <div class="identification">
      <div class="identification-page">
        <div class="center">
          <img src="./icon-personage@2x.png" class="identification-icon">
          <p class="identification-name">{{taskData.member_name}}的线下拓展任务详情</p>
        </div>
        <!--<div class="btn-main" @click="exportExcel">导出</div>-->
      </div>
      <div class="top-data">
        <div v-for="(item, index) in topItem" :key="index" class="top-item">
          <img class="img" :src="require('./'+ item.icon +'@2x.png')" alt="">
          <span class="name">{{item.name}}</span>
          <span class="num">{{item.icon === 'icon-deal' ? '¥' : ''}}{{taskData[item.value]}}</span>
        </div>
      </div>
    </div>
    <div class="big-list">
      <div class="list-header list-box">
        <div v-for="(item,index) in activityTitle" :key="index" class="list-item" :style="{flex: item.flex}">{{item.name}}</div>
      </div>
      <div class="list">
        <div v-for="(item, index) in taskDetail" :key="index" class="list-content list-box">
          <div v-for="(val, ind) in activityTitle" :key="ind" :style="{flex: val.flex}" class="list-item" :class="{'list-about': val.type === 2}">
            <div v-if="+val.type === 1" :style="{flex: val.flex}" class="item">
              {{val.value === 'pay_amount' ? '¥' : ''}}{{(val.value === 'pay_num' || val.value === 'pay_amount' || val.value === 'repurchase_num') ? (item[val.value] || '0') : (item[val.value] || '---')}}
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
      <base-pagination ref="pages" :pageDetail="taskPage" @addPage="addPage"></base-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {outreachGroupDetailComputed, outreachGroupMethods, outreachGroupDetailMethods} from '@state/helpers'

  const COMPONENT_NAME = 'GROUP_STAFF'
  const TOP_ITEM = [
    {name: '订单', icon: 'icon-order', value: 'order_counts'},
    {name: '交易额', icon: 'icon-deal', value: 'total_sum'},
    {name: '复购率', icon: 'icon-repeat', value: 'repurchase_rate'}
  ]
  const ICON = ['icon-rising', 'icon-up_hover', 'icon-flat']
  const ACTIVITI_TITLE = [
    {name: '拓展任务', flex: 1.2, value: 'activity_name', type: 1},
    {name: '拓展时间', flex: 1.2, value: 'start_at', type: 2},
    {name: '拓展社区', flex: 1.2, value: 'social_name', type: 1},
    {name: '订单', flex: 1, value: 'pay_num', type: 1},
    {name: '交易额(元)', flex: 1, value: 'pay_amount', type: 1},
    {name: '复购数', flex: 1, value: 'repurchase_num', type: 1},
    {name: '复购率(15天)', flex: 1, value: 'repeat_rate', type: 1}
  ]
  export default {
    name: COMPONENT_NAME,
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
      ...outreachGroupDetailComputed,
      exportUrl() {
        let currentId = this.getCurrentId()
        let token = this.$storage.get('auth.currentUser', '')
        let data = {
          current_corp: currentId,
          current_shop: process.env.VUE_APP_CURRENT_SHOP,
          access_token: token.access_token,
          page: this.page
        }
        let search = []
        for (let key in data) {
          search.push(`${key}=${data[key]}`)
        }
        return (
          process.env.VUE_APP_API +
          '/social-shopping/api/backend/activity-manage/member-activity-excel/' +
          this.staffId +
          '?' +
          search.join('&')
        )
      }
    },
    created() {},
    beforeDestroy() {
      this.setContent(true)
    },
    methods: {
      ...outreachGroupDetailMethods,
      ...outreachGroupMethods,
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
        this.getTaskDetail({page, id: this.staffId})
      },
      exportExcel() {
        window.open(this.exportUrl, '_blank')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .group-staff
    flex: 1
    padding :0 19px
    layout(column,block,nowrap)
  .identification
    height: 106px
    padding: 20px 0 26px
    display: block
    .identification-page
      justify-content: space-between
      .center
        display: flex
        align-items: center
    .top-data
      margin-top: 22px
      display: flex
      align-items: center
    .top-item
      display: flex
      align-items: center
    .img
      height: 14px
      object-fit: cover
    .name
      font-size: $font-size-14
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
  .list-item .item
    text-overflow: ellipsis
    overflow: hidden
    white-space: nowrap
</style>
