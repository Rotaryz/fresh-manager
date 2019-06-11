<template>
  <div class="pru-item">
    <div class="down-content">
      <span class="down-tip">创建时间</span>
      <div class="down-item">
        <base-date-select placeHolder="选择创建时间" :dateInfo="[goodsMsg.startTime, goodsMsg.endTime]" @getTime="changeTime"></base-date-select>
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
          <!--v-for="(item, index) in goodsCoupon" :key="index"-->
          <div class="list-content list-box">
            <div class="list-item">item.created_at}}</div>
            <div class="list-item">item.social_name}}</div>
            <div class="list-item">item.name}}</div>
            <div class="list-item">item.total}}</div>
            <div class="list-item">item.delivery_at}}</div>
            <div class="list-item">item.delivery_at}}</div>
            <div class="list-item">item.delivery_at}}</div>
            <div class="list-item">item.delivery_at}}</div>
            <div class="list-item">
              <div class="list-operation">查看</div>
              <div class="list-operation" @click="showDel()">删除</div>
            </div>
          </div>
        </div>
      </div>
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
        couponTitle: COUPON_TITLE
      }
    },
    computed: {
      ...couponComputed
    },
    methods: {
      ...couponMethods,
      changeTime() {

      },
      changePage(time) {

      },
      // 确认删除
      sureConfirm() {

      },
      showDel(item) {
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
