<template>
  <div class="leader-withdrawal table">
    <div class="tab-header">
      <base-drop-down :select="statusSelect" @setValue="changeWithdrawalStatus"></base-drop-down>
      <div class="tab-item">
        <base-date-select @getTime="_setTime"></base-date-select>
      </div>
      <input v-model="orderSn" type="text" class="with-search" placeholder="提现单号">
      <input v-model="keyword" type="text" class="with-search" placeholder="社区名称/团长名称/团长账号">
      <div class="search-icon-box" @click="search">
        <span class="search-icon hand"></span>
      </div>
      <div class="btn-main btn-main-end" @click="exportExcel">导出Excel</div>
    </div>
    <div class="list-header list-box">
      <div v-for="(item,index) in listTitle" :key="index" class="list-item">{{item}}</div>
    </div>
    <div class="list">
      <div v-for="(item, index) in withdrawalList" :key="index" class="list-content list-box">
        <div class="list-item list-double-row">
          <p class="item-dark">{{item.withdraw_sn}}</p>
          <p class="item-sub">{{item.created_at}}</p>
        </div>
        <div class="list-item">{{item.mobile}}</div>
        <div class="list-item">{{item.name}}</div>
        <div class="list-item">{{item.social_name}}</div>
        <div class="list-item">{{item.total}}</div>
        <div class="list-item">{{item.poundage}}</div>
        <div class="list-item">{{item.realy_total}}</div>
        <div class="list-item list-help">
          {{item.status_str}}
          <div v-if="item.status === 2 || item.status === 4" class="help-box">
            <img src="./icon-help@2x.png" class="help hand">
            <div v-if="item.note" class="help-tip">{{item.note}}</div>
          </div>
        </div>
        <div class="list-item list-operation-box">
          <span v-if="item.status === 0 || item.status === 4" class="list-operation" @click="checkApply(item.id)">审核</span>
          <router-link tag="span" :to="`budget-detail/${item.payee_id}/${item.name}`" append class="list-operation">收支明细</router-link>
        </div>
      </div>
    </div>
    <div class="pagination-box">
      <!--:pageDetail="pageTotal"-->
      <base-pagination ref="pagination" :pageDetail="withdrawalPageDetail" :pagination="page" @addPage="setWithdrawalPage"></base-pagination>
    </div>
    <default-modal ref="modal">
      <div slot="content">
        <div class="Auditing">
          <div class="top">
            <div class="title">审核</div>
            <div class="close" @click.stop="hideModal"><img class="close-img" src="./icon-close@2x.png" alt=""></div>
          </div>
          <div class="text-area-box">
            <span class="after"></span>
            <textarea v-model="note" placeholder="请输入审核意见" class="model-area"></textarea>
            <span class="before"></span>
          </div>
          <div class="btn-group">
            <div class="btn-item" @click.stop="hideModal">取消</div>
            <div class="btn-item" @click.stop="auditing(2)">驳回</div>
            <div class="btn-item" @click.stop="auditing(1)">批准提现</div>
          </div>
        </div>
      </div>
    </default-modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  import {authComputed, leaderComputed, leaderMethods} from '@state/helpers'
  import API from '@api'

  const PAGE_NAME = 'LEADER_WITHDRAWAL'
  const TITLE = '团长提现'
  const LIST_TITLE = [
    '提现单号',
    '团长账号',
    '团长名称',
    '社区名称',
    '提现金额',
    '手续费',
    '预计到账金额',
    '提现状态',
    '操作'
  ]
  const STATUS_SELECT = {
    check: false,
    show: false,
    content: '全部状态',
    type: 'default',
    data: []
  }
  const EXCEL_URL = '/social-shopping/api/backend/backend-shop-manager/withdrawal-excel'

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultModal
    },
    data() {
      return {
        listTitle: LIST_TITLE,
        page: 1,
        orderSn: '',
        excelParams: '',
        keyword: '',
        note: '',
        checkId: 0,
        statusSelect: STATUS_SELECT,
        start: '',
        end: ''
      }
    },
    computed: {
      ...authComputed,
      ...leaderComputed,
      withdrawalExportUrl() {
        let data = {
          current_corp: process.env.VUE_APP_CURRENT_CORP,
          current_shop: process.env.VUE_APP_CURRENT_SHOP,
          access_token: this.currentUser.access_token,
          withdraw_sn: this.withdrawalSn,
          type: this.withdrawalType,
          keyword: this.withdrawalKeyword,
          status: this.withdrawalStatus,
          start_at: this.start || '',
          end_at: this.end || ''
        }
        let search = []
        for (let key in data) {
          search.push(`${key}=${data[key]}`)
        }
        return process.env.VUE_APP_API + EXCEL_URL + '?' + search.join('&')
      }
    },
    created() {
      this._getWithdrawalStatus()
    },
    methods: {
      ...leaderMethods,
      async _getWithdrawalStatus() {
        let res = await API.Leader.getWithdrawalStatus()
        if (res.error !== this.$ERR_OK) {
          console.warn('获取不到提现状态列表')
          return
        }
        let selectData = res.data
        selectData.unshift({name: '全部状态', id: ''})
        this.statusSelect.data = selectData
      },
      exportExcel() {
        window.open(this.withdrawalExportUrl, '_blank')
      },
      checkApply(id) {
        this.checkId = id
        this.$refs.modal.showModal()
      },
      hideModal() {
        this.$refs.modal.hideModal()
      },
      async auditing(status) {
        let data = {
          id: this.checkId,
          note: this.note,
          status
        }
        let res = await API.Leader.applyWithdrawal(data)
        this.$loading.hide()
        this.$toast.show(res.message)
        if (res.error === this.$ERR_OK) {
          this.hideModal()
          this.getWithdrawalList()
        }
      },
      search() {
        let searchValue = {
          orderSn: this.orderSn,
          keyword: this.keyword
        }
        this.setWithdrawalSearch(searchValue)
        this.$refs.pagination.beginPage()
      },
      changeWithdrawalStatus(status) {
        this.setWithdrawalStatus(status)
        this.$refs.pagination.beginPage()
      },
      _setTime(time) {
        this.setWidthTime(time)
        this.start = time[0]
        this.end = time[1]
        this.$refs.pagination.beginPage()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .tab-header
    height: 80px
    display: flex
    align-items: center
    box-sizing: border-box
    position: relative
    .tab-item
      margin-left: 10px
    .with-search
      height: 28px
      width: 244px
      margin-left: 10px
      color: $color-text-main
      font-family: $font-family-regular
      font-size: $font-size-12
      box-sizing: border-box
      border: 1px solid $color-line
      border-radius: 4px
      padding-left: 14px
      transition: all 0.2s
      &:hover
        border: 1px solid #ACACAC
      &::placeholder
        font-family: $font-family-regular
        color: $color-text-assist
      &:focus
        border: 1px solid $color-sub !important
    .search-icon-box
      overflow: hidden
      height: 28px
      width: 47px
      border-radius: 4px
      margin-left: 10px
    .search-icon
      box-sizing: border-box
      height: 28px
      width: 47px
      transition: all 0.3s
      icon-image('icon-search_button')
      &:active
        transform: scale(1.1)
    .btn-main-end
      col-center()
      right: 0

  .list-box
    .list-item
      box-sizing: border-box
      padding-right: 10px
      flex: 1
      &:first-child
        flex: 1.5
    .list-help
      overflow: visible !important
      display: flex
      align-items: center
      .help-box
        margin-left: 5px
        position: relative
        &:hover .help-tip
          opacity: .8
          visibility: initial
      .help
        width: 14px
        height: 14px
      .help-tip
        background: #32323A
        opacity: 0
        color: $color-white
        padding: 8px 18px
        border-radius: 4px
        line-height: 16px
        font-family: $font-family-regular
        font-size: $font-size-14
        width: 196px
        white-space: normal
        position: absolute
        left: -75px
        top: 24.5px
        transition: opacity .3s
        visibility: hidden

  .btn-main
    position: relative
    .file-box
      position: absolute
      top: 0
      left: 0
      width: 84px
      height: 28px
      opacity: 0

  .Auditing
    width: 534px
    height: 261px
    background: $color-white
    border-radius: 3px
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.6)
    text-align: center
    .top
      height: 59.5px
      border-bottom: 1px solid $color-line
      align-items: center
      justify-content: space-between
      padding: 0 20px
      layout(row)
      .title
        font-family: $font-family-medium
        font-size: $font-size-16
        color: $color-text-main
      .close
        width: 16px
        height: 16px
        cursor: pointer
        .close-img
          width: 16px
          height: 16px
          display: block
          transition: all 0.3s
          &:hover
            transform: scale(1.1)
    .text-area-box
      .model-area
        font-size: $font-size-14
        width: 494px
        resize: none
        height: 80px
        padding: 12px
        margin: 30px auto 30px
        border: 1px solid $color-line
    .btn-group
      layout(row)
      align-items: center
      justify-content: flex-end
      padding-right: 20px
      .btn-item
        width: 96px
        line-height: 40px
        margin-left: 10px
        cursor: pointer
        text-align: center
        border: 1px solid $color-text-assist
        border-radius: 4px
        font-family: $font-family-regular
        font-size: $font-size-16
        color: $color-text-main
        height: 40px
        &:nth-child(2)
          color: $color-positive
          border-color: $color-positive
        &:nth-child(3)
          background: $color-positive
          color: $color-white
          border-color: $color-positive

</style>