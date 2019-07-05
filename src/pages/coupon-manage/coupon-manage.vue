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
          <div class="list">
            <div v-for="(item, index) in couponList" :key="index" class="list-content list-box">
              <div v-for="(val, ind) in couponTitle" :key="ind" :style="{flex: val.flex}" class="list-item">
                <div v-if="+val.type === 1" :style="{flex: val.flex}" class="item">
                  {{item[val.value] || 0}}
                </div>
                <div v-if="+val.type === 2" :style="{flex: val.flex}" class="item">
                  {{item[val.value] || 0}}{{+item.preferential_type === 1 ? '折' : '元'}}
                </div>
                <div v-if="+val.type === 3" :style="{flex: val.flex}" class="list-double-row item">
                  <p class="item-dark">{{item.start_at}}</p>
                  <p class="item-sub">{{item.end_at}}</p>
                </div>
                <div v-if="+val.type === 4" class="list-item list-use">
                  <router-link tag="span" :to="'new-coupon?id=' + (item.id || 0)" append class="list-operation">查看</router-link>
                  <span class="list-operation" @click="_deleteCoupon(item, item.id)">删除</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="pagination-box">
          <base-pagination ref="pagination" :pageDetail="pageDetail" :pagination="requestData.page" @addPage="changePage"></base-pagination>
        </div>
      </div>
    </div>
    <goods-coupon v-show="infoTabIndex === 1" ref="goodsCoupon"></goods-coupon>
    <default-confirm ref="confirm" infoTitle="删除优惠券" :oneBtn="false" @confirm="_sureConfirm"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import GoodsCoupon from './goods-coupon/goods-coupon'
  import {couponComputed, couponMethods} from '@state/helpers'

  const PAGE_NAME = 'COUPON_MANAGE'
  const TITLE = '优惠券列表'
  const DATE_PLACE_HOLDER = '选择时间'

  const ORDERSTATUS = [{text: '优惠券', status: 1}, {text: '兑换券', status: 0}]
  const COUPON_TITLE = [
    {name: '优惠券名称', flex: 1.4, value: 'coupon_name', type: 1},
    {name: '类型', flex: 1, value: 'preferential_str', type: 1},
    {name: '面值', flex: 1, value: 'denomination', type: 2},
    {name: '使用范围', flex: 1, value: 'range_type_str', type: 1},
    {name: '有效时间', flex: 1.2, value: '', type: 3},
    {name: '创建时间', flex: 1.2, value: 'created_at', type: 1},
    {name: '发放总数', flex: 1, value: 'total_stock', type: 1},
    {name: '剩余数量', flex: 1, value: 'usable_stock', type: 1},
    {name: '已领取数', flex: 1, value: 'customer_coupon_count', type: 1},
    {name: '已使用数', flex: 1, value: 'customer_coupon_used_count', type: 1},
    {name: '操作', flex: 1.2, value: '', type: 4}
  ]
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultConfirm,
      GoodsCoupon
    },
    data() {
      return {
        tabStatus: ORDERSTATUS,
        datePlaceHolder: DATE_PLACE_HOLDER,
        couponTitle: COUPON_TITLE,
        statusTab: [
          {name: '全部', value: '', num: 0},
          {name: '进行中', value: 1, num: 0},
          {name: '未开始', value: 1, num: 0},
          {name: '已过期', value: 1, num: 0}
        ],
        delId: '',
        delItem: {}
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
      changePage(page) {
        // this.msg.page = page
        this.setRequestData({page})
        // this.getCouponList(this.msg)
      },
      _deleteCoupon(item, id) {
        this.delId = id
        this.delItem = item
        this.$refs.confirm.show('删除后将无法查看优惠券的信息，且无法恢复，谨慎操作！')
      },
      async _sureConfirm() {
        let res = await API.Coupon.deleteCoupon(this.delId)

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
        // this.getCouponList(this.requestData)
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
        max-width: 75px
      .item
        text-overflow: ellipsis
        overflow: hidden
        white-space: nowrap
        font-size: 14px
      .list-double-row > .item-sub
        color: $color-text-main

</style>
