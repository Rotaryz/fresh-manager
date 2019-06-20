<template>
  <div class="leader-list table">
    <div class="empty-50">
      <base-tabs :tabList="tabStatus"
                 :defaultTab="leaderListFilter.model_type"
                 :isShowMark="false"
                 tabAlign="left"
                 padding="12px 5px"
                 margin="0 10px"
                 defaultColor="#333333"
                 class="tab-top"
                 @tab-change="tabChange"
      ></base-tabs>
    </div>
    <div class="down-content">
      <!--搜索-->
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search ref="research" :infoText="leaderListFilter.keyword" placeHolder="团长名称/社区名称" @search="searchBtn"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div v-if="leaderListFilter.model_type===0" class="identification">
        <div class="identification-page">
          <img src="./icon-bandit_list@2x.png" class="identification-icon">
          <p class="identification-name">团长列表</p>
          <base-status-nav :statusList="statusList" :value="leaderListFilter.status" valueKey="status" labelKey="status_str" numKey="statistic"
                           @change="changeStatus"
          ></base-status-nav>
          <!--<base-status-tab :infoTabIndex="defaultIndex" :statusList="statusTab" @setStatus="changeStatus"></base-status-tab>-->
          <p class="header-text">团长可使用账号数量为{{topData.total}}个，当前剩余{{topData.usable}}个</p>
        </div>
        <div class="function-btn">
          <router-link to="/home/leader-list/edit-leader" tag="div" class="btn-main">新建团长<span class="add-icon"></span></router-link>
          <!--<div class="btn-main g-btn-item" @click="_syncLeader">关联</div>-->
        </div>
      </div>
      <div v-if="leaderListFilter.model_type===1" class="identification">
        <div class="identification-page">
          <img src="./icon-bandit_list@2x.png" class="identification-icon">
          <p class="identification-name">团长申请表</p>
          <base-status-nav :statusList="statusList" :value="leaderListFilter.status" valueKey="status" labelKey="status_str" numKey="statistic"
                           @change="changeStatus"
          ></base-status-nav>
        </div>
      </div>
      <div :class="['big-list',leaderListFilter.model_type===1 ? 'application-list' : 'leader-list']">
        <div class="list-header list-box">
          <div v-for="(item,index) in leaderTitle" :key="index" class="list-item">{{item}}</div>
        </div>
        <div v-if="leaderList.length && leaderListFilter.model_type===0" class="list">
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
        <div v-if="leaderList.length && leaderListFilter.model_type===1" class="list">
          <div v-for="(item, index) in leaderList" :key="index" class="list-content list-box">
            <div class="list-item">{{item.mobile || '---'}}</div>
            <div class="list-item">{{item.name || '---'}}</div>
            <div class="list-item">{{item.social_name || '---'}}</div>
            <div class="list-item">{{item.address || '---'}}</div>
            <div class="list-item">{{item.status_str || '---'}}</div>
            <div class="list-item photo">
              <img :src="item.shop_photo_url" class="photo" alt="门头照片" @click="showBigImg(item.shop_photo_url)">
              <img :src="item.wx_group_photo_url" class="photo last" alt="微信群照片" @click="showBigImg(item.wx_group_photo_url)">
            </div>
            <!--<div class="list-item">{{item.total_money || '-&#45;&#45;'}}</div>-->
            <div class="list-item">{{item.handle_at || '---'}}</div>
            <div class="list-item list-operation-box">
              <span class="list-operation" @click="showCheck(item, index)">审核</span>
            </div>
          </div>
        </div>
        <base-blank v-if="!leaderList.length" blackStyle="padding-top:15%"></base-blank>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination" :pageDetail="pageTotal" @addPage="_getMore"></base-pagination>
      </div>
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
    <default-modal ref="checkDialog">
      <div slot="content" class="pop-main code check-content">
        <div class="top">
          <div class="title">审核操作</div>
          <span class="close" @click="closeCheck"></span>
        </div>
        <div class="body">
          <div class="activity-tab">
            <div v-for="item in checkList" :key="item.value" class="check-box hand" @click="checkDialogContent.status =item.value">
              <span class="check" :class="{'checked': item.value === checkDialogContent.status}"></span>
              <span class="text">{{item.label}}</span>
            </div>
          </div>
          <div class="edit-input-box">
            <textarea v-model="checkDialogContent.remark" class="edit-text"></textarea>
          </div>
        </div>
        <div class="back">
          <div class="back-cancel back-btn hand" @click="closeCheck">返回</div>
          <div class="back-btn back-submit  hand" @click="_submitCheck">保存</div>
        </div>
      </div>
    </default-modal>
    <default-modal ref="imgModal" class="img-model">
      <div slot="content">
        <div class="top">
          <div class="title">资质审核</div>
          <span class="close" @click="$refs.imgModal.hideModal()"></span>
        </div>
        <div class="model-img-wrap">
          <img :src="currentImgSrc" alt="" class="big-img">
        </div>
      </div>
    </default-modal>
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
  const LEADER_APPLICATION_TILTE = [
    '团长账号',
    '团长名称',
    '社区名称',
    '详细地址',
    '状态',
    '资质审核',
    // '一周交易额',
    '处理时间',
    '操作']
  const ORDERSTATUS = [{text: '团长列表', status: 0,id:'list'}, {text: '团长申请表', status: 1,id:'application'}]

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
        tabStatus: ORDERSTATUS,
        bigImgUrl:'',
        currentLeader:null,
        currentImgSrc:'',
        checkList:[{
          label:'通过',
          value:1
        },{
          label:'拒绝',
          value:0
        }],
        checkDialogContent:{
          status:1,
          remark:''
        },
        statusList: [
          {name: '全部', value: '', num: 0},
          {name: '正常', value: 0, num: 0},
          {name: '禁用', value: 1, num: 0}
        ],
        loadImg: true,
        codeUrl: '',
        freezeId: 0,
        imgIndex: 0,
        freezeItem: {},
        freezeIndex: '',
        topData: {},
        statusArr: new Array(10).fill(undefined)
      }
    },
    computed: {
      ...leaderComputed,
      leaderTitle() {
        return this.leaderListFilter.model_type ===0 ? LEADER_TITLE : LEADER_APPLICATION_TILTE
      }
    },
    created() {
      console.log(this.leaderListFilter.model_type)
      console.log(this.leaderList)
      if(this.leaderListFilter.model_type){
        this.getTopData()
      }
      this._getLeaderStatus()
    },
    methods: {
      ...leaderMethods,
      showBigImg(src){
        this.currentImgSrc =src
        this.$refs.imgModal.showModal()
      },
      showCheck(item,idx){
        this.currentLeader = item
        this.$refs.checkDialog.showModal()
      },
      closeCheck(){
        this.$refs.checkDialog.hideModal()
      },
      _submitCheck(){
        API.Leader.submitCheck(this.currentLeader.id || '',this.checkDialogContent).then(res => {
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
            return
          }
          this._updateData()
        })
      },
      // 顶部tab切换
      tabChange(val) {
        let params = {
          page: 1,
          limit: 10,
          status: 0,
          keyword: "",
          model_type:val
        }
        this.$refs.research._setText()
        this._updateData(params)
      },
      // 更新列表
      _updateData(params={}, noUpdataStatus) {
        this.SET_lEADER_LIST_FILTER(params)
        this.getList(params)
        if (!noUpdataStatus) {
          this._getLeaderStatus()
        }
        if (params.page === 1) {
          this.$refs.pagination.beginPage()
        }
      },
      // 搜索按钮
      searchBtn(keyword) {
        this._updateData({keyword, page: 1})
      },
      // 状态列表
      _getLeaderStatus() {
        let name  = this.leaderListFilter.model_type ?'getDistributionStatus' :'getLeaderStatus'
        API.Leader[name]({keyword:this.leaderListFilter.keyword}).then((res) => {
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
            return
          }
          this.statusList = res.data
        })
      },
      // 状态改变
      changeStatus(val) {
        this._updateData({status: val, page: 1})
      },
      async _syncLeader() {
        let res = await API.Leader.syncShop()
        this.$loading.hide()
        if (res.error === this.$ERR_OK) {
          this.$toast.show('关联成功')
          this._updateData({page:1})
        }
      },
      // 团长可使用账号数量为10000个，当前剩余9966个
      getTopData() {
        API.Leader.getTopData().then((res) => {
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
            return
          }
          this.topData = res.data.store
        })
      },
      // 分页
      _getMore(page) {
        this._updateData({page})
      },
      // 关闭弹框
      _close() {
        this.$refs.dialog.hideModal()
      },
      // 店铺二维码
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
      // 开关状态
      statusHandle(item, index) {
        let status = 0
        if (typeof this.statusArr[index] === 'number') {
          status = this.statusArr[index]
        } else {
          status = item.is_freeze ? 0 : 1
        }
        return status
      },
      // 列表中的开关
      _showFreeze(item, index) {
        this.freezeItem = item
        this.freezeIndex = index
        let status = 1
        if (typeof this.statusArr[index] === 'number') {
          status = this.statusArr[index]
        } else {
          status = item.is_freeze ? 0 : 1
        }
        let title = status ? '确定冻结该团长？' : '确定解冻该团长？'
        this.$refs.confirm.show(title)
      },
      // 列表中状态弹框 确定
      async _freeze() {
        let res = await API.Leader.shopToggleFrozen({shop_id: this.freezeItem.id})
        this.$toast.show(res.message)
        if (res.error !== this.$ERR_OK) {
          return
        }
        this.statusArr = this.statusArr.map((item, ind) => {
          if (this.freezeIndex === ind) {
            if (typeof item === 'number') {
              item = item ? 0 : 1
            } else {
              item = this.freezeItem.is_freeze
            }
          }
          return item
        })
        this.getTopData()
        this._getLeaderStatus()
        // this.getLeaderList({page: this.page, status: this.status, loading: false})
        this.$refs.confirm.hide()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .big-list
   position:relative
   &.leader-list  .list-item
     &:nth-child(6), &:nth-child(7)
       flex: 1.5
     &:nth-child(8)
       flex: 0.9
     &:last-child
       padding: 0
       max-width: 90px
       flex: 1.8
    &.application-list .list-item
      &:nth-child(6)
        min-width:130px
      &:nth-child(7)
        min-width:200px
      &:last-child
        max-width: 50px
      .photo
        width:40px
        height:40px
        &.last
          margin-left :10px
  .tab-top
    position:fixed
    top: 38px
    left: 210px
    z-index: 700
    margin-bottom: 20
  .empty-50
    height:50px
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
      &.no-bottom-border
        border-bottom: 0px solid $color-line

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
  .top
    align-items: center
    justify-content: space-between
    padding: 20px
    layout(row)

    .title
      font-family: $font-family-regular
      font-size: $font-size-16
      color: $color-text-main

    .close
      cursor pointer
      width: 12px
      height: 12px
      icon-image(icon-close)
  .activity-tab
    display: flex
    algin-items: center
    .check-box
      display: flex
      align-items: center
      margin-right: 50px
    .check
      width: 16px
      height: 16px
      border: 1px solid #E1E1E1
      border-radius: 50%
      transition: all 0.3s
      display: flex
      justify-content: center
      align-items: center
      margin-right: 10px
    .checked
      border: 5px solid $color-main
  .check-content
    width:380px
    height:275px
    .body
      padding:6px 20px
      .edit-text
        height:86px
        margin-top:18px
        width:100%
        background: #F9F9F9
        border: 1px solid #D3D8DC
        border-radius: 2px
    .back
      position: relative
      left:0
      background:#fff
      &::before
        border-top: 0px solid #e9ecee
  .img-model
    .top
      background: #fff
    .model-img-wrap
      background: #fff
      height: 600px
      width: 500px
      text-align center
      padding:20px
    .big-img
      max-width: 100%
      max-height: 100%

</style>
