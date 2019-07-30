<template>
  <div class="advertisement-content">
    <div v-if="contentType === 'article'">
      <div class="content-header">
        <div class="content-title">内容推荐</div>
        <div class="content-sub">(最多添加3个内容推荐位，鼠标拖拽调整专区顺序)</div>
      </div>
      <draggable v-model="temporaryArticle" @update="_setSort()">
        <transition-group>
          <div v-for="(article, idx) in temporaryArticle" :key="idx" class="advertisement-item">
            <div class="advertisement-msg">
              <div class="img-box hand" :style="{'background-image': 'url(\'' + (article.image_url || article.add_icon) + '\')'}">
                <div v-if="article.showLoading" class="loading-mask">
                  <img src="./loading.gif" class="loading">
                </div>
                <input type="file" class="sendImage hand" accept="image/*" @change="_addPic(idx, article, $event)">
                <div v-if="article.image_id" class="img-change-tip">更换图片</div>
              </div>
              <!--@click=""-->
              <div class="art-right">
                <div class="input-box">
                  <input v-model="article.title" maxlength="8" type="text" class="edit-input" placeholder="请输入内容专区的标题名称">
                  <span class="input-num">{{article.title.length}}/8</span>
                </div>
                <div class="advertisement-link">
                  <div class="add-link hand" @click="_showGoods(idx, article.other_id)">{{article.name ? '更换内容' : '添加链接'}}</div>
                  <p class="goods-title">{{article.name}}</p>
                </div>
              </div>
              <p class="use hand" @click="_showConfirm(article.id, idx)">删除</p>
              <div class="eat-switch" @click="changeSwitch(idx, article)">
                <base-switch :status="article.is_close" confirmText="显示" cancelText="隐藏"></base-switch>
              </div>
            </div>
          </div>
        </transition-group>
      </draggable>
      <div class="advertisement-btn">
        <div class="new-advertisement hand" @click="_addMore">新建内容推荐</div>
        <div class="submit-activity-btn hand" @click="_editBanner()">提交</div>
      </div>
    </div>
    <div v-if="contentType === 'classify'">
      <div class="content-header">
        <div class="content-title">内容分类</div>
        <div class="content-sub">(最多添加15个内容分类，鼠标拖拽调整频道顺序)</div>
      </div>
      <draggable v-model="temporaryClassify" @update="_setSort()">
        <transition-group>
          <div v-for="(item, idx) in temporaryClassify" :key="idx" class="advertisement-item classify-msg">
            <div class="advertisement-msg">
              <div class="input-box">
                <base-drop-down
                  :width="300"
                  :height="44"
                  :select="item"
                  :downIndex="idx"
                  @selectType="showSelectClassify"
                  @setValue="getClassifyId"
                ></base-drop-down>
              </div>
              <div class="input-box input-box-title">
                <input v-model="item.title" maxlength="4" type="text" class="edit-input" placeholder="请输入内容分类描述">
                <span class="input-num">{{item.title.length}}/4</span>
              </div>
              <p class="use hand" @click="_showConfirm(item.id, idx)">删除</p>
            </div>
            <div class="eat-switch" @click="changeSwitch(idx, item)">
              <base-switch :status="item.is_close" confirmText="显示" cancelText="隐藏"></base-switch>
            </div>
          </div>
        </transition-group>
      </draggable>
      <div class="advertisement-btn">
        <div class="new-advertisement hand" @click="_addMoreClassify">新建内容分类</div>
        <div class="submit-activity-btn hand" @click="_editClassify()">提交</div>
      </div>
    </div>

    <!--内容弹窗-->
    <default-modal ref="goods">
      <div slot="content" class="shade-box">
        <div class="title-box">
          <div class="title">
            内容详情
          </div>
          <span class="close hand" @click="_hideGoods"></span>
        </div>
        <!--<div class="shade-header">-->
        <!--<div class="shade-title">选择内容</div>-->
        <!--<span class="close hand" @click="_hideGoods"></span>-->
        <!--</div>-->
        <!--内容详情-->
        <div>
          <div class="shade-tab">
            <div class="tab-item">
              <base-drop-down :width="218" :select="assortment" @setValue="_secondAssortment"></base-drop-down>
            </div>
            <div class="tab-item">
              <base-search placeHolder="请输入内容名称" @search="_searchGoods"></base-search>
            </div>
          </div>
          <div class="goods-content">
            <div class="goods-list" :class="{'goods-list-border':choiceGoods.length}">
              <div v-for="(item, index) in choiceGoods" :key="index" class="goods-item">
                <div class="select-icon hand" :class="{'select-icon-active': showSelectIndex === index}" @click="_selectGoods(item, index)">
                  <span class="after"></span>
                </div>
                <div class="goods-img" :style="{'background-image': 'url(\'' + item.cover_image_url + '\')'}"></div>
                <div class="goods-msg">
                  <div class="goods-name">{{item.title}}</div>
                  <div v-if="item.author" class="goods-name">{{item.author.nickname}}</div>
                  <!--<div class="goods-money">{{item.goods_sku_encoding}}</div>-->
                </div>

              </div>
            </div>
          </div>
          <div class="page-box">
            <base-pagination ref="goodsPage" :pageDetail="goodsPage" @addPage="_getMoreGoods"></base-pagination>
          </div>
        </div>
        <div class="back back-box">
          <div class="back-cancel back-btn hand" @click="_hideGoods">取消</div>
          <div class="back-btn back-submit hand" @click="_miniGoods">确定</div>
        </div>
      </div>
    </default-modal>
    <default-confirm ref="dialog" @confirm="_delBanner"></default-confirm>
  </div>
