<template>
  <div class="content-center table">
    <base-tab-select :infoTabIndex="centerTabIndex" :tabStatus="tabStatus" @getStatusTab="changeTab"></base-tab-select>
    <div class="down-content">
      <span class="down-tip">分类</span>
      <div class="down-item">
        <base-drop-down :select="stairSelect" @setValue="_setStairValue"></base-drop-down>
      </div>
      <span class="down-tip">标题名称</span>
      <div class="down-item">
        <base-search ref="search" :infoText="centerKeyword" placeHolder="请输入关键词" @search="search"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-activity_category@2x.png" class="identification-icon">
          <p class="identification-name">内容分类</p>
        </div>
        <div class="function-btn">
        </div>
      </div>
      <div class="center-list">
        <div v-for="(item, index) in centerList" :key="index" class="center-item">
          <img src="" alt="" class="center-img">
          <p class="center-title">
            <span class="center-title-box">这里是文章标题文章标题文章标题爱上覅卷发</span>
          </p>
          <div class="center-btn">
            <div class="center-btn-item hand" @click="showQrCode(item)">预览</div>
            <div class="center-btn-item hand select" :class="{'select-disable': item.is_select}" @click="selectContent(item.id)">选择</div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pages" :pageDetail="centerPage" @addPage="addPage"></base-pagination>
      </div>
    </div>
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
  import {contentComputed, contentMethods} from '@state/helpers'
  import API from '@api'
  import DefaultModal from '@components/default-modal/default-modal'

  const PAGE_NAME = 'CONTENT_CENTER'
  const TITLE = '内容中心'
  const TAB_STATUS = [{text: '图文', status: '', type: 'common'}, {text: '视频', status: '', type: 'video'}, {text: '菜谱', status: '', type: 'cookbook'}]

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultModal
    },
    data() {
      return {
        loadImg: true,
        codeUrl: '',
        tabStatus: TAB_STATUS,
        stairSelect: {
          check: false,
          show: false,
          content: '请选择分类',
          type: 'default',
          data: []
        },
        type: 1,
        commonKeyword: '',
        videoKeyword: '',
        cookbookKeyword: '',
        commonPage: '',
        videoPage: '',
        cookbookPage: '',
        commonStatus: '',
        videoStatus: '',
        cookbookStatus: ''
      }
    },
    computed: {
      ...contentComputed,
      keywordName() {
        let name = `${this.tabStatus[this.centerTabIndex].type}Keyword`
        return name
      },
      pageName() {
        let page = `${this.tabStatus[this.centerTabIndex].type}Page`
        return page
      },
      statusName() {
        let page = `${this.tabStatus[this.centerTabIndex].type}Status`
        return page
      }
    },
    watch: {
      centerTabIndex(news) {
        this.stairSelect.content = this[this.statusName] || '请选择分类' + news
      }
    },
    methods: {
      ...contentMethods,
      changeTab(item, index) {
        this.getCenterListMore({page: this[this.pageName], status: this[this.statusName], keyword: this[this.keywordName], tabIndex: index})
        this.$refs.search.infoTextMethods(this[this.keywordName])
      },
      async showQrCode(item) {
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
      // 选择内容
      async selectContent(id) {
        let res = await API.Center.selectContent(id)
        this.$toast.show(res.message)
        res.error === this.$ERR_OK && this.getCenterList()
      },
      addPage(page) {
        this[this.pageName] = page
        this.getCenterListMore({page})
      },
      _setStairValue(item) {
        this.getCenterListMore({page: 1, status: item.status})
        this.$refs.pages.beginPage()
      },
      search(keyword) {
        this[this.keywordName] = keyword
        this.getCenterListMore({page: 1, keyword})
        this.$refs.pages.beginPage()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .content-center
    width: 100%
  .center-list
    flex: 1
    display: flex
    flex-wrap: wrap
    .center-item
      overflow: hidden
      border-1px($color-line, 12px)
      height: 328.4px
      width: 250px
      border-radius: 6px
      margin-right: 20px
      margin-bottom: 20px
      .center-img
        width: 100%
        background: $color-background
        display: block
        object-fit: cover
        overflow: hidden
        height: 75.578%
      .center-title
        height: 13.06%
        display: flex
        align-items: center
        font-size: $font-size-14
        padding: 0 20px 0 10px
        .center-title-box
          no-wrap()
          display: block
      .center-btn
        background: #F6F9FA
        display: flex
        align-items: center
        height: 11.68%
        .center-btn-item
          flex: 1
          text-align: center
          position: relative
          &:first-child
            color: #666666
            &:before
              col-center()
              height: 13px
              width: 1px
              right: 0
              background: #D4D8DB
              content: ''
        .select
          color: #3E77C3
        .select-disable
          cursor: not-allowed
          color: #CCCCCC
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
