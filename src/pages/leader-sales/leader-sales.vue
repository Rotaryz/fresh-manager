<template>
  <div class="leader-sales table">
    <article class="data-content">
      <section class="down-content">
        <div class="distribution-down">
          <span class="down-tip">搜索</span>
          <div class="down-item">
            <base-search placeHolder="请输入团长名称" @search="handleSearch"></base-search>
          </div>
        </div>
      </section>
      <section class="table-content">
        <div class="identification">
          <div class="identification-page">
            <img src="./icon-bandit_list@2x.png" class="identification-icon">
            <p class="identification-name">团长邀请排行榜<span class="sub-title">(合计成功邀请 {{10}} 位团长)</span> </p>
          </div>
          <div class="switch-wrapper" @click="handleSwitchChange">
            <base-switch :status="status" confirmText="开启" cancelText="关闭"></base-switch>
          </div>
          <p class="leader-status" :class="{active: status}">团长奖励比例：{{number > 0 ? number + '%' : '未设置'}}</p>
        </div>
        <div class="big-list">
          <div class="list-header list-box">
            <div v-for="(item,index) in tabTitle" :key="index" class="list-item" :style="{flex: item.flex}">{{item.name}}</div>
          </div>
          <div v-if="dataArray.length" class="list">
            <div v-for="(item, index) in dataArray" :key="index" class="list-content list-box">
              <div v-for="(val, ind) in tabTitle" :key="ind" :style="{flex: val.flex}" class="list-item">
                <div v-if="+val.type === 1 || +val.type === 3" :style="{flex: val.flex}" class="item">
                  {{+val.type === 3 ? '¥' : ''}}{{item[val.value] || '0'}}
                </div>
                <div v-if="+val.type === 2" :style="{flex: val.flex}" class="item">
                  <span class="list-operation">{{item[val.value] || ''}}</span>
                </div>
                <div v-if="+val.type === 5" :style="{flex: val.flex}" class="list-operation-box item">
                  <span class="list-operation" @click="handleAccount(item)">佣金结算</span>
                  <span class="list-operation" @click="handleLog">结算记录</span>
                </div>
                <div v-if="+val.type === 6" :style="{flex: val.flex}" class="item">
                  {{item[val.value] || '0'}}个/{{item[val.value2] || '0'}}元
                </div>
              </div>
            </div>
          </div>
          <base-blank v-else blackStyle="padding-top:15%"></base-blank>
        </div>
        <div class="pagination-box">
          <base-pagination ref="pages" :pageDetail="pageInfo" @addPage="addPage"></base-pagination>
        </div>
      </section>
      <default-modal ref="modalSwitch">
        <div slot="content" class="default-panel leader-switch">
          <header class="header">
            <p>开启设置</p>
            <img class="close" src="./icon-close@2x.png" alt="" @click="hideModal('modalSwitch')">
          </header>
          <section class="input-wrapper">
            <p class="key">团长奖励比例</p>
            <div class="edit-input-box">
              <input v-model="number" type="text" placeholder="" class="edit-input">
            </div>
            <p>%</p>
          </section>
          <dl class="explain-wrapper">
            <dt>开启后团长邀请其他用户注册为团长将获得以下福利：</dt>
            <dd>福利一：团长审核通过获得50元现金券</dd>
            <dd>福利二：被邀请的团长用户下单后团长(邀请者)可获得对应的订单分销提成</dd>
          </dl>
          <div class="btn-group">
            <span class="btn cancel" @click="handleSwitchModalCancel">取消</span>
            <span class="btn confirm" @click="handleSwitchModalConfirm">确认</span>
          </div>
        </div>
      </default-modal>
      <default-modal ref="modalAccount">
        <div slot="content" class="default-panel account">
          <header class="header">
            <p>佣金结算</p>
            <img class="close" src="./icon-close@2x.png" alt="" @click="hideModal('modalAccount')">
          </header>
          <div class="account-container">
            <p class="title">请选择结算佣金时间：</p>
            <section class="date-wrapper">
              <base-date-select
                dataPickerType="date"
                :disabled="true"
                :value="new Date()"
              ></base-date-select>
              <span class="separator">至</span>
              <base-date-select
                dataPickerType="date"
                :dateInfo="null"
                :disabledDate="dateOption"
                @getTime="getTime"
              ></base-date-select>
            </section>
            <p class="result">结算金额：50*3+1050*3%=1200.00元</p>
          </div>
          <div class="btn-group">
            <span class="btn cancel" @click="hideModal('modalAccount')">取消</span>
            <span class="btn confirm" @click="handleAccountConfirm">确认</span>
          </div>
        </div>
      </default-modal>
      <default-modal ref="modalLogs">
        <div slot="content" class="default-panel logs">
          <header class="header">
            <p>结算记录</p>
            <img class="close" src="./icon-close@2x.png" alt="" @click="hideModal('modalLogs')">
          </header>
          <div class="logs-container table">
            <div class="big-list">
              <div class="list-header list-box">
                <div v-for="(item,index) in logTile" :key="index" class="list-item" :style="{flex: item.flex}">{{item.name}}</div>
              </div>
              <div v-if="logArray.length" class="list">
                <div v-for="(item, index) in logArray" :key="index" class="list-content list-box">
                  <div v-for="(val, ind) in logTile" :key="ind" :style="{flex: val.flex}" class="list-item">
                    <div v-if="+val.type === 1 || +val.type === 3" :style="{flex: val.flex}" class="item">
                      {{+val.type === 3 ? '¥' : ''}}{{item[val.value] || '0'}}
                    </div>
                    <div v-if="+val.type === 6" :style="{flex: val.flex}" class="item">
                      {{item[val.value] || '0'}}至{{item[val.value2] || '0'}}
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="logArray.length < 1" style="height: 354px"></div>
              <base-blank v-if="logArray.length < 1" blackStyle="padding-top:3%"></base-blank>
            </div>
            <div class="pagination-box">
              <base-pagination ref="pages" :pageDetail="logPageInfo" @addPage="addPageLogs"></base-pagination>
            </div>
          </div>
          <div height="10px"></div>
        </div>
      </default-modal>
    </article>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import DefaultModal from '@components/default-modal/default-modal'

  const PAGE_NAME = 'LEADER_SALES'
  const TITLE = '团长分销'

  const TAB_TITLE = [
    {name: '社区名称', flex: 1.5, value: 'activity_name', type: 2},
    {name: '团长名称', flex: 1.5, value: 'activity_name', type: 2},
    {name: '邀请团长用户数/奖励', flex: 1.5, value: 'groupon_success_num', type: 6, value2: 'groupon_imitate_success_num'},
    {name: '分销佣金', flex: 1, value: 'groupon_all_people_num', type: 3},
    {name: '待结算佣金', flex: 1, value: 'groupon_all_people_num', type: 3},
    {name: '已结算佣金', flex: 1.5, value: 'groupon_all_people_num', type: 3},
    {name: '操作', flex: 1.6, value: '', type: 5}
  ]

  const LOG_TITLE = [
    {name: '结算时间', flex: 1.5, value: 'activity_name', type: 1},
    {name: '结算佣金时间段', flex: 1.5, value: 'groupon_imitate_success_num', type: 6, value2: 'groupon_imitate_success_num'},
    {name: '奖励比例', flex: 1.5, value: 'groupon_success_num', type: 1},
    {name: '结算金额', flex: 1.5, value: 'groupon_all_people_num', type: 1},
  ]
  export default {
    name: PAGE_NAME,
    components: {
      DefaultModal,
    },
    page: {
      title: TITLE
    },
    data() {
      const params = this.$route.meta.params
      return {
        tabTitle: TAB_TITLE,
        logTile: LOG_TITLE,
        logPage: 1,
        page: 1,
        dataArray: params.dataInfo,
        pageInfo: params.pageInfo,
        logPageInfo: {
          total: 0,
          per_page: 1,
          total_page: 1
        },
        status: 0,
        number: '',
        currentNumber: '',
        dateOption: {
          disabledDate(date) {
            // 自定义日期必须小于今天
            return date.valueOf() > Date.now() - 1000 * 60 * 60 * 24 || date.valueOf() < Date.now() - 1000 * 60 * 60 * 24 * 7
          }
        },
        logArray: []
      }
    },
    computed: {
    },
    created() {
      this.$loading.hide()
    },
    mounted() {
      // this.$refs.modal && this.$refs.modal.showModal()
    },
    methods: {
      getTime(time) {
        console.log(time)
      },
      cancel() {

      },
      showModal(key) {
        this.$refs[key] && this.$refs[key].showModal()
      },
      hideModal(key) {
        this.$refs[key] && this.$refs[key].hideModal()
      },
      handleSwitchModalConfirm() {
        this.status = this.status === 1 ? 0 : 1
        this.hideModal('modalSwitch')
      },
      handleSwitchModalCancel() {
        this.number = this.currentNumber
        this.hideModal('modalSwitch')
      },
      handleSwitchChange() {
        if (this.status === 1) {
          this.status = this.status === 1 ? 0 : 1
        } else {
          this.currentNumber = this.number
          this.showModal('modalSwitch')
        }
      },
      handleSearch() {

      },
      handleAccount() {
        this.showModal('modalAccount')
      },
      handleAccountConfirm() {
        this.hideModal('modalAccount')
      },
      handleLog() {
        this.showModal('modalLogs')
      },
      _deleteActivity() {

      },
      async _getList() {
        try {
          const res = await API.Activity.getActiveList({
            page: this.page,
            activity_theme: 'fixed',
          })
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
            return
          }
          this.dataArray = res.data
          this.pageInfo = {
            total: res.meta.total,
            per_page: res.meta.per_page,
            total_page: res.meta.last_page
          }
        } catch (e) {
          console.warn(e)
        }
      },
      addPage(page) {
        this.page = page
        this._getList()
      },
      addPageLogs(page) {
        this.logPage = page
        // todo
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .leader-sales
    width: 100%

  // 弹窗
  .default-panel
    background: #fff
    border-radius: 3px
    box-shadow: 0 8px 14px 0 rgba(12, 6, 14, 0.08)
    text-align: center
    padding: 0 20px
    box-sizing: border-box
    position: relative
    &.leader-switch
      width :534px
      height :298px
    &.account
      width :534px
      height :262px
    &.logs
      width :1000px
      height :536px
    .header
      display :flex
      font-family: $font-family-medium
      font-size: 16px;
      color: #333333;
      padding-top :20px
      justify-content :space-between
      align-items :center
      .close
        extend-click()
        width :8px
        height :@width
        cursor :pointer
    // 佣金记录
    .logs-container
      position :relative
      height :476
      padding-top :20px
      text-align :left
    // 佣金结算
    .account-container
      font-family: $font-family-regular
      font-size: 14px;
      color: #333333;
      line-height :1
      .result
        text-align :left
        padding-top :30px
      .title
        text-align :left
        padding-top :20px
        padding-bottom :14px
      .date-wrapper
        display :flex
        align-items :center
        .separator
          padding :0 10px

  // 佣金设置
    .input-wrapper
      padding-top :30px
      display :flex
      align-items :center
      font-family: $font-family-regular
      font-size: 14px;
      color: #151515;
      .key
        position :relative
        &:before
          content: '*'
          col-center()
          left :-6px
          font-size: 14px;
          color: #F52424;
      .edit-input-box
        margin: 0 10px 0 20px
        .edit-input
          font-size: $font-size-12
          border-radius: 2px
          padding: 0 14px
          width: 114px
          height: 40px
          display: flex
          align-items: center
          justify-content: space-between
          font-family: $font-family-regular
          color: $color-text-main
          border: 1px solid $color-line
          transition: all 0.3s
          &:hover
            border-color: #ACACAC
          &:focus
            border-color: $color-main
    .explain-wrapper
      font-family: $font-family-regular
      font-size: 14px;
      color: #666666;
      text-align :left
      line-height :1
      dt
        padding-top :24px
        padding-bottom :16px
      dd
        padding-bottom :10px



  .distribution-down
    display: flex
    align-items: center

  .data-content
    flex: 1
    display: flex
    flex-direction: column
  .identification
    .leader-status
      font-family: $font-family-regular
      font-size: 14px;
      color: #ACACAC
      padding-left :10px
      &.active
        color: #333333;
    .switch-wrapper
      flex: 1
      display :flex
      justify-content :flex-end
    .sub-title
      padding :0 5px
      font-size: 14px;
      color: #333333;
  .big-list
    background :#FFFFFF
  .list-box
    .list-item:last-child
      max-width: 150px
      padding-right: 0
  .list
    flex: 1
    .list-item
      font-size: $font-size-14
      &:last-child
        max-width: 150px
        padding-right: 0
      .item
        text-overflow: ellipsis
        overflow: hidden
        white-space: nowrap
        font-size: 14px
      .status-item:before
        content: ""
        display: inline-block
        width: 9px
        height: 9px
        border-radius: 50%
        margin-right: 6px
        background: $color-negative
      .status-fail:before
        background: #E1E1E1
      .status-success:before
        background: $color-positive
      .list-double-row
        .item-sub
          color: #333
</style>
