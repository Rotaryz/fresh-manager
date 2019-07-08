<template>
  <div class="purchase-management table">
    <base-tab-select :infoTabIndex="tabIndex" :tabStatus="tabStatus" @getStatusTab="changeList"></base-tab-select>
    <div v-if="tabIndex === 0" class="purchase-order">
      <div class="down-content">
        <span class="down-tip">申请时间</span>
        <div class="down-item">
          <base-date-select :dateInfo="time" @getTime="changeTime"></base-date-select>
        </div>
        <span class="down-tip">搜索</span>
        <div class="down-item">
          <input v-model="keywords" type="text" class="with-search" placeholder="订单号/会员名称/会员手机">
          <input v-model="socialNames" type="text" class="with-search" placeholder="社区名称">
          <div class="search-icon-box hand" @click="changeKeyword">
            搜索
          </div>
        </div>
      </div>
      <div class="table-content">
        <div class="identification">
          <div class="identification-page">
            <img src="./icon-return_goods@2x.png" class="identification-icon">
            <p class="identification-name">退货管理</p>
            <base-status-tab :statusList="statusList" :infoTabIndex="infoTabIndex" @setStatus="changeStatus"></base-status-tab>
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
            <div v-if="list.length">
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
                  <span v-if="item.after_sale_status === 0 || item.after_sale_status === 2" class="list-operation" @click="checkApply(item.id)">审核</span>
                  <router-link tag="span" :to="`refund-detail/${item.id}`" append class="list-operation">详情</router-link>
                </div>
              </div>
            </div>
            <base-blank v-else></base-blank>
          </div>
        </div>
        <div class="pagination-box">
          <base-pagination ref="pagination" :pageDetail="pageDetail" :pagination="page" @addPage="setPage"></base-pagination>
        </div>
      </div>
    </div>
    <div v-if="tabIndex === 1" class="purchase-order">
      <div class="table-content">
        <div class="identification">
          <div class="identification-page">
            <img src="./icon-return_goods@2x.png" class="identification-icon">
            <p class="identification-name">规则列表</p>
          </div>
          <div class="function-btn">
            <router-link to="edit-rules" append class="btn-main hand">新建规则<span class="add-icon"></span></router-link>
          </div>
        </div>
        <div class="big-list">
          <div class="list-header list-box">
            <div v-for="(item,index) in rulesList" :key="index" class="list-item">{{item}}</div>
          </div>
          <div class="list">
            <div v-for="(item, index) in marketList" :key="index" class="list-content list-box">
              <div class="list-item list-text">{{item.title}}</div>
              <div class="list-item list-text">{{item.take_count}}</div>
              <div class="list-item list-text">{{item.used_count}}</div>
              <div class="list-item list-text" @click="open(item, index)">
                <base-switch confirmText="开启" cancelText="关闭" :status="item.status"></base-switch>
              </div>
              <div class="list-item list-use">
                <router-link tag="span" :to="`edit-rules?id=${item.id}`" append class="list-operation">查看</router-link>
                <span class="list-operation" @click="delRules(item.id)">删除</span>
              </div>
            </div>
          </div>
        </div>
        <div class="pagination-box">
          <base-pagination ref="pagination" :pagination="marketPage" :pageDetail="marketPageDetail" @addPage="addPage"></base-pagination>
        </div>
      </div>

    </div>
    <default-modal ref="modal">
      <div slot="content">
        <div class="Auditing">
          <div class="title-box">
            <div class="title">
              审核
            </div>
            <span class="close hand" @click.stop="hideModal"></span>
          </div>
          <div class="textarea-box">
            <span class="after"></span>
            <textarea v-model="remark" placeholder="备注原因" class="modelarea"></textarea>
            <span class="before"></span>
          </div>
          <div class="btn-group">
            <div class="btn cancel" @click.stop="hideModal">取消</div>
            <div class="btn manager" @click.stop="auditing(0)">驳回</div>
            <div class="btn confirm" @click.stop="auditing(1)">批准退款</div>
          </div>
        </div>
      </div>
    </default-modal>
    <default-confirm ref="confirm" @confirm="confirm"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
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
  const RULES_LIST = ['规则名称', '发放数', '使用数', '状态', '操作']
  const SELECT = {
    check: false,
    show: false,
    content: '全部社区',
    type: 'default',
    data: []
  }
  const TAB_STATUS = [{text: '售后订单'}, {text: '售后补偿'}]
  export default {
    name: PAGE_NAME,
    components: {
      DefaultModal,
      DefaultConfirm
    },
    page: {
      title: TITLE
    },
    data() {
      return {
        statusList: [
          {name: '全部', status: '', key: 'all', num: 0},
          {name: '待处理', status: 0, key: 'wait_release', num: 0},
          {name: '退款成功', status: 0, key: 'wait_release', num: 0},
          {name: '退款失败', status: 0, key: 'wait_release', num: 0},
          {name: '已取消', status: 0, key: 'wait_release', num: 0}
        ],
        listTitle: LIST_TITLE,
        searchPlaceHolder: SEARCH_PLACE_HOLDER,
        checkId: '',
        remark: '',
        socialSelect: SELECT,
        infoTabIndex: 0,
        tabStatus: TAB_STATUS,
        rulesList: RULES_LIST,
        keywords: '',
        socialNames: '',
        delId: ''
      }
    },
    computed: {
      ...authComputed,
      ...returnsComputed,
      // infoTabIndex() {
      //   return this.tabStatus.findIndex((item) => item.status === this.status)
      // },
      // 导出售后订单
      returnsExportUrl() {
        let currentId = this.getCurrentId()
        let data = {
          current_corp: currentId,
          current_shop: process.env.VUE_APP_CURRENT_SHOP,
          access_token: this.currentUser.access_token,
          status: this.status,
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
    watch: {
      keyword(value) {
        this.keywords = value
      },
      socialName(value) {
        this.socialNames = value
      }
    },
    async created() {
      this.keywords = this.keyword
      this.socialNames = this.socialName
      await this._statistic()
    },
    methods: {
      ...returnsMethods,
      async open(item, index) {
        let res = await API.Order.openActivity(item.id, item.status === 0 ? 1 : 0)
        this.$toast.show(res.message)
        if (res.error === this.$ERR_OK) {
          this.getMarketList({page: this.marketPage, source_type: 2})
        }
      },
      delRules(id) {
        this.delId = id
        this.$refs.confirm.show('是否删除该规则？')
      },
      async confirm() {
        let res = await API.Order.delCouponActivity(this.delId)
        this.$toast.show(res.message)
        if (res.error === this.$ERR_OK) {
          this.getMarketList({page: this.marketPage, source_type: 2})
        }
        this.$refs.confirm.hide()
      },
      // 获取状态
      async _statistic() {
        let res = await API.Order.afterSaleOrdersStatus({
          start_time: this.time[0],
          end_time: this.time[1],
          keyword: this.keyword,
          social_name: this.socialName
        })
        if (res.error !== this.$ERR_OK) {
          console.warn('获取交易状态类型失败')
          return
        }
        let selectData = res.data
        if (this.$route.query.status && this.firstIn) {
          this.infoTabIndex = this.$route.query.status * 1 + 1
          this.setFirstIn()
        } else {
          let index = res.data.findIndex((item) => item.status === this.status)
          this.infoTabIndex = index > 0 ? index : 0
        }
        this.statusList = selectData.map((item) => {
          item.num = item.statistic
          item.name = item.status_str
          return item
        })
      },
      changeList(item, index) {
        this.resetReturnsData()
        this.infoTab(index)
        this.infoTabIndex = 0
        switch (index) {
        case 0:
          this.getReturnsList()
          break
        case 1:
          this.getMarketList({page: this.marketPage, source_type: 2})
          break
        }
      },
      addPage(page) {
        // this.marketPage = page
        this.setMarketPage(page)
        this.getMarketList({page, source_type: 2})
      },
      exportExcel() {
        window.open(this.returnsExportUrl, '_blank')
      },
      // 审核
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
      // 删除规则
      checkApply(id) {
        this.checkId = id
        this.$refs.modal.showModal()
      },
      hideModal() {
        this.$refs.modal.hideModal()
      },
      changeStatus(selectStatus) {
        this.setStatus(selectStatus)
        let index = this.statusList.findIndex((item) => +item.status === +this.status)
        this.infoTabIndex = index > 0 ? index : 0
        this.$refs.pagination.beginPage()
      },
      changeShopId(shop) {
        this.setShopId(shop)
        this.$refs.pagination.beginPage()
      },
      async changeTime(time) {
        this.setTime(time)
        await this._statistic()
        this.$refs.pagination.beginPage()
      },
      async changeKeyword() {
        this.setKeyword([this.keywords, this.socialNames])
        await this._statistic()
        this.$refs.pagination.beginPage()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .purchase-order
    flex: 1
    display: flex
    flex-direction: column
  .with-search
    height: 28px
    width: 187px
    margin-right: 10px
    color: $color-text-main
    font-family: $font-family-regular
    font-size: $font-size-12
    box-sizing: border-box
    border: 0.5px solid $color-line
    border-radius: 2px
    padding-left: 14px
    transition: all 0.2s
    &:hover
      border: 1px solid #ACACAC
    &::placeholder
      font-family: $font-family-regular
      color: $color-text-assist
    &:focus
      border: 0.5px solid $color-main !important
  .search-icon-box
    overflow: hidden
    height: 28px
    width: 47px
    border-radius: 2px
    background: $color-main
    text-align: center
    line-height: 28px
    font-size: $font-size-12
    color: $color-white
    &:hover
      opacity: 0.8
  textarea::-webkit-input-placeholder
    font-size: $font-size-14
    color: #ACACAC
  .list-box
    .list-item
      &:nth-child(1)
        min-width: 188px
      &:nth-child(7)
        flex: 0.8
      &:nth-child(8), &:nth-child(4)
        flex: 0.6
      &:last-child
        padding: 0
        max-width: 76px
  .Auditing
    width: 380px
    height: 225px
    padding: 0 20px
    box-sizing: border-box
    background: $color-white
    border-radius: 2px
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.6)
    text-align: center
    .top
      height: 59.5px
      border-bottom: 0.5px solid $color-line
      align-items: center
      justify-content: space-between
      padding: 0 20px
      layout(row)

    .title-box
      display: flex
      box-sizing: border-box
      padding: 23px 0
      align-items: center
      justify-content: space-between
      .title
        font-size: $font-size-16
        font-family: $font-family-medium
        line-height: 1
        color: $color-text-main
      .close
        width: 12px
        height: @width
        icon-image('icon-close')
    .textarea-box
      margin-top: -3px
      .modelarea
        font-size: $font-size-14
        width: 100%
        resize: none
        height: 76px
        padding: 13px 11px
        box-sizing: border-box
        border-radius: 2px
        border: 0.5px solid $color-line
        background: #F9F9F9
        &:focus
          background: $color-white

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
      border-radius: 2px
      font-family: $font-family-regular
      font-size: $font-size-12
      color: $color-white
      text-align: center

  .list-text-name
    no-wrap()
    font-family: $font-family-regular
    font-size: $font-size-14
</style>
