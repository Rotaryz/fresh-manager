<template>
  <div class="rush-purchase table">
    <div class="down-content">
      <span class="down-tip">活动筛选</span>
      <div class="down-item">
        <base-date-select placeHolder="选择活动时间" @getTime="_setTime"></base-date-select>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-today_rob@2x.png" class="identification-icon">
          <p class="identification-name">今日抢购</p>
        </div>
        <div class="function-btn">
          <router-link tag="div" to="edit-rush" append class="btn-main">新建活动<span class="add-icon"></span></router-link>
        </div>
      </div>
      <!--<div class="tab-header">-->
      <!--<router-link tag="div" to="edit-rush" append class="btn-main">新建活动 +</router-link>-->
      <!---->
      <!--</div>-->
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in rushTitle" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-for="(item,index) in rushList" :key="index" class="list-content list-box">
            <div class="list-item">{{item.activity_name || '---'}}</div>
            <div class="list-item list-double-row">
              <p class="item-dark">{{item.start_at}}</p>
              <p class="item-sub">{{item.end_at}}</p>
            </div>
            <div class="list-item">{{item.goods_count}}</div>
            <div class="list-item">{{item.sale_count}}</div>
            <div class="list-item"><span class="list-status" :class="item.status === 1 ? 'list-status-success' : item.status === 2 ? 'list-status-fail' : ''"></span>{{item.status === 0 ? '未开始' : item.status === 1 ? '进行中' : item.status === 2 ? '已关闭' : ''}}</div>
            <div class="list-item">{{item.created_at}}</div>
            <div class="list-item list-operation-box">
              <router-link tag="span" :to="'/home/rush-purchase/edit-rush?disable=2'+'&id=' + item.id" class="list-operation">详情</router-link>
              <span v-if="item.status === 2" class="list-operation" @click="_deleteRush(item.id)">删除</span>
              <router-link v-else tag="span" :to="'/home/rush-purchase/edit-rush?id=' + item.id" class="list-operation">编辑</router-link>
              <span v-if="item.status !== 2" class="list-operation" @click="_downRush(item.id, item.status)">关闭</span>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pages" :pageDetail="rushPage" @addPage="addPage"></base-pagination>
      </div>
    </div>
    <default-confirm ref="confirm" @confirm="_sureConfirm"></default-confirm>
    <default-confirm ref="downConfirm" @confirm="_sureDown"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import {rushComputed, rushMethods} from '@state/helpers'
  import API from '@api'

  const PAGE_NAME = 'RUSH_PURCHASE'
  const TITLE = '今日抢购'
  const RUSH_TITLE = ['活动名称', '活动时间', '活动商品数', '销量', '状态', '创建时间', '操作']

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
        rushTitle: RUSH_TITLE,
        startTime: '',
        endTime: '',
        page: 1,
        delId: 0,
        downId: 0,
        status: 0
      }
    },
    computed: {
      ...rushComputed
    },
    methods: {
      ...rushMethods,
      _downRush(id, status) {
        this.$refs.downConfirm.show('是否确定关闭该活动？')
        this.downId = id
        this.status = status === 2 ? 1 : 0
      },
      async _sureDown() {
        let res = await API.Rush.downGoods({is_online: this.status, activity_id: this.downId})
        this.$toast.show(res.message)
        if (res.error !== this.$ERR_OK) {
          return
        }
        this.getRushList({page: this.page, startTime: this.startTime, endTime: this.endTime})
      },
      _setTime(arr) {
        this.$refs.pages.beginPage()
        this.page = 1
        this.startTime = arr[0]
        this.endTime = arr[1]
        this.getRushList({page: this.page, startTime: this.startTime, endTime: this.endTime})
      },
      addPage(page) {
        this.page = page
        this.getRushList({page: this.page, startTime: this.startTime, endTime: this.endTime})
      },
      _deleteRush(id) {
        this.delId = id
        this.$refs.confirm.show('确定删除该活动？')
      },
      async _sureConfirm() {
        let res = await API.Rush.deleteGoods(this.delId)
        this.$toast.show(res.message)
        if (res.error !== this.$ERR_OK) {
          return
        }
        this.getRushList({page: this.page, startTime: this.startTime, endTime: this.endTime})
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .list
    flex: 1
    .list-item
      no-wrap()
      font-size: $font-size-14
      .list-status
        display: inline-block
        width: 9px
        height: 9px
        border-radius: 50%
        margin-right: 6px
        background: $color-negative
      .list-status-fail
        background: #E1E1E1
      .list-status-success
        background: $color-positive

  .btn-main
    margin-right: 10px
</style>
