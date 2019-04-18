<template>
  <div class="account-manage table">
    <base-tab-select :infoTabIndex="tabIndex" :tabStatus="tabStatus" :lineWidth="64" @getStatusTab="changeStatus"></base-tab-select>
    <div v-if="tabIndex === 0" class="down-content">
      <div class="distribution-down">
        <span class="down-tip">搜索</span>
        <div class="down-item">
          <base-search :infoText="orderKeyword" placeHolder="请输入员工姓名/账号" @search="changeKeyword"></base-search>
        </div>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-number_list@2x.png" class="identification-icon">
          <p class="identification-name">{{tabIndex === 0 ? '账号列表' : '角色权限'}}</p>
        </div>
        <div class="function-btn">
          <div class="btn-main" @click="addAccount(0)">新建账号<span class="add-icon"></span></div>
        </div>
      </div>
      <div class="big-list" :class="tabIndex === 1 ? 'big-list-max' : ''">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item" :style="{flex: item.flex}">{{item.title}}</div>
        </div>
        <div class="list">
          <div v-if="tabIndex === 0">
            <!--<div v-for="(item, index) in orderList" :key="index" class="list-content list-box">-->
            <div class="list-content list-box">
              <div class="list-item" :style="{flex: commodities[0].flex}">导出</div>
              <div class="list-item" :style="{flex: commodities[1].flex}">导出</div>
              <div class="list-item" :style="{flex: commodities[2].flex}">导出</div>
              <div class="list-item" :style="{flex: commodities[3].flex}">导出</div>
              <div class="list-item" :style="{flex: commodities[4].flex}">导出</div>
              <div class="list-item" :style="{flex: commodities[5].flex}">
                <span class="list-operation" @click="addAccount(1)">编辑</span>
                <span class="list-operation" @click="delAccount">删除</span>
              </div>
            </div>
          </div>
          <div v-if="tabIndex === 1">
            <!--<div v-for="(item, index) in orderList" :key="index" class="list-content list-box">-->
            <div v-for="(item, index) in 20" :key="index" class="list-content list-box">
              <div class="list-item" :style="{flex: commodities[0].flex}">导出</div>
              <div class="list-item" :style="{flex: commodities[1].flex}">导出</div>
              <div class="list-item" :style="{flex: commodities[2].flex}">导出</div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="tabIndex === 0" class="pagination-box">
        <base-pagination ref="pagination" :pageDetail="accountPageDetail" :pagination="accountPage" @addPage="setOrderPage"></base-pagination>
      </div>
    </div>
    <default-modal ref="addAccount">
      <div slot="content" class="add-account">
        <div class="account-box-title">
          <div class="account-title-text">新建员工账号</div>
          <div class="close hand" @click="cancel"></div>
        </div>
        <div class="account-input-box">
          <div class="account-input-left">
            <span class="start">*</span>
            员工姓名
          </div>
          <div class="account-input-right">
            <input v-model="true_name" type="text" class="main-input-box" placeholder="请输入真实姓名" maxlength="6">
          </div>
        </div>
        <div class="account-input-box account-input-margin">
          <div class="account-input-left">
            <span class="start">*</span>
            账号
          </div>
          <div class="account-input-right">
            <input v-if="accountType * 1 === 0" v-model="true_name" type="text" class="main-input-box" placeholder="请输入11位手机号作为账号"
                   maxlength="6"
            >
            <div v-if="accountType * 1 === 1" class="account-text">13316241009</div>
          </div>
        </div>
        <div class="account-select-list">
          <div class="account-input-left">
            <span class="start">*</span>
            角色
          </div>
          <div class="account-select-item">
            <div v-for="(item, index) in roleList" :key="index" class="select-item-box">
              <div class="pro-select-icon hand" :class="item.selected ? 'pro-select-icon-active' : ''" @click="selectItem(index)"></div>
              <div class="select-text hand" @click="selectItem(index)">{{item.text}}</div>
            </div>
          </div>
        </div>
        <div class="account-input-box">
          <div class="account-input-left">
            <span class="start">*</span>
            密码
          </div>
          <div class="account-input-right">
            <input v-model="true_name" type="password" class="main-input-box" placeholder="请输入新密码" maxlength="6">
          </div>
        </div>
        <div class="btn-group">
          <div class="btn cancel" @click="cancel">取消</div>
          <div class="btn confirm" @click="handleRoad">确定</div>
        </div>
      </div>
    </default-modal>
    <default-confirm ref="confirm" @confirm="handleAccount"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import {accountComputed, accountMethods} from '@state/helpers'
  import DefaultModal from '@components/default-modal/default-modal'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  const PAGE_NAME = 'ACCOUNT_MANAGE'
  const TITLE = '账号管理'
  const ORDERSTATUS = [{text: '账号管理', status: ''}, {text: '角色权限', status: 0}]
  const ACCOUNT_LIST = [
    {title: '账号姓名', key: 'created_at', flex: 0.9},
    {title: '账号', key: 'order_sn', flex: 0.9},
    {title: '角色', key: 'sale_order_sn', flex: 0.9},
    {title: '注册时间', key: 'road_name', flex: 1},
    {title: '最后登录时间', key: 'receiver', flex: 1},
    {title: '操作', key: '', operation: '导出', flex: 0.7}
  ]

  const PERMISSIONS_LIST = [
    {title: '角色名称', key: 'created_at', flex: 1},
    {title: '角色描述', key: 'order_sn', flex: 3},
    {title: '授权人员数量', key: 'sale_order_sn', flex: 0.5}
  ]

  const ROLE_LIST = [
    {text: '采购', selected: false, id: 0},
    {text: '管理员', selected: false, id: 0},
    {text: '运营', selected: false, id: 0},
    {text: '财务', selected: false, id: 0},
    {text: '分拣员', selected: true, id: 0},
    {text: '仓配', selected: false, id: 0}
  ]

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultModal,
      DefaultConfirm
    },
    data() {
      return {
        tabStatus: ORDERSTATUS,
        commodities: ACCOUNT_LIST,
        orderKeyword: '',
        accountPageDetail: {},
        accountPage: 1,
        true_name: '',
        roleList: ROLE_LIST,
        accountType: 0,
        accountId: 0
      }
    },
    computed: {
      ...accountComputed
    },
    created() {
      this.commodities = this.tabIndex === 0 ? ACCOUNT_LIST : PERMISSIONS_LIST
    },
    mounted() {
      // this.$refs.addAccount.showModal()
    },
    methods: {
      ...accountMethods,
      changeStatus(item, index) {
        this.commodities = index === 0 ? ACCOUNT_LIST : PERMISSIONS_LIST
        this.setTabIndex(index)
      },
      changeKeyword() {},
      setOrderPage() {},
      addAccount(number) {
        this.accountType = number
        this.$refs.addAccount.showModal()
      },
      handleRoad() {},
      cancel() {
        this.$refs.addAccount.hideModal()
      },
      selectItem(index) {
        this.roleList[index].selected = !this.roleList[index].selected
      },
      handleAccount() {},
      delAccount() {
        let name = '石开达'
        this.$refs.confirm.show(`确定删除${name}员工账号吗？`)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .account-manage
    width: 100%
  .list-box
    .list-item
      &:nth-child(6)
        max-width: 80px !important
        padding-right: 0 !important
  .add-account
    width: 534px
    min-height: 440px
    background: $color-white
    padding: 0 20px 60px
    .account-box-title
      padding: 22px 0 30px
      layout(row)
      align-items: center
      justify-content: space-between
    .account-title-text
      font-size: $font-size-16
      color: $color-text-main
      font-family: $font-family-medium
      line-height: 1
    .close
      width: 12px
      height: @width
      icon-image('icon-close')
  .account-text
    font-size: $font-size-14
    font-family: $font-family-regular
    color: $color-text-main
    height: 44px
    line-height: 44px
  .account-input-box
    layout(row)
    align-items: center
    margin-bottom: 20px
  .account-input-margin
    margin-bottom: 30px
  .account-input-left
    width: 68px
    text-align: right
    margin-right: 20px
    font-family: $font-family-regular
    font-size: $font-size-14
    color: #151515
  .main-input-box
    display: flex
    align-items: center
    width: 406px
    height: 44px
    border: 1px solid $color-line
    border-radius: 2px
    font-family: $font-family-regular
    color: $color-text-main
    font-size: $font-size-14
    padding-left: 11px
    transition: all 0.3s
    &::-webkit-inner-spin-button
      appearance: none
    &:hover
      border: 1px solid #ACACAC
    &::placeholder
      font-family: $font-family-regular
      color: $color-text-assist
    &:focus
      border-color: $color-main !important
    .main-input-box-add
      width: 84px
      height: 24px
      background: #F5F7FA
      line-height: 24px
      padding-left: 8px
      box-sizing: border-box
      font-family: PingFangSC-Regular
      font-size: $font-size-14
      color: #ACACAC
      margin-left: 3px
      position: relative
      transition: all 0.3s
      &:after
        content: ''
        position: absolute
        right: 11px
        top: 8px
        width: 2px
        height: 8px
        background: #ACACAC
        transition: all 0.3s
      &:before
        content: ''
        position: absolute
        right: 8px
        top: 11px
        width: 8px
        height: 2px
        background: #ACACAC
        transition: all 0.3s
  .account-select-list
    layout(row)
    .account-select-item
      display: flex
      flex: 1
      layout(row)
      .select-item-box
        width: 33.3333%
        margin-bottom: 30px
        layout(row)
        align-items: center
        .select-text
          font-size: $font-size-14
          font-family: $font-family-regular
          color: $color-text-main
  .pro-select-icon
    border-radius: 2px
    border: 1px solid $color-line
    height: 14px
    width: 14px
    margin-right: 6px
    background: $color-white
    transition: all 0.3s
  .pro-select-icon-active
    border: 1px solid transparent
    icon-image('icon-check')
  .start
    display: inline-block
    margin-right: -2px
    color: #F52424
  .distribution-down
    display: flex
    align-items: center
  .btn-group
    text-align: center
    display: flex
    justify-content: flex-end
    user-select: none
    .btn
      width: 96px
      height: 40px
      line-height: 40px
      border-radius: 2px
      border: 1px solid $color-text-D9
      cursor: pointer
      transition: all 0.3s
    .cancel
      border: 1px solid $color-line
      &:hover
        color: $color-text-sub
        border-color: $color-text-sub
    .confirm
      border: 1px solid $color-main
      background: $color-main
      color: $color-white
      margin-left: 20px
      &:hover
        opacity: 0.8
    .one-btn
      margin-left: 0
</style>
