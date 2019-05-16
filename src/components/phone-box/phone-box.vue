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
          <section v-if="cms.module_name === 'activity_fixed'"
                   class="un-touch"
                   :class="{'touch': comType === cms.module_name}"
                   @click="_setType(cms)"
          >
            <!--          限时抢购-->
            <article class="flash-wrapper">
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
            </article>
            <article class="active-wrapper">
              <!--          tab-->
              <ul class="tab-wrapper">
                <li
                  v-for="(item,index) in 5"
                  :key="index"
                  class="tab-item"
                  :class="{active: !index}"
                >
                  <p>新人特惠</p>
                  <div class="sub">
                    <span>专属特权</span>
                  </div>
                </li>
              </ul>
<!--              团购-->
              <nav class="panel">
                <img class="banner-img" src="./pic-ptfx.png" alt="">
                <div
                  v-for="(item, index) in 5"
                  :key="index"
                  class="goods-item-wrapper"
                >
                  <article class="goods-wrapper">
                    <figure class="left">
                      <img class="goods-image" src="./pic-ptfx.png" alt="">
                      <img class="label" src="./icon-label@1x.png" alt="">
                    </figure>
                    <section class="right">
                      <p class="title">超值特惠4斤新鲜柠檬超值特惠4斤新鲜柠檬</p>
                      <p class="sub-title">味道香甜可做各式味道香甜可做各式</p>
                      <div class="money-wrapper">
                        <p class="int">10</p>
                        <p class="dot">.8</p>
                        <p class="unit">元</p>
                        <p class="origin">12元</p>
                      </div>
                      <p class="type-icon group">拼团价</p>
                      <div class="button-group">
                        <div class="button-wrapper">
                          <p>去拼团</p>
                        </div>
                        <p class="number">已售3303斤</p>
                      </div>
                    </section>
                  </article>
                </div>
              </nav>
<!--              今日爆破-->
              <nav class="panel">
                <img class="banner-img" src="./pic-jrbk.png" alt="">
                <div
                  v-for="(item, index) in 5"
                  :key="index"
                  class="goods-item-wrapper"
                >
                  <article class="goods-wrapper">
                    <figure class="left">
                      <img class="goods-image" src="./pic-ptfx.png" alt="">
                      <img class="label" src="./icon-label@1x.png" alt="">
                    </figure>
                    <section class="right">
                      <p class="title">超值特惠4斤新鲜柠檬超值特惠4斤新鲜柠檬</p>
                      <p class="sub-title">味道香甜可做各式味道香甜可做各式</p>
                      <div class="money-wrapper">
                        <p class="int">10</p>
                        <p class="dot">.8</p>
                        <p class="unit">元</p>
                        <p class="origin">12元</p>
                      </div>
                      <p class="type-icon group">爆款价</p>
                      <div class="button-group">
                        <div class="button-wrapper">
                          <p>+购物车</p>
                        </div>
                        <p class="number">已售3303斤</p>
                      </div>
                    </section>
                  </article>
                </div>
              </nav>
              <!--              新人特惠-->
              <nav class="panel">
                <img class="banner-img" src="./pic-xrth.png" alt="">
                <div
                  v-for="(item, index) in 5"
                  :key="index"
                  class="goods-item-wrapper"
                >
                  <article class="goods-wrapper">
                    <figure class="left">
                      <img class="goods-image" src="./pic-ptfx.png" alt="">
                      <img class="label" src="./icon-label@1x.png" alt="">
                    </figure>
                    <section class="right">
                      <p class="title">超值特惠4斤新鲜柠檬超值特惠4斤新鲜柠檬</p>
                      <p class="sub-title">味道香甜可做各式味道香甜可做各式</p>
                      <div class="money-wrapper">
                        <p class="int">10</p>
                        <p class="dot">.8</p>
                        <p class="unit">元</p>
                        <p class="origin">12元</p>
                      </div>
                      <p class="type-icon group">新人价</p>
                      <div class="button-group">
                        <div class="button-wrapper">
                          <p>+购物车</p>
                        </div>
                        <p class="number">已售3303斤</p>
                      </div>
                    </section>
                  </article>
                </div>
              </nav>
              <!--              猜你喜欢-->
              <nav class="panel guess">
