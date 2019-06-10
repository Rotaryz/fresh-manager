<template>
  <div class="pru-item">
    <div class="down-content">
      <span class="down-tip">创建时间</span>
      <div class="down-item">
        <base-date-select placeHolder="选择创建时间" :dateInfo="[msg.startTime, msg.endTime]" @getTime="changeTime"></base-date-select>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="../icon-coupon_list@2x.png" class="identification-icon">
          <p class="identification-name">优惠券列表</p>
        </div>
        <div class="function-btn">
          <router-link tag="div" to="new-coupon" append class="btn-main">新建优惠券<span class="add-icon"></span></router-link>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item, idx) in couponTitle" :key="idx" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <!--v-for="(item, index) in deliveryOrder" :key="index"-->
          <div class="list-content list-box">
            <div class="list-item">item.created_at}}</div>
            <div class="list-item">item.social_name}}</div>
            <div class="list-item">item.name}}</div>
            <div class="list-item">item.total}}</div>
            <div class="list-item">item.delivery_at}}</div>
            <div class="list-item">item.delivery_at}}</div>
            <div class="list-item">item.delivery_at}}</div>
            <div class="list-item">item.delivery_at}}</div>
            <div class="list-item">item.delivery_at}}</div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <!--:pageDetail="pageDetail" :pagination="msg.page" @addPage="changePage"-->
        <base-pagination ref="pagination"></base-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  const PAGE_NAME = 'GOODS-COUPON'
  const COUPON_TITLE = ['商品券名称', '面值', '有效期', '创建时间', '发放总数', '剩余数量', '已领取数', '已使用数', '操作']
  export default {
    name: PAGE_NAME,
    props: {},
    data() {
      return {
        couponTitle: COUPON_TITLE
      }
    }
  }
</script>

<style scoped>

</style>
