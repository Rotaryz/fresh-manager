<template>
  <div class="rush-purchase table">
    <div class="down-content">
      <span class="down-tip">活动时间</span>
      <div class="down-item">
        <base-date-select :dateInfo="[requestData.start_at, requestData.end_at]" placeHolder="选择活动时间" @getTime="_setTime"></base-date-select>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-task@2x.png" class="identification-icon">
          <p class="identification-name">拓展任务</p>
          <base-status-tab :infoTabIndex="defaultIndex" :statusList="statusTab" @setStatus="changeStatus"></base-status-tab>
        </div>
        <div class="function-btn">
          <router-link tag="div" to="edit-outreach" append class="btn-main">新建任务<span class="add-icon"></span></router-link>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in activityTitle" :key="index" class="list-item" :style="{flex: item.flex}">{{item.name}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in outreachList" :key="index" class="list-content list-box">
            <div v-for="(val, ind) in activityTitle" :key="ind" :style="{flex: val.flex}" class="list-item" :class="{'list-about':val.type === 4}">
              <div v-if="+val.type === 1" :style="{flex: val.flex}" class="item">
                {{val.value === 'pay_amount' ? '¥' : ''}}{{(val.value === 'pay_num' || val.value === 'pay_amount' || val.value === 'repurchase_num') ? (item[val.value] || '0') : (item[val.value] || '---')}}
              </div>
              <div v-if="+val.type === 2" :style="{flex: val.flex}" class="list-double-row item">
                <p class="item-dark">{{item.start_at}}</p>
                <p class="item-sub-time">{{item.end_at}}</p>
              </div>
              <div v-if="+val.type === 6" :style="{flex: val.flex}" class="list-item-double">
                {{(val.value === 'pay_num' || val.value === 'pay_amount') ? (item[val.value] || '0') : (item[val.value] || '---')}}
              </div>
              <!--状态-->
              <div v-if="+val.type === 3" :style="{flex: val.flex}" class="item">{{item.status === 0 ? '未开始' : item.status === 1 ? '进行中' : item.status === 2 ? '已结束' : ''}}</div>
              <!--复购率-->
              <div v-if="+val.type === 4" :style="{flex: val.flex}" class="tip-box hand">
                <div class="tip-main" @mouseenter="showTip(index)" @mouseleave="hideTip">
                  <span>{{item[val.value] || '0%'}}</span>
                  <img v-if="+(item.rise && item.rise.split('%')[0]) > 0" :src="require('./'+ iconArr[0] +'@2x.png')" alt="" class="tip-icon">
                  <img v-if="+(item.rise && item.rise.split('%')[0]) < 0" :src="require('./'+ iconArr[1] +'@2x.png')" alt="" class="tip-icon down">
                  <img v-if="+(item.rise && item.rise.split('%')[0]) === 0" :src="require('./'+ iconArr[2] +'@2x.png')" alt="" class="tip-icon equal">
                  <transition name="fade">
                    <div v-if="tipShow === index" class="tip-content">
                      <span class="text">第{{item.days}}天复购,比昨天{{item.rise && _textHandle(item.rise)}}{{item.rise.split('-').length > 1 ? item.rise.split('-')[1] : item.rise}}</span>
                      <img v-if="+(item.rise && item.rise.split('%')[0]) > 0" :src="require('./'+ iconArr[0] +'@2x.png')" alt="" class="tip-icon">
                      <img v-if="+(item.rise && item.rise.split('%')[0]) < 0" :src="require('./'+ iconArr[1] +'@2x.png')" alt="" class="tip-icon down">
                      <img v-if="+(item.rise && item.rise.split('%')[0]) === 0" :src="require('./'+ iconArr[2] +'@2x.png')" alt="" class="tip-icon equal">
                    </div>
                  </transition>
                </div>
              </div>

              <div v-if="+val.type === 5" :style="{flex: val.flex}" class="list-operation-box item">
                <router-link tag="span" :to="'/home/outreach-activity/edit-outreach?id=' + (item.id || 0)" class="list-operation">详情</router-link>
                <router-link tag="span" :to="'/home/outreach-activity/outreach-activity-staff?id=' + (item.id || 0)" class="list-operation">成员</router-link>
                <span class="list-operation" @click="_deleteActivity(item.id)">删除</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pages" :pagination="requestData.page" :pageDetail="outreachPage" @addPage="addPage"></base-pagination>
      </div>
    </div>
    <default-confirm ref="confirm" @confirm="_sureConfirm"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import {outreachComputed, outreachMethods} from '@state/helpers'
  import {getCorpId} from '@utils/tool'
  import API from '@api'

  const PAGE_NAME = 'OUTREACH_ACTIVITY'
  const TITLE = '拓展任务'
  const ACTIVITI_TITLE = [
    {name: '拓展任务', flex: 1.3, value: 'activity_name', type: 6},
    {name: '拓展社区', flex: 1.3, value: 'social_name', type: 6},
    {name: '拓展时间', flex: 1.3, value: 'start_at', type: 2},
    {name: '订单', flex: 1, value: 'pay_num', type: 1},
    {name: '交易金额', flex: 1, value: 'pay_amount', type: 1},
    {name: '复购数', flex: 1, value: 'repurchase_num', type: 1},
    {name: '复购率(15天)', flex: 1, value: 'repeat_rate', type: 4},
    {name: '状态', flex: 1, value: 'status', type: 3},
    // {name: '二维码', flex: 1, value: '', type: 4},
    {name: '操作', flex: 1.4, value: '', type: 5}
  ]
  // const OUTREACH_LIST = [
  //   {activity_name: '名称', start_at: '2019-03-01', end_at: '2019-03-05', group: '白云花园社区', sale_count: 20, total: 100, order_count: '30', status: 1}
  // ]
  const ICON = ['icon-rising', 'icon-up_hover', 'icon-flat']
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
        statusTab: [
          {name: '全部', value: '', key: 'all', num: 0},
          {name: '未开始', value: 1, key: 'wait_submit', num: 0},
          {name: '进行中', value: 1, key: 'success', num: 0},
          {name: '已结束', value: 1, key: 'success', num: 0}
        ],
        activityTitle: ACTIVITI_TITLE,
        delId: 0,
        downId: 0,
        status: '',
        tipShow: '',
        timer: '',
        qrUrl: process.env.VUE_APP_API,
        corpId: '',
        iconArr: ICON
      }
    },
    computed: {
      ...outreachComputed
    },
    created() {
      this.corpId = getCorpId()
      this.getOutreachStatus()
    },
    mounted() {},
    methods: {
      ...outreachMethods,
      async _setTime(arr) {
        this.$refs.pages.beginPage()
        this.setRequestData({page: 1, start_at: arr[0], end_at: arr[1]})
        this.getOutreachStatus()
      },
      async changeStatus(selectStatus, index) {
        this.$refs.pages.beginPage()
        this.setDefaultIndex({status: selectStatus.status, index})
      },
      getOutreachStatus() {
        API.Outreach.getOutreachStatus({
          activity_theme: 'offline',
          start_at: this.requestData.start_at,
          end_at: this.requestData.end_at
        }).then((res) => {
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
      showTip(index) {
        clearTimeout(this.timer)
        this.tipShow = index
      },
      hideTip() {
        this.timer = setTimeout(() => {
          this.tipShow = ''
        }, 500)
      },
      addPage(page) {
        this.setRequestData({page})
      },
      _deleteActivity(id) {
        this.delId = id
        this.$refs.confirm.show('确定删除该活动？')
      },
      async _sureConfirm() {
        let res = await API.Outreach.deleteActivity(this.delId)

        if (res.error !== this.$ERR_OK) {
          this.$toast.show(res.message)
          return
        } else {
          this.$toast.show('删除成功')
        }
        if (+this.outreachPage.total % 10 === 1 && +this.requestData.page === +this.outreachPage.total_page) {
          this.setRequestData({page: this.outreachPage.total_page - 1})
        } else {
          this.getOutreachList()
        }
        this.getOutreachStatus()
      },
      _textHandle(num) {
        return +num.split('%')[0] < 0 ? '下降' : '上升'
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .identification .identification-icon
    width: 12px
    height: 12px
  .list
    flex: 1
    .list-item
      font-size: $font-size-14
      .item
        text-overflow: ellipsis
        overflow: hidden
        white-space: nowrap
        font-size: 14px
      .tip-box
        display: flex
        align-items: center
        .tip-main
          position: relative
          margin-left: -15px
          padding-left: 15px
          height: 16px
          display: flex
          align-items: center
          .tip-icon
            width: 8px
            height: 10px
            margin-left: 5px
          .down
            transform: rotate(180deg)
          .equal
            width: 8px
            height: 2px
      .tip-content
        position: absolute
        right: -192px
        top: -8px
        width: 198px
        height: 32px
        border-radius: 4px
        padding-left: 10px
        box-shadow: 0 0 8px 0 #E9ECEE
        border: 1px solid #E9ECEE
        background: rgba(50,50,50,0.8)
        z-index: 1
        display: flex
        align-items: center
        &:before
          content: ""
          width: 9px
          height: 10px
          border: 5px solid rgba(50,50,50,0.8)
          border-top: 4px solid transparent
          border-bottom: 5px solid transparent
          border-left: 4px solid transparent
          col-center()
          left: -9px
        .text
          font-size: $font-size-12
          color: #FFF
          font-family: $font-family-regular
          line-height: 32px
          height: 32px
        .tip-icon
          width: 8px
          height: 10px
          margin-left: 5px
        .down
          transform: rotate(180deg)
        .equal
          width: 8px
          height: 2px
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
