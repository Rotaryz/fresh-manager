<template>
  <div class="leader-invite table">
    <article class="data-content">
      <section class="down-content">
        <div class="distribution-down">
          <span class="down-tip">搜索</span>
          <div class="down-item">
            <base-search :infoText="filter.keyword" placeHolder="请输入团长名称" @search="handleSearch"></base-search>
          </div>
        </div>
      </section>
      <section class="table-content">
        <div class="identification">
          <div class="identification-page">
            <img src="./icon-bandit_list@2x.png" class="identification-icon">
            <p class="identification-name">团长邀请排行榜<span class="sub-title">(合计成功邀请 {{pageInfo.invite_number_count}} 位团长)</span></p>
          </div>
          <div class="empty-flex-1"></div>
          <div class="switch-wrapper" @click="handleSwitchChange">
            <base-switch :status="statusObj.status" confirmText="开启" cancelText="关闭"></base-switch>
          </div>
          <p class="leader-status" :class="{active: statusObj.status}">团长奖励比例：{{statusObj.percent > 0 ? statusObj.percent + '%' : '未设置'}}</p>
        </div>
        <div class="big-list  ranking-list">
          <div class="list-header list-box">
            <div v-for="(item,index) in tabTitle" :key="index" class="list-item" :style="{flex: item.flex}">{{item.name}}</div>
          </div>
          <div v-if="dataArray.length" class="list">
            <div v-for="(row, index) in dataArray" :key="index" class="list-content list-box">
              <!--{{row}}-->
              <div :style="{flex: tabTitle[0].flex}" class="list-item">
                <router-link tag="span" :to="{name:'leader-list',query:{keyword:row[tabTitle[0].key][tabTitle[0].key2],model_type:1,status:'',model_type:0}}" append class="list-operation">
                  {{row[tabTitle[0].key][tabTitle[0].key2]}}
                </router-link>
              </div>
              <div :style="{flex: tabTitle[1].flex}" class="list-item">
                <router-link tag="span" :to="{name:'leader-list',query:{keyword:row[tabTitle[1].key][tabTitle[1].key2],model_type:1,status:'',model_type:0}}" append class="list-operation">
                  {{row[tabTitle[1].key][tabTitle[1].key2]}}
                </router-link>
              </div>
              <div :style="{flex: tabTitle[2].flex}" class="list-item">{{row[tabTitle[2].key]}}个/{{row[tabTitle[2].after.key]}}元</div>
              <div :style="{flex: tabTitle[3].flex}" class="list-item">￥{{row[tabTitle[3].key]}}</div>
              <div :style="{flex: tabTitle[4].flex}" class="list-item">￥{{row[tabTitle[4].key]}}</div>
              <div :style="{flex: tabTitle[5].flex}" class="list-item">￥{{row[tabTitle[5].key]}}</div>
              <div :style="{flex: tabTitle[6].flex}" class="list-item list-operation-box">
                <div class="list-operation" @click="showAccountModal(row)">
                  {{tabTitle[6].operateText}}
                </div>
                <div class="list-operation" @click="showLogModal(row)">
                  {{tabTitle[6].afterBtn.operateText}}
                </div>
              </div>
            </div>
          </div>
          <base-blank v-else blackStyle="padding-top:15%"></base-blank>
        </div>
        <div class="pagination-box">
          <base-pagination ref="pagination" :pageDetail="pageInfo" @addPage="addPage"></base-pagination>
        </div>
      </section>
      <default-modal ref="modalSwitch">
        <div slot="content" class="default-panel leader-switch">
          <header class="header">
            <p>设置团长邀请注册</p>
            <img class="close" src="./icon-close@2x.png" alt="" @click="$refs.modalSwitch.hideModal()">
          </header>
          <section class="input-wrapper">
            <p class="key">团长奖励比例</p>
            <div class="edit-input-box">
              <input v-model="inviteSetting.percent" type="number" placeholder="" class="edit-input">
            </div>
            <p>%</p>
          </section>
          <dl class="explain-wrapper">
            <dt>注：开启后团长邀请其他用户注册为团长将获得以下福利：</dt>
            <dd>福利一：团长审核通过且社区用户交易额达到100元可获50元现金</dd>
            <dd>福利二：被邀请的团长用户下单后团长（邀请者）可获得对应的订单奖励提成</dd>
          </dl>
          <div class="btn-group">
            <span class="btn cancel" @click="$refs.modalSwitch.hideModal()">取消</span>
            <span class="btn confirm" @click="_leaderInviteSetting">确认</span>
          </div>
        </div>
      </default-modal>
      <default-modal ref="modalAccount">
        <div slot="content" class="default-panel account">
          <header class="header">
            <p>奖励结算</p>
            <img class="close" src="./icon-close@2x.png" alt="" @click="$refs.modalAccount.hideModal()">
          </header>
          <div class="account-container">
            <p class="title">请选择结算团长奖励时间：</p>
            <section class="date-wrapper">
              <base-date-select
                dataPickerType="date"
                :dateInfo="null"
                :disabled="true"
                :value="accountObj.start_date"
              ></base-date-select>
              <span class="separator">至</span>
              <base-date-select
                palceholder="选择结束时间"
                :dateInfo="null"
                dataPickerType="date"
                :value="accountObj.end_date"
                :disabledDate="disabledDate"
                @getTime="getTime"
              ></base-date-select>
            </section>
            <p v-if="accountCountObj.entry_money>0" class="result">结算金额：{{accountCountObj.invite_reward_money}} * {{accountCountObj.invite_reward_number}} + {{accountCountObj.entry_source_money}} * {{accountCountObj.entry_percent}}%= {{accountCountObj.entry_money}}元</p>
            <p v-else class="result">该时间段内没有产生佣金记录</p>
          </div>
          <div v-if="accountCountObj.entry_money>0" class="btn-group">
            <span class="btn cancel" @click="$refs.modalAccount.hideModal()">取消</span>
            <span class="btn confirm" @click="handleAccountConfirm">确认</span>
          </div>
          <div v-else class="btn-group">
            <span class="btn cancel" @click="$refs.modalAccount.hideModal()">关闭</span>
          </div>
        </div>
      </default-modal>
      <default-modal ref="modalLogs">
        <div slot="content" class="default-panel logs">
          <header class="header">
            <p>结算记录</p>
            <img class="close" src="./icon-close@2x.png" alt="" @click="$refs.modalLogs.hideModal()">
          </header>
          <div class="logs-container table">
            <div class="big-list">
              <div class="list-header list-box">
                <div v-for="(item,index) in logTile" :key="index" :class="['list-item',item.class]" :style="{flex: item.flex}">{{item.name}}</div>
              </div>
              <div v-if="logArray.length" class="list">
                <div v-for="(row, index) in logArray" :key="index" class="list-content list-box">
                  <div :style="{flex: logTile[0].flex}" class="list-item">{{row[logTile[0].key]}}</div>
                  <div :style="{flex: logTile[1].flex}" class="list-item">{{row[logTile[1].key]}}至{{row[logTile[1].key2]}}</div>
                  <div :style="{flex: logTile[2].flex}" class="list-item">{{row[logTile[2].key]}}%</div>
                  <div :style="{flex: logTile[3].flex}" class="list-item acount-money-item">{{row.invite_reward_money}} * {{row.invite_reward_number}} + {{row.distribution_source_money}} * {{row.distribution_percent}}%= {{row.total_money}}元</div>
                </div>
              </div>
              <div v-if="logArray.length < 1" style="height: 354px"></div>
              <base-blank v-if="logArray.length < 1" blackStyle="padding-top:3%"></base-blank>
            </div>
            <div class="pagination-box">
              <base-pagination ref="pages" :pageDetail="logPageInfo" @addPage="addPageLogs"></base-pagination>
            </div>
          </div>
        </div>
      </default-modal>
    </article>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import DefaultModal from '@components/default-modal/default-modal'

  const PAGE_NAME = 'LEADER_SALES'
  const TITLE = '团长邀请'

  const TAB_TITLE = [
    {
      name: '社区名称',
      type: 'operate',
      operateText: '',
      flex: 1.5,
      key: 'shop',
      key2: 'social_name',
      class: 'operate',
      params: {id: 'id', goods_sku_code: 'goods_sku_code'},
      routerName: 'leader-list'
    },
    {
      name: '团长名称',
      key: 'shop',
      key2: 'name',
      type: 'operate',
      operateText: '',
      flex: 1.5,
      class: 'operate',
      params: {id: 'id', goods_sku_code: 'goods_sku_code'},
      routerName: 'sorting-task-detail-by-goods'
    },
    {
      name: '邀请团长用户数/奖励',
      flex: 1.5,
      key: 'invite_number',
      type: 6,
      after: {key: 'invite_reward_money'}
    },
    {name: '团长奖励', flex: 1, key: 'invite_total_money'},
    {name: '待结算', flex: 1, key: 'not_settlement_money'},
    {name: '已结算 ', flex: 1.5, key: 'settlement_money'},
    {
      name: '操作',
      flex: 1.6,
      key: '',
      type: 'showModal',
      operateText: '奖励结算',
      modalName: 'modalAccount',
      class: 'operate-two',
      afterBtn: {
        type: 'showModal',
        modalName: 'modalLogs',
        operateText: '结算记录'
      }
    }
  ]
  const LOG_TITLE = [
    {name: '结算时间', flex: 1, key: 'created_at', type: 1},
    {name: '结算团长奖励时间段', flex: 2, key: 'start_at', type: 6, key2: 'end_at'},
    {name: '团长佣金比例', flex: 1, key: 'distribution_percent', type: 1},
    {name: '结算金额', flex: 3, key: 'total_money', type: 1, class: 'acount-money-item'}
  ]
  export default {
    name: PAGE_NAME,
    components: {
      DefaultModal
    },
    page: {
      title: TITLE
    },
    data() {
      const params = this.$route.meta.params
      return {
        status: 0,
        filter: {
          page: 1,
          limit: 10,
          keyword: ''
        },
        invite_number_count: 0,
        tabTitle: TAB_TITLE,
        dataArray: params.dataInfo,
        statusObj: {
          status: 0,
          percent: '4.00',
          invite_money: '50.00'
        },
        // 设置团长邀请注册
        inviteSetting: {
          status: 1,
          percent: ''
        },
        currentLeader: {},
        accountObj: {
          invite_shop_id: '',
          start_date: '',
          end_date: ''
        },
        disableEndTime: '',
        accountCountObj: {
          invite_reward_money: '',
          invite_reward_number: '',
          entry_source_money: '',
          entry_percent: '',
          entry_money: '0.00'
        },
        logTile: LOG_TITLE,
        pageInfo: params.pageInfo,
        logPageInfo: {
          total: 0,
          per_page: 1,
          total_page: 1
        },
        number: '',
        logsFilter: {
          page: 1,
          limit: 10,
          invite_shop_id: ''
        },
        logArray: []
      }
    },
    computed: {
      disabledDate() {
        return {
          disabledDate: (date) => {
            console.log(this.accountObj.start_date, this.disableEndTime)
            return (
              date.valueOf() < new Date(this.accountObj.start_date) - 24 * 60 * 60 * 1000 ||
              date.valueOf() > new Date(this.disableEndTime)
            )
          }
        }
      // 自定义日期必须小于今天
      }
    },
    created() {
      this._getSettingStatus()
      this.$loading.hide()
    },
    mounted() {
    // this.$refs.modalAccount.showModal()
    // this.$refs.modal && this.$refs.modal.showModal()
    },
    methods: {
      _getSettingStatus() {
        return API.Leader.getSettingStatus()
          .then((res) => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return
            }
            this.statusObj = res.data
          })
          .finally((res) => {
            this.$loading.hide()
          })
      },
      addPage(page) {
        this.filter.page = page
        this._getList()
      },
      _leaderInviteSetting() {
        API.Leader.leaderInviteSetting(this.inviteSetting)
          .then((res) => {
            if (res.error === this.$ERR_OK) {
              this._getSettingStatus().then((res) => {
                this.$refs.modalSwitch.hideModal()
              })
            }
            this.$toast.show(res.message)
          })
          .finally((res) => {
            this.$loading.hide()
          })
      },
      handleSwitchChange() {
        this.inviteSetting.percent = this.statusObj.percent
        if (this.statusObj.status === 1) {
          this.inviteSetting.status = 0
          this._leaderInviteSetting()
        } else {
          this.inviteSetting.status = 1
          this.$refs.modalSwitch.showModal()
        }
      },
      handleSearch(val) {
        if (this.filter.page !== 1) this.$refs.pagination.beginPage()
        this.filter.keyword = val
        this._getList()
      },
      _getList() {
        API.Leader.leaderDistributionRankingList(this.filter, true)
          .then((res) => {
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
            this.pageInfo.invite_number_count = res.invite_number_count
          })
          .finally((res) => {
            this.$loading.hide()
          })
      },
      // 佣金结算
      showAccountModal(row) {
        // todo
        this.accountObj.invite_shop_id = row.invite_shop_id
        API.Leader.getAccountTimes({invite_shop_id: row.invite_shop_id})
          .then((res) => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return false
            }
            this.accountObj.start_date = res.data.start_date
            this.accountObj.end_date = res.data.end_date
            this.disableEndTime = res.data.end_date
            return true
          })
          .then((res) => {
            res && this._getAccountData()
          })
      },
      // 获取算式 各个数据
      _getAccountData() {
        API.Leader.getAccountData(this.accountObj).then((res) => {
          this.$refs.modalAccount.showModal()
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
            return
          }
          this.accountCountObj = {...res.data, ...{entry_money: Number(res.data.entry_money)}}
        })
      },
      handleAccountConfirm() {
        API.Leader.setAccountData(this.accountObj).then((res) => {
          this.$toast.show(res.message)
          if (res.error === this.$ERR_OK) {
            this._getList()
            this.$refs.modalAccount.hideModal()
          }
        })
      },
      getTime(time) {
        this.accountObj.end_date = time
        this._getAccountData()
      },
      // 结算记录
      showLogModal(row) {
        this.logsFilter.invite_shop_id = row.shop.id
        this.logsFilter.page = 1
        this._getLogList().then((res) => {
          if (res) {
            this.$refs.modalLogs.showModal()
            this.$refs.pages.beginPage()
          }
        })
      },
      _getLogList() {
        return API.Leader.getLogList(this.logsFilter).then((res) => {
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
            return false
          }
          this.logArray = res.data
          this.logPageInfo = {
            total: res.meta.total,
            per_page: res.meta.per_page,
            total_page: res.meta.last_page
          }
          return true
        })
      },
      addPageLogs(page) {
        this.logsFilter.page = page
        this._getLogList()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .big-list
    position: relative

  .leader-invite
    width: 100%

  // 弹窗
  .model-active
    max-height: 90%

  .default-panel
    height:606px
    background: #fff
    border-radius: 3px
    box-shadow: 0 8px 14px 0 rgba(12, 6, 14, 0.08)
    text-align: center
    padding: 0 20px
    box-sizing: border-box
    position: relative

    &.leader-switch
      width: 534px
      height: 298px

    &.account
      width: 534px
      height: 262px

    &.logs
      width: 1000px
      display flex
      flex-direction column

    .header
      display: flex
      font-family: $font-family-medium
      padding-top: 20px
      justify-content: space-between
      align-items: center
      p
        font-size: 16px
        color: #333333

      .close
        extend-click()
        width: 12px
        height: @width
        cursor: pointer

    // 佣金记录
    .logs-container
      position: relative
      min-height: 300px
      padding-top: 20px
      text-align: left
      .big-list
        max-height: 1000px
        overflow auto
    // 佣金结算
    .account-container
      font-family: $font-family-regular
      font-size: 14px;
      color: #333333;
      line-height: 1

      .result
        text-align: left
        padding-top: 30px

      .title
        text-align: left
        padding-top: 20px
        padding-bottom: 14px

      .date-wrapper
        display: flex
        align-items: center

        .separator
          padding: 0 10px

    // 佣金设置

    .input-wrapper
      padding-top: 30px
      display: flex
      align-items: center
      font-family: $font-family-regular
      font-size: 14px;
      color: #151515;

      .key
        position: relative

        &:before
          content: '*'
          col-center()
          left: -6px
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
      text-align: left
      line-height: 1

      dt
        padding-top: 24px
        padding-bottom: 16px

      dd
        padding-bottom: 10px


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
      padding-left: 10px

      &.active
        color: #333333;
    .empty-flex-1
      flex: 1

    .switch-wrapper
      flex-shrink: 0
      display: flex
      justify-content: flex-end

    .sub-title
      padding: 0 5px
      font-size: 14px;
      color: #333333;

  .big-list
    background: #FFFFFF

  .ranking-list .list-box .list-item:last-child
      max-width: 150px
      padding-right: 0


</style>
