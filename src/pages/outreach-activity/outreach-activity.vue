<template>
  <div class="rush-purchase table">
    <div class="down-content">
      <span class="down-tip">活动时间</span>
      <div class="down-item">
        <base-date-select placeHolder="选择活动时间" @getTime="_setTime"></base-date-select>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-customer_list@2x.png" class="identification-icon">
          <p class="identification-name">拓展活动</p>
        </div>
        <div class="function-btn">
          <router-link tag="div" to="edit-outreach" append class="btn-main">新建活动<span class="add-icon"></span></router-link>
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
                {{(val.value === 'pay_num' || val.value === 'pay_amount') ? (item[val.value] || '0') : (item[val.value] || '---')}}
              </div>
              <div v-if="+val.type === 2" :style="{flex: val.flex}" class="list-double-row item">
                <p class="item-dark">{{item.start_at}}</p>
                <p class="item-sub">{{item.end_at}}</p>
              </div>

              <!--状态-->
              <div v-if="+val.type === 3" :style="{flex: val.flex}" class="item">{{item.status === 0 ? '未开始' : item.status === 1 ? '进行中' : item.status === 2 ? '已结束' : ''}}</div>
              <!--二维码-->
              <div v-if="+val.type === 4" :style="{flex: val.flex}" class="code-box">
                <div class="code-main" @mouseenter="showCode(index)" @mouseleave="hideCode">
                  <img src="./icon-qr@2x.png" class="small-code">
                  <transition name="fade">
                    <div v-if="codeShow === index" class="code-content">
                      <img :src="item.qrcode_url" alt="" class="code">
                      <a class="text" :src="qrUrl + `/social-shopping/api/backend/activity-manage/qrcode-download?qrcode_url=${item.qrcode_url}`" target="_blank">下载</a>
                    </div>
                  </transition>
                </div>
              </div>

              <div v-if="+val.type === 5" :style="{flex: val.flex}" class="list-operation-box item">
                <router-link tag="span" :to="'/home/outreach-activity/edit-outreach?id=' + (item.id || 0)" class="list-operation">查看</router-link>
                <span class="list-operation" @click="_deleteActivity(item.id)">删除</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pages" :pageDetail="outreachPage" @addPage="addPage"></base-pagination>
      </div>
    </div>
    <default-confirm ref="confirm" @confirm="_sureConfirm"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import {outreachComputed, outreachMethods} from '@state/helpers'
  import API from '@api'

  const PAGE_NAME = 'OUTREACH_ACTIVITY'
  const TITLE = '拓展活动'
  const ACTIVITI_TITLE = [
    {name: '活动名称', flex: 1.4, value: 'activity_name', type: 1},
    {name: '活动时间', flex: 1.2, value: 'start_at', type: 2},
    {name: '社区', flex: 1.4, value: 'social_name', type: 1},
    {name: '成交订单', flex: 1, value: 'pay_num', type: 1},
    {name: '交易金额', flex: 1, value: 'pay_amount', type: 1},
    {name: '复购率', flex: 1, value: 'repeat_rate', type: 1},
    {name: '状态', flex: 1, value: 'status', type: 3},
    {name: '二维码', flex: 1, value: '', type: 4},
    {name: '操作', flex: 1, value: '', type: 5},
  ]
  // const OUTREACH_LIST = [
  //   {activity_name: '名称', start_at: '2019-03-01', end_at: '2019-03-05', group: '白云花园社区', sale_count: 20, total: 100, order_count: '30', status: 1}
  // ]
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
        activityTitle: ACTIVITI_TITLE,
        startTime: '',
        endTime: '',
        page: 1,
        delId: 0,
        downId: 0,
        status: 0,
        codeShow: '',
        timer: '',
        qrUrl: process.env.VUE_APP_API
      }
    },
    computed: {
      ...outreachComputed
    },
    mounted() {
    },
    methods: {
      ...outreachMethods,
      async _setTime(arr) {
        this.$refs.pages.beginPage()
        this.page = 1
        this.startTime = arr[0]
        this.endTime = arr[1]
        await this.getOutreachList({page: this.page, startTime: this.startTime, endTime: this.endTime})
      },
      download() {
        console.log('download')
      },
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
        this.getOutreachList({page: this.page, startTime: this.startTime, endTime: this.endTime})
      },
      _deleteActivity(id) {
        this.delId = id
        this.$refs.confirm.show('确定删除该活动？')
      },
      async _sureConfirm() {
        let res = await API.Outreach.deleteActivity(this.delId)
        this.$toast.show(res.message)
        if (res.error !== this.$ERR_OK) {
          return
        }
        this.getOutreachList({page: this.page, startTime: this.startTime, endTime: this.endTime})
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

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
        top: -88px
        width: 160px
        height: 200px
        border-radius: 1px
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
  .btn-main
    margin-right: 10px
</style>
