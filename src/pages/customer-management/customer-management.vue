<template>
  <div class="customer-management">
    <div class="tab-header">
      <div class="tab-box">
        <base-date-select placeHolder="选择注册日期" @getTime="_selectTime"></base-date-select>
      </div>
      <base-search placeHolder="客户昵称/手机号" @search="_search"></base-search>
    </div>
    <div class="list-header list-box">
      <div v-for="(item,index) in listTitle" :key="index" class="list-item" :class="{'hand': item.showSort}" @click="_setSort(index)">
        {{item.title}}
        <base-sort v-show="item.showSort" ref="sort" :sortStatus="item.sort"></base-sort>
      </div>
    </div>
    <div class="list">
      <div v-for="(item, index) in customerList" :key="index" class="list-content list-box">
        <div class="list-item">
          <img :src="item.head_image_url" class="list-img">
        </div>
        <div class="list-item">{{item.nickname}}</div>
        <div class="list-item">{{item.mobile}}</div>
        <div class="list-item">{{item.order_count}}</div>
        <div class="list-item">{{item.order_total}}</div>
        <div class="list-item">{{item.unit_price}}</div>
        <div class="list-item">{{item.created_at}}</div>
      </div>
    </div>
    <div class="pagination-box">
      <!---->
      <base-pagination ref="pages" :pageDetail="pageTotal" @addPage="_getMoreList"></base-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {customerComputed, customerMethods} from '@state/helpers'

  const PAGE_NAME = 'CUSTOMER_MANAGEMENT'
  const TITLE = '客户管理'
  const LIST_TITLE = [
    {title: '客户头像', showSort: false, sort: []},
    {title: '客户昵称', showSort: false, sort: []},
    {title: '客户手机', showSort: false, sort: []},
    {title: '交易单数', showSort: true, sort: [1, 2]},
    {title: '交易额', showSort: true, sort: [3, 4]},
    {title: '笔单价', showSort: true, sort: [5, 6]},
    {title: '注册时间', showSort: false, sort: []}
  ]

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        listTitle: LIST_TITLE,
        page: 1,
        regDate: '',
        keyword: '',
        sortType: 0,
        startTime: '',
        endTime: ''
      }
    },
    computed: {
      ...customerComputed
    },
    created() {
    },
    methods: {
      ...customerMethods,
      _selectTime(value) {
        this.$refs.pages.beginPage()
        this.page = 1
        this.startTime = value[0]
        this.endTime = value[1]
        this._getCustomerList()
      },
      _setSort(index) {
        this.listTitle.forEach((item, idx) => {
          if (idx !== index) {
            this.$refs.sort[idx].infoSort()
          }
        })
        let sort = this.$refs.sort[index].setSort()
        this.sortType = sort
        this._getCustomerList()
      },
      _getCustomerList() {
        this.getCustomerList({
          page: this.page,
          startTime: this.startTime,
          endTime: this.endTime,
          keyword: this.keyword,
          sortType: this.sortType,
          loading: false
        })
      },
      _search(text) {
        this.$refs.pages.beginPage()
        this.page = 1
        this.keyword = text
        this.sortType = 0
        this._getCustomerList()
      },
      _getMoreList(page) {
        this.page = page
        this.getCustomerList({
          page: this.page,
          startTime: this.startTime,
          endTime: this.endTime,
          keyword: this.keyword,
          sortType: this.sortType,
          loading: true
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .customer-management
    overflow: hidden
    flex: 1
    display: flex
    flex-direction: column

  .tab-header
    height: 80px
    display: flex
    align-items: center
    box-sizing: border-box
    .tab-box
      margin-right: 10px

  .list-header
    height: 50px
    font-size: $font-size-16
    font-family: $font-family-regular
    color: $color-text-main
    background: $color-list-header
    .list-item
      display: flex
      align-items: center

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
      .list-img
        width: 50px
        height: @width
        object-fit: cover
        overflow: hidden
        border-radius: 50%

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
