<template>
  <div class="phone-box">
    <div class="phone">
      <div v-if="isShowEmpty" :class="['content-box', 'empty-type-'+type]">
      </div>
      <div v-else class="content-box">
        <div v-if="type !== 'video'" class="content-article-detail">
          <video v-if="data.coverVideo.url" :src="data.coverVideo.url" controls class="cover-photo"></video>
          <img v-else :src="data.coverImage.url" class="cover-photo">
          <div v-if="type === 'cookbook'" class="cookbook-title">{{data.title}}</div>
          <div :class="['auth-wrap',{cookbook: type === 'cookbook' }]">
            <img src="./icon-high_quality@2x.png" class="good-article-icon">
            <div v-if="data.authPhoto.url" class="auth-photo-wrap">
              <img :src="data.authPhoto.url" class="auth-photo">
              <img src="./icon-v@2x.png" class="auth-photo-v">
            </div>
            <div v-if="data.authName|| data.authSignature" class="auth-info">
              <div v-if="data.authName" class="name">
                {{data.authName}}
                <img src="./icon-lv8@2x.png" class="level-icon">
              </div>
              <div v-if="data.authSignature" class="auth-introduce">{{data.authSignature}}</div>
            </div>
          </div>
          <div class="browse-wrap">
            <!--<div v-if="data.lookCount && type !== 'cookbook'" class="browse-title">浏览{{data.lookCount>= 10000 ? data.lookCount/10000 +'万':data.lookCount}}</div>-->
            <!--v-if="type === 'cookbook'"-->
            <div class="browse-title"></div>
            <div v-if="data.goodCount" class="like-wrap">
              <div class="like-total">
                <img src="./icon-like_big1@2x.png" alt="" class="like-icon">
                <div class="total-count">{{data.goodCount}}</div>
              </div>
              <img v-for="(item,idx) in data.likes" :key="idx" :src="item.avatar" class="liker-photo">
            </div>
          </div>
          <div class="line-middle"></div>
          <div v-if="type !== 'cookbook'" class="title">{{data.title}}</div>
          <template v-else>
            <div class="emoty-grey-bg"></div>
            <div class="foodlist-title">
              <img src="./icon-ingredients@2x.png" class="foodlist-icon">食材
            </div>
            <div v-if="data.foodList" class="foods-list">
              {{data.foodList}}
            </div>
            <div class="goods-list">
              <goods-item v-for="(item,idx) in data.goodsList" :key="idx" :goodsData="item"></goods-item>
            </div>
            <div class="emoty-grey-bg"></div>
          </template>
          <div class="article-cont">
            <div v-for="(item,idx) in data.details" :key="idx" class="article-item">
              <div v-if="item.type==='text'" class="article-text">{{item.value}}</div>
              <img v-if="item.type==='image'" :src="item.value" mode="widthFix" class="article-image">
              <video v-if="item.type==='video'" :src="item.value" class="article-video"></video>
              <goods-item v-if="item.type==='goods'" :goodsData="item.value" :addDisabled="true"></goods-item>
            </div>
          </div>
          <div class="bottom-operate-wrap">
            <div class="bottom-operate">
              <div class="operate-item">
                <div class="icon-wrap">
                  <div v-if="data.goodCount" class="count">{{data.goodCount}}</div>
                  <img src="./icon-like_big1@2x.png" class="operate-icon">
                </div>
              </div>
              <div class="operate-item">
                <div class="icon-wrap">
                  <!--<div class="count">{{data.goodCount}}</div>-->
                  <img src="./icon-share@2x.png" class="operate-icon">
                </div>
              </div>
              <div class="operate-item">
                <div class="icon-wrap">
                  <!--<div class="count red">{{data.goodCount}}</div>-->
                  <img src="./icon-shopping_cart@2x.png" class="operate-icon">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="content-article-detail-video" @click.self="videoClick">
          <video v-if="data.videoContent.url" :src="data.videoContent.url" controls class="full-screen-video" @click="videoClick">
          </video>
          <div class="info-wrap" @click="videoClick">
            <div class="auth-wrap">
              <div v-if="data.authPhoto.url" class="auth-photo-wrap">
                <img :src="data.authPhoto.url" class="auth-photo">
                <img src="./icon-v@2x.png" class="auth-photo-v">
              </div>
              <template v-if="data.authName">
                <div class="name">{{data.authName}}</div>
                <img src="./icon-lv8@2x.png" class="level-icon">
              </template>
            </div>
            <div class="text">
              {{data.videoIntroduce}}
            </div>
            <div class="operate-wrap">
              <div>
                <div class="like-operate">
                  <div class="count">{{data.goodCount > 99 ? '99+' :data.goodCount}}</div>
                  <img src="./icon-fabulous1@2x.png" class="operate-icon">
                </div>
                <img src="./icon-share_big@2x.png" class="operate-icon">
                <img src="./icon-shoping_catbig@2x.png" class="operate-icon">
              </div>
              <div class="goods-btn" @click.stop="showGoodsListBtn">
                商品({{data.goodsList.length}})
              </div>
            </div>
          </div>
          <div :class="['goods-list-wrap',{show:goodsListVisible}]">
            <div class="title">全部商品<span class="num">/共{{data.goodsList.length}}个商品</span></div>
            <div class="good-list">
              <goods-item v-for="(item,idx) in data.goodsList" :key="idx" :goodsData="item"></goods-item>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import goodsItem from './goods-item/goods-item.vue'

  const COMPONENT_NAME = 'PHONE_BOX'

  export default {
    name: COMPONENT_NAME,
    components: {
      goodsItem
    },
    props: {
      isShowEmpty: {
        default: true,
        required: true,
        type: Boolean
      },
      data: {
        default: () => {
          return {}
        },
        required: true,
        type: Object
      },
      type: {
        default: 'common',
        required: true,
        type: String
      }
    },
    data() {
      return {
        goodsStatus: false,
        goodsListVisible: false
      }
    },
    computed: {},
    methods: {
      videoClick() {
        this.goodsListVisible = false
      },
      showGoodsListBtn() {
        this.goodsListVisible = true
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
    width: 340px

    .phone
      position: fixed
      z-index: 200
      top: 13%
      icon-image('pic-tel')
      width: 340px
      height: 726.24px

      .content-box
        box-sizing: border-box
        top: 111px
        left: 21px
        position: absolute
        width: 303px
        height: 503px
        overflow: hidden

        &.empty-type-video
          icon-image(pic-video_empty)

        &.empty-type-common
        &.empty-type-cookbook
          icon-image(pic-content_empty)

    .content-article-detail
      width: 100%
      height: 100%
      overflow: auto
      scroll-opacity(5px, 50px,rgba(0,0,0,0),rgba(0,0,0,0.15))
      .cover-photo
        width: 100%

      .cookbook-title
        font-family: $font-family-medium
        font-size: $font-size-22
        color: #111111;
        text-align: center
        padding: 22px 12px 10px

      .article-cont
        padding: 13px 15px

      .auth-wrap
        display flex
        align-items center
        padding: 13px 15px
        position relative

        &.cookbook
          justify-content: center

          .good-article-icon
            top: 0px

        .good-article-icon
          position absolute
          right: 11px
          top: 10px
          width: 48px
          height: @width

        .auth-photo-wrap
          position: relative

          .auth-photo
            width: 34px
            height: 34px

          .auth-photo-v
            position: absolute
            bottom: 0
            right: 0
            width: 10px
            height: 10px

        .auth-info
          font-family $font-family-regular
          margin-left: 5px

          .name
            font-size: $font-size-14
            color: #111111
            margin-bottom: 6px

            .level-icon
              width: 40px
              height: 13px

          .auth-introduce
            color: #808080
            font-size: $font-size-12

      .browse-wrap
        padding-left: 15px

        .browse-title
          font-size $font-size-12
          color: #333
          padding-bottom: 10px
          border-bottom-1px(#E6E6E6)

        .like-wrap
          height: 56px
          display flex
          align-items center
          flex-wrap wrap
          overflow hidden

          .like-total
            margin-right: 10px

            .like-icon
              width: 15px
              height: 15px
              display block

            .total-count
              font-size $font-size-10
              color: #111
              margin-top: 1px

          .liker-photo
            margin 15px 15px 15px 0px
            width: 26px
            height: 26px
            border-radius 50%
            border: 1px solid #ccc
            flex-shrink 0
            background #acacac

      .line-middle
        border-bottom-1px(#E6E6E6)

      .emoty-grey-bg
        height: 10px
        background-color #F8F8F8

      .title
        font-size $font-size-22
        font-family $font-family-medium
        color: #111111
        padding: 22px 15px 5px 15px

      .foodlist-title
        margin-left: 15px
        margin-right: 15px
        height: 44px
        line-height: 44px
        font-size: $font-size-15
        border-bottom-1px()
        font-family: $font-family-bold
        color: #111111
        letter-spacing: 0.4px

        .foodlist-icon
          width: 16px
          height: 13px
          margin-right: 3px

      .foods-list
        font-family $font-family-regular
        font-size $font-size-15
        letter-spacing 0.4px
        color: #111111
        margin: 15px

      .goods-list
        padding: 0px 15px 5px

      .article-cont
        padding: 15px 15px 10px 15px

        .article-item
          margin-bottom 15px

        .article-text
          font-family $font-family-regular
          font-size 15px
          color: #111111
          white-space: pre-wrap;
          word-wrap: break-word
        .article-image
        .article-video
          width: 100%
          background-color $color-np-content

      .bottom-operate-wrap
        height: 50px

      .bottom-operate
        position absolute
        bottom 0px
        right: 0
        left: 0
        background white
        box-shadow: 0 -4px 20px 0 rgba(29, 32, 35, 0.06)
        display flex
        justify-content space-around
        align-items center

        .operate-item
          padding: 13px

          .icon-wrap
            position relative
            height: 23px

            .operate-icon
              width: 23px
              height: @width

            .count
              position absolute
              top: -5px
              left: 23px
              color: #111
              font-size $font-size-12

              &.red
                left: 16px
                padding: 0px 4px
                background #FE3B39
                color: #fff
                height: 16px
                border-radius 8px
                font-size: $font-size-10

    .content-article-detail-video
      position absolute
      top: 0
      left: 0
      right: 0
      bottom 0
      overflow hidden
      background #000

      .bottom-emty-20
        height: 20px

      .full-screen-video
        width: 100%
        height: 100%

      .info-wrap
        position: absolute
        bottom: 20px
        left: 0
        right: 0
        padding: 0px 15px

        .auth-wrap
          display flex
          align-items center

          .auth-photo-wrap
            position: relative

            .auth-photo
              width: 36px
              height: 36px
              border-radius 50%

            .auth-photo-v
              position: absolute
              bottom: 4px
              right: 4px
              width: 12px
              height: 12px

          .name
            font-size: $font-size-16
            color: #ffffff
            font-family $font-family-regular
            margin: 0px 3px 0px 5px

          .level-icon
            width: 40px
            height: 13px

        .text
          color: #ffffff
          font-family $font-family-regular
          font-size: $font-size-15
          line-height 21px
          margin: 12px 0px 25px

        .operate-wrap
          display flex
          justify-content space-between
          align-items center

          .operate-icon
            width: 36px
            height: 36px
            margin-right: 20px

          .like-operate
            display inline-block
            position: relative

            .count
              position: absolute
              top: -12px
              left: 18px
              color: #fff;
              font-size $font-size-12
              padding: 0 3px
              min-width: 14px
              text-align: center
              height: 14px
              line-height 14px
              background: #FE3B39
              border-radius 7px

          .goods-btn
            flex-shrink 0s
            height: 36px
            line-height 36px
            padding: 0px 15px
            border-radius: 20px
            color: #fff
            background #73C200
            font-size $font-size-16
            font-family $font-family-regular


      .goods-list-wrap
        position: absolute
        background #fff
        bottom 0
        left: 0
        right: 0
        transform translateY(100%)
        border-radius 12px 12px 0 0
        transition all 0.3s

        &.show
          transition all 0.3s
          transform translateY(0)

        .title
          height: 50px
          line-height 50px
          padding 0px 15px
          font-family: $font-family-regular
          font-size: $font-size-16
          color: #111111

          .num
            font-family: $font-family-regular
            font-size: $font-size-11
            color: #808080
            margin-left 3px

        .good-list
          padding: 0px 15px 17px 15px
          max-height: 400px
          overflow auto
          scroll-opacity(0, 0)
</style>
