<template>
  <div class="pru-item">
    <div class="down-content">
      <span class="down-tip">创建时间</span>
      <div class="down-item">
        <base-date-select placeHolder="选择创建时间" :dateInfo="[startTime, endTime]" @getTime="changeTime"></base-date-select>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="../icon-coupon_list@2x.png" class="identification-icon">
          <p class="identification-name">商品券列表</p>
        </div>
        <div class="function-btn">
          <router-link tag="div" to="edit-commodity" append class="btn-main">新建商品券<span class="add-icon"></span></router-link>
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
              <div class="list-item">{{item.denomination}}</div>
              <div class="list-item list-double-row">
                <p class="item-dark">{{item.start_at}}</p>
                <p class="item-dark">{{item.end_at}}</p>
              </div>
              <div class="list-item">{{item.created_at}}</div>
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
        <base-pagination ref="pagination" :pageDetail="pageTotal" @addPage="changePage"></base-pagination>
      </div>
    </div>
    <default-confirm ref="confirm" infoTitle="删除商品券" :oneBtn="false" @confirm="sureConfirm"></default-confirm>
  </div>
</template>

<script>
  import {couponComputed, couponMethods} from '@state/helpers'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import API from '@api'

  const PAGE_NAME = 'GOODS-COUPON'
  const COUPON_TITLE = ['商品券名称', '面值', '有效期', '创建时间', '发放总数', '剩余数量', '已领取数', '已使用数', '操作']
  export default {
    name: PAGE_NAME,
    components: {
      DefaultConfirm
    },
    props: {
      goodsMsg: {
        type: Object,
        default: () => {
          return {
            page: 1,
            startTime: '',
            endTime: ''
          }
        }
      }
    },
    data() {
      return {
        couponTitle: COUPON_TITLE,
        page: 1,
        startTime: '',
        endTime: '',
        delId: null
      }
    },
    computed: {
      ...couponComputed
    },
    methods: {
      ...couponMethods,
      changeTime(time) {
        this.startTime = time[0]
        this.endTime = time[1]
        this.page = 1
        this.getGoodsCoupon()
        this.$refs.pagination.beginPage()
      },
      getGoodsCoupon() {
        this.getCouponList({startTime: this.startTime, endTime: this.endTime, page: this.page, tagType: 1, loading: false})
      },
      changePage(page) {
        this.page = page
        this.getGoodsCoupon()
      },
      // 确认删除
      async sureConfirm() {
        let res = await API.Coupon.deleteCoupon(this.delId)
        this.$toast.show(res.message)
        if (res.error !== this.$ERR_OK) {
          return
        }
        this.getGoodsCoupon()
      },
      showDel(item) {
        this.delId = item.id
        this.$refs.confirm.show('删除后将无法查看商品券的信息，且无法恢复，谨慎操作！')
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
