<template>
  <div class="rush-purchase">
    <div class="tab-header">
      <!--<div class="btn-main">新建活动 +</div>-->
      <base-date-select></base-date-select>
    </div>
    <div class="list-header list-box">
      <div v-for="(item,index) in rushTitle" :key="index" class="list-item">{{item}}</div>
    </div>
    <div class="list">
      <div v-for="(item,index) in rushList" :key="index" class="list-content list-box">
        <div class="list-item list-double-row">
          <p class="item-dark">{{item.start_at}}</p>
          <p class="item-sub">{{item.end_at}}</p>
        </div>
        <div class="list-item">{{item.shelf_goods_count}}</div>
        <div class="list-item">{{item.sale_count}}</div>
        <div class="list-item">{{item.delivery_at}}</div>
        <div class="list-item"><span class="list-status" :class="item.status === 1 ? 'list-status-success' : item.status === 2 ? 'list-status-fail' : ''"></span>{{item.status === 0 ? '未开始' : item.status === 1 ? '进行中' : item.status === 2 ? '已关闭' : ''}}</div>
        <div class="list-item">2018-12-07 15:00</div>
        <div class="list-item list-operation-box">
          <router-link tag="span" :to="'/home/rush-purchase/edit-rush?disable='+item.status+'&id=' + item.id" class="list-operation">详情</router-link>
          <span v-if="item.status === 2" class="list-operation">删除</span>
          <router-link v-else tag="span" :to="'/home/rush-purchase/edit-rush?id=' + item.id" class="list-operation">编辑</router-link>
        </div>
      </div>
    </div>
    <div class="pagination-box">
      <base-pagination :pageDetail="rushPage"></base-pagination>
    </div>
    <default-confirm></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import {rushComputed, rushMethods} from '@state/helpers'

  const PAGE_NAME = 'RUSH_PURCHASE'
  const TITLE = '今日抢购'
  const RUSH_TITLE = ['活动时间', '活动商品数', '销量', '预计到货时间', '状态', '创建时间', '操作']

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultConfirm
    },
    data() {
      return {
        rushTitle: RUSH_TITLE
      }
    },
    computed: {
      ...rushComputed
    },
    created() {
      console.log(this.rushList)
    },
    methods: {
      ...rushMethods
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .rush-purchase
    overflow: hidden
    flex: 1
    display: flex
    flex-direction: column

  .tab-header
    height: 80px
    display: flex
    align-items: center
    box-sizing: border-box

  .list-header
    height: 50px
    font-size: $font-size-16
    font-family: $font-family-regular
    color: $color-text-main
    background: $color-list-header

  .list-box
    line-height: 1
    padding-left: 30px
    box-sizing: border-box
    border-bottom: 1px solid $color-line
    display: flex
    align-items: center
    .list-item
      box-sizing: border-box
      padding-right: 10px
      flex: 1
      &:last-child
        flex: 0.6

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
        .list-status
          display: inline-block
          width: 9px
          height: 9px
          border-radius: 50%
          background: #E1E1E1
          margin-right: 6px
        .list-status-fail
          background: $color-negative
        .list-status-success
          background: $color-positive
      // 双行样式
      .list-double-row
        .item-sub
          margin-top: 8px
          font-size: $font-size-14
        .item-dark
          font-size: $font-size-14

  .pagination-box
    height: 70px
    align-items: center
    display: flex
</style>
