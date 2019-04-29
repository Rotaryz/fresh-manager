<template>
  <div class="leader-list table">
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-bandit_list@2x.png" class="identification-icon">
          <p class="identification-name">团长列表</p>
          <base-status-tab :statusList="statusTab" @setStatus="changeStatus"></base-status-tab>
          <p class="header-text">团长可使用账号数量为{{topData.total}}个，当前剩余{{topData.usable}}个</p>
        </div>
        <div class="function-btn">
          <router-link to="/home/leader-list/edit-leader" tag="div" class="btn-main">新建团长<span class="add-icon"></span></router-link>
          <!--<div class="btn-main g-btn-item" @click="_syncLeader">关联</div>-->
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in leaderTitle" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in leaderList" :key="index" class="list-content list-box">
            <div class="list-item">{{item.mobile || '---'}}</div>
            <div class="list-item">{{item.nickname || '---'}}</div>
            <div class="list-item">{{item.wx_account || '---'}}</div>
            <div class="list-item">{{item.social_name || '---'}}</div>
            <div class="list-item">{{item.name || '---'}}</div>
            <div class="list-item">{{item.address || '---'}}</div>
            <div class="list-item">{{item.created_at || '---'}}</div>
            <!--<div class="list-item">{{item.is_freeze_str}}</div>-->
            <!--<div class="list-item">{{item.out_id ? '已关联' : '未关联'}}</div>-->
            <div class="list-item" @click="_showFreeze(item, index)">
              <base-switch :status="statusHandle(item, index)" confirmText="正常" cancelText="禁用"></base-switch>
            </div>
            <div class="list-item list-operation-box">
              <router-link tag="span" :to="'edit-leader?id=' + item.id" append class="list-operation">编辑</router-link>
              <span class="list-operation" @click="_getQrCode(item.id, index)">店铺码</span>
              <!--<span class="list-operation" @click="_showFreeze(item.is_freeze, item.id)">{{item.is_freeze ? '解冻' : '冻结'}}</span>-->
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination" :pageDetail="pageTotal" @addPage="_getMore"></base-pagination>
      </div>
      <default-modal v-if="leaderList.length" ref="dialog">
        <div slot="content" class="pop-main code">
          <div class="shade-header">
            <div class="shade-title">{{leaderList[imgIndex].social_name}}</div>
            <!--@click="_cancelGoods"-->
            <span class="close hand" @click="_close"></span>
          </div>
          <div class="img-box">
            <img v-if="!loadImg" key="1" :src="codeUrl" alt="" class="xcx-img">
            <img v-if="loadImg" key="2" src="./loading.gif" alt="" class="load-img">
          </div>
        </div>
      </default-modal>
      <default-confirm ref="confirm" @confirm="_freeze"></default-confirm>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {leaderComputed, leaderMethods} from '@state/helpers'
  import DefaultModal from '@components/default-modal/default-modal'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import API from '@api'

  const PAGE_NAME = 'LEADER_LIST'
  const TITLE = '团长列表'
  const LEADER_TITLE = [
    '团长账号',
    '微信昵称',
    '微信号',
    '社区名称',
    '团长名称',
    '详细地址',
    '创建时间',
    '状态',
    // '是否关联',
    '操作'
  ]

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultModal,
      DefaultConfirm
    },
    data() {
      return {
        statusTab: [
          {name: '全部', value: '', num: 0},
          {name: '正常', value: '', num: 0},
          {name: '禁用', value: 1, num: 0}
        ],
        leaderTitle: LEADER_TITLE,
        page: 1,
        loadImg: true,
        codeUrl: '',
        imgIndex: 0,
        freezeItem: {},
        freezeIndex: '',
        topData: {},
        statusArr: new Array(10).fill(undefined)
      }
    },
    computed: {
      ...leaderComputed
    },
    created() {
      this.getTopData()
      this.getLeaderStatus()
    },
    methods: {
      ...leaderMethods,
      getLeaderStatus() {
        API.Leader.getLeaderStatus()
          .then(res => {
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
          })
      },
      changeStatus(selectStatus) {
        this.status = selectStatus.status
        this.$refs.pagination.beginPage()
        this.page = 1
        this.statusArr = new Array(10).fill(undefined)
        this.getLeaderList({page: this.page, status: selectStatus.status, loading: false})
      },
      async _syncLeader() {
        let res = await API.Leader.syncShop()
        this.$loading.hide()
        if (res.error === this.$ERR_OK) {
          this.$toast.show('关联成功')
          this.page = 1
          this.$refs.pagination.beginPage()
          this.getLeaderList({page: this.page, status: this.status, loading: false})
        }
      },
      getTopData() {
        API.Leader.getTopData()
          .then(res => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return
            }
            this.topData = res.data.store
          })
      },
      _getMore(page) {
        this.page = page
        this.statusArr = new Array(10).fill(undefined)
        this.getLeaderList({page: this.page, status: this.status, loading: false})
      },
      _close() {
        this.$refs.dialog.hideModal()
      },
      async _getQrCode(id, index) {
        this.imgIndex = index
        this.loadImg = true
        let res = await API.Leader.createQrcode({path: 'pages/choiceness?s=' + id, is_hyaline: false})
        if (res.error !== this.$ERR_OK) {
          this.$toast.show(res.message)
          return
        }
        this.$refs.dialog.showModal()
        this.loadImg = false
        this.codeUrl = res.data.image_url
      },
      statusHandle(item, index) {
        let status = 0
        if (typeof(this.statusArr[index]) === 'number') {
          status = this.statusArr[index]
        } else {
          status = item.is_freeze ? 0 : 1
        }
        return status
      },
      _showFreeze(item, index) {
        this.freezeItem = item
        this.freezeIndex = index
        let status = 1
        if (typeof(this.statusArr[index]) === 'number') {
          status = this.statusArr[index]
        } else {
          status = item.is_freeze ? 0 : 1
        }
        let title = status ? '确定冻结该团长？' : '确定解冻该团长？'
        this.$refs.confirm.show(title)
      },
      async _freeze() {
        let res = await API.Leader.shopToggleFrozen({shop_id: this.freezeItem.id})
        this.$toast.show(res.message)
        if (res.error !== this.$ERR_OK) {
          return
        }
        this.statusArr = this.statusArr.map((item, ind) => {
          if (this.freezeIndex === ind) {
            if (typeof(item) === 'number') {
              item = item ? 0 : 1
            } else {
              item = this.freezeItem.is_freeze
            }

          }
          return item
        })
        this.getTopData()
        this.getLeaderStatus()
        // this.getLeaderList({page: this.page, status: this.status, loading: false})
        this.$refs.confirm.hide()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .tab-header
    height: 80px
    display: flex
    justify-content: space-between
    align-items: center
    box-sizing: border-box

  .header-text
    color: $color-text-assist
    font-size: $font-size-14
    margin-left: 20px
    font-family: $font-family-regular
  .list-box
    .list-item
      box-sizing: border-box
      padding-right: 10px
      flex: 1
      &:nth-child(6), &:nth-child(7)
        flex: 1.5
      &:nth-child(8)
        flex: 0.9
      &:last-child
        padding: 0
        max-width: 90px
        flex: 1.8

  .pop-main
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.60)
    border-radius: 2px
    background: $color-white
    width: 530px
    height: 360px
    box-sizing: border-box
    text-align: left
    display: flex
    flex-direction: column
    .shade-header
      display: flex
      align-items: center
      justify-content: space-between
      height: 60.5px
      box-sizing: border-box
      padding: 0 20px
      border-bottom: 0.5px solid $color-line
    .shade-title
      color: $color-text-main
      font-family: $font-family-regular
      font-size: $font-size-16
    .close
      icon-image('icon-close')
      width: 16px
      height: @width
      transition: all 0.3s
      &:hover
        transform: scale(1.3)
    .img-box
      flex: 1
      display: flex
      align-items: center
      justify-content: center
    .xcx-img
      display: block
      width: 238px
      height: @width

    .load-img
      display: block
      width: 40px
      height: 40px
</style>
