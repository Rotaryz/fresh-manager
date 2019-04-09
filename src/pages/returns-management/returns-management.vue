<template>
  <div class="purchase-management table">
    <base-tab-select :infoTabIndex="infoTabIndex" :tabStatus="tabStatus" @getStatusTab="changeStatus"></base-tab-select>
    <div class="down-content">
      <span class="down-tip">订单筛选</span>
      <div class="down-item-small">
        <base-drop-down :select="socialSelect" @setValue="changeShopId"></base-drop-down>
      </div>
      <div class="down-item">
        <base-date-select :dateInfo="time" @getTime="changeTime"></base-date-select>
      </div>
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search :infoText="keyword" :placeHolder="searchPlaceHolder" @search="changeKeyword"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-return_goods@2x.png" class="identification-icon">
          <p class="identification-name">退货管理</p>
        </div>
        <div class="function-btn">
          <div class="btn-main hand" @click="exportExcel">导出Excel</div>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in listTitle" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in list" :key="index" class="list-content list-box">
            <div class="list-item list-double-row">
              <p class="item-dark">{{item.after_sale_order_sn}}</p>
              <p class="item-sub">{{item.created_at}}</p>
            </div>
            <div class="list-item list-text">
              <div class="list-text-name">{{item.nickname}}</div>
            </div>
            <div class="list-item list-text">{{item.goods_name}}</div>
            <div class="list-item list-text">￥{{item.total}}</div>
            <div class="list-item list-text">{{item.order_sn}}</div>
            <div class="list-item list-text" :title="item.social_name">{{item.social_name}}</div>
            <div class="list-item list-text">{{item.remark}}</div>
            <div class="list-item list-text">{{item.status_str}}</div>
            <div class="list-item list-use">
              <span v-if="item.after_sale_status === 0" class="list-operation" @click="checkApply(item.id)">审核</span>
              <router-link tag="span" :to="`refund-detail/${item.id}`" append class="list-operation">详情</router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination" :pageDetail="pageDetail" :pagination="page" @addPage="setPage"></base-pagination>
      </div>
    </div>
    <default-modal ref="modal">
      <div slot="content">
        <div class="Auditing">
          <div class="top">
            <div class="title">审核</div>
            <div class="close" @click.stop="hideModal"><img class="close-img" src="./icon-close@2x.png" alt=""></div>
          </div>
          <div class="textarea-box">
            <span class="after"></span>
            <textarea v-model="remark" placeholder="备注原因" class="modelarea"></textarea>
            <span class="before"></span>
          </div>
          <div class="btn-group">
            <div class="btn-item" @click.stop="hideModal">取消</div>
            <div class="btn-item" @click.stop="auditing(0)">驳回</div>
            <div class="btn-item" @click.stop="auditing(1)">批准退款</div>
          </div>
        </div>
      </div>
    </default-modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  import API from '@api'
  import {authComputed, returnsMethods, returnsComputed} from '@state/helpers'

  const PAGE_NAME = 'ORDER_LIST'
  const TITLE = '退货管理'
  const SEARCH_PLACE_HOLDER = '订单号/会员名称/会员手机'
  const EXCEL_URL = '/social-shopping/api/backend/after-sale-excel'

  const LIST_TITLE = [
    '退货单号',
    '会员名称',
    '商品',
    '退货金额',
    '原订单号',
    '社区名称',
    '退货原因',
    '退货单状态',
    '操作'
  ]
  const TAB_STATUS = [{text: '全部', status: ''}, {text: '待处理', status: 0}]
  const SELECT = {
    check: false,
    show: false,
    content: '全部社区',
    type: 'default',
    data: []
  }
  export default {
    name: PAGE_NAME,
    components: {
      DefaultModal
    },
    page: {
      title: TITLE
    },
    data() {
      return {
        tabStatus: TAB_STATUS,
        listTitle: LIST_TITLE,
        searchPlaceHolder: SEARCH_PLACE_HOLDER,
        checkId: '',
        remark: '',
        socialSelect: SELECT,
        infoTabIndex: 0
      }
    },
    computed: {
      ...authComputed,
      ...returnsComputed,
      // infoTabIndex() {
      //   return this.tabStatus.findIndex((item) => item.status === this.status)
      // },
      returnsExportUrl() {
        let currentId = this.getCurrentId()
        let data = {
          current_corp: currentId,
          current_shop: process.env.VUE_APP_CURRENT_SHOP,
          access_token: this.currentUser.access_token,
          status: this.status,
          shop_id: this.shopId,
          start_time: this.time[0] || '',
          end_time: this.time[1] || '',
          keyword: this.keyword
        }
        let search = []
        for (let key in data) {
          search.push(`${key}=${data[key]}`)
        }
        return process.env.VUE_APP_API + EXCEL_URL + '?' + search.join('&')
      }
    },
    created() {
      if (this.$route.query.status) {
        this.infoTabIndex = this.$route.query.status * 1 + 1
      }
      this._getShopList()
    },
    methods: {
      ...returnsMethods,
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
        })
      },
      exportExcel() {
        window.open(this.returnsExportUrl, '_blank')
      },
      auditing(isAgree) {
        let data = {
          id: this.checkId,
          remark: this.remark,
          is_agree: isAgree
        }
        this.hideModal()
        API.Order.checkApply(data)
          .then((res) => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return
            }
            this.getReturnsList()
            this.$toast.show(res.message)
          })
          .catch((error) => {
            this.$toast.show(error)
          })
          .finally(() => {
            this.$loading.hide()
          })
      },
      checkApply(id) {
        this.checkId = id
        this.$refs.modal.showModal()
      },
      hideModal() {
        this.$refs.modal.hideModal()
      },
      changeStatus(selectStatus) {
        this.setStatus(selectStatus)
        this.$refs.pagination.beginPage()
      },
      changeShopId(shop) {
        this.setShopId(shop)
        this.$refs.pagination.beginPage()
      },
      changeTime(time) {
        this.setTime(time)
        this.$refs.pagination.beginPage()
      },
      changeKeyword(keyword) {
        this.setKeyword(keyword)
        this.$refs.pagination.beginPage()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  textarea::-webkit-input-placeholder
    font-size: $font-size-14
    color: #ACACAC

  .Auditing
    width: 534px
    height: 261px
    background: $color-white
    border-radius: 1px
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.6)
    text-align: center
    .top
      height: 59.5px
      border-bottom: 0.5px solid $color-line
      align-items: center
      justify-content: space-between
      padding: 0 20px
      layout(row)
      .title
        font-family: $font-family-regular
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
    .textarea-box
      .modelarea
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
        border-radius: 1px
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

  .search-warp
    layout(row)
    height: 80px
    align-items: center
    justify-content: space-between
    .ac-tab
      layout(row)
      align-items: center
      .base-date-select
        padding: 0 10px
    .excel
      display: block
      height: 28px
      width: 84px
      line-height: 28px
      background: $color-positive
      border: 1px solid $color-positive
      border-radius: 1px
      font-family: $font-family-regular
      font-size: $font-size-12
      color: $color-white
      text-align: center

  .list-text-name
    no-wrap()
    font-family: $font-family-regular
    font-size: $font-size-14
</style>
