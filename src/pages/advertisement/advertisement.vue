<template>
  <div class="advertisement">
    <div class="phone-box">
      <div class="phone">
        <div class="banner">
          <carousel autoplay :autoplaySpeed="3000" arrow="never" :height="104" :radiusDot="true">
            <carousel-item v-for="(item, index) in bannerList" :key="index" width="242.4px">
              <div class="carousel" :style="{'background-image': 'url(' + item.image_url + ')'}"></div>
            </carousel-item>
          </carousel>
        </div>
      </div>
    </div>
    <div class="advertisement-content">
      <div v-for="(banner, idx) in bannerList" :key="idx" class="advertisement-item">
        <div class="content-header">
          <div class="content-title">广告{{idx + 1}}</div>
          <div>
            <div v-if="idx !== 0" class="list-operation">上移</div>
            <div class="list-operation">删除</div>
          </div>
        </div>
        <div class="advertisement-msg">
          <div class="img-box hand" :style="{'background-image': 'url(' + banner.image_url + ')'}">
            <div v-if="banner.showLoading" class="loading-mask">
              <img src="./loading.gif" class="loading">
            </div>
            <input type="file" class="sendImage hand" accept="image/*" @change="_addPic(idx, banner, $event)">
          </div>
          <!--@click=""-->
          <div v-if="!banner.type" class="add-advertisement hand" @click="_showSelectType(banner, idx)">
            <span class="add-icon"></span>
            <span class="add-title">添加广告链接(选填)</span>
            <transition name="fade">
              <ul v-if="banner.showType" class="select-type" @click.stop="">
                <li v-for="(item, index) in typeList" :key="index" class="select-item" @click="_hideSelectType(index, idx)">{{item}}</li>
              </ul>
            </transition>
          </div>
          <div v-if="banner.type === 'out_html'" class="advertisement-link">
            <div class="goods-small-img goods-small-icon"></div>
            <p class="goods-title">{{banner.content.url}}</p>
            <p class="use hand">编辑</p>
          </div>
          <div v-if="banner.type === 'mini_goods'" class="advertisement-link">
            <div class="goods-small-img" :style="{'background-image': 'url(' + banner.goods_cover_image + ')'}"></div>
            <p class="goods-title">{{banner.goods_name}}</p>
            <p class="use hand">编辑</p>
          </div>
        </div>
      </div>
      <div class="btn-main new-advertisement" @click="_addMore">新建广告 +</div>
    </div>
    <!--商品-->
    <default-modal ref="goods">
      <div slot="content" class="shade-box">
        <div class="shade-header">
          <div class="shade-title">选择商品</div>
          <span class="close hand" @click="_hideGoods"></span>
        </div>
        <div class="shade-tab">
          <div class="tab-item">
            <base-drop-down :width="218"></base-drop-down>
          </div>
          <div class="tab-item">
            <base-search placeHolder="请输入商品名称"></base-search>
          </div>
        </div>
        <div class="goods-content">
          <div class="goods-list">
            <div class="goods-item">
              <div class="select-icon hand" :class="{'select-icon-active': showSelect}">
                <span class="after"></span>
              </div>
              <div class="goods-img"></div>
              <div class="goods-msg">
                <div class="goods-name">商品名称商品名称商品名称商品是否商品名称商品名称商品名称商品是否</div>
                <div class="goods-money">¥268.00</div>
              </div>
            </div>
            <div class="goods-item">
              <div class="select-icon hand select-icon-active">
                <span class="after"></span>
              </div>
              <div class="goods-img"></div>
              <div class="goods-msg">
                <div class="goods-name">商品名称商品名称商品名称商品是否</div>
                <div class="goods-money">¥268.00</div>
              </div>
            </div>
            <div class="goods-item">
              <div class="select-icon hand select-icon-active">
                <span class="after"></span>
              </div>
              <div class="goods-img"></div>
              <div class="goods-msg">
                <div class="goods-name">商品名称商品名称商品名称商品是否</div>
                <div class="goods-money">¥268.00</div>
              </div>
            </div>
          </div>
        </div>
        <div class="page-box">
          <base-pagination></base-pagination>
        </div>
        <div class="back">
          <div class="back-cancel back-btn hand" @click="_hideGoods">取消</div>
          <div class="back-btn btn-main">确定</div>
        </div>
      </div>
    </default-modal>
    <!--自定义链接-->
    <default-modal ref="custom">
      <div slot="content" class="custom">
        <div class="shade-header">
          <div class="shade-title">自定义链接</div>
          <span class="close hand" @click="_hideCustom"></span>
        </div>
        <textarea v-model="outHtml" class="link-box"></textarea>
        <div class="btn-group">
          <span class="btn cancel" @click="_hideCustom">取消</span>
          <span class="btn confirm" @click="addOutHtml">确定</span>
        </div>
      </div>
    </default-modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  import {Carousel, CarouselItem} from 'iview'
  import API from '@api'
  import ADD_IMAGE from './pic-add_ad@2x.png'
  import {adverComputed} from '@state/helpers'
  import _ from 'lodash'

  const PAGE_NAME = 'ADVERTISEMENT'
  const TITLE = '轮播广告'
  const TYPE_LIST = ['商品链接', '自定义链接']
  const TEMPLATE_OBJ = {id: '', image_id: '', type: '', content: {id: '', url: ''}, image_url: ADD_IMAGE} // 模板对象
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultModal,
      Carousel,
      CarouselItem
    },
    data() {
      return {
        typeList: TYPE_LIST,
        showType: false,
        isHaveLink: true,
        showSelect: false,
        showLoading: false,
        bannerList: [TEMPLATE_OBJ],
        upIndex: 0,
        upItem: {},
        outHtml: '',
        bannerIndex: 0
      }
    },
    computed: {
      ...adverComputed
    },
    created() {
      this.bannerList = this.infoBannerList.length ? _.cloneDeep(this.infoBannerList) : this.bannerList
      this.bannerList = this.bannerList.map((item) => {
        item.showType = false
        return item
      })
    },
    methods: {
      // 获取商品列表
      _getGoodsList() {},
      // 添加更多的广告
      _addMore() {
        this.bannerList.push(TEMPLATE_OBJ)
      },
      // 选择广告链接类型
      _showSelectType(item, index) {
        this.bannerList[index].showType = !this.bannerList[index].showType
        this.$forceUpdate()
      },
      _hideSelectType(typeIndex, index) {
        this.bannerList[index].showType = false
        this.$forceUpdate()
        switch (typeIndex) {
        case 0:
          this._showGoods()
          break
        case 1:
          this._showCustom()
          break
        }
        this.bannerIndex = index
      },
      async _addPic(index, item, e) {
        this.upIndex = index
        this.upItem = item
        this.bannerList[index].showLoading = true
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
      async _upImage(param) {
        let res = await API.Upload.UploadImg(param)
        this.bannerList[this.upIndex].showLoading = false
        if (res.error !== this.$ERR_OK) {
          this.$toast.show(res.message)
          return
        }
        this.bannerList[this.upIndex].image_url = res.data.url
        this.bannerList[this.upIndex].image_id = res.data.id
        let obj = {image_id: res.data.id, type: this.upItem.type, content: this.upItem.content}
        console.log(this.upItem)
        if (this.upItem.id) {
          await this._updateBanner(obj, this.upItem.id)
          return
        }
        await this._storeBanner(obj)
      },
      async _storeBanner(obj) {
        let res = await API.Advertisement.storeBanner(obj)
        this.$toast.show(res.message)
        if (res.error === this.$ERR_OK) {
          this._hideCustom()
          this._hideGoods()
        }
      },
      async _updateBanner(obj, id) {
        let res = await API.Advertisement.updateBanner(obj, id)
        this.$toast.show(res.message)
        if (res.error === this.$ERR_OK) {
          this._hideCustom()
          this._hideGoods()
        }
      },
      _showCustom() {
        this.$refs.custom.showModal()
      },
      async addOutHtml() {
        this.bannerList[this.bannerIndex].type = 'out_html'
        this.bannerList[this.bannerIndex].content.url = this.outHtml
        await this._storeBanner(this.bannerList[this.bannerIndex])
      },
      _hideCustom() {
        this.outHtml = ''
        this.$refs.custom.hideModal()
      },
      _showGoods() {
        this.$refs.goods.showModal()
      },
      _hideGoods() {
        this.$refs.goods.hideModal()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .advertisement
    flex: 1
    display: flex

  .phone-box
    width: 60%
    box-sizing: border-box
    .phone
      icon-image('pic-preview_bg')
      margin: 60px 0 60px 28%
      width: 300px
      height: 612px
      position: relative
    .banner
      position: absolute
      left: 28.8px
      top: 198.4px
      width: 242.4px
      height: 104px
      background-color: $color-white
      .carousel
        height: 100%
        width: 100%
        background-repeat: no-repeat
        background-size: cover
        background-position: center
        background-image: url('./icon-plus_young@3x.png')

  .advertisement-content
    box-sizing: border-box
    width: 40%
    padding: 0 20px 0 40px
    border-left: 1px solid $color-line
    overflow: hidden
    padding-bottom: 40px
    .new-advertisement
      font-style: $font-size-14
      padding: 8px 40px
    .advertisement-item
      margin-bottom: 50px
      .advertisement-msg
        display: flex
        .img-box
          margin-top: 20px
          height: 100px
          width: 230px
          min-height: 100px
          min-width: 230px
          background-repeat: no-repeat
          background-size: cover
          background-position: center
          background-image: url('./pic-add_ad@2x.png')
          position: relative
          .sendImage
            position: absolute
            width: 100%
            left: 0
            height: 100%
            top: 0
            opacity: 0
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
          margin: 28px 0 0 21px
          display: flex
          align-items: center
          height: 14px
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
            border-radius: 4px
            position: absolute
            &.fade-enter, &.fade-leave-to
              opacity: 0
            &.fade-enter-to, &.fade-leave-to
              transition: opacity .3s ease-in-out
            .select-item
              width: 140px
              line-height: 42px
              height: 42px
              border-bottom: 1px solid $color-line
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
          margin-top: 28px
          margin-left: 14px
          display: flex
          height: 30px
          align-items: center
          flex: 1
          overflow: hidden
          .goods-small-img
            width: 30px
            height: @width
            min-width: @width
            min-height: @width
            background-repeat: no-repeat
            background-size: cover
            background-position: center
            background-color: $color-background
            margin-right: 10px
          .goods-small-icon
            icon-image('icon-link')
          .goods-title
            width: 80%
            no-wrap()
            font-size: $font-size-14
            color: #666666
            line-height: 1.2
            font-family: $font-family-regular
          .use
            white-space: nowrap
            font-size: $font-size-14
            color: $color-sub
            margin-left: 21px
            line-height: 1

  /*background-image: url('./')*/

  /*基本信息类头部盒子样式*/
  .content-header
    border-bottom: 1px solid $color-line
    display: flex
    align-items: center
    justify-content: space-between
    height: 62px
    position: relative
    box-sizing: border-box
    &:after
      content: ''
      position: absolute
      width: 34px
      height: 2px
      background: $color-main
      border-radius: 1px
      bottom: -1px
      left: 0
    .content-title
      color: $color-text-main
      font-family: $font-family-medium
      font-size: $font-size-16
    .del
      font-size: $font-size-14
      font-family: $font-family-regular
      color: $color-sub

  //  商品弹窗
  .shade-box
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.60)
    border-radius: 3px
    background: $color-white
    height: 675px
    max-width: 1000px
    width: 1000px
    position: relative
    overflow-x: hidden
    overflow-y: auto
    flex-wrap: wrap
    .shade-tab
      height: 67.5px
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
      border: 1px solid $color-line
      margin: 0 20px
      height: 400px
      .goods-list
        flex-wrap: wrap
        display: flex
      .goods-item
        box-sizing: border-box
        padding: 0 20px
        width: 50%
        height: 79.5px
        display: flex
        align-items: center
        border-bottom: 1px solid $color-line
        &:nth-child(2n+1)
          border-right: 1px solid $color-line
        &:nth-child(9), &:nth-child(10)
          border-bottom: none
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
          border: 1px solid $color-main
          .after
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-main
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
          display: flex
          flex-direction: column
          color: $color-text-main
          font-family: $font-family-regular
          justify-content: space-between
          height: 40px
          .goods-name
            width: 350px
            no-wrap()
          .goods-name, .goods-money
            line-height: 1
            font-size: $font-size-14
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
      .page-box
        padding: 0 20px
        box-sizing: border-box
        height: 66px
        align-items: center
        display: flex

    .back
      left: 0
      right: 0
      bottom: 0
      position: absolute
      z-index: 10
      background: #F9F9F9
      height: 80px
      border-radius: 0 0 6px 6px
      display: flex
      align-items: center
      padding-left: 40px
      box-sizing: border-box
      justify-content: flex-end
      border-top: 1px solid $color-line
      .back-btn
        box-sizing: border-box
        font-size: $font-size-16
        margin-right: 20px
        padding: 12px 0
        width: 96px
        text-align: center
        white-space: nowrap
        transition: all 0.3s
      .back-cancel
        padding: 11px 0
        box-sizing: border-box
        line-height: 1
        color: $color-text-main
        border: 1px solid #ACACAC
        border-radius: 4px
        &:hover
          color: $color-text-sub
          border-color: $color-text-sub

  .shade-header
    display: flex
    align-items: center
    justify-content: space-between
    height: 60.5px
    box-sizing: border-box
    padding: 0 20px
    border-bottom: 1px solid $color-line
    .shade-title
      color: $color-text-main
      font-family: $font-family-medium
      font-size: $font-size-16
    .close
      icon-image('icon-close')
      width: 16px
      height: @width
      transition: all 0.3s
      &:hover
        transform: scale(1.3)

  /*选择商品样式*/
  .custom
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.60)
    border-radius: 3px
    background: $color-white
    width: 534px
    height: 261px
    position: relative
    .link-box
      outline: none
      resize: none
      display: block
      margin: 30px auto
      border: 1px solid $color-line
      border-radius: 4px
      padding: 10px
      box-sizing: border-box
      hieght: 80px
      width: 494px
      transition: all 0.3s
      &:hover
        border: 1px solid #ACACAC
      &::placeholder
        font-family: $font-family-regular
        color: $color-text-assist
      &:focus
        border-color: $color-sub !important
    .btn-group
      padding: 0 20px
      box-sizing: border-box
      margin-top: 40px
      text-align: center
      display: flex
      justify-content: flex-end
      user-select: none
      .btn
        width: 96px
        height: 40px
        line-height: 40px
        border-radius: 3px
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

</style>
