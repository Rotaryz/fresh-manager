<template>
  <div class="phone-box">
    <div class="phone">
      <div class="content-box">
        <div class="content-article-detail">
          <img v-if="!details.coverVideo" :src=" '/yx-image/leader/pic-tzzm_03.jpg'" mode="widthFix" class="cover-photo">
          <video v-if="details.coverVideo" :src="item.value" class="cover-photo"></video>
          <div class="auth-wrap">
            <img :src="'./icon-high_quality@2x.png'" class="good-article-icon">
            <div class="auth-photo-wrap">
              <img v-if="details.authPhoto" :src="details.authPhoto" class="auth-photo">
              <img src="./icon-v@2x.png" class="auth-photo-v">
            </div>
            <div class="auth-info">
              <div class="name">
                {{details.authName}}
                <img src="./icon-lv8@2x.png" class="level-icon">
              </div>
              <div class="auth-introduce">{{details.authIntroduce}}</div>
            </div>
          </div>
          <div class="browse-wrap">
            <div class="browse-title">浏览1.9万</div>
            <div class="like-wrap">
              <div class="like-total">
                <img src="./icon-like_big1@2x.png" alt="" class="like-icon">
                <div class="total-count">664</div>
              </div>
              <img v-for="(item,idx) in details.likes" :key="idx" :src="item.photo" class="liker-photo">
            </div>
          </div>
          <div class="line-middle"></div>
          <div class="article-cont">
            <div class="name">懒人版糖醋排骨</div>
            <div class="foods-list">
              {{details.foodsList}}
            </div>
            <div class="goods-list">
              <goods-item v-for="(item,idx) in details.goodsList" :key="idx" :goodsData="item"></goods-item>
            </div>
            <div v-for="(item,idx) in details.articles" :key="idx" class="article-item">
              <div v-if="item.type==='text'" class="article-text">{{item.value}}</div>
              <img v-if="item.type==='img'" :src="item.value" mode="widthFix" class="article-image">
              <video v-if="item.type==='video'" :src="item.value" class="article-video"></video>
              <goods-item v-if="item.type==='goods'" :goodsData="item.value"></goods-item>
            </div>
          </div>
          <div class="bottom-operate-wrap">
            <div class="bottom-operate">
              <div class="operate-item">
                <div class="icon-wrap">
                  <div class="count">{{details.goodCount}}</div>
                  <img v-if="!goodsStatus" :src=" './icon-like_big1@2x.png'" class="operate-icon">
                </div>
              </div>
              <div class="operate-item">
                <div class="icon-wrap">
                  <div class="count">{{details.goodCount}}</div>
                  <img :src="'./icon-share@2x.png'" class="operate-icon">
                </div>
              </div>
              <div class="operate-item">
                <div class="icon-wrap">
                  <div class="count red">{{details.goodCount}}</div>
                  <img :src=" './icon-shopping_cart@2x.png'" class="operate-icon">
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
  import goodsItem from './goods-item/goods-item.vue'
  const COMPONENT_NAME = 'PHONE_BOX'

  export default {
    name: COMPONENT_NAME,
    components: {
      goodsItem
    },
    props: {},
    data() {
      return {
        goodsStatus: false,
        details: {
          coverVideo: false,
          authName: 'dsofdpsf',
          authIntroduce: '美食达人。深入浅出的美食科普知识…',
          authPhoto: 'https://img.jkweixin.net/defaults/yx-image/retuan/hdpi/icon-select_press01.png',
          text: '迅速的翻炒，我用筷子直接搅拌了几下，蛋液只要都凝固了，就可以改小火盛起来，我这个炒锅有点粘锅，看起来不是很好。',
          goodCount: 132,
          foodsList: '用料：排骨、糖、醋、大葱、丁香、八角、花椒、老抽、可乐、盐',
          likes: [{
            photo: 'https://social-shopping-api-1254297111.picgz.myqcloud.com/1/2019/06/21/156109801094065.png'
          }, {
            photo: 'https://social-shopping-api-1254297111.picgz.myqcloud.com/1/2019/06/21/156109801094065.png'
          }, {
            photo: 'https://social-shopping-api-1254297111.picgz.myqcloud.com/1/2019/06/21/156109801094065.png'
          }, {
            photo: 'https://social-shopping-api-1254297111.picgz.myqcloud.com/1/2019/06/21/156109801094065.png'
          }, {
            photo: 'https://social-shopping-api-1254297111.picgz.myqcloud.com/1/2019/06/21/156109801094065.png'
          }, {
            photo: 'https://social-shopping-api-1254297111.picgz.myqcloud.com/1/2019/06/21/156109801094065.png'
          }, {
            photo: 'https://social-shopping-api-1254297111.picgz.myqcloud.com/1/2019/06/21/156109801094065.png'
          }, {
            photo: 'https://social-shopping-api-1254297111.picgz.myqcloud.com/1/2019/06/21/156109801094065.png'
          }, {
            photo: 'https://social-shopping-api-1254297111.picgz.myqcloud.com/1/2019/06/21/156109801094065.png'
          }],
          goodsList: [{
            name: '超值特惠 2斤农家新鲜家新鲜',
            details: '绿色外皮下包裹着白嫩嫩的果…',
            price: '10.8',
            photo: ''
          }, {
            name: '超值特惠 2斤农家新鲜家新鲜',
            details: '绿色外皮下包裹着白嫩嫩的果…',
            price: '10.8',
            photo: ''
          }, {
            name: '超值特惠 2斤农家新鲜家新鲜',
            details: '绿色外皮下包裹着白嫩嫩的果…',
            price: '10.8',
            photo: ''
          }, {
            name: '超值特惠 2斤农家新鲜家新鲜',
            details: '绿色外皮下包裹着白嫩嫩的果…',
            price: '10.8',
            photo: ''
          }],
          steps: [{
            type: 'text',
            value: '每毕竟排骨本身就非常的受欢迎，再加上红烧的做法不但味道很足而且也不怎么重口味，因此成人和儿童都非常喜欢这道菜。'
          }, {
            type: 'text',
            value: '每毕竟排骨本身就非常的受欢迎，再加上红烧的做法不但味道很足而且也不怎么重口味，因此成人和儿童都非常喜欢这道菜。'
          }, {
            type: 'text',
            value: '每毕竟排骨本身就非常的受欢迎，再加上红烧的做法不但味道很足而且也不怎么重口味，因此成人和儿童都非常喜欢这道菜。'
          }, {
            type: 'text',
            value: '每毕竟排骨本身就非常的受欢迎，再加上红烧的做法不但味道很足而且也不怎么重口味，因此成人和儿童都非常喜欢这道菜。'
          }],
          articles: [{
            type: 'text',
            value: '一般而言在聊到自己制作的肉一类菜肴的时候，每个人最先想到的大概都是辣椒炒肉以及红烧肉了，但实际上有一种比这两种更受欢迎的菜，那就是红烧排骨了。'
          }, {
            type: 'img',
            value: 'https://img.jkweixin.net/defaults/yx-image/goods/pic-zbyx@2x.png'
          }, {
            type: 'text',
            value: '每毕竟排骨本身就非常的受欢迎，再加上红烧的做法不但味道很足而且也不怎么重口味，因此成人和儿童都非常喜欢这道菜。'
          }, {
            type: 'text',
            value: '每毕竟排骨本身就非常的受欢迎，再加上红烧的做法不但味道很足而且也不怎么重口味，因此成人和儿童都非常喜欢这道菜。'
          }, {
            type: 'img',
            value: 'https://img.jkweixin.net/defaults/yx-image/goods/pic-zbyx@2x.png'
          }, {
            type: 'goods',
            value: {
              name: '超值特惠 2斤农家新鲜家新鲜',
              details: '绿色外皮下包裹着白嫩嫩的果…',
              price: '10.8',
              photo: ''
            }
          }]
        }
      }
    },
    computed: {},
    methods: {}
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

  .content-article-detail
    width: 100%

    .cover-photo
      width: 100vw

    .article-cont
      padding: 13px 15px

    .auth-wrap
      display flex
      align-items center
      margin-bottom: 12px
      padding: 13px 15px
      position relative

      .good-article-icon
        position absolute
        right: 11px
        top: 35px
        width: 48px
        height: @width

      .auth-photo-wrap
        position: relative

        .auth-photo
          width: 36px
          height: 36px

        .auth-photo-v
          position: absolute
          bottom: 0
          right: 0
          width: 12px
          height: 12px

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

          .total-count
            font-size $font-size-10
            color: #111
            margin-top: 3px

        .liker-photo
          margin 15px 20px 15px 0px
          width: 26px
          height: 26px
          flex-shrink 0

    .line-middle
      border-bottom-1px(#E6E6E6)

    .article-cont
      padding: 25px 15px 10px 15px

      .name
        font-size $font-size-22
        font-family $font-family-medium
        color: #111111
        margin-bottom 25px

      .foods-list
        font-family $font-family-regular
        font-size $font-size-15
        letter-spacing 0.4px

      .goods-list
        margin-bottom: 10px
        margin-top: 25px

      .article-item
        margin-bottom 15px

      .article-text
        font-family $font-family-regular
        font-size $font-size-15

      .article-image
      .article-video
        width: 100%


    .bottom-operate-wrap
      height: 50px

    .bottom-operate
      position fixed
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

</style>
