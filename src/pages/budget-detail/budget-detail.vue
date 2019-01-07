<template>
  <div class="budget-detail">
    <div class="tab-header">
      <base-drop-down :width="152" :select="billSelect" @setValue="changeBillType"></base-drop-down>
    </div>
    <div class="list-header list-box">
      <div v-for="(item,index) in listTitle" :key="index" class="list-item">{{item}}</div>
    </div>
    <div class="list">
      <div v-for="(item, index) in billList" :key="index" class="list-content list-box">
        <div class="list-item">{{item.created_at}}</div>
        <div class="list-item">{{item.type_str}}</div>
        <div class="list-item">{{item | adjustType(1)}}</div>
        <div class="list-item">{{item | adjustType(2)}}</div>
        <div class="list-item">{{item.after_remaining}}</div>
        <div class="list-item">{{item.order_sn}}</div>
      </div>
    </div>
    <div class="pagination-box">
      <!--:pageDetail="pageTotal"-->
      <base-pagination ref="pagination" :pageDetail="billPageDetail" :pagination="billPage" @addPage="setBillPage"></base-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {leaderComputed, leaderMethods} from '@state/helpers'
  import API from '@api'
  const PAGE_NAME = 'BUDGET_DETAIL'
  const TITLE = '收支明细'

  const LIST_TITLE = ['生成时间', '类型', '收入', '支出', '余额', '关联订单号']
  const INCOME = 1
  const OUTCOME = 2
  const BILL_SELECT = {
    check: false,
    show: false,
    content: '全部类型',
    type: 'default',
    data: []
  }

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    filters: {
      adjustType(data, status) {
        let isIncome = data.type === 30 || data.type === 31
        if (status === INCOME) {
          return isIncome ? data.total : ''
        } else if (status === OUTCOME) {
          return !isIncome ? data.total : ''
        } else {
          return ''
        }
      }
    },
    data() {
      return {
        listTitle: LIST_TITLE,
        billSelect: BILL_SELECT
      }
    },
    computed: {
      ...leaderComputed
    },
    created() {
      this._getShopBillType()
      console.log(this.billPage)
    },
    methods: {
      ...leaderMethods,
      async _getShopBillType() {
        let res = await API.Leader.getShopBillType()
        console.log(res)
        if (res.error !== this.$ERR_OK) {
          console.warn('获取不到收支类型')
          return
        }
        let selectData = res.data
        selectData.unshift({name: '全部类型', id: '0'})
        this.billSelect.data = selectData
      },
      changeBillType(type) {
        this.setBillType(type)
        this.$refs.pagination.beginPage()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .budget-detail
    overflow: hidden
    flex: 1
    display: flex
    flex-direction: column

  .tab-header
    height: 80px
    display: flex
    justify-content: space-between
    align-items: center
    box-sizing: border-box

  .list-header
    height: 50px
    font-size: $font-size-16
    font-family: $font-family-regular
    color: $color-text-main
    background: $color-list-header

  .list-box
    padding-left: 30px
    box-sizing: border-box
    border-bottom: 1px solid $color-line
    display: flex
    align-items: center
    .list-item
      box-sizing: border-box
      padding-right: 10px
      flex: 1

  .list
    flex: 1
    .list-content
      font-family: $font-family-regular
      color: $color-text-main
      height: 70px
      border-bottom: 1px solid $color-line
      .list-item
        no-wrap()
        font-size: $font-size-14
        .list-link
          &:hover
            color: $color-sub
      // 双行样式
      .list-double-row
        .item-sub
          no-wrap()
          line-height: 1
          margin-top: 8px
          font-size: $font-size-14
          color: $color-text-assist
        .item-dark
          no-wrap()
          font-size: $font-size-14
          line-height: 1

  .pagination-box
    height: 70px
    align-items: center
    display: flex

  .btn-main
    position: relative
    .file-box
      position: absolute
      top: 0
      left: 0
      width: 84px
      height: 28px
      opacity: 0
</style>
