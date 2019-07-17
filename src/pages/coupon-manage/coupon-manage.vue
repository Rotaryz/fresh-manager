<template>
  <div class="purchase-management table">
    <base-tab-select :infoTabIndex="infoTabIndex" :tabStatus="tabStatus" @getStatusTab="changeTab"></base-tab-select>
    <div v-if="infoTabIndex === 0" class="pru-item">
      <div class="down-content">
        <span class="down-tip">创建时间</span>
        <div class="down-item">
          <base-date-select :placeHolder="datePlaceHolder" :dateInfo="[requestData.created_start_at, requestData.created_end_at]" @getTime="changeTime"></base-date-select>
        </div>
      </div>

      <!--优惠券列表-->
      <div class="table-content">
        <div class="identification">
          <div class="identification-page">
            <img src="./icon-coupon_list@2x.png" class="identification-icon">
            <p class="identification-name">优惠券列表</p>
            <base-status-tab :statusList="statusTab" :infoTabIndex="+defaultIndex" @setStatus="changeStatus"></base-status-tab>
          </div>
          <div class="function-btn">
            <router-link tag="div" to="new-coupon" append class="btn-main">新建优惠券<span class="add-icon"></span></router-link>
          </div>
        </div>
        <div class="big-list">
          <div class="list-header list-box">
            <div v-for="(item,index) in couponTitle" :key="index" :style="{flex: item.flex}" class="list-item">{{item.name}}</div>
          </div>
          <div v-if="couponList.length" class="list">
            <div v-for="(item, index) in couponList" :key="index" class="list-content list-box">
              <div v-for="(val, ind) in couponTitle" :key="ind" :style="{flex: val.flex}" class="list-item">

                <div v-if="+val.type === 1" :style="{flex: val.flex}" class="item">
                  {{item[val.value] || 0}}
                </div>
                <div v-if="+val.type === 2" :style="{flex: val.flex}" class="item">
                  {{item[val.value] || 0}}{{+item.preferential_type === 1 ? '折' : '元'}}
                </div>
                <div v-if="+val.type === 3" :style="{flex: val.flex}" class="item">
                  {{+item.status === 0 ? '未开始' : +item.status === 1 ? '进行中' : '已结束'}}
                </div>
                <div v-if="+val.type === 4" class="list-item list-use">
                  <span class="list-operation" @click="viewDataShow(item)">统计</span>
                  <router-link v-if="item.is_online" tag="span" :to="'new-coupon?editId=' + (item.id || 0)" append class="list-operation">编辑</router-link>
                  <router-link v-if="!item.is_online" tag="span" :to="'new-coupon?id=' + (item.id || 0)" append class="list-operation">查看</router-link>
                  <span v-if="item.is_online" class="list-operation" @click="_stopCoupon(item)">停止</span>
                  <span v-if="!item.is_online" class="list-operation" @click="_deleteCoupon(item)">删除</span>
                </div>
                <div v-if="+val.type === 5" :style="{flex: val.flex}" class="item">
                  {{item[val.value] > 0 ? item[val.value] : '无门槛'}}
                </div>
              </div>
            </div>
          </div>
          <base-blank v-else blackStyle="margin-top:15%"></base-blank>
        </div>
        <div class="pagination-box">
          <base-pagination ref="pagination" :pageDetail="pageDetail" :pagination="requestData.page" @addPage="changePage"></base-pagination>
        </div>
      </div>
    </div>

    <!--统计-->
    <div v-if="showViewData" class="view-data">
      <div class="view-header">
        <div class="title">
          <img src="./icon-@2x.png" alt="" class="data-icon">
          <p class="name">“{{currentItem.coupon_name}}”效果统计</p>
          <span class="text">(统计至前一天)</span>
        </div>
        <div class="right">
          <p class="export hand" @click="exportData">
            <span class="export-icon"></span>
            <span>导出</span>
          </p>
          <span class="close hand" @click="closeData"><img src="./icon-close@2x.png" alt="" class="close-icon"></span>
        </div>
      </div>
      <div class="view-num">
        <p class="data-title">投入产出统计</p>
        <div class="data-num">
          <div v-for="(item, index) in viewData" :key="index" class="data-item">
            <img :src="require('./'+item.icon+'@2x.png')" alt="" class="icon">
            <div class="num-text hand" @click="showDescription(index)">
              <span class="name">{{item.name}} <img src="./icon-help@2x.png" alt="" class="name-icon"></span>
              <span class="num">{{item.num}}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="image-data">
        <p class="data-title">优惠券使用统计</p>
        <div class="data-box">
          <funnel-data ref="funnel" :chartData="chartData" chartId="funnel"></funnel-data>
        </div>
      </div>
    </div>

    <description-modal ref="description"></description-modal>
    <!--兑换券-->
    <goods-coupon v-show="infoTabIndex === 1" ref="goodsCoupon"></goods-coupon>
    <default-confirm ref="confirm" :infoTitle="infoTitle" :oneBtn="false" @confirm="_sureConfirm"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import GoodsCoupon from './goods-coupon/goods-coupon'
  import DescriptionModal from './description-modal/description-modal'
  import FunnelData from './funnel-data/funnel-data'
  import {couponComputed, couponMethods} from '@state/helpers'

  const PAGE_NAME = 'COUPON_MANAGE'
  const TITLE = '优惠券列表'
  const DATE_PLACE_HOLDER = '选择时间'

  const ORDERSTATUS = [{text: '优惠券', status: 1}, {text: '兑换券', status: 0}]
  const COUPON_TITLE = [
    {name: '创建时间', flex: 1.2, value: 'created_at', type: 1},
    {name: '优惠券名称', flex: 1.4, value: 'coupon_name', type: 1},
    {name: '类型', flex: 1, value: 'preferential_str', type: 1},
    {name: '使用范围', flex: 1, value: 'range_type_str', type: 1},
    {name: '使用门槛', flex: 1, value: 'condition', type: 5},
    {name: '面值', flex: 1, value: 'denomination', type: 2},
    {name: '状态', flex: 1, value: 'status', type: 3},
    {name: '操作', flex: 1.2, value: '', type: 4}
  ]

  const VIEW_DATA = [
    {
      name: '用券成交金额(元)',
      icon: 'icon-use_coupon',
      num: '600.00'
    },
    {
      name: '优惠总金额(元)',
      icon: 'icon-entered_account',
      num: '200.00'
    },
    {
      name: 'ROI',
      icon: 'icon-pending_entry',
      num: '100.00'
    }
  ]
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultConfirm,
      GoodsCoupon,
      FunnelData,
      DescriptionModal
    },
    data() {
      return {
        tabStatus: ORDERSTATUS,
        datePlaceHolder: DATE_PLACE_HOLDER,
        couponTitle: COUPON_TITLE,
        viewData: VIEW_DATA,
        statusTab: [
          {name: '全部', value: '', num: 0},
          {name: '进行中', value: 1, num: 0},
          {name: '未开始', value: 1, num: 0},
          {name: '已过期', value: 1, num: 0}
        ],
        delId: '',
        delItem: {},
        confirmType: '',
        showViewData: false,
        infoTitle: '停止优惠券',
        chartDataArr: ['total_num', 'received_num', 'used_num'],
        chartData: [
          {
            value: 1,
            name: '优惠券总数'
          },
          {
            value: 1,
            name: '已发放'
          },
          {
            value: 1,
            name: '已使用'
          }
        ]
      }
    },
    computed: {
      ...couponComputed
    },
    created() {
      this.getCouponStatus()
    },
    methods: {
      ...couponMethods,
      changeTab(item, index) {
        this.setInfoIndex(index)
        this.getCouponList()
      },
      getCouponStatus() {
        API.Coupon.getCouponStatus({
          created_start_at: this.requestData.created_start_at,
          created_end_at: this.requestData.created_end_at
        }).then(
          (res) => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return
            }
            this.statusTab = res.data.map((item, index) => {
              return {
                name: item.status_str,
                status: item.status,
                num: item.statistic
              }
            })
          }
        )
      },
      changeStatus(status, index) {
        // this.msg.status = status.status
        // this.msg.page = 1
        this.setDefaultIndex({status: status.status, index})
        this.$refs.pagination.beginPage()
        // this.getCouponList(this.msg)
      },
      async changeTime(time) {
        // this.msg.startTime = time[0]
        // this.msg.endTime = time[1]
        // this.msg.page = 1
        this.setRequestData({
          created_start_at: time[0],
          created_end_at: time[1],
          page: 1
        })
        // this.getCouponList(this.requestData)
        this.getCouponStatus()
        this.$refs.pagination.beginPage()
      },
      viewDataShow(item) {
        this.currentItem = item
        this.getCouponData()
      },
      getCouponData() {
        API.Coupon.getCouponData({
          tag_type: 0,
          coupon_id: this.currentItem.id
        })
          .then(res => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return
            }
            this.chartData = this.chartDataArr.map((item, index) => {
              return {
                value: res.data[item],
                name: this.chartData[index].name
              }
            })
            this.viewData[0].num = res.data.trade_total
            this.viewData[1].num = res.data.discount_total
            this.viewData[2].num = res.data.roi_value
            this.showViewData = true
          })
      },
      exportUrl() {
        let currentId = this.getCurrentId()
        let token = this.$storage.get('auth.currentUser', '')
        let data = {
          current_corp: currentId,
          current_shop: process.env.VUE_APP_CURRENT_SHOP,
          access_token: token.access_token,
          tag_type: 0,
          coupon_id: this.currentItem.id
        }
        let search = []
        for (let key in data) {
          search.push(`${key}=${data[key]}`)
        }
        return process.env.VUE_APP_API + '/social-shopping/api/backend/coupon-manage/coupon/coupon-report/day-report-export?' + search.join('&')
      },
      exportData() {
        window.open(this.exportUrl())
      },
      showDescription(index) {
        this.$refs.description.show(index)
      },
      closeData() {
        this.showViewData = false
      },
      changePage(page) {
        this.setRequestData({page})
      },
      _stopCoupon(item) {
        this.currentItem = item
        this.confirmType = 'stop'
        this.infoTitle = '停止优惠券'
        this.$refs.confirm.show('确定停止此优惠券？')
      },
      _deleteCoupon(item) {
        this.currentItem = item
        this.confirmType = 'del'
        this.infoTitle = '删除优惠券'
        this.$refs.confirm.show('删除后将无法查看优惠券的信息，且无法恢复，谨慎操作！')
      },
      async _sureConfirm() {
        this.confirmType === 'del' && API.Coupon.deleteCoupon(this.currentItem.id)
          .then(res => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return
            }
            if (+this.pageDetail.total%10 === 1 && +this.requestData.page === +this.pageDetail.total_page) {
              this.setRequestData({page: this.pageDetail.total_page - 1})
            } else {
              this.getCouponList()
            }
            this.$toast.show('删除成功')
            this.getCouponStatus()
          })
        this.confirmType === 'stop' && API.Coupon.stopCoupon(this.currentItem.id)
          .then(res => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return
            }
            this.$toast.show('停止成功')
            this.getCouponList()
          })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .pru-item
    display: flex
    flex: 1
    flex-direction: column
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

  .list-text-name
    no-wrap()
    font-family: $font-family-regular
    font-size: $font-size-14
  .list-box
    .list-item
      font-size: $font-size-14
      &:last-child
        padding-right: 0
        max-width: 122px
      .item
        text-overflow: ellipsis
        overflow: hidden
        white-space: nowrap
        font-size: 14px
      .list-double-row > .item-sub
        color: $color-text-main
  .view-data
    position: absolute
    width: 100%
    height: 856px
    left: 0
    top: 40px
    z-index: 10
    background: #FFF
    .view-header
      height: 60px
      display: flex
      align-items: center
      justify-content: space-between
      padding: 0 20px
      border-bottom-1px($color-line)
      .title
        display: flex
        align-items: center
      .data-icon
        width: 14px
        height: 14px
      .name
        font-family: $font-family-regular
        font-size: $font-size-16
        color: #333
      .text
        font-family: $font-family-regular
        font-size: $font-size-14
        color: #acacac
        margin-left: 6px
      .right
        display: flex
        align-items: center
      .export
        display: flex
        align-items: center
        font-family: $font-family-regular
        font-size: $font-size-14
        color: #444
        margin-right: 20px
        transition: all 0.2s
        &:hover
          color: #4dbd65
          .export-icon
            background-image: url("./icon-export_2@2x.png")
      .export-icon
        width: 12px
        height: 12px
        margin-right: 5px
        background: url("./icon-export_1@2x.png")
        background-size: 100% 100%
        transition: all 0.2s
      .close
        padding-left: 20px
        border-left-1px(#E6EAED)
        height: 16px
      .close-icon
        width: 12px
        height: 12px
        margin: auto
    .view-num
      padding: 20px 20px 10px
      .data-title
        font-family: $font-family-regular
        font-size: $font-size-16
        color: #333333
      .data-num
        margin-top: 14px
        border-1px($color-line)
        display: flex
        align-items: center
        height: 138px
        padding: 40px 20px
      .data-item
        margin-right: 80px
        display: flex
        align-items: center
      .icon
        width: 58px
        height: 58px
        margin-right: 18px
      .num-text
        color: #333333
        font-family: $font-family-regular
        font-size: $font-size-14
      .name
        display: flex
        align-items: center
        padding-left: 2px
      .name-icon
        width: 14px
        height: 14px
        margin-left: 10px
      .num
        font-size: 32px
        font-family: $font-family-din-bold
        color: #333333
        margin-top: 10px
    .image-data
      padding: 22px 20px 12px
      .data-title
        font-family: $font-family-regular
        font-size: $font-size-16
        color: #333333
      .data-box
        margin-top: 14px
        border-1px($color-line)
        display: flex
        height: 512px
        padding: 44px

</style>
