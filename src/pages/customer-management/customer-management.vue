<template>
  <div class="customer-management table">
    <div class="down-content">
      <span class="down-tip">筛选</span>
      <div class="down-item">
        <base-date-select placeHolder="选择注册日期" @getTime="_selectTime"></base-date-select>
      </div>
      <div class="down-item-small">
        <base-drop-down :select="socialSelect" :isInput="true" @changeText="_searchShop" @setValue="changeShopId"></base-drop-down>
      </div>
      <div class="down-item">
        <base-date-select placeHolder="选择用户首单的时间" @getTime="_selectFirstTime"></base-date-select>
      </div>
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search placeHolder="客户昵称/手机号" @search="_search"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-customer_list@2x.png" class="identification-icon">
          <p class="identification-name">客户列表</p>
        </div>
        <div class="function-btn">
          <div class="btn-main hand" @click="exportExcel">导出Excel</div>
        </div>
      </div>
      <div class="big-list">
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
      </div>
      <div class="pagination-box">
        <!---->
        <base-pagination ref="pages" :pageDetail="pageTotal" @addPage="_getMoreList"></base-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {authComputed, customerComputed, customerMethods} from '@state/helpers'
  import API from '@api'

  const PAGE_NAME = 'CUSTOMER_MANAGEMENT'
  const TITLE = '客户列表'
  const LIST_TITLE = [
    {title: '客户头像', showSort: false, sort: []},
    {title: '客户昵称', showSort: false, sort: []},
    {title: '客户手机', showSort: false, sort: []},
    {title: '交易单数', showSort: true, sort: [1, 2]},
    {title: '交易额', showSort: true, sort: [3, 4]},
    {title: '笔单价', showSort: true, sort: [5, 6]},
    {title: '注册时间', showSort: false, sort: []}
  ]

  const EXCEL_URL = '/social-shopping/api/backend/customer-index-excel'

  const SOCIAL_SELECT = {
    check: false,
    show: false,
    content: '全部社区',
    type: 'default',
    data: []
  }

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      this.socialList = []
      return {
        listTitle: LIST_TITLE,
        page: 1,
        regDate: '',
        keyword: '',
        sortType: 0,
        startTime: '',
        endTime: '',
        shop_id: '',
        paid_start_time: '',
        paid_end_time: '',
        socialSelect: SOCIAL_SELECT
      }
    },
    computed: {
      ...customerComputed,
      ...authComputed,
      exportUrl() {
        let currentId = this.getCurrentId()
        let data = {
          current_corp: currentId,
          current_shop: process.env.VUE_APP_CURRENT_SHOP,
          access_token: this.currentUser.access_token,
          start_time: this.startTime,
          end_time: this.endTime,
          keyword: this.keyword,
          sort_type: this.sortType,
          shop_id: this.shop_id,
          paid_start_time: this.paid_start_time,
          paid_end_time: this.paid_end_time
        }
        let search = []
        for (let key in data) {
          search.push(`${key}=${data[key]}`)
        }
        return process.env.VUE_APP_API + EXCEL_URL + '?' + search.join('&')
      }
    },
    created() {
      this._getShopList()
    },
    methods: {
      ...customerMethods,
      _getShopList() {
        API.Leader.shopDropdownList().then((res) => {
          if (res.error !== this.$ERR_OK) {
            return
          }
          let selectData = res.data.map((item) => {
            item.name = item.social_name
            return item
          })
          selectData.unshift({name: '全部社区', id: ''})
          this.socialSelect.data = selectData
          this.socialList = selectData
        })
      },
      _selectTime(value) {
        this.$refs.pages.beginPage()
        this.page = 1
        this.startTime = value[0]
        this.endTime = value[1]
        this._getCustomerList()
      },
      _selectFirstTime(value) {
        this.$refs.pages.beginPage()
        this.page = 1
        this.paid_start_time = value[0]
        this.paid_end_time = value[1]
        this._getCustomerList()
      },
      _searchShop(text) {
        if (text.length === 0) {
          this.socialSelect.data = this.socialList
          return
        }
        let arr = []
        this.socialList.forEach((item) => {
          if (item.name.toLowerCase().includes(text.toLowerCase())) {
            arr.push(item)
          }
        })
        this.socialSelect.data = arr
      },
      changeShopId(shop) {
        this.$refs.pages.beginPage()
        this.page = 1
        this.shop_id = shop.id
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
      _getCustomerList(loading = false) {
        this.getCustomerList({
          page: this.page,
          startTime: this.startTime,
          endTime: this.endTime,
          keyword: this.keyword,
          sortType: this.sortType,
          shopId: this.shop_id,
          paidStartTime: this.paid_start_time,
          paidEndTime: this.paid_end_time,
          loading: loading
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
        this._getCustomerList(true)
      },
      exportExcel() {
        if (!this.shop_id) {
          this.$toast.show('请选择社区')
          return
        }
        window.open(this.exportUrl, '_blank')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .list-box
    .list-item
      &:nth-child(1)
        max-width: 100px
      &:nth-child(2)
        flex: 1.5
      &:nth-child(3)
        flex: 1.2
      &:last-child
        padding: 0
        max-width: 140px
      .list-img
        width: 40px
        height: 40px
  .down-content
    .down-tip
      margin-left: 10px
    .down-item
      margin-right: 10px

</style>
