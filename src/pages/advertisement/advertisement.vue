<template>
  <div class="advertisement normal-box">
    <div class="identification">
      <div class="identification-page">
        <img :src="actName[cmsType + 'Icon']" class="identification-icon">
        <p class="identification-name">{{actName[cmsType]}}</p>
      </div>
      <div class="function-btn">
      </div>
    </div>
    <div class="advertisement-small">
      <phone-box
        :bannerList="bannerList"
        :cateGoods="cateGoods"
        :activityGoodsList="activityGoodsList"
        :cmsMsg="infoBannerList.modules"
        @setType="_changeType"
      ></phone-box>
      <!--广告-->
      <div v-if="cmsType === 'bannar'" class="advertisement-content">
        <div class="content-header">
          <div class="content-title">轮播图设置</div>
          <div class="content-sub">(最多添加5个广告，鼠标拖拽调整广告顺序)</div>
        </div>
        <draggable v-model="temporaryBannar" @update="_setSort()">
          <transition-group>
            <div v-for="(banner, idx) in temporaryBannar" :key="idx" class="advertisement-item">
              <div class="advertisement-msg">
                <div class="img-box hand" :style="{'background-image': 'url(' + (banner.image_url || banner.add_icon) + ')'}">
                  <div v-if="banner.showLoading" class="loading-mask">
                    <img src="./loading.gif" class="loading">
                  </div>
                  <input type="file" class="sendImage hand" accept="image/*" @change="_addPic(idx, banner, $event)">
                  <div v-if="banner.image_id" class="img-change-tip">更换图片</div>
                </div>
                <!--@click=""-->
                <div class="advertisement-link">
                  <div class="add-link hand" @click="_showGoods(idx, banner.other_id)">添加链接</div>
                  <p class="goods-title">{{banner.type === 'out_html' || banner.type === 'mini_link' ? banner.url : banner.name}}</p>
                </div>
                <p class="use hand" @click="_showConfirm(banner.id, idx)">删除</p>
              </div>
            </div>

          </transition-group>
        </draggable>
        <div class="advertisement-btn">
          <div class="new-advertisement hand" @click="_addMore">新建广告</div>
          <div class="submit-activity-btn hand" @click="_editBanner()">提交</div>
        </div>
      </div>

      <!--限时抢购-->
      <div v-if="cmsType === 'activity_fixed'" class="advertisement-content">
        <div class="content-header">
          <div class="content-title">限时抢购</div>
        </div>
        <div>
          <div class="edit-item edit-flex">
            <div class="left">显示活动<span class="tip-text">(开启后显示模块，关闭后隐藏模块)</span></div>
            <div class="switch" @click="switchBtn()">
              <base-switch :status="activityStatus" confirmText="开启" cancelText="关闭"></base-switch>
            </div>
          </div>
          <div class="submit-activity advertisement-btn">
            <div class="submit-activity-btn hand" @click="_editActivity()">保存并发布</div>
          </div>
        </div>
      </div>

      <!--商品弹窗-->
      <default-modal ref="goods">
        <div slot="content" class="shade-box">
          <div class="shade-header">
            <div class="shade-tab-type">
              <div v-for="(items, index) in typeList" :key="index" :class="{'shade-tab-item-active': tabIndex === index}" class="shade-tab-item hand" @click="_setLinkType(index, $event)">{{items.title}}</div>
              <div class="line" :style="{left: left + 'px'}"></div>
            </div>
            <!--<div class="shade-title">选择商品</div>-->
            <span class="close hand" @click="_hideGoods"></span>
          </div>
          <!--商品详情-->
          <div v-if="tabIndex === 0">
            <div class="shade-tab">
              <div class="tab-item">
                <base-drop-down :width="218" :select="assortment" @setValue="_secondAssortment"></base-drop-down>
              </div>
              <div class="tab-item">
                <base-drop-down :width="140" :select="secondAssortment" @setValue="_choessSecondAssortment"></base-drop-down>
              </div>
              <div class="tab-item">
                <base-search placeHolder="请输入商品名称" @search="_searchGoods"></base-search>
              </div>
            </div>
            <div class="goods-content">
              <div class="goods-list">
                <div v-for="(item, index) in choiceGoods" :key="index" class="goods-item">
                  <div class="select-icon hand" :class="{'select-icon-active': showSelectIndex === index}" @click="_selectGoods(item, index)">
                    <span class="after"></span>
                  </div>
                  <div class="goods-img" :style="{'background-image': 'url(' +item.goods_cover_image+ ')'}"></div>
                  <div class="goods-msg">
                    <div class="goods-name">{{item.name}}</div>
                    <div class="goods-money">¥{{item.original_price}}</div>
                  </div>
                </div>
                <!--select-icon-active-->
              </div>
            </div>
            <div class="page-box">
              <base-pagination ref="pagination" :pageDetail="goodsPage" @addPage="_getMoreGoods"></base-pagination>
            </div>
          </div>
          <!--商品分类-->
          <div v-if="tabIndex === 1" class="goods-cate">
            <div v-for="(goods, goodsIdx) in goodsCate" :key="goodsIdx" class="goods_cate-item">
              <div class="select-icon hand" :class="{'select-icon-active': showCateIndex === goodsIdx}" @click="_selectCate(goods, goodsIdx)">
                <span class="after"></span>
              </div>
              <div class="shade-goods-msg">
                <div class="shade-goods-name">{{goods.name}}</div>
                <div class="shade-goods-num">{{goods.goods_count}}个商品</div>
              </div>
            </div>
          </div>
          <div v-if="tabIndex === 2" class="link-text">
            <textarea v-model="miniLink" class="link-text-box" placeholder="请输入小程序链接"></textarea>
          </div>
          <div v-if="tabIndex === 3" class="link-text">
            <textarea v-model="outHtml" class="link-text-box" placeholder="请输入H5链接"></textarea>
          </div>
          <div class="back back-box">
            <div class="back-cancel back-btn hand" @click="_hideGoods">取消</div>
            <div class="back-btn back-submit hand" @click="_miniGoods">确定</div>
          </div>
        </div>
      </default-modal>
      <default-confirm ref="dialog" @confirm="_delBanner"></default-confirm>
    </div>
    <!--<div class="back">-->
    <!--<div class="back-btn btn-main">保存并发布</div>-->
    <!--</div>-->
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import PhoneBox from '@components/phone-box/phone-box'
  import API from '@api'
  import ADD_IMAGE from './pic-add_img@2x.png'
  import {adverComputed, adverMethods} from '@state/helpers'
  import _ from 'lodash'
  import Draggable from 'vuedraggable'

  const PAGE_NAME = 'ADVERTISEMENT'
  const TITLE = '轮播广告'
  const TYPE_LIST = [
    {title: '商品详情', status: 'mini_goods'},
    {title: '商品分类', status: 'goods_cate'},
    {title: '小程序链接', status: 'mini_link'},
    {title: 'H5链接', status: 'out_html'}
  ]
  const ACT_NAME = {
    bannar: '轮播广告',
    bannarIcon: require('./icon-carousel@2x.png'),
    navigation: '导航栏设置',
    navigationIcon: require('./icon-nav_settings@2x.png'),
    activity_fixed: '限时抢购',
    activity_fixedIcon: require('./icon-time@2x.png')
  }
  const TEMPLATE_OBJ = {id: '', image_id: '', type: '', name: '', url: '', other_id: '', image_url: '', add_icon: ADD_IMAGE} // 模板对象
  export default {
    name: PAGE_NAME,
    components: {
      DefaultModal,
      DefaultConfirm,
      PhoneBox,
      Draggable
    },
    page: {
      title: TITLE
    },
    data() {
      return {
        actName: ACT_NAME,
        typeList: TYPE_LIST,
        showType: false,
        showSelectIndex: -1,
        showLoading: false,
        bannerList: [TEMPLATE_OBJ],
        goodsList: [],
        temporaryBannar: [],
        temporaryNavigation: [],
        upIndex: 0,
        upItem: {},
        outHtml: '',
        miniLink: '',
        bannerIndex: 0,
        choiceGoods: [],
        goodsPage: {total: 1, per_page: 10, total_page: 1},
        choicePage: 1,
        parentId: 0,
        keyword: '',
        assortment: {check: false, show: false, content: '选择分类', type: 'default', data: []}, // 格式：{title: '55'
        secondAssortment: {check: false, show: false, content: '选择二级分类', type: 'default', data: []}, // 格式：{title: '55'}}
        goodsId: 0,
        delId: 0,
        delIndex: 0,
        cmsType: 'bannar',
        tabIndex: 0,
        left: 36,
        outLink: 'mini_goods',
        cmsId: 0,
        cmsModuleId: '',
        activityType: {
          check: false,
          show: false,
          content: '限时抢购',
          type: 'default',
          data: [{name: '限时抢购'}]
        },
        goodsCate: [],
        showCateIndex: 0,
        activityItem: {},
        activityStatus: 0,
        activityGoodsList: [],
        cateGoods: []
      }
    },
    computed: {
      ...adverComputed,
      dataName() {
        let lastName = this.cmsType[0].toUpperCase() + this.cmsType.slice(1, this.cmsType.length)
        let useName = `temporary${lastName}`
        return useName
      }
    },
    async created() {
      this.cmsId = this.infoBannerList.modules[0] ? this.infoBannerList.modules[0].id : ''
      this.cmsModuleId = this.infoBannerList.modules[0] ? this.infoBannerList.modules[0].module_id : ''
      this.$loading.show()
      this.infoBannerList.modules.forEach(async (item) => {
        await this._getModuleMsg(item.module_name, item.id, item.module_id)
      })
      await this._getFirstAssortment()
      await this._getGoodsList()
      await this._getActivityGoods()
      await this._getCateGoods()
      this.$loading.hide()
    },
    methods: {
      ...adverMethods,
      switchBtn() {
        this.activityStatus = this.activityStatus ? 0 : 1
      },
      async _getModuleMsg(type, id, moduleId) {
        let res = await API.Advertisement.getModuleMsg({id: id, module_id: moduleId})
        if (res.error !== this.$ERR_OK) {
          return
        }
        switch (type) {
        case 'bannar':
          this.bannerList = res.data.length ? res.data : this.bannerList
          this.temporaryBannar = _.cloneDeep(res.data)
          break
        case 'activity_fixed':
          this.activityStatus = ((res.data && +res.data.is_close === 1) ? 0 : 1)
          break
        case 'goods_cate':
          // this.temporaryNavigation = _.cloneDeep(res.data)
          break
        }
      },
      // 获取分类商品列表
      _getCateGoods() {
        API.Advertisement.getGoodsList({
          is_online: 1,
          keyword: '',
          goods_category_id: 0,
          limit: 10,
          page: 1
        }).then(res => {
          if (res.error !== this.$ERR_OK) {
            return
          }
          this.cateGoods = res.data
        })
      },
      // 获取限时抢购商品列表
      _getActivityGoods() {
        this.infoBannerList.modules.forEach(item => {
          if (item.module_name === 'activity_fixed' && item.content_data && item.content_data.list && item.content_data.list.length > 0) {
            API.Advertisement.getActivityGoods(item.content_data.list[0].id)
              .then(res => {
                if (res.error !== this.$ERR_OK) {
                  return
                }
                this.activityGoodsList = res.data
              })
          }
        })
      },
      _setSort() {},
      _setLinkType(index, e) {
        this.tabIndex = index
        this.left = e.target.offsetLeft + (e.target.offsetWidth - 64) / 2
        this.outLink = this.typeList[index].status
      },
      // cms的类型
      async _changeType(cms) {
        this.cmsType = cms.module_name
        this.cmsId = cms.id
        this.cmsModuleId = cms.module_id
        await this._getModuleMsg(this.cmsType, this.cmsId, this.cmsModuleId)
      },
      // 展示确认弹窗
      _showConfirm(id, index) {
        this.delId = id
        this.delIndex = index
        if (!id) {
          this[this.dataName].splice(index, 1)
          return
        }
        this.$refs.dialog.show('是否确定删除该广告？')
      },
      // 删除banner
      async _delBanner() {
        let res = await API.Advertisement.deleteBanner(this.delId)
        this.$toast.show(res.message)
        if (res.error !== this.$ERR_OK) {
          return
        }
        await this._getModuleMsg(this.cmsType, this.cmsId, this.cmsModuleId)
      // this.temporaryBannar.splice(this.delIndex, 1)
      },
      // 弹窗确定选择链接
      async _miniGoods() {
        let index = this.bannerIndex
        this[this.dataName][index].type = this.outLink
        switch (this.outLink) {
        case 'out_html':
          if (!this.outHtml) {
            this.$toast.show('H5链接不能为空')
            return
          }
          this[this.dataName][index].url = this.outHtml
          this[this.dataName][index].name = ''
          break
        case 'mini_link':
          if (!this.miniLink) {
            this.$toast.show('小程序链接不能为空')
            return
          }
          this[this.dataName][index].url = this.miniLink
          this[this.dataName][index].name = ''
          break
        case 'mini_goods':
          this[this.dataName][index].other_id = this.choiceGoods[this.showSelectIndex].id
          this[this.dataName][index].url = ''
          this[this.dataName][index].name = this.choiceGoods[this.showSelectIndex].name
          break
        case 'goods_cate':
          this[this.dataName][index].other_id = this.goodsCate[this.showCateIndex].id
          this[this.dataName][index].url = ''
          this[this.dataName][index].name = this.goodsCate[this.showCateIndex].name
          break
        }
        this._hideGoods()
      },
      // 选择商品
      _selectGoods(item, index) {
        this.showSelectIndex = index
      },
      //
      _selectCate(item, index) {
        this.showCateIndex = index
      },
      // 获取商品列表
      async _getGoodsList() {
        let res = await API.Advertisement.getGoodsList({
          is_online: 1,
          keyword: this.keyword,
          goods_category_id: this.parentId,
          limit: 7,
          page: this.choicePage
        })
        if (res.error !== this.$ERR_OK) {
          return
        }
        this.goodsPage = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        this.choiceGoods = res.data
        this.showSelectIndex = this.choiceGoods.findIndex((item) => item.id === this.goodsId)
      },
      // 获取分页商品列表
      async _getMoreGoods(page) {
        this.choicePage = page
        await this._getGoodsList()
      },
      // 选择一级分类
      async _secondAssortment(item) {
        this.parentId = item.id
        if (item.id === '') {
          this.secondAssortment.data = []
        } else {
          let res = await API.Rush.goodsCategory({parent_id: this.parentId})
          this.secondAssortment.data = res.error === this.$ERR_OK ? res.data : []
          this.secondAssortment.data.unshift({name: '全部', id: this.parentId})
        }
        this.secondAssortment.content = '选择二级分类'
        this.page = 1
        this.$refs.pagination.beginPage()
        await this._getGoodsList()
      },
      // 选择二级分类
      async _choessSecondAssortment(item) {
        this.parentId = item.id
        this.page = 1
        this.$refs.pagination.beginPage()
        await this._getGoodsList()
      },
      // 获取一级分类
      async _getFirstAssortment() {
        let res = await API.Rush.goodsCategory({parent_id: this.parentId})
        this.goodsCate = res.error === this.$ERR_OK ? _.cloneDeep(res.data) : []
        this.assortment.data = res.error === this.$ERR_OK ? res.data : []
        this.assortment.data.unshift({name: '全部', id: ''})
      },
      // 搜索商品
      async _searchGoods(text) {
        this.keyword = text
        this.page = 1
        this.$refs.pagination.beginPage()
        await this._getGoodsList()
      },
      // 添加更多的广告
      _addMore() {
        if (this.temporaryBannar.length >= 5) {
          this.$toast.show('最多添加五个广告')
          return
        }
        this.temporaryBannar.push(_.cloneDeep(TEMPLATE_OBJ))
        let el = document.querySelector('html')
        setTimeout(() => {
          el.scrollTop = el.scrollHeight
        }, 100)
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
      },
      // 新建banner
      async _editBanner() {
        if (!this.temporaryBannar.length) {
          this.$toast.show('轮播图不能为空', 1500)
          return
        } else {
          for (let i = 0; i < this.temporaryBannar.length; i++) {
            if (!this.temporaryBannar[i].image_id) {
              this.$toast.show(`第${i + 1}轮播图广告图片不能为空`, 1500)
              return
            } else if (!this.temporaryBannar[i].name && !this.temporaryBannar[i].url) {
              this.$toast.show(`第${i + 1}轮播图链接不能为空`, 1500)
              return
            }
          }
        }
        let data = this.temporaryBannar.map((item) => {
          delete item.add_icon
          return {page_module_id: this.cmsId, ext_json: item}
        })
        await this._editCms(data)
      },
      // 新建活动
      async _editActivity() {

        let data = [
          {
            page_module_id: this.cmsId,
            config_data: {is_close: this.activityStatus === 1 ? 0 : 1}
          }
        ]
        let res = await API.Advertisement.saveFlashSale({data})
        // if (res.error === this.$ERR_OK) {
        //   await this._getModuleMsg(this.cmsType, this.cmsId, this.cmsModuleId)
        // }
        this.$loading.hide()
        this.$toast.show(res.message)
      },
      // 保存模块数据
      async _editCms(data) {
        let res = await API.Advertisement.saveModuleMsg({data})
        if (res.error === this.$ERR_OK) {
          await this._getModuleMsg(this.cmsType, this.cmsId, this.cmsModuleId)
        }
        this.$loading.hide()
        this.$toast.show(res.message)
      },
      // 展示商品弹窗
      _showGoods(index, id) {
        this.bannerIndex = index
        this.goodsId = id
        this.showSelectIndex =
          this.outLink === 'mini_goods' ? this.choiceGoods.findIndex((item) => item.id === this.goodsId) : -1
        this.showCateIndex =
          this.outLink === 'goods_cate' ? this.goodsCate.findIndex((item) => item.id === this.goodsId) : -1
        this.$refs.goods.showModal()
      },
      // 隐藏商品弹窗
      _hideGoods() {
        this.showSelectIndex = -1
        this.outHtml = ''
        this.miniLink = ''
        this.showCateIndex = -1
        this.$refs.goods.hideModal()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .advertisement-small
    display: flex
    font-family: $font-family-regular

  .goods-cate
    flex: 1
    width: 960px
    height: 480px
    margin: 20px auto 0
    border-radius: 2px
    overflow-x: hidden
    .goods_cate-item
      display: flex
      align-items: center
      padding: 0 20px
      height: 60px
      position: relative
      box-sizing: border-box
      &:nth-child(2n - 1)
        background: #f5f7fa
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
      .shade-goods-msg
        flex: 1
        justify-content: space-between
        display: flex
      .shade-goods-name
        width: 500px
        no-wrap()
      .shade-goods-name, .shade-goods-num
        font-size: $font-size-14
        color: $color-text-main

  .link-text-box
    width: 960px
    height: 220px
    margin: 20px auto 0
    border: 0.5px solid $color-line
    border-radius: 2px
    outline: none
    display: block
    resize: none
    padding: 20px 14px
    box-sizing: border-box
    position: relative
    background: #F9F9F9
    &:focus
      background: $color-white

  .advertisement
    flex: 1

  .advertisement-content
    box-sizing: border-box
    flex: 1
    overflow: hidden
    padding-bottom: 40px
    .content-header
      display: flex
      align-items: center
      .content-title
        font-size: 16px
      .content-sub
        font-size: 14px
        margin-left: 10px
        color: #acacac
        font-family: $font-family-regular
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
          flex: 1
          overflow: hidden
          .goods-small-icon
            icon-image('icon-link')
          .goods-title
            width: 63%
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
          transition: all 0.2s
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


  //  商品弹窗
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
    .shade-tab
      height: 68px
      align-items: center
      padding: 0 20px
      box-sizing: border-box
      display: flex
      .tab-item
        margin-right: 10px
    .page-box
      padding: 0 20px
      box-sizing: border-box
      height: 66px
      align-items: center
      display: flex

  .goods-content
    border-radius: 4px
    margin: 0 20px
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
        justify-content: space-between
        height: 100%
        align-items: center
        .goods-name
          width: 500px
          no-wrap()
        .goods-name, .goods-money
          line-height: 1
          font-size: $font-size-14
      .add-btn
        border-radius: 2px
        margin-left: 88px
        padding: 7px 0
        width: 56px
        text-align: center
      .add-btn-disable
        border-radius: 2px
        margin-left: 88px
        padding: 7px 0
        width: 56px
        box-sizing: border-box
        text-align: center
        font-size: $font-size-14
        line-height: 1
        cursor: not-allowed
        background: $color-line
        color: $color-text-assist
    .page-box
      padding: 0 20px
      box-sizing: border-box
      height: 77px
      align-items: center
      display: flex

  .shade-header
    display: flex
    justify-content: space-between
    height: 52px
    box-sizing: border-box
    padding: 23px 20px 0 0
    .shade-tab-type
      height: 100%
      display: flex
      position: relative
      .shade-tab-item
        line-height: 1
        display: flex
        transition: all 0.3s
        color: $color-text-main
        font-family: $font-family-regular
        margin-left: 40px
      .shade-tab-item-active
        font-family: $font-family-medium
      .line
        transition: all 0.3s
        left: 40px
        position: absolute
        bottom: 0px
        height: 3px
        width: 64px
        background: $color-main
        border-radius: 3px
    .shade-title
      color: $color-text-main
      font-family: $font-family-medium
      font-size: $font-size-16
    .close
      icon-image('icon-close')
      width: 12px
      height: @width
      transition: all 0.3s

  .back-box
    background: $color-white
    height: 70px
    border-top-1px($color-line)
    justify-content: flex-end
    position: absolute
    left: 0
    bottom: 0


  .edit-item
    display: flex
    color: #2A2A2A
    min-height: 40px
    margin-top: 24px
    .edit-title
      margin-top: 7.5px
      font-size: $font-size-14
      font-family: $font-family-regular
      white-space: nowrap
      text-align: left
      min-width: 64px
    .start
      display: inline-block
      margin-right: -2px
      color: #F52424
    .edit-box
      margin-left: 40px
      .edit-input
        font-size: $font-size-14
        padding: 0 14px
        border-radius: 2px
        width: 240px
        height: 44px
        display: flex
        align-items: center
        justify-content: space-between
        border: 0.5px solid $color-line
        transition: all 0.3s
        &:hover
          border-color: #ACACAC
        .edit-time
          color: $color-text-assist
          font-family: $font-family-regular
          font-size: $font-size-12
        .time-icon
          icon-image('icon-date_icon')
          width: 12px
          height: @width
    .edit-input-right
      margin-left: 14px
    .tip
      line-height: 44px
      font-size: $font-size-12
      font-family: $font-family-regular
      color: $color-text-main
    .tip-text
      margin-left: 2px
      line-height: 44px
      font-size: $font-size-12
      font-family: $font-family-regular
      color: $color-text-assist

  .edit-flex
    border: 0.5px dashed #D9D9D9
    border-radius: 1px
    background: #F5F7FA
    padding: 18px 20px
    box-sizing: border-box
    display: flex
    justify-content: space-between
    align-items: center
    margin-top: 30px
  .edit-activity
    padding-left: 40px

  .submit-activity
    border-top: 0.5px solid $color-line

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
</style>
