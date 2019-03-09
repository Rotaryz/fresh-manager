<template>
  <div class="phone-box">
    <div class="phone">
      <div class="content-box">
        <div v-for="(cms, cmsIdx) in cmsMsg" :key="cmsIdx">
          <!-- 轮播图-->
          <div v-if="cms.module_name === 'bannar'" class="banner-box hand" :class="{'touch': comType === cms.module_name}" @click="_setType(cms)">
            <div class="big-box hand">
              <div class="banner">
                <carousel :autoplaySpeed="3000"
                          arrow="never"
                          :height="104"
                          autoplay
                          :radiusDot="true"
                          dots="none"
                          @on-change="_getBanner"
                >
                  <carousel-item v-for="(item, index) in bannerList" :key="index">
                    <div class="carousel" :class="{'carousel-active' :bannerIndex === index, 'carousel-none': !item.image_url}" :style="{'background-image': 'url(' + item.image_url + ')'}">
                      <img v-if="!item.image_url" src="./icon-picmr@2x.png" class="none-img">
                    </div>
                  </carousel-item>
                </carousel>
              </div>
            </div>
          </div>
          <!--分类-->
          <div v-if="cms.module_name === 'navigation'" class="hand nav-box" :class="{'touch': comType === cms.module_name}" @click="_setType(cms)">
            <div v-if="navList.length" class="nav-list">
              <div v-for="(item, index) in navList" :key="index" class="nav-item">
                <div :style="{'background-image': 'url(' + item.image_url + ')'}" class="nav-top-box"></div>
                <div v-if="item.title" class="nav-top-text">{{item.title}}</div>
              </div>
            </div>
            <div v-if="!navList.length" class="nav-list">
              <div v-for="(item) in [0, 1, 2, 3, 4, 5 , 6, 7, 8, 9]" :key="item" class="nav-item">
                <div class="nav-top-box"></div>
              </div>
            </div>
          </div>
          <!--进日抢购-->
          <div v-if="cms.module_name === 'activity'" class="goods-big-box">
            <div class="line"></div>
            <div :class="{'touch': comType === cms.module_name}" class="goods-small-box hand" @click="_setType(cms)">
              <div class="goods-title-box">
                <div class="goods-title-main">
                  <div class="goods-title-text">今日抢购</div>
                  <!--<div class="goods-title-icon"></div>-->
                  <div class="goods-title-sub">今日下单 次日提货</div>
                </div>
              </div>
              <div class="goods-box hand">
                <div v-for="(item, index) in goodsList" :key="index" class="goods-list">
                  <div class="goods-left">
                    <div class="goods-left-img">
                      <img v-if="item.goods_cover_image" class="item-img" :src="item.goods_cover_image">
                    </div>
                    <div class="goods-left-icon">
                      <img class="item-img" src="./icon-label@2x.png">
                    </div>
                  </div>
                  <div class="goods-right">
                    <div class="goods-right-top">
                      <div class="title">{{item.name}}</div>
                      <div v-if="item.describe" class="text-sub">{{item.describe}}</div>
                      <div class="text-sales-box">
                        <div class="text-sales">已售{{item.sale_count}}件</div>
                      </div>
                    </div>
                    <div class="add-box">
                      <div class="add-box-left">
                        <section class="left">
                          <div class="text-group">团购价</div>
                        </section>
                        <div class="price-box">
                          <div class="money">{{item.trade_price}}</div>
                          <div class="unit">元</div>
                          <div class="lineation">{{item.original_price}}元</div>
                        </div>
                      </div>
                      <button v-if="item.usable_stock * 1 > 0" class="add-box-right" formType="submit">
                        <div class="add-goods-btn">
                          <div class="phone-add-icon">
                            <div class="add1"></div>
                            <div class="add2"></div>
                          </div>
                          <div class="add-text">购物车</div>
                        </div>
                      </button>
                      <div v-if="item.usable_stock * 1 <= 0" class="add-box-right" @click.stop>
                        <div class="add-goods-btn add-goods-btn-active">
                          <div class="add-text">已抢完</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="!goodsList.length" class="goods-none">
                  <div class="none-box">
                    <img src="./icon-picmr@2x.png" class="none-img">
                  </div>
                </div>
                <!--<div v-if="!goodsList.length" class="goods-none">-->
                <!--<div class="none-box">-->
                <!--<img src="./icon-picmr@2x.png" class="none-img">-->
                <!--</div>-->
                <!--</div>-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {Carousel, CarouselItem} from 'iview'

  const COMPONENT_NAME = 'PHONE_BOX'
  export default {
    name: COMPONENT_NAME,
    components: {
      Carousel,
      CarouselItem
    },
    props: {
      infoType: {
        type: String,
        default: 'bannar'
      },
      cmsMsg: {
        type: Array,
        default: () => {
          return []
        }
      },
      bannerList: {
        type: Array,
        default: () => {
          return [
            {
              content: {id: '', url: ''},
              image_id: '',
              image_url: '',
              type: 'mini_goods'
            }
          ]
        }
      },
      navList: {
        type: Array,
        default: () => {
          return []
        }
      },
      goodsList: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data() {
      return {
        bannerIndex: 0,
        comType: this.infoType
      }
    },
    watch: {
      infoType(news) {
        this.comType = news
      }
    },
    methods: {
      _getBanner(oldValue, value) {
        this.bannerIndex = value
      },
      _setType(cms) {
        this.comType = cms.module_name
        this.$emit('setType', cms)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .phone-box
    margin: 0 76px 0 71px
    box-sizing: border-box
    display: flex
    justify-content: center
    .phone
      icon-image('pic-tel')
      width: 340px
      height: 726.24px
      position: relative
      .content-box
        padding: 0 2px
        box-sizing: border-box
        top: 111px
        left: 23px
        position: absolute
        width: 294px
        height: 499px
        max-height: 532px
        overflow-x: hidden
        &::-webkit-scrollbar
          width: 0px

  .banner-box
    margin-top: 3px
    background: $color-white
    width: 100%
    overflow: hidden
    display: flex
    align-items: center
    justify-content: center
    box-sizing: border-box
    position: relative
    &:after
      content: ''
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      transition: all 0.2s
      box-sizing: border-box
      border: 2px dashed #D9D9D9
    .big-box
      width: 299px
      height: 100%
      box-sizing: border-box
    .banner
      width: 293px
      height: 104px
      .carousel
        margin-top: 5px
        border-radius: 1px
        width: 287px
        height: 94.6px
        background-repeat: no-repeat
        background-size: cover
        background-position: center
        background-image: url('./icon-picmr@2x.png')
      .carousel-active
        margin-top: 0
        height: 104px
      .carousel-none
        display: flex
        align-items: center
        justify-content: center
        background: #F5F5F5
        .none-img
          width: 60px

  .touch
    overflow: hidden
    position: relative
    transition: all 0.2s
    &:after
      content: ''
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      transition: all 0.2s
      box-sizing: border-box
      border: 2px solid $color-main !important

  .nav-box
    margin-top: 7px
    overflow: hidden
    position: relative
    transition: all 0.2s
    &:after
      content: ''
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      transition: all 0.2s
      box-sizing: border-box
      border: 2px dashed #D9D9D9

  .goods-small-box
    overflow: hidden
    position: relative
    transition: all 0.2s
    &:after
      content: ''
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      transition: all 0.2s
      box-sizing: border-box
      border: 2px dashed #D9D9D9

  .nav-list
    box-sizing: border-box
    background: $color-white
    layout(row)
    align-items: center
    margin: 4.7px 5px 10px
    padding-bottom: 10px
    .nav-item
      width: 20%
      margin-top: 10px
      .nav-top-box
        width: 47px
        height: @width
        margin: 0 auto 5px
        background: #F5F5F5
        border-radius: 50%
        background-repeat: no-repeat
        background-size: cover
        background-position: center
      .nav-top-text
        height: 12px
        font-size: $font-size-12
        font-family: $font-family-regular
        color: #333
        text-align: center

  .goods-big-box
    background: $color-white
    .line
      height: 10px
      background #F7F7F7

  .goods-title-box
    padding-left: 12px
    box-sizing: border-box
    border-bottom-1px($color-line)
    .goods-title-main
      layout(row)
      border-bottom-1px($color-line)
      align-items: center
      height: 45px
      .goods-title-img
        width: 16px
        height: 16px
        display: block
        margin-right: 5px
        icon-image('icon-clock')
      .goods-title-text
        font-size: 15px
        color: $color-text-main
        font-family: $font-family-regular
        text-indent: 9.5px
        position: relative
        &:after
          content: ''
          col-center()
          left: 0
          width: 3.5px
          height: 14px
          background: #FC4D1A
      .goods-title-icon
        width: 3px
        height: 3px
        background: #FF8300
        margin: 0 5px
        border-radius: 50%
      .goods-title-sub
        font-size: $font-size-12
        margin-left: 5.5px
        color: #808080
        font-family: $font-family-regular

  .goods-box
    padding: 0 10.08px
    box-sizing: border-box
    position: relative
    .goods-list
      height: 121px
      layout(row)
      border-bottom-1px(#e6e6e6)
      align-items: center
      &:last-child
        border-none()
      .goods-left
        margin-left: 5px
        position: relative
        width: 94.6px
        height: @width
        margin-right: 12px
        .goods-left-img
          width: 100%
          height: 100%
          border-radius: 3px
          .item-img
            width: 100%
            height: 100%
            border-radius: 3px
            display: block
            object-fit: cover
        .goods-left-icon
          width: 28px
          position: absolute
          left: -5px
          top: -5px
          img
            display: block
            width: 28px
            object-fit: cover
      .goods-right
        flex: 1
        overflow: hidden
        layout()
        justify-content: space-between
        min-height: 94.6px
        .goods-right-top
          width: 100%
        .title
          padding-top: 3px
          font-size: $font-size-13
          font-family: $font-family-regular
          color: $color-text-main
          min-height: $font-size-13
          margin-bottom: 4px
          no-wrap()
        .text-sub
          font-size: $font-size-13
          font-family: $font-family-regular
          color: $color-text-sub
          margin-bottom: 4px
          no-wrap()
          padding-right: 10px
          box-sizing: border-box
        .text-sales-box
          layout(row)
          .text-sales
            font-size: $font-size-12
            font-family: $font-family-regular
            color: #808080
            margin-bottom: 9px
            border-radius: 10px
            height: 15px
            line-height: 14px
            box-sizing: border-box
            border-1px(#808080, 10px)
            padding: 0 5px
        .add-box
          layout(row)
          justify-content: space-between
          align-items: center
          .left
            layout(row)
            .text-group
              font-size: $font-size-12
              font-family: $font-family-regular
              color: #FF8300
              height: 13px
              line-height: 13px
              margin-bottom: 3px
              border-radius: 10px
              padding: 0 5px
          .price-box
            layout(row)
            align-items: flex-end
            .money
              font-family: $font-family-regular
              color: #FF8300
              font-size: $font-size-20
              line-height: 1
            .unit
              font-family: $font-family-regular
              color: #FF8300
              font-size: $font-size-12
              line-height: 1
              margin-right: 2px
              padding-bottom: 2.5px
            .lineation
              font-family: $font-family-regular
              color: #B7B7B7
              font-size: $font-size-12
              text-decoration line-through
              padding-bottom: 1px
              line-height: 1
              margin-left: 3.6px
          .add-goods-btn
            layout(row)
            width: 64.5px
            height: 24px
            background: #73C200
            justify-content: center
            align-items: center
            border-radius: 14px
            .add-text
              font-size: $font-size-12
              font-family: $font-family-regular
              color: #fff
            .phone-add-icon
              width: 11px
              height: 11px
              position: relative
              margin-right: 2px
              .add1
                width: 11px
                height: 3px
                transform: scaleY(0.5)
                background-color: #fff
                position: absolute
                left: 0
                top: 4.5px
                border-radius: 30px
              .add2
                width: 3px
                height: 11px
                transform: scaleX(0.5)
                background-color: #fff
                border-radius: 30px
                position: absolute
                left: 4px
                top: 0

          .add-goods-btn-active
            background: #b7b7b7

  .goods-none
    padding: 13px 0
    border-radius: 3px
    border-bottom-1px(#e6e6e6)
    &:last-child
      border-none()
    .none-box
      background: #F5F5F5
      height: 94.6px
      display: flex
      align-items: center
      justify-content: center
    .none-img
      width: 40px
</style>
