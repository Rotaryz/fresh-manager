<template>
  <div class="leader-list">
    <div class="tab-header">
      <div class="btn-main">新建团长 +</div>
    </div>
    <div class="list-header list-box">
      <div v-for="(item,index) in leaderTitle" :key="index" class="list-item">{{item}}</div>
    </div>
    <div class="list">
      <div v-for="(item, index) in leaderList" :key="index" class="list-content list-box">
        <div class="list-item">{{item.mobile}}</div>
        <div class="list-item">{{item.nickname}}</div>
        <div class="list-item">{{item.wx_account}}</div>
        <div class="list-item">{{item.social_name}}</div>
        <div class="list-item">{{item.name}}</div>
        <div class="list-item">{{item.address}}</div>
        <div class="list-item">{{item.created_at}}</div>
        <div class="list-item list-operation-box">
          <router-link tag="span" :to="'edit-leader?id=' + item.id" append class="list-operation">编辑</router-link>
          <span class="list-operation">店铺码</span>
        </div>
      </div>
    </div>
    <div class="pagination-box">
      <base-pagination :pageDetail="pageTotal"></base-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {leaderComputed} from '@state/helpers'

  const PAGE_NAME = 'LEADER_LIST'
  const TITLE = '团长列表'
  const LEADER_TITLE = ['团长账号', '微信昵称', '微信号', '社区名称', '团长名称', '详细地址', '创建时间', '操作']

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        leaderTitle: LEADER_TITLE,
        page: 1
      }
    },
    computed: {
      ...leaderComputed
    },
    created() {
      console.log(this.pageTotal)
    },
    methods: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .leader-list
    overflow: hidden
    flex: 1
    display: flex
    flex-direction: column

  .tab-header
    height: 80px
    display: flex
    justify-content: space-between
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
      &:nth-child(6), &:nth-child(7)
        flex: 1.5
      &:last-child
        flex: 0.8

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
      // 双行样式
      .list-double-row
        .item-sub
          margin-top: 8px
          font-size: $font-size-14
          color: $color-text-assist
        .item-dark
          font-size: $font-size-14

  .pagination-box
    height: 70px
    align-items: center
    display: flex
</style>
