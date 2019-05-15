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
                          :height="117"
                          :autoplay="true"
                          :radiusDot="true"
                          dots="none"
                          @on-change="_getBanner"
                >
                  <carousel-item v-for="(item, index) in bannerList" :key="index">
                    <!--                    <div class="carousel" :class="{'carousel-active' :bannerIndex === index, 'carousel-none': !item.image_url}" :style="{'background-image': 'url(\'' + item.image_url + '\')'}">-->
                    <!--                      <img v-if="!item.image_url" src="./icon-picmr@2x.png" class="none-img">-->
                    <!--                    </div>-->
                    <img v-if="item.image_url" class="carousel" :src="item.image_url" alt="">
                    <img v-else src="./icon-picmr@2x.png" class="carousel">
                  </carousel-item>
                </carousel>
              </div>
            </div>
          </div>
          <!--商品分类-->
          <ul v-if="cmsIdx === 0" class="goods-classify-wrapper">
            <li v-for="(item, index) in 9"
                :key="index"
                class="classify-item"
                :class="{'next-row': index > 4}"
            >
              <img src="" alt="">
              <p>实力蔬菜</p>
            </li>
          </ul>
          <!--          限时抢购-->
          <section v-if="cms.module_name === 'activity_fixed'"
                   class="flash-wrapper un-touch"
                   :class="{'touch': comType === cms.module_name}"
                   @click="_setType(cms)"
          >
            <nav class="tab-wrapper">
              <img class="logo" src="./pic-qgtitle@2x.png" alt="">
              <template v-for="(val, ind) in cms.content_data.list">
                <div
                  v-if="ind < 2"
                  :key="ind"
                  class="button-wrapper active"
                  :class="{active: ind === 0}"
                >
                  <p class="title">{{val.at}}</p>
                  <p class="date">{{val.at_str}}</p>
                </div>
              </template>
              <div class="more-wrapper">
                <p>更多</p>
                <img src="./icon-pressed@2x.png" alt="">
              </div>
            </nav>
            <ul v-if="activityGoodsList && activityGoodsList.length"
                class="goods-list-wrapper"
            >
              <template v-for="(item, index) in activityGoodsList">
                <li :key="index"
                    class="goods-item-wrapper"
                >
                  <div class="goods-image">
                    <img v-if="item.goods_cover_image"
                         class="goods-img"
                         :src="item.goods_cover_image"
                         alt=""
                    >
                    <img class="label" src="./pic-label_qg@2x.png" alt="">
                  </div>
                  <p class="title">超值特新鲜柠</p>
                  <div class="money-wrapper">
                    <p class="m-int">10</p>
                    <p class="m-dot">.8</p>
                    <p class="m-unit">元</p>
                    <p class="m-origin">12元</p>
                  </div>
                </li>
              </template>
            </ul>
            <ul v-else
                class="goods-list-wrapper"
            >
              <template v-for="(item, index) in 4">
                <li :key="index"
                    class="goods-item-wrapper empty"
                >
                  <img class="goods-image empty" src="./icon-picmr@2x.png" alt="">
                  <p class="empty-text">未添加活动</p>
                </li>
              </template>
            </ul>
          </section>
          <!--限时抢购-->
          <div v-if="cms.module_name === 'activity_fixed'" class="goods-big-box">
            <div :class="{'touch': comType === cms.module_name}" class="goods-small-box hand" @click="_setType(cms)">
              <!--title-->
              <div class="goods-title-box">
                <div class="goods-title-main">
                  <div class="goods-title-left">
                    <img src="./pic-time_qg@2x.png" class="logo">
                  </div>
                  <div class="goods-title-right">
                    <div v-for="(val, ind) in cms.content_data.list" :key="ind" class="sale">
                      <span class="time">{{val.at}}</span>
                      <span class="text">{{val.at_str}}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="goods-box hand" :class="{'no-radius':cms.content_data.list.length === 1}">
                <div v-if="activityGoodsList.length" class="content">
                  <div v-for="(item, index) in activityGoodsList" :key="index" class="goods-list">
                    <img src="./icon-qiang@2x.png" alt="" class="tag">
                    <img v-if="item.goods_cover_image" class="item-img" :src="item.goods_cover_image">
                    <img v-else src="./icon-picmr@2x.png" class="item-img goods-none">
                    <div class="title">{{item.name}}</div>
                    <div class="bottom">
                      <span class="price">{{item.trade_price}}<em class="unit">元</em><del class="grey">{{item.original_price}}元</del></span>
                    </div>
                  </div>
                </div>
                <div v-if="!activityGoodsList.length" class="none-content">
                  <div v-for="(item, index) in new Array(4).fill(1)" :key="index" class="goods-none">
                    <div class="none-box">
                      <img src="./icon-picmr@2x.png" class="none-img">
                    </div>
                  </div>
                </div>
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
      cateGoods: {
        type: Array,
        default: () => {
          return []
        }
      },
      activityGoodsList: {
        type: Array,
        default: () => {
          return new Array(4).fill({})
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
  .add-box-right
    col-center()
    text-align: center
    right : 10PX

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
          width: 0
  // 商品分类
  .goods-classify-wrapper
    padding :17.5px 9.4px
    display :flex
    flex-direction :row
    flex-wrap :wrap
    .classify-item
      width :20%
      display :flex
      flex-direction column
      align-items :center
      overflow :hidden
      &.next-row
        padding-top :9.6px
      img
        display inline-block
        width :39.2px
        background :#ccc
        height :@width
        text-align :center
      p
        width :100%
        box-sizing :border-box
        padding :0 1px
        padding-top :7.9px
        font-family: $font-family-regular
        font-size: 9.41px;
        color: #333333;
        text-align: center;
        line-height: 1
        no-wrap()
  // 限时抢购
  .flash-wrapper
    padding :0 9.4px
    margin-bottom :20px
    .goods-list-wrapper
      height :134.8px
      box-sizing :border-box
      border:7px solid #FFE359
      display :flex
      flex-wrap :nowrap
      overflow :hidden
      .goods-item-wrapper
        height :100%
        margin-left :5.5px
        width :71px
        position :relative
        &.empty
          background :#f5f5f5
          .goods-image
            object-fit :contain
          .empty-text
            font-size :10px
            text-align :center
        .goods-image
          margin-top :7.8px
          width :71px
          height :@width
          object-fit :cover
          position :relative
          .goods-img
            width :100%
            height :@width
            border-radius: 2.35px;
          .label
            width :20px
            height :12.2px
            position :absolute
            left :0
            bottom :@left
        .title
          padding-top :5px
          width :100%
          font-family: $font-family-regular
          font-size: 10.19px;
          color: #111111;
          transform :scale(0.9)
          no-wrap()
        .money-wrapper
          width :100%
          display :flex
          font-family: $font-family-medium
          color:#FA7500
          overflow :hidden
          .m-int
            font-size: 15px
            transform :scale(0.8)
            position :relative
            bottom :3px
          .m-dot, .m-unit
            position :relative
            font-size: 10px;
            bottom :1px
          .m-dot
            transform :scale(.9)
          .m-unit
            transform :scale(0.8)
          .m-origin
            font-family: $font-family-regular
            font-size: 10px;
            transform :scale(0.8)
            color: #B7B7B7;
            text-decoration :line-through
    .tab-wrapper
      display :flex
      height :35.3px
      align-items :center
      background :#F7F9FA
      .logo
        width :60px
        height :14.8px
        margin-right :11px
        margin-left :7.8px
      .more-wrapper
        flex: 1
        display :flex
        height :100%
        align-items :center
        justify-content :flex-end
        padding-right :9.8px
        p
          font-family: $font-family-regular
          font-size: 10.98px;
          color: #111111;
          transform scale(0.8)
        img
          width :4.3px
          height :8.2px
      .button-wrapper
        width :64.3px
        height :100%
        color: #1D2023;
        font-family: $font-family-medium
        text-align :center
        &.active
          background :#FFE359
        .title
          padding-top :8px
          font-size: 12.54px;
          transform scale(1)
          line-height :0.8
        .date
          font-size: 7.84px;
          transform scale(0.6)
          line-height :1

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
    transition: all 0.2s
    border: 2px dashed #D9D9D9
    .big-box
      width: 299px
      height: 100%
      box-sizing: border-box
    .banner
      height: 117px
      .carousel
        border-radius: 2px
        width: 100%
        height: 100%
        object-fit :cover

  .touch
    overflow: hidden
    position: relative
    border: 2px solid $color-main !important

  .un-touch
    transition: all 0.2s
    background-clip: padding-box
    border: 2px dashed #D9D9D9

  .nav-content
    overflow: hidden
    position: relative
    margin-top: 15px
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
  .no-line:after
    border:0
    width: 0
    height: 0

  .goods-small-box
    padding-bottom: 12px
    background: #FFE359
    overflow: hidden
    position: relative
    transition: all 0.2s
    background-clip: padding-box
    border: 2px dashed #D9D9D9
  .nav-list
    box-sizing: border-box
    background: $color-white
    width: 400%
    height: 65px
    border-bottom: 0.5px solid #E6E6E6
    .nav-item
      width: 50px
      float: left
      height: 65px
      margin-right: 10px
      text-align: center
      position: relative
      font-size: 11px
      color: #111
      font-family: $font-family-regular
      &:first-child
        font-size: 12.5px
        font-family: $font-family-medium
      &:first-child:before
        content: ""
        width: 24px
        height: 2px
        border-radius: 1px
        background: #73C200
        position: absolute
        bottom: 0
        row-center()
      .img
        width: 35px
        height: 35px
        margin-bottom: 5px
        object-fit: cover
        border-radius: 50%
        display: block
        margin: 0 auto
      .text
        margin-top: 4px
        font-size: 12px
        transform: scale(0.92)
        display: block
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

  .no-goods
    .no-goods-item
      width: 270px
      height: 85px
      background: #F5F5F5
      margin: 10px auto 0
      display: flex
      align-items: center
      justify-content: center
      &:last-child
        margin-bottom: 10px
    .none-img
      width: 36px
      height: 29px
  .pro-list
    height: 111px
    layout(row)
    border-bottom-1px(#e6e6e6)
    align-items: center
    &:last-child
      border-none()
    .goods-left
      margin-left: 5px
      position: relative
      width: 86.7px
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
        .goods-none
          width: 80px
          height: 86px
          object-fit: contain
      .goods-left-icon
        width: 28px
        position: absolute
        left: -3px
        top: -3px
        img
          display: block
          width: 28px
          object-fit: cover
    .goods-right
      flex: 1
      overflow: hidden
      layout()
      justify-content: space-between
      min-height: 86.7px
      .goods-right-top
        width: 100%
      .title
        font-size: $font-size-13
        font-family: $font-family-regular
        color: $color-text-main
        min-height: $font-size-13
        line-height: 1.1
        no-wrap()
      .text-sub
        font-size: $font-size-10
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
        position :relative
        .left
          layout(row)
          .text-group
            height: 17px
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
          width: 60px
          height: 20px
          background: #73C200
          display: flex
          justify-content: center
          align-items: center
          border-radius: 20px
          .add-cart-icon
            width: 10px
            height: 10px
            object-fit: cover
            margin-right: 2px
          .add-text
            font-size: $font-size-10
            font-family: $font-family-regular
            color: #fff
        .sale-count
          font-size: 10px
          color: $color-text-assist
        .add-goods-btn-active
          background: #b7b7b7
  .goods-big-box
    border-radius: 6px
  .goods-title-box
    box-sizing: border-box
    height: 46.6px
    .goods-title-main
      display: flex
      justify-content: space-between
      height: 45px
      padding: 5px 7px
      .goods-title-left
        margin-top: 7px
        width: 100px
        display: flex
        flex-direction: column
        justify-content: center
        line-height: 1.2
        .logo
          width: 74px
          object-fit: cover
      .goods-title-right
        width: 165px
        height: 41px
        display: flex
        align-items: center
        justify-content: flex-end
        .sale
          font-size: $font-size-14
          font-family: $font-family-medium
          width: 55px
          height: 39px
          border-top-left-radius: 3px
          border-top-right-radius: 3px
          color: #1D2023
          text-align: center
          margin-top: 4px
          padding: 5px 0
          box-sizing: border-box
        .time
          display: block
          height: 14px
          line-height: 14px
          margin: 0 auto
        .text
          display: block
          font-family: $font-family-regular
          font-size: 10px
          line-height: 14px
          transform: scale(0.8)
        .sale:first-child
          background: #FFF
          background-size: 100% 100%
  .goods-box
    box-sizing: border-box
    overflow: hidden
    margin: 0 7px
    border-radius: 5px
    .content
      background: #FFF
      width: 200%
      height: 140px
      overflow: hidden
    .goods-list
      float: left
      width: 72px
      padding: 7.9px 0 10px 7.9px
      height: 126px
      box-sizing: content-box
      align-items: center
      position: relative
      &:first-child
        padding-left: 5.7px
      .tag
        width: 16px
        height: 16px
        position: absolute
        left: 5.9px
        top: 5.9px
      .item-img
        width: 71px
        height: 71px
        object-fit: cover
        border-radius: 2.5px
      .goods-none
        object-fit: contain
      .title
        color: #111
        font-size: 10.26px
        overflow: hidden
        white-space: nowrap
        text-overflow: ellipsis
        margin-top: 10px
      .bottom
        color: #FF8506
        font-family: $font-family-medium
        font-size: 13.42px
        margin-top: 2px
        .price
          .unit
            font-style: normal
            font-size: 8px
        .grey
          color: #B7B7B7
          display: inline-block
          margin-left: 3.6px
          font-size: 12px
          vertical-align: bottom
          transform: scale(0.8)
      .add
        width: 18.2px
        height: 18.2px
        icon-image(icon-shopcart)

  .no-radius
    border-top-right-radius: 0
  .none-content
    width: 400%
    height:106px
    .goods-none
      float: left
      margin-right: 5px
      width: 83px
      height: 83px
      padding: 8.5px 0 15px
      box-sizing: content-box
      align-items: center
      box-sizing: content-box
      align-items: center
      border-radius: 3px
      .none-box
        background: #F5F5F5
        height: 100%
        display: flex
        align-items: center
        justify-content: center
      .none-img
        width: 36px
  .line
    height: 7.9px
    background #F7F7F7
</style>
