<template>
  <div class="phone-box">
    <div class="phone">
      <div class="content-box">
        <!-- 轮播图-->
        <div class="banner-box">
          <div class="big-box hand" :class="{'touch': comType === 2}" @click="_setType(2)">
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
        <div class="nav-list" :class="{'touch': comType === 4}">
          <div v-for="(item, index) in [0, 1, 2, 3, 4, 5 , 6, 7, 8, 9]" :key="index" class="nav-item">
            <div class="nav-top-box">{{item}}</div>
            <div class="nav-top-text"></div>
          </div>
        </div>
        <!--进日抢购-->
        <div class="goods-big-box">
          <div class="line"></div>
          <div class="goods-title-box">
            <div class="goods-title-main">
              <div class="goods-title-img"></div>
              <div class="goods-title-text">今日抢购</div>
              <div class="goods-title-icon"></div>
              <div class="goods-title-sub">今日下单 次日提货</div>
            </div>
          </div>
          <div class="goods-box hand" :class="{'touch': comType === 3}">
            <div v-for="(item, index) in goodsList" :key="index" class="goods-list" @click="jumpGoodsDetail(item)">
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
                      <div class="money">{{item.shop_price}}</div>
                      <div class="unit">元</div>
                      <div class="lineation">{{item.original_price}}元</div>
                    </div>
                  </div>
                  <button v-if="item.usable_stock * 1 > 0" class="add-box-right" formType="submit">
                    <div class="add-goods-btn">
                      <div class="add-icon">
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
      bannerList: {
        type: Array,
        default: () => {
          return [
            // {
            //   content: {id: '', url: ''},
            //   goods_cover_image:
            //     '',
            //   goods_name: '',
            //   id: '',
            //   image_id: '',
            //   image_url: '',
            //   type: 'mini_goods'
            // },
            {
              content: {id: 15, url: ''},
              goods_cover_image:
                'http://social-shopping-api-1254297111.picgz.myqcloud.com/1/2018/12/16/154492815148239.png',
              goods_name: '马某某0222',
              id: 25,
              image_id: 177,
              image_url: 'http://social-shopping-api-1254297111.picgz.myqcloud.com/1/2018/12/28/154599333710387.png',
              type: 'mini_goods'
            },
            {
              content: {id: 15, url: ''},
              goods_cover_image:
                'http://social-shopping-api-1254297111.picgz.myqcloud.com/1/2018/12/20/154528943392936.png',
              goods_name: '马某某0222',
              id: 25,
              image_id: 177,
              image_url: 'http://social-shopping-api-1254297111.picgz.myqcloud.com/1/2018/12/20/154528943392936.png',
              type: 'mini_goods'
            },
            {
              content: {id: 15, url: ''},
              goods_cover_image:
                'http://social-shopping-api-1254297111.picgz.myqcloud.com/1/2018/12/20/154528896495722.png',
              goods_name: '马某某0222',
              id: 25,
              image_id: 177,
              image_url: 'http://social-shopping-api-1254297111.picgz.myqcloud.com/1/2018/12/20/154528896495722.png',
              type: 'mini_goods'
            }
          ]
        }
      },
      goodsList: {
        type: Array,
        default: () => {
          return [
          // {
          //   describe: 'dsf',
          //   goods_cover_image:
          //     'http://social-shopping-api-1254297111.picgz.myqcloud.com/1/2018/12/19/154520881660614.png?imageView2/3/w/200/h/200/q/85',
          //   goods_id: 34,
          //   goods_units: '斤',
          //   id: 2393,
          //   name: '测试编号002',
          //   original_price: '3.21',
          //   sale_count: 51,
          //   shop_price: '1',
          //   shop_sku_id: 2393,
          //   thumb_image: '',
          //   usable_stock: 1
          // },
          // {
          //   describe: 'dsf',
          //   goods_cover_image:
          //     'http://social-shopping-api-1254297111.picgz.myqcloud.com/1/2018/12/19/154520881660614.png?imageView2/3/w/200/h/200/q/85',
          //   goods_id: 34,
          //   goods_units: '斤',
          //   id: 2393,
          //   name: '测试编号002',
          //   original_price: '3.21',
          //   sale_count: 51,
          //   shop_price: '1',
          //   shop_sku_id: 2393,
          //   thumb_image: '',
          //   usable_stock: 1
          // },
          // {
          //   describe: 'dsf',
          //   goods_cover_image:
          //     'http://social-shopping-api-1254297111.picgz.myqcloud.com/1/2018/12/19/154520881660614.png?imageView2/3/w/200/h/200/q/85',
          //   goods_id: 34,
          //   goods_units: '斤',
          //   id: 2393,
          //   name: '测试编号002',
          //   original_price: '3.21',
          //   sale_count: 51,
          //   shop_price: '1',
          //   shop_sku_id: 2393,
          //   thumb_image: '',
          //   usable_stock: 1
          // }
          ]
        }
      }
    },
    data() {
      return {
        bannerIndex: 0,
        comType: 4
      }
    },
    methods: {
      _getBanner(oldValue, value) {
        this.bannerIndex = value
      },
      _setType(type) {
        this.comType = type
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .phone-box
    width: 48%
    box-sizing: border-box
    display: flex
    align-items: center
    justify-content: center
    .phone
      icon-image('pic-iphone')
      width: 375px
      height: 764.6px
      position: relative
      margin: 40px 0
      .content-box
        top: 94px
        left: 35px
        position: absolute
        width: 315px
        height: 550px
        max-height: 550px
        overflow-x: hidden
        &::-webkit-scrollbar
          width: 0px

  .banner-box
    background: $color-white
    width: 100%
    overflow: hidden
    display: flex
    align-items: center
    justify-content: center
    padding-top: 3px
    box-sizing: border-box
    .big-box
      width: 299px
      height: 100%
      box-sizing: border-box
    .banner
      width: 293px
      height: 104px
      .carousel
        margin-top: 5px
        border-radius: 4px
        width: 287px
        height: 94.6px
        background-repeat: no-repeat
        background-size: cover
        background-position: center
        background-image: url('./icon-picmr@2x.png')
        transition: all 0.3s
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
    transition: all 0.2s
    box-sizing: border-box
    border: 2px solid $color-main

  .nav-list
    background: $color-white
    layout(row)
    align-items: center
    padding: 4.7px 5px 23px
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
        font-size: $font-size-16
        color: $color-text-main
        font-family: $font-family-medium
      .goods-title-icon
        width: 3px
        height: 3px
        background: #FF8300
        margin: 0 5px
        border-radius: 50%
      .goods-title-sub
        font-size: $font-size-12
        color: #808080
        font-family: $font-family-regular

  .goods-box
    padding: 0 10.08px
    box-sizing: border-box
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
          img
            width: 100%
            height: 100%
            border-radius: 3px
            display: block
        .goods-left-icon
          width: 28px
          position: absolute
          left: -5px
          top: -5px
          img
            display: block
            width: 28px
      .goods-right
        flex: 1
        overflow: hidden
        layout()
        justify-content: space-between
        min-height: 94.6px
        .title
          padding-top: 3px
          font-size: $font-size-13
          font-family: $font-family-medium
          color: $color-text-main
          line-height: 1
          min-height: $font-size-13
          margin-bottom: 4px
          no-wrap()
        .text-sub
          font-size: $font-size-13
          font-family: $font-family-regular
          color: $color-text-sub
          line-height: 1
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
              font-family: $font-family-medium
              color: #FF8300
              font-size: $font-size-20
              line-height: 1
            .unit
              font-family: $font-family-medium
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
            .add-icon
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