<!--                <img class="banner-img" src="./pic-jrbk.png" alt="">-->
                <div
                  v-for="(item, index) in 5"
                  :key="index"
                  class="goods-item-wrapper"
                >
                  <article class="goods-wrapper">
                    <figure class="left">
                      <img class="goods-image" src="./pic-ptfx.png" alt="">
                      <img class="label" src="./icon-label@1x.png" alt="">
                    </figure>
                    <section class="right">
                      <p class="title">超值特惠4斤新鲜柠檬超值特惠4斤新鲜柠檬</p>
                      <p class="sub-title">味道香甜可做各式味道香甜可做各式</p>
                      <div class="money-wrapper">
                        <p class="int">10</p>
                        <p class="dot">.8</p>
                        <p class="unit">元</p>
                        <p class="origin">12元</p>
                      </div>
                      <p class="type-icon group">团购价</p>
                      <div class="button-group guess">
                        <div class="button-wrapper">
                          <p>+购物车</p>
                        </div>
                        <p class="number">已售3303斤</p>
                      </div>
                    </section>
                  </article>
                </div>
              </nav>
            </article>
          </section>
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

  // 结构布局
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
  // 活动tab
  .active-wrapper
    padding-top :10px
    background: linear-gradient(-180deg, #FFFFFF 0%, #F7F7F7 100%)
    // 各个活动
    .panel
      position :relative
      padding: 47px 9px 0
      &.guess
        padding :0 9px 0
      .banner-img
        position absolute
        left :0
        top:0
        width :100%
      .goods-item-wrapper
        padding-bottom :10px
        .goods-wrapper
          height :102px
          display :flex
          border-radius: 3px
          position :relative
          align-items :center
          padding :0 8px
          background :#FFFFFF
          .right
            flex: 1
            overflow :hidden
            padding-left :8px
            height :100%
            position :relative
            background :#FFFFFF
            .button-group
              font-family: $font-family-regular
              position absolute
              right :0
              bottom :5px
              &.guess
                .button-wrapper
                  background: #73C200
              &.group
                .button-wrapper
                  background: #FF8506
              .button-wrapper
                height :22px
                padding :0 13px
                background: #FF8506
                border-radius: 22px
                font-size: 10px;
                display :flex
                align-items :center
                justify-content :center
                color: #FFFFFF
                transform :scale(0.9)
              .number
                position :relative
                top: -2px
                font-size: 10px
                transform :scale(0.7)
                color: #808080;
                text-align :center
            .type-icon
              position absolute
              left :8px
              bottom :30px
              height :18.5px
              line-height :8.5px
              border-radius: 12.5px
              padding :4px 5px
              font-family: $font-family-regular
              font-size: 10px;
              transform scale(0.8)
              border: 1px solid transparent
              &.group
                background: rgba(250,117,0,0.10)
                color: #FA7500;
                border: 1px solid #FA7500
            .title
              width :100%
              padding-top :10px
              font-family: $font-family-medium
              font-size: 12px
              color: #111111
              no-wrap()
            .sub-title
              width :100%
              padding-top :0px
              font-family: $font-family-regular
              font-size: 10px;
              color: #808080;
              no-wrap()
            .money-wrapper
              display :flex
              font-family: $font-family-medium
              color: #FA7500;
              padding-top :24px
              .int
                font-size: 19px
              .dot
                position :relative
                top:7px
                font-size :12px
              .unit
                padding-left :1px
                position :relative
                top:6px
                font-size :10px
                transform :scale(0.8)
                font-family: $font-family-regular
              .origin
                padding-left :2px
                position :relative
                top:6px
                font-family: $font-family-regular
                font-size :10px
                color: #B7B7B7
                transform :scale(0.8)
                text-decoration :line-through
          .left
            width :86px
            height :@width
            position :relative
            .goods-image
              width: 100%
              height: 100%
              object-fit :cover
              background :#f5f5f5
              border-radius :1px
            .label
              position :absolute
              display :block
              top:-1px
              left :@top
              width :25px
              height :@width
    // tab
    .tab-wrapper
      overflow :hidden
      height :46px
      padding :0 5px
      .tab-item
        display :inline-block
        p
          padding-top :7px
          font-family: $font-family-medium
          font-size: 12px;
          color: #1D2023;
          text-align: center;
        .sub
          display :block
          font-family: $font-family-regular;
          font-size: 10px;
          color: #808080;
          text-align: center;
          line-height :14px
          height :16px
          border-radius :14px
          transform :scale(0.7)
          padding :2px 5px
        &.active
          p
            color: #73C200
          .sub
            background : #73C200
            color: #fff

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
          position :relative
          .goods-img
            width :100%
            height :@width
            object-fit :cover
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

  // 轮播图
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

  // 选中
  .touch
    overflow: hidden
    position: relative
    border: 2px solid $color-main !important

  // 未选中
  .un-touch
    transition: all 0.2s
    background-clip: padding-box
    border: 2px dashed #D9D9D9

</style>