</template>

<script>
  import Draggable from 'vuedraggable'
  import ADD_IMAGE from '../pic-add_img@2x.png'
  import API from '@api'
  import DefaultModal from '@components/default-modal/default-modal'
  import _ from 'lodash'
  import DefaultConfirm from '@components/default-confirm/default-confirm'

  const PAGE_NAME = 'eat-content'

  // import {Carousel, CarouselItem} from 'iview'
  const TEMPLATE_OBJ = {
    id: '',
    image_id: '',
    type: 'article',
    name: '',
    url: '',
    other_id: '',
    image_url: '',
    title: '',
    showLoading: false,
    is_close: 1,
    add_icon: ADD_IMAGE
  } // 模板对象
  let TEMPLATE_CLASSIFY = {
    content: '请选择内容分类',
    type: 'article_cate',
    id: '',
    name: '',
    title: '',
    check: false,
    show: false,
    is_close: 1,
    other_id: 0,
    data: []
  }
  export default {
    name: PAGE_NAME,
    components: {
      Draggable,
      DefaultModal,
      DefaultConfirm
    },
    props: {
      contentType: {
        type: String,
        default: 'article'
      },
      articleId: {
        type: Number,
        default: 0
      },
      articleCateId: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        temporaryArticle: [],
        upIndex: -1,
        upItem: {},
        goodsPage: {total: 1, per_page: 10, total_page: 1},
        choiceGoods: [],
        choicePage: 1,
        goodsItem: [],
        text: '',
        showSelectIndex: -1,
        parentId: '',
        goodsCate: [],
        assortment: {check: false, show: false, content: '选择文章分类', type: 'default', data: []}, // 格式：{title: '55'
        selectItem: {},
        classifyIndex: 0,
        temporaryClassify: [],
        storageId: 0,
        storageList: [],
        showArticle: [],
        showClassify: []
      }
    },
    computed: {
      dataName() {
        let lastName = this.contentType[0].toUpperCase() + this.contentType.slice(1, this.contentType.length)
        let useName = `temporary${lastName}`
        return useName
      }
    },
    watch: {
      temporaryClassify: {
        async handler(news) {
          this.$emit('getClassify', news)
          await this.getContentList()
        },
        deep: true
      },
      temporaryArticle: {
        handler(news) {
          let arr = []
          news.forEach((item) => {
            if (item.is_close) {
              arr.push(item)
            }
          })
          this.showArticle = arr
          this.$emit('getArticle', this.showArticle)
        },
        deep: true
      }
    },
    async created() {
      await this._getFirstAssortment()
      await this._getGoodsList(false)
    },
    methods: {
      changeSwitch(index, item) {
        this[this.dataName][index].is_close = item.is_close === 1 ? 0 : 1
      },
      async infoClassData(arr) {
        TEMPLATE_CLASSIFY.data = JSON.parse(JSON.stringify(arr))
      },
      changeArticle(arr) {
        this.temporaryArticle = arr
      },
      async _editClassify() {
        if (!this.temporaryClassify.length) {
          this.$toast.show('内容推荐不能为空', 1500)
          return
        } else {
          for (let i = 0; i < this.temporaryClassify.length; i++) {
            if (!this.temporaryClassify[i].other_id) {
              this.$toast.show(`第${i + 1}条内容分类不能为空`, 1500)
              return
            } else if (!this.temporaryClassify[i].title) {
              this.$toast.show(`第${i + 1}条内容分类描述不能为空`, 1500)
              return
            }
          }
        }
        let idsArr = this.temporaryClassify.map((item) => {
          return item.other_id
        })
        let arr = new Set(idsArr)
        if (arr.size < idsArr.length) {
          this.$toast.show(`请勿选择重复的分类`, 1500)
          return
        }
        let data = this.temporaryClassify.map((item) => {
          let obj = {id: item.id, title: item.title, name: item.content, other_id: item.other_id, type: item.type, is_close: item.is_close}
          return {page_module_id: this.articleCateId, ext_json: obj}
        })
        let res = await API.Advertisement.saveModuleMsg({data})
        if (res.error === this.$ERR_OK) {
          this.$parent.infoEat()
          // await this._getModuleMsg(this.cmsType, this.articleId, this.cmsModuleId)
          // this._isSave = true
        }
        this.$loading.hide()
        this.$toast.show(res.message)
      },
      showSelectClassify(value, index) {
        this.classifyIndex = index
      },
      async getContentList(item) {
        let arr = []
        let inIndex = this.temporaryClassify.findIndex((item) => item.is_close && item.other_id !== 0)
        let id = inIndex === -1 ? '' : this.temporaryClassify[inIndex].other_id
        if (id === '') {
          this.$emit('getContentList', [])
          return
        }
        if (this.storageId === id) {
          this.$emit('getContentList', this.storageList)
          return
        }
        this.storageId = id
        let res = await API.Content.getWorkList({type: '', status: 1, is_cate_show: 0, category_id: this.storageId}, false)
        arr = res.data
        this.storageList = arr
        this.$emit('getContentList', arr)
      },
      // 获取分类id
      async getClassifyId(item) {
        this[this.dataName][this.classifyIndex].name = item.name
        this[this.dataName][this.classifyIndex].other_id = item.id
        this.$emit('getClassify', this[this.dataName])
      },
      _addMoreClassify() {
        if (this.temporaryClassify.length >= 15) {
          this.$toast.show('最多添加十五个内容分类')
          return
        }
        this.temporaryClassify.push(_.cloneDeep(TEMPLATE_CLASSIFY))
        let el = document.querySelector('html')
        setTimeout(() => {
          el.scrollTop = el.scrollHeight
        }, 100)
      },
      // 删除banner
      async _delBanner() {
        switch (this.dataName) {
        case 'temporaryArticle':
          // this.$emit('getArticle', this[this.dataName])
          break
        case 'temporaryClassify':
          this.$emit('getClassify', this[this.dataName])
          break
        }
        let index = this[this.dataName].findIndex(item => item.id === this.delId)
        let res = await API.Advertisement.deleteBanner(this.delId)
        this.$toast.show(res.message)
        if (res.error !== this.$ERR_OK) {
          return
        }
        this[this.dataName].splice(index, 1)
      },
      // 展示确认弹窗
      _showConfirm(id, index) {
        this.delId = id
        this.delIndex = index
        if (!id) {
          this[this.dataName].splice(index, 1)
          return
        }
        this.$refs.dialog.show('是否确定删除该内容？')
      },
      // 提交内容推荐
      async _editBanner() {
        if (!this.temporaryArticle.length) {
          this.$toast.show('内容推荐不能为空', 1500)
          return
        } else {
          for (let i = 0; i < this.temporaryArticle.length; i++) {
            if (!this.temporaryArticle[i].image_id) {
              this.$toast.show(`第${i + 1}条内容推荐图片不能为空`, 1500)
              return
            } else if (!this.temporaryArticle[i].title) {
              this.$toast.show(`第${i + 1}条内容推荐标题名称`, 1500)
              return
            } else if (!this.temporaryArticle[i].name && !this.temporaryArticle[i].url) {
              this.$toast.show(`第${i + 1}条内容推荐内容不能为空`, 1500)
              return
            }
          }
        }
        let data = this.temporaryArticle.map((item) => {
          delete item.add_icon
          return {page_module_id: this.articleId, ext_json: item}
        })
        let res = await API.Advertisement.saveModuleMsg({data})
        if (res.error === this.$ERR_OK) {
          this.$parent.infoEat()
          // await this._getModuleMsg(this.cmsType, this.articleId, this.cmsModuleId)
          // this._isSave = true
        }
        this.$loading.hide()
        this.$toast.show(res.message)
      },
      // 添加更多的广告
      _addMore() {
        if (this.temporaryArticle.length >= 3) {
          this.$toast.show('最多添加三个内容推荐')
          return
        }
        this.temporaryArticle.push(_.cloneDeep(TEMPLATE_OBJ))
        let el = document.querySelector('html')
        setTimeout(() => {
          el.scrollTop = el.scrollHeight
        }, 100)
        // this.$emit('getArticle', this[this.dataName])
      },
      _showGoods(index) {
        this.upIndex = index
        this.$refs.goods.showModal()
      },
      // 获取文章列表
      async _getGoodsList(loading = true) {
        let res = await API.Content.getWorkList(
          {
            type: '',
            keyword: this.text,
            category_id: this.parentId,
            page: this.choicePage,
            is_cate_show: 1,
            status: 1,
            limit: 7
          },
          loading
        )
        this.$loading.hide()
        if (res.error !== this.$ERR_OK) {
          return
        }
        this.goodsPage = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        this.choiceGoods = res.data
        this.showSelectIndex = this.choiceGoods.findIndex((item) => item.id === this.selectItem.id)
      },
      // 弹窗确定选择链接
      async _miniGoods() {
        if (!this.selectItem.id) {
          this.$toast.show('请选择内容文章')
          return
        }
        this.goodsItem = [this.selectItem]
        this[this.dataName][this.upIndex].name = this.selectItem.title
        this[this.dataName][this.upIndex].other_id = this.selectItem.id
        this._hideGoods()
      },
      // 获取分页内容列表
      async _getMoreGoods(page) {
        this.choicePage = page
        await this._getGoodsList()
      },
      async _secondAssortment(item) {
        this.parentId = item.id
        this.choicePage = 1
        this.$refs.goodsPage.beginPage()
        await this._getGoodsList()
      },
      // 搜索内容
      async _searchGoods(text) {
        this.statusTab = 4
        this.text = text
        this.choicePage = 1
        this.$refs.goodsPage.beginPage()
        await this._getGoodsList()
      },
      // 选择内容
      _selectGoods(item, index) {
        this.showSelectIndex = index
        this.selectItem = item
      },
      // 获取一级分类
      async _getFirstAssortment() {
        let res = await API.Content.getContentClassList({keyword: '', limit: 0, page: 1, status: 1})
        this.goodsCate = res.error === this.$ERR_OK ? _.cloneDeep(res.data) : []
        this.assortment.data = res.error === this.$ERR_OK ? res.data : []
        this.assortment.data.unshift({name: '全部', id: ''})
      },
      // 隐藏内容弹窗
      _hideGoods() {
        this.showSelectIndex = -1
        this.selectItem = {}
        this.text = ''
        this.choicePage = 1
        this.$refs.goods.hideModal()
      },
      _setSort() {
      },
      // 添加图片
      async _addPic(index, item, e) {
        this.upIndex = index
        this.upItem = item
        this[this.dataName][index].showLoading = true
        let param = this._infoImage(e.target.files[0])
        e.target.value = ''
        await this._upImage(param)
      },
      // 格式化图片流
      _infoImage(file) {
        let param = new FormData() // 创建form对象
        param.append('file', file, file.name) // 通过append向form对象添加数据
        return param
      },
      // 上传banner图片
      async _upImage(param) {
        let res = await API.Upload.UploadImg(param)
        this[this.dataName][this.upIndex].showLoading = false
        if (res.error !== this.$ERR_OK) {
          this.$toast.show(res.message)
          return
        }
        this[this.dataName][this.upIndex].image_url = res.data.url
        this[this.dataName][this.upIndex].image_id = res.data.id
        // this.$emit('getArticle', this[this.dataName])
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .content-header
    border-bottom-1px($color-line)
    display: flex
    align-items: center
    height: 60px
    position: relative
    box-sizing: border-box
    text-indent: 13px
    &:before
      content: ''
      position: absolute
      width: 3px
      height: 14px
      background: $color-main
      border-radius: 2px
      col-center()
      left: 0
    .content-title
      color: $color-text-main
      font-family: $font-family-regular
      font-size: $font-size-16
    .content-sub
      color: $color-text-assist
      font-size: $font-size-14
      font-family: $font-family-regular
      text-indent: 10px

  .advertisement-item
    margin-top: 24px
    border: 0.5 pxdashed #D9D9D9
    border-radius: 2px
    background: #F5F7FA
    height: 140px
    padding: 20px
    box-sizing: border-box
    &:first-child
      margin-top: 30px
    .advertisement-msg
      display: flex
      align-items: center
      position: relative
      .img-box
        height: 100px
        width: 100px
        min-height: 100px
        min-width: 100px
        background-repeat: no-repeat
        background-size: cover
        background-position: center
        background-image: url('./pic-add_img@2x.png')
        position: relative
        border: 0.5 pxsolid #F2F2F2
        border-radius: 2px
        box-sizing: border-box
        .img-change-tip
          position: absolute
          bottom: 0
          left: 0
          width: 100%
          height: 22px
          background: rgba(0, 0, 0, .5)
          color: rgba(255, 255, 255, .7)
          font-size: $font-size-14
          text-align: center
          line-height: 22px
        .sendImage
          position: absolute
          width: 100%
          left: 0
          height: 100%
          top: 0
          opacity: 0
          z-index: 1
        .loading-mask
          width: 100%
          height: 100%
          position: absolute
          top: 0
          left: 0
          background: rgba(0, 0, 0, .6)
        .loading
          all-center()
          width: 25px
          height: 25px
      .add-advertisement
        position: relative
        margin-left: 20px
        display: flex
        align-items: center
        .add-icon
          icon-image('icon-plus_young')
          height: 8px
          width: 8px
        .add-title
          line-height: 1
          text-decoration: underline
          color: $color-sub
          margin-left: 4px
          font-family: $font-family-regular
          font-size: $font-size-14
          white-space: nowrap
        .select-type
          top: 24px
          background: $color-white
          box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.20)
          border-radius: 2px
          position: absolute
          &.fade-enter, &.fade-leave-to
            opacity: 0
          &.fade-enter-to, &.fade-leave-to
            transition: opacity .3s ease-in-out
          .select-item
            width: 140px
            line-height: 42px
            height: 42px
            border-bottom: 0.5px solid $color-line
            box-sizing: border-box
            text-indent: 11px
            font-size: $font-size-14
            font-family: $font-family-regular
            color: $color-text-main
            transition: all 0.3s
            &:last-child
              border: none
          .select-item-active
            color: $color-sub

      .advertisement-link
        margin-left: 20px
        display: flex
        align-items: center
        overflow: hidden
        .goods-small-icon
          icon-image('icon-link')
        .goods-title
          width: 400px
          no-wrap()
          margin-left: 12px
          font-size: $font-size-14
          color: #666666
          line-height: 1.2
          font-family: $font-family-regular
      .use
        position: absolute
        top: -4px
        right: -4px
        white-space: nowrap
        font-size: $font-size-14
        color: #3E77C3
        margin-left: 21px
        line-height: 1
        user-select: none
        transition: color 0.2s
        &:hover
          color: #06397E
      .add-link
        width: 108px
        height: 32px
        line-height: 32px
        border: 1px solid $color-main
        border-radius: 2px
        font-size: $font-size-14
        font-family: $font-family-regular
        color: $color-main
        box-sizing: border-box
        text-indent: 33px
        position: relative
        user-select: none
        transition: all 0.3s
        z-index: 2
        &:after
          content: ''
          width: 2px
          height: 10px
          background: $color-main
          col-center()
          left: 23px
        &:before
          content: ''
          width: 10px
          height: 2px
          background: $color-main
          col-center()
          left: 19px
        &:hover
          background: $color-main
          color: $color-white
          &:before, &:after
            background: $color-white

    .nav-msg
      align-items: flex-start
      .advertisement-link, .add-advertisement
        margin-top: 16px
      .nav-name
        padding-left: 15px
        box-sizing: border-box
        font-size: $font-size-14
        width: 280px
        height: 44px
        margin-left: 20px
        border-radius: 2px
        background: $color-white
        border: 0.5px solid #D9D9D9

  .input-box
    position: relative
    display: inline-block
    width: 400px
    .edit-input
      margin-left: 20px
      font-size: $font-size-14
      padding: 0 14px
      border-radius: 2px
      width: 400px
      height: 44px
      display: flex
      align-items: center
      justify-content: space-between
      border: 0.5px solid $color-line
      transition: all 0.3s
    .input-num
      col-center()
      font-size: $font-size-14
      color: #ACACAC
      right: 10px
      font-family: $font-family-regular
  .art-right
    height: 100px
    padding: 4px 0
    justify-content: space-between
    display: flex
    flex-direction: column

  //  弹窗
  .shade-box
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.60)
    border-radius: 2px
    background: $color-white
    height: 675px
    max-width: 1000px
    width: 1000px
    position: relative
    overflow-x: hidden
    overflow-y: auto
    flex-wrap: wrap
    padding: 0 20px
    box-sizing: border-box
    .title-box
      display: flex
      box-sizing: border-box
      padding: 23px 0
      align-items: center
      justify-content: space-between
      .title
        font-size: $font-size-16
        font-family: $font-family-medium
        line-height: 1
        color: $color-text-main
      .close
        width: 12px
        height: @width
        icon-image('icon-close')
    .back
      border-top-1px($color-line)
      position: absolute
      left: 0
      right: 0
      bottom: 0
      background: $color-white
      justify-content: flex-end
    /*小弹窗盒子*/
    .default-modal-small
      position: absolute
      width: 100%
      height: 100%
      background: rgba(0, 0, 0, 0.50)
      top: 0
      bottom: 0
      right: 0
      z-index: 10
      layout()
      justify-content: center
      align-items: center
      .model-active
        animation: layerFadeIn .3s
      .model-un-active
        animation: hideFadeIn .4s

    /*分类弹窗*/
    .default-input
      box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.60)
      background: #fff
      border-radius: 2px
      .title-input
        height: 60px
        layout(row)
        align-items: center
        justify-content: space-between
        border-bottom: 0.5px solid $color-line
        padding-left: 20px
        .title
          color: $color-text-main
          font-size: $font-size-16
          font-family: $font-family-medium
        .close-box
          padding: 17px
          .close
            width: 16px
            height: 16px
            border-radius: 50%
            background-size: 22px
            icon-image('icon-close')
            transition: all 0.3s
            &:hover
              transform: scale(1.3)

      .main-input
        padding: 42px 20px 30px 20px
        .main-input-box
          width: 310px
          height: 40px
          border-radius: 2px
          font-family: $font-family-regular
          color: $color-text-main
          font-size: $font-size-14
          padding-left: 14px
          border: 1px solid $color-line
          transition: all 0.3s
          &::-webkit-inner-spin-button
            appearance: none
          &:hover
            border: 1px solid #ACACAC
          &::placeholder
            font-family: $font-family-regular
            color: $color-text-assist
          &:focus
            border-color: $color-main !important

    .btn-group
      text-align: center
      display: flex
      justify-content: flex-end
      user-select: none
      .btn
        width: 96px
        height: 40px
        line-height: 40px
        border-radius: 2px
        cursor: pointer
        transition: all 0.3s
      .cancel
        border: 1px solid $color-line
        &:hover
          color: $color-text-sub
          border-color: $color-text-sub
      .confirm
        border: 1px solid $color-main
        background: $color-main
        color: $color-white
        margin-left: 20px
        &:hover
          background: #44AB67
        &:active
          opacity: 0.8
      .one-btn
        margin-left: 0

    .main-model-box
      layout(row)
      align-items: center
      margin-bottom: 24px
      .text
        color: #666
        font-size: $font-size-14
        font-family: $font-family-regular
        width: 60px
        margin-right: 36px
  //  内容弹窗
  .shade-box
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.60)
    border-radius: 2px
    background: $color-white
    height: 675px
    max-width: 1000px
    width: 1000px
    position: relative
    overflow-x: hidden
    overflow-y: auto
    flex-wrap: wrap
    padding: 0 20px
    .shade-tab
      margin-bottom: 20px
      align-items: center
      box-sizing: border-box
      display: flex
      .tab-item
        margin-right: 10px
    .page-box
      box-sizing: border-box
      height: 76px
      align-items: center
      display: flex

  .goods-content
    border-radius: 4px
    height: 420px
    .goods-list
      flex-wrap: wrap
      display: flex
    .goods-item
      box-sizing: border-box
      padding: 0 30px 0 20px
      width: 100%
      height: 60px
      display: flex
      align-items: center
      position: relative
      &:last-child
        border-bottom-1px($color-line)
      &:before
        content: ""
        pointer-events: none // 解决iphone上的点击无效Bug
        display: block
        position: absolute
        left: 0
        top: 0
        transform-origin: 0 0
        border-right: 1px solid #E9ECEE
        border-left: 1px solid #E9ECEE
        border-top: 1px solid #E9ECEE
        box-sizing border-box
        width: 200%
        height: 100%
        transform: scaleX(.5) translateZ(0)
        @media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3)
          width: 100%
          height: 300%
          transform: scaleX(1 / 3) translateZ(0)
      &:nth-child(2n - 1)
        background: #f5f7fa
      .goods-img
        margin-right: 10px
        width: 40px
        height: @width
        overflow: hidden
        background-repeat: no-repeat
        background-size: cover
        background-position: center
        background-color: $color-background
      .goods-msg
        flex: 1
        display: flex
        color: $color-text-main
        font-family: $font-family-regular
        height: 100%
        align-items: center
        margin-left: 40px
        .goods-name
          flex: 1
          no-wrap()
          line-height: 1.2
          &:nth-child(1)
            flex: 2
          &:nth-child(4)
            max-width: 80px
      .add-btn
        border-radius: 2px
        margin-left: 88px
        padding: 5px 0
        width: 56px
        text-align: center
      .add-btn-disable
        border-radius: 2px
        margin-left: 88px
        padding: 5px 0
        width: 56px
        box-sizing: border-box
        text-align: center
        font-size: $font-size-14
        line-height: 1
        cursor: not-allowed
        background: $color-line
        color: $color-text-assist
  .title-box
    display: flex
    box-sizing: border-box
    padding: 23px 0
    align-items: center
    justify-content: space-between
    .title
      font-size: $font-size-16
      font-family: $font-family-medium
      line-height: 1
      color: $color-text-main
    .close
      width: 12px
      height: @width
      icon-image('icon-close')
  .page-box
    padding: 0 20px
    box-sizing: border-box
    height: 77px
    align-items: center
    display: flex
  .back-box
    background: $color-white
    height: 70px
    border-top-1px($color-line)
    justify-content: flex-end
    position: absolute
    left: 0
    bottom: 0
  //  单选框
  .select-icon
    width: 16px
    height: 16px
    border-radius: 50%
    background: $color-white
    border: 1px solid $color-line
    transition: all, 0.3s
    position: relative
    transform-origin: 50%
    margin-right: 20px
    .after
      all-center()
      transform-origin: 50%
      transition: all, 0.3s
      width: 0
      height: 0
      border-radius: 50%
  .select-icon-active
    border: 5px solid $color-main
  .advertisement-btn
    margin: 50px 0 0 0
    display: flex
    position: fixed
    left: 0
    right: 0
    bottom: 0
    z-index: 10
    background: #F9F9F9
    height: 80px
    border-radius: 0 0 6px 6px
    align-items: center
    padding-left: 40px
    box-sizing: border-box
    justify-content: center
  .new-advertisement
    font-size: $font-size-14
    padding: 7px 19px 8px 33px
    line-height: 1
    position: relative
    color: $color-main
    border: 0.5px solid $color-main
    transition: 0.3s all
    &:hover
      opacity: 0.8
    &:after
      content: ''
      width: 2px
      height: 10px
      background: $color-main
      col-center()
      left: 21px
    &:before
      content: ''
      width: 10px
      height: 2px
      background: $color-main
      col-center()
      left: 17px
  .submit-activity-btn
    margin-left: 20px
    font-family: $font-family-regular
    font-size: $font-size-14
    color: $color-white
    letter-spacing: 0
    width: 108px
    height: 32px
    background: $color-main
    border-radius: 2px
    line-height: 32px
    text-align: center
    transition: 0.3s all
    user-select: none
    &:hover
      opacity: 0.8

  .classify-msg
    padding: 0
    position: relative
    .advertisement-msg
      height: 100%
      width: 100%
      padding: 20px 0 20px 20px
      display: flex
      flex-direction: column
      align-items: flex-start
      .input-box-title
        margin-top: 12px
      .input-box
        width: 300px
        .edit-input
          width: 300px
          margin-left: 0
      .use
        right: 20px
        top: 16px
      .input-box
        background: $color-white
  .eat-switch
    col-center()
    right: -4px
  .classify-msg
    position: relative
    .eat-switch
      right: 12px
</style>
