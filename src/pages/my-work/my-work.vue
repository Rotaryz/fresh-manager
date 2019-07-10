<template>
  <div class="my-work table">
    <base-tab-select :infoTabIndex="workTabIndex" :tabStatus="tabStatus" @getStatusTab="changeTab"></base-tab-select>
    <div class="down-content">
      <span class="down-tip">分类</span>
      <div class="down-item">
        <base-drop-down :select="stairSelect" @setValue="_setStairValue"></base-drop-down>
      </div>
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search ref="search" placeHolder="请输入关键词" @search="search"></base-search>
      </div>
    </div>

    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-product_list@2x.png" class="identification-icon">
          <p class="identification-name">我的作品</p>
          <base-status-tab ref="baseStatusTab" :statusList="dispatchSelect" :statusType="statusType" :infoTabIndex="statusTab" @setStatus="_setStatus"></base-status-tab>
        </div>
        <div class="function-btn">
          <router-link :to="`article-add?type=${workType}`" append class="btn-main">创作内容<span class="add-icon"></span></router-link>
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
            <div class="list-item list-item-img">
              <img class="pic-box" :src="item.cover_image_url">
            </div>
            <div class="list-item">{{item.title}}</div>
            <div class="list-item">{{item.list_date}}</div>
            <div v-if="workStatus !== 0" class="list-item">{{item.status_str}}</div>
            <div v-if="workStatus !== 0" class="list-item">{{item.browse_count}}</div>
            <div v-if="workStatus !== 0" class="list-item">{{item.share_count}}</div>
            <div v-if="workStatus !== 0" class="list-item">{{item.fabulous_num}}</div>
            <div v-if="workStatus !== 0" class="list-item">{{item.guide_goods_rate}}%</div>
            <div v-if="workStatus !== 0" class="list-item">{{item.pay_goods_count}}</div>
            <div class="list-item list-operation-box">
              <span class="list-operation" @click="shwoQrCode(item.id, index, item)">预览</span>
              <span v-if="item.status !== 1" class="list-operation" @click="editWork(item)">编辑</span>
              <span v-else class="list-operation" @click="upLine(item)">下线</span>
              <div class="list-operation" @click="delContent(item.id)">删除</div>
            </div>
          </div>
        </div>
        <base-blank v-else></base-blank>
      </div>
      <div class="pagination-box">
        <!--:pageDetail="contentClassPage"-->
        <base-pagination ref="pages" :pageDetail="workPage" @addPage="addPage"></base-pagination>
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
  const QUERY = ['Keyword', 'Page', 'Status', 'CategoryId']
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
  const TAB_STATUS = [{text: '图文', status: '', type: 'common'}, {text: '视频', status: '', type: 'video'}, {text: '菜谱', status: '', type: 'cookbook'}]
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
        selectId: [],
        saveValue: {},
        statusType: 1
      }
    },
    computed: {
      ...contentComputed,
      keywordName() {
        let name = `${this.tabStatus[this.workTabIndex].type}Keyword`
        return name
      },
      pageName() {
        let page = `${this.tabStatus[this.workTabIndex].type}Page`
        return page
      },
      categoryIdName() {
        let page = `${this.tabStatus[this.workTabIndex].type}CategoryId`
        return page
      },
      statusName() {
        let status = `${this.tabStatus[this.workTabIndex].type}Status`
        return status
      }
    },
    watch: {
      workList: {
        handler(news) {
          let index = news.findIndex((item) => !item.select)
          this.select = index === -1
        },
        deep: true
      },
      workTabIndex(news) {
        if (this.stairSelect.data.length < 1) {
          return
        }
        let item = this.stairSelect.data.find((item) => item.id === this.saveValue[this.categoryIdName])
        this.stairSelect.content = item.name === '全部' ? '请选择分类' : item.name
      },
      statusName(news) {
        this.statusType = this.saveValue[news]
        this.$refs.baseStatusTab.infoStatus(this.statusType)
      }
    },
    async created() {
      this.infoQuery()
      await this.getContentClassList()
      await this._statistic()
      this.$nextTick(() => {
        this.$refs.baseStatusTab.infoStatus(this.statusType)
      })
    },
    methods: {
      ...contentMethods,
      // 初始化变量
      infoQuery() {
        this.tabStatus.forEach((item) => {
          QUERY.forEach((items) => {
            this.saveValue[`${item.type}${items}`] = items === 'Page' || items === 'Status' ? 1 : ''
          })
        })
        this.saveValue[this.keywordName] = this.workKeyword
        this.saveValue[this.pageName] = this.workPage
        this.saveValue[this.categoryIdName] = this.workCategoryId
        this.saveValue[this.statusName] = this.workStatus
        this.statusType = this.saveValue[this.statusName]
      },
      // 获取二维码
      async shwoQrCode(id, index, item) {
        let url = item.type === 'video' ? `package-content/content-article-detail-video?a=${id}` : `package-content/content-article-detail?a=${id}`
        this.loadImg = true
        // {path: 'pages/choiceness?s=' + id, is_hyaline: false} 页面参数
        let res = await API.Content.createQrcode({path: url, is_hyaline: false})
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
        this.methodsName = 'delWork'
        this.delId = id
        this.$refs.confirm.show('确定要删除该作品吗？')
      },
      // 批量删除
      delContentAll() {
        this.$refs.confirm.show(`确定要删除这${this.workList.length}该作品吗？`)
      },
      // 下线
      upLine(item) {
        this.methodsName = 'downLineWork'
        this.delId = item.id
        this.$refs.confirm.show('确定要下线该作品吗？')
      },
      // 编辑
      editWork(item) {
        this.$router.push(`/home/my-work/article-add?type=${this.workType}&id=${item.id}`)
      },
      async freeze() {
        let res = await API.Content[this.methodsName](this.delId)
        this.$toast.show(res.message)
        this.$loading.hide()
        if (res.error === this.$ERR_OK) {
          this._statistic()
          this.getWorkList()
        }
      },
      // 获取分类
      async getContentClassList() {
        let res = await API.Content.getContentClassList({limit: 0, keyword: '', page: 1, status: 1})
        let arr = [{name: '全部', id: ''}]
        if (res.error === this.$ERR_OK) {
          arr = arr.concat(res.data)
        }
        this.stairSelect.data = arr
        let item = this.stairSelect.data.find((item) => item.id === this.saveValue[this.categoryIdName])
        this.stairSelect.content = item.name === '全部' ? '请选择分类' : item.name
      },
      // 筛选分类
      _setStairValue(item) {
        this.saveValue[this.categoryIdName] = item.id
        this.getWorkListMore({page: 1, workCategoryId: item.id})
        this.$refs.pages.beginPage()
        this._statistic()
      },
      // 搜索
      search(keyword) {
        this.saveValue[this.keywordName] = keyword
        this.getWorkListMore({page: 1, keyword})
        this.$refs.pages.beginPage()
        this._statistic()
      },
      // 翻页
      addPage(page) {
        this.saveValue[this.pageName] = page
        this.getWorkListMore({page})
        this._statistic()
      },
      // 获取列表和状态
      _getWorkList() {
        this._statistic()
        this.getWorkList({page: this.page, status: this.status, keyword: this.keyWord})
      },
      // 获取状态
      async _statistic() {
        let res = await API.Content.getWorkStatusList({type: this.workType, keyword: this.workKeyword, category_id: this.saveValue[this.categoryIdName]})
        if (res.error !== this.$ERR_OK) return
        let selectData = res.data.map((item) => {
          return {
            name: item.status_str,
            status: item.status,
            num: item.statistic
          }
        })
        this.dispatchSelect = selectData
      },
      // 切换状态
      _setStatus(item, index) {
        this.saveValue[this.statusName] = item.status
        this.getWorkListMore({page: 1, status: item.status})
        this._statistic()
        this.dispatTitle = item.name === '草稿' ? DISPATCHING_LIST2 : DISPATCHING_LIST
      },
      // 切换tab
      changeTab(item, index) {
        this.setWorkIndex(index)
        this.getWorkListMore({page: this.saveValue[this.pageName], workCategoryId: this.saveValue[this.categoryIdName], keyword: this.saveValue[this.keywordName], status: this.saveValue[this.statusName], tabIndex: index})
        this.$refs.search.infoTextMethods(this.saveValue[this.keywordName])
        this._statistic()
      }
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
