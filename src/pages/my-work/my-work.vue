<template>
  <div class="my-work table">
    <base-tab-select :infoTabIndex="tabIndex" :tabStatus="tabStatus" @getStatusTab="changeTab"></base-tab-select>
    <div class="down-content">
      <span class="down-tip">分类</span>
      <div class="down-item">
        <base-drop-down :select="stairSelect" @setValue="_setStairValue"></base-drop-down>
      </div>
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search placeHolder="请输入关键词" @search="search"></base-search>
      </div>
    </div>

    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-product_list@2x.png" class="identification-icon">
          <p class="identification-name">我的作品</p>
          <base-status-tab ref="baseStatusTab" :statusList="dispatchSelect" :infoTabIndex="statusTab" @setStatus="_setStatus"></base-status-tab>
        </div>
        <div class="function-btn">
          <div class="btn-main">创作内容<span class="add-icon"></span></div>
          <!--<div v-else class="btn-main" @click="delContentAll">删除</div>-->
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <!--<div class="list-item">-->
          <!--<div class="pro-select-icon hand" :class="{'pro-select-icon-active': select}" @click="selectPurchase('all')"></div>-->
          <!--</div>-->
          <div v-for="(item,index) in dispatTitle" :key="index" class="list-item">{{item}}</div>
        </div>
        <div v-if="workList.length" class="list">
          <div v-for="(item, index) in workList" :key="index" class="list-content list-box">
            <!--<div class="list-item">-->
            <!--<div class="pro-select-icon hand" :class="{'pro-select-icon-active': item.select}" @click="selectPurchase('one', index)"></div>-->
            <!--</div>-->
            <div class="list-item list-item-img">
              <img class="pic-box" alt="">
            </div>
            <div class="list-item">item.name}}</div>
            <div class="list-item">item.name}}</div>
            <div class="list-item">item.name}}</div>
            <div class="list-item">item.name}}</div>
            <div class="list-item">item.name}}</div>
            <div class="list-item">item.name}}</div>
            <div class="list-item">item.name}}</div>
            <div class="list-item">item.delivery_at}}</div>
            <div class="list-item list-operation-box">
              <span class="list-operation" @click="shwoQrCode(item.id, index)">预览</span>
              <span v-if="status !== 1" class="list-operation" @click="editWork(item)">编辑</span>
              <span v-else class="list-operation" @click="upLine(item)">下线</span>
              <div class="list-operation" @click="delContent(item.id)">删除</div>
            </div>
          </div>
        </div>
        <base-blank v-else></base-blank>
      </div>
      <div class="pagination-box">
        <!--:pageDetail="contentClassPage"-->
        <base-pagination ref="pages" @addPage="addPage"></base-pagination>
      </div>
    </div>
    <default-confirm ref="confirm" @confirm="freeze"></default-confirm>
    <default-modal ref="dialog">
      <div slot="content" class="pop-main code">
        <div class="shade-header">
          <div class="shade-title"></div>
          <!--@click="_cancelGoods"-->
          <span class="close hand" @click="closeCode"></span>
        </div>
        <div class="img-box">
          <img v-if="loadImg" key="2" src="./loading.gif" alt="" class="load-img">
          <img v-else key="1" :src="codeUrl" alt="" class="xcx-img">
        </div>
        <div class="pop-text">微信扫码预览内容</div>
      </div>
    </default-modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import {contentComputed, contentMethods} from '@state/helpers'
  import DefaultModal from '@components/default-modal/default-modal'
  import API from '@api'

  const PAGE_NAME = 'MY_WORK'
  const TITLE = '我的作品'
  const DISPATCHING_LIST = [
    '封面图',
    '文章标题',
    '时间',
    '状态',
    '阅读数',
    '分享次数',
    '点赞数',
    '商品页跳转率',
    '支付笔数',
    '操作'
  ]
  const DISPATCHING_LIST2 = ['封面图', '文章标题', '创建时间', '操作']
  const TAB_STATUS = [{text: '图文', statue: ''}, {text: '视频', statue: ''}, {text: '菜谱', statue: ''}]
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultConfirm,
      DefaultModal
    },
    data() {
      return {
        loadImg: true,
        codeUrl: '',
        tabStatus: TAB_STATUS,
        page: 1,
        status: '',
        keyWord: '',
        dispatTitle: DISPATCHING_LIST,
        statusTab: 1,
        dispatchSelect: [
          {name: '全部', value: '', key: 'all', num: 0},
          {name: '已上线', value: 1, key: 'wait_release', num: 0},
          {name: '草稿', value: 2, key: 'wait_purchase', num: 0},
          {name: '已下线', value: 3, key: 'success', num: 0}
        ],
        tabIndex: 0,
        delId: null,
        stairSelect: {
          check: false,
          show: false,
          content: '请选择分类',
          type: 'default',
          data: []
        },
        select: false,
        selectId: []
      }
    },
    computed: {
      ...contentComputed
    },
    watch: {
      workList: {
        handler(news) {
          let index = news.findIndex((item) => !item.select)
          this.select = index === -1
        },
        deep: true
      }
    },
    create() {
      this._statistic()
    },
    methods: {
      ...contentMethods,
      // 获取二维码
      async shwoQrCode(id, index) {
        this.loadImg = true
        // {path: 'pages/choiceness?s=' + id, is_hyaline: false} 页面参数
        let res = await API.Content.createQrcode()
        if (res.error !== this.$ERR_OK) {
          this.$toast.show(res.message)
          return
        }
        this.$refs.dialog.showModal()
        this.loadImg = false
        this.codeUrl = res.data.image_url
      },
      // 关闭弹窗（二维码）
      closeCode() {
        this.$refs.dialog.hideModal()
      },
      // 多选
      async selectPurchase(type, index) {
        let ids = []
        switch (type) {
        case 'all':
          ids = await this.selectWork({type: 'all', index: -1, value: !this.select, ids: []})
          break
        case 'one':
          ids = await this.selectWork({type: 'one', index, value: false, ids: this.selectId})
          break
        }
        this.selectId = ids
      },
      //  删除单个
      delContent(id) {
        this.delId = id
        this.$refs.confirm.show('确定要删除该作品吗？')
      },
      // 批量删除
      delContentAll() {
        console.log(this.selectId)
        this.$refs.confirm.show(`确定要删除这${this.workList.length}该作品吗？`)
      },
      // 下线
      upLine(item) {
        this.$refs.confirm.show('确定要下线该作品吗？')
      },
      // 编辑
      editWork(item) {
        this.$router.push(`?id=${item.id}`)
      },
      async freeze() {
        let res = await API.Content.delWork(this.delId)
        this.$toast.show(res.message)
        this._getWorkList()
      },
      // 筛选分类
      _setStairValue() {
        this.page = 1
        this.$refs.pages.beginPage()
        this._getWorkList()
      },
      // 搜索
      search(text) {
        this.keyWord = text
        this.page = 1
        this.$refs.pages.beginPage()
        this._getWorkList()
      },
      // 翻页
      addPage(page) {
        this.page = page
      },
      // 获取列表和状态
      _getWorkList() {
        this._statistic()
        this.getWorkList({page: this.page, status: this.status, keyword: this.keyWord})
      },
      // 获取状态
      _statistic() {},
      // 切换状态
      _setStatus(item, index) {
        this.statusTab = index
        this.status = item.status
        this.dispatTitle = item.name === '草稿' ? DISPATCHING_LIST2 : DISPATCHING_LIST
      },
      // 切换tab
      changeTab() {}
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  /*&:nth-child(1)*/
  /*max-width: 38px*/
  .my-work
    width: 100%
  .list-box
    .list-item
      &:last-child
        max-width: 128px
        min-width: 128px
        padding: 0
  .list-item-img
    display: flex
    align-items: center
  .pic-box
    height: 40px
    width: 40px
    border-radius: 2px
    object-fit: cover
    background-repeat: no-repeat
    background-size: cover
    background-position: center
  .pro-select-icon
    border-radius: 2px
    border: 1px solid $color-line
    height: 18px
    min-height: 18px
    width: 18px
    min-width: 18px
    margin-right: 18px
    background: $color-white
    box-sizing: border-box
  .pro-select-icon-active
    border: none
    icon-image('icon-check')
  .pop-main
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.60)
    border-radius: 2px
    background: $color-white
    width: 420px
    height: 360px
    box-sizing: border-box
    text-align: left
    display: flex
    flex-direction: column
    .close
      icon-image('icon-close')
      width: 10px
      height: @width
      transition: all 0.3s
    .shade-header
      display: flex
      align-items: center
      justify-content: space-between
      height: 48px
      margin-bottom: 24px
      box-sizing: border-box
      padding: 0 20px
    .img-box
      display: flex
      align-items: center
      height: 200px
      justify-content: center
    .xcx-img
      display: block
      width: 200px
      border-1px($color-line)
      height: @width
    .pop-text
      color: $color-text-main
      line-height: 1
      margin-top: 16px
      text-align: center
      font-size: $font-size-16
</style>
