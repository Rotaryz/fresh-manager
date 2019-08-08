<template>
  <div class="pru-item">
    <div class="down-content">
      <span class="down-tip">创建时间</span>
      <div class="down-item">
        <base-date-select placeHolder="选择创建时间" :dateInfo="[requestData.created_start_at, requestData.created_end_at]" @getTime="changeTime"></base-date-select>
      </div>
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search ref="search" placeHolder="请输入兑换券名称" @search="searchHandle"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="../icon-coupon_list@2x.png" class="identification-icon">
          <p class="identification-name">兑换券列表</p>
          <base-status-tab :statusList="statusTab" :infoTabIndex="+defaultIndex" @setStatus="changeStatus"></base-status-tab>
        </div>
        <div class="function-btn">
          <router-link tag="div" to="edit-commodity" append class="btn-main">新建兑换券<span class="add-icon"></span></router-link>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item, idx) in couponTitle" :key="idx" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-if="couponList.length">
            <div v-for="(item, index) in couponList" :key="index" class="list-content list-box">
              <div class="list-item">{{item.coupon_name}}</div>
              <div class="list-item">{{item.coupon_name}}类型</div>
              <div class="list-item">{{item.denomination}}</div>
              <div class="list-item">{{item.denomination}}状态</div>
              <div class="list-item">{{item.created_at}}</div>
              <div class="list-item list-double-row">
                <p class="item-dark">{{item.start_at}}</p>
                <p class="item-dark">{{item.end_at}}</p>
              </div>
              <div class="list-item">{{item.total_stock}}</div>
              <div class="list-item">{{item.usable_stock}}</div>
              <div class="list-item">{{item.customer_coupon_count}}</div>
              <div class="list-item">{{item.customer_coupon_used_count}}</div>
              <div class="list-item">
                <router-link tag="div" :to="`edit-commodity?id=${item.id}`" append class="list-operation">查看</router-link>
                <div class="list-operation" @click="showDel(item)">删除</div>
              </div>
            </div>
          </div>
          <base-blank v-else></base-blank>
        </div>
      </div>
      <!---->
      <div class="pagination-box">
        <!-- :pagination="goodsCoupon.page" -->
        <base-pagination ref="pagination" :pagination="requestData.page" :pageDetail="pageDetail" @addPage="changePage"></base-pagination>
      </div>
    </div>
    <default-confirm ref="confirm" infoTitle="删除兑换券" :oneBtn="false" @confirm="sureConfirm"></default-confirm>
  </div>
</template>

<script>
  import {couponComputed, couponMethods} from '@state/helpers'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import API from '@api'

  const PAGE_NAME = 'GOODS-COUPON'
  const COUPON_TITLE = [
    '兑换券名称',
    '类型todo',
    '面值',
    '状态todo',
    '创建时间',
    '有效时间',
    '发放总数',
    '剩余数量',
    '已领取数',
    '已使用数',
    '操作'
  ]
  export default {
    name: PAGE_NAME,
    components: {
      DefaultConfirm
    },
    props: {},
    data() {
      return {
        couponTitle: COUPON_TITLE,
        // page: 1,
        // startTime: '',
        // endTime: '',
        delId: null,
        statusTab: [
          {name: '全部', status: '', num: 0},
          {name: '进行中', status: 1, num: 0},
          {name: '未开始', status: 1, num: 0},
          {name: '已结束', status: 1, num: 0}
        ],
      }
    },
    computed: {
      ...couponComputed
    },
    methods: {
      ...couponMethods,
      changeStatus(status, index) {
        this.setDefaultIndex({status: status.status, index})
        this.$refs.pagination.beginPage()
      },
      getCouponStatus() {
        API.Coupon.getCouponStatus({
          tag_type: this.infoTabIndex,
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
      searchHandle(keyword) {
        this.setRequestData({keyword, page: 1})
        this.$refs.pagination.beginPage()
      },
      changeTime(time) {
        this.setRequestData({
          created_start_at: time[0],
          created_end_at: time[1],
          page: 1
        })
        this.$refs.pagination.beginPage()
      },
      changePage(page) {
        this.setRequestData({page})
      },
      // 确认删除
      async sureConfirm() {
        let res = await API.Coupon.deleteCoupon(this.delId)
        this.$toast.show(res.message)
        if (res.error !== this.$ERR_OK) {
          return
        }
        if (+this.pageDetail.total%10 === 1 && +this.requestData.page === +this.pageDetail.total_page) {
          this.setRequestData({page: this.pageDetail.total_page - 1})
        } else {
          this.getCouponList()
        }
      },
      showDel(item) {
        this.delId = item.id
        this.$refs.confirm.show('删除后将无法查看兑换券的信息，且无法恢复，谨慎操作！')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .list-box
    .list-item
      font-size: $font-size-14
      &:last-child
        padding: 0
        max-width: 80px
      .item
        text-overflow: ellipsis
        overflow: hidden
        white-space: nowrap
        font-size: 14px

</style>
