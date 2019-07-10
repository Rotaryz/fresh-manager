<template>
  <div>
    <div class="phone-box">
      <div class="phone">
        <div class="content-box">
          <!--文章-->
          <div class="article-modal hand " :class="{'active': contentType === 'article', 'none': !articleList.length}" @click="changeType('article')">
            <!--一篇文章样式-->
            <!--两篇文章样式-->
            <div v-if="articleList.length <3 " class="article" :class="'article' + articleList.length">
              <div v-for="(item, index) in articleList" :key="index" class="article-item">
                <div class="shade"></div>
                <img mode="aspectFill" :src="item.image_url" class="article-modal-img">
                <div class="article-modal-title">{{item.title}}</div>
              </div>
            </div>
            <!--三篇文章样式-->
            <div v-if="articleList.length === 3" class="article article3">
              <div class="article-item">
                <div class="shade"></div>
                <img mode="aspectFill" :src="articleList[0].image_url" class="article-modal-img">
                <div class="article-modal-title">{{articleList[0].title}}</div>
              </div>
              <div class="article-left">
                <div class="article-item">
                  <div class="shade"></div>
                  <img mode="aspectFill" :src="articleList[1].image_url" class="article-modal-img">
                  <div class="article-modal-title">{{articleList[1].title}}</div>
                </div>
                <div class="article-item">
                  <div class="shade"></div>
                  <img mode="aspectFill" :src="articleList[2].image_url" class="article-modal-img">
                  <div class="article-modal-title">{{articleList[2].title}}</div>
                </div>
              </div>
            </div>
          </div>
          <!--分类列表-->
          <div class="scroll-classify hand" :class="{'active': contentType === 'classify', 'none': !classifyList.length}" @click="changeType('classify')">
            <div v-for="(item, index) in classifyList" :key="index" class="scroll-classify-item" :class="{'none': !classifyList.length}">
              <span v-if="item.name" :class="{'scroll-classify-item-active': index === 0}">
                {{item.name}}
              </span>
            </div>
          </div>
          <!--内容列表-->
          <!--瀑布流-->
          <div class="fall-container">
            <!-- 左边一列 -->
            <div class="fall-box fall-left">
              <div v-for="(item, index) in leftList" :key="item.id" class="fall-item">
                <div class="img-box" :style="{height:item.itemHeight+'px'}">
                  <img v-if="item.type === 'video'" src="./icon-img_play@2x.png" class="video-icon">
                  <img :src="item.cover_image_url" class="card-img">
                </div>
                <div class="fall-title">{{item.title}}</div>
                <div class="fall-author">
                  <div v-if="item.author" class="fall-author-left">
                    <img :src="item.author.head_image_url" class="fall-author-img">
                    <span class="fall-author-name">{{item.author.nickname}}</span>
                  </div>
                  <div class="fall-author-right" @click="giveLike('left', index, item)">
                    <img src="./icon-like_big1@2x.png" class="fall-author-icon">
                    <span class="fall-author-like">{{item.fabulous_num}}</span>
                  </div>
                </div>
                <!--瀑布流内容卡片-->
              </div>
            </div>
            <!--右边一列 -->
            <div id="right" class="fall-box fall-right">
              <div v-for="(item, index) in rightList" :key="item.id" class="fall-item">
                <div class="img-box" :style="{height:item.itemHeight+'px'}">
                  <img v-if="item.type === 'video'" src="./icon-img_play@2x.png" class="video-icon">
                  <img :src="item.cover_image_url" class="card-img">
                </div>
                <div class="fall-title">{{item.title}}</div>
                <div class="fall-author">
                  <div v-if="item.author" class="fall-author-left">
                    <img :src="item.author.head_image_url" class="fall-author-img">
                    <span class="fall-author-name">{{item.author.nickname}}</span>
                  </div>
                  <div class="fall-author-right" @click="giveLike('left', index, item)">
                    <img src="./icon-like_big1@2x.png" class="fall-author-icon">
                    <span class="fall-author-like">{{item.fabulous_num}}</span>
                  </div>
                </div>
                <!--瀑布流内容卡片-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  const PAGE_NAME = 'MINE'
  let leftList = []
  let rightList = []
  let leftHight = 0
  let rightHight = 0
  let itemWidth = 0
  let maxHeight = 0
  export default {
    name: PAGE_NAME,
    props: {
      articleList: {
        type: Array,
        default: () => {
          return new Array(3).fill({
            title: '日常闷土豆',
            image_url:
              'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1561788963314&di=5819814e930a3bbeb180fae75ffc657e&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201207%2F01%2F20120701003045_EWsMd.jpeg',
            id: 0
          })
        }
      },
      contentTypeDefault: {
        type: String,
        default: 'article'
      },
      classifyList: {
        type: Array,
        default: () => {
          return new Array(4).fill({
            name: '日常闷土',
            status: 1
          })
        }
      },
      listData: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data() {
      return {
        contentType: this.contentTypeDefault,
        // 瀑布流参数
        leftHight: 0,
        rightHight: 0,
        itemWidth: 0,
        maxHeight: 500,
        leftList: [],
        rightList: [],
        elRight: '',
      }
    },
    watch: {
      listData: {
        handler(news) {
          this.fillData()
        },
        deep: true
      }
    },
    created() {
      let percentage = 750 / 294
      // 计算瀑布流间距
      let margin = 20 / percentage
      // 计算 瀑布流展示的宽度
      itemWidth = (294 - margin) / 2
      // 计算瀑布流的最大高度，防止长图霸屏
      maxHeight = itemWidth / 0.8
      // this.getList()
    },
    methods: {
      changeType(type) {
        this.contentType = type
        this.$emit('getContentType', type)
      },
      getList() {
        let list = []
        for (let i = 0; i < 10; i++) {
          let num = Math.random()
          let item = {
            width: 200,
            height: (i + 1) * num * 300,
            color: `rgb(125 ,${Math.ceil(Math.random() * 255)} , ${Math.ceil(Math.random() * 255)})`,
            text: '我是模块' + i,
            image_url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1562403814&di=9c35111623c9b4948ebebff004d77776&imgtype=jpg&er=1&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201408%2F13%2F20140813104323_4rHCx.jpeg'
          }
          list.push(item)
        }
        // console.log(list)
        this.fillData(false, list)
      },
      // 分开左右两个list
      fillData(isPull) {
        if (isPull) {
          // 是否下拉刷新，是的话清除之前的数据
          leftList.length = 0
          rightList.length = 0
          leftHight = 0
          rightHight = 0
          this.leftList = []
          this.rightList = []
        }
        rightList = []
        leftList = []
        for (let i = 0, len = this.listData.length; i < len; i++) {
          let tmp = this.listData[i]
          tmp.width = parseInt(tmp.cover_image.width)
          tmp.height = parseInt(tmp.cover_image.height)
          tmp.itemWidth = itemWidth
          let per = tmp.width / tmp.itemWidth
          tmp.itemHeight = tmp.height / per
          if (tmp.itemHeight > maxHeight) {
            tmp.itemHeight = maxHeight
          }
          if (leftHight === rightHight) {
            leftList.push(tmp)
            leftHight = leftHight + tmp.itemHeight
          } else if (leftHight < rightHight) {
            leftList.push(tmp)
            leftHight = leftHight + tmp.itemHeight
          } else {
            rightList.push(tmp)
            rightHight = rightHight + tmp.itemHeight
          }
        }
        this.leftList = leftList
        this.rightList = rightList
      },
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
    position: relative
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
        overflow-y: auto
        &::-webkit-scrollbar
          width: 0
  .article-modal
    border: 2px solid transparent
  .article
    margin: 2% 2%
    height: 134.45px
    overflow: hidden
  .article-item
    height: 100%
    width: 100%
    overflow: hidden
    position: relative
    padding: 20px 0 0 12px
    box-sizing: border-box
    .shade
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      background: rgba(0, 0, 0, .15)
    .article-modal-img
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      object-fit: cover
    .article-modal-title
      position: relative
      font-family: FZLTTHJW--GB1-0
      color: $color-white
      font-size: $font-size-16
      z-index: 1
  .article1
    border-radius: 4px
  .article2
    display: flex
    justify-content: space-between
    .article-item
      border-radius: 4px
      padding: 12px 0 0 12px
      width: 134px
      .article-modal-title
        line-height: 20px
        width: 84px
  .article3
    display: flex
    justify-content: space-between
    .article-left
      flex-direction: column
      display: flex
      height: 100%
      justify-content: space-between
      .article-item
        width: 134px
        height: 64.5px
    .article-item
      border-radius: 4px
      padding: 12px 0 0 12px
      width: 134px
      height: 100%
      .article-modal-title
        line-height: 20px
        width: 84px
  .scroll-classify
    height: 55px
    display: flex
    border: 2px solid transparent
    overflow-x: auto
    align-items: center
    margin-top: 6px
    hide-scrollbar()
    .scroll-classify-item
      padding: 0 10px
      white-space: nowrap
      font-size: $font-size-13
    .scroll-classify-item-active
      font-family: $font-family-medium
      color: #4dbd65
      font-size: $font-size-16
      position: relative
      &:before
        content: ''
        row-center()
        bottom: -6px
        width: 30px
        height: 2px
        border-radius: 2px
        background: #4dbd65

  .active
    background: $color-white
    border: 2px solid #4dbd65
    box-sizing: border-box
  .none
    background: #F3F5F8

  .fall-container
    margin-top: 10px
    width: 100%
    padding: 0 2px
    box-sizing: border-box
    display: flex
    justify-content: space-between
    /*display: flex;*/
    .fall-box
      width: 49.3%
      &.fall-left
        box-sizing border-box
      &.fall-right
        box-sizing border-box
      .img-box
        max-height: 250px
        overflow: hidden
        position: relative
      .card-img
        border-top-right-radius: 4px
        border-top-left-radius: 4px
        width: 100%
        object-fit: cover
        height: 100%
      .video-icon
        width: 20px
        z-index: 1
        height: 20px
        position: absolute
        top: 11px
        right: 11px
      .fall-item
        margin-bottom: 8px
        overflow: hidden
        box-shadow: 0 3px 8px 0 rgba(17, 17, 17, 0.05)
        background: $color-white
        border-radius: 4px
        .fall-author
          display: flex
          padding: 0 7.84px 7.84px
          box-sizing: border-box
          justify-content: space-between
          align-items: center
          .fall-author-left
            display: flex
            align-items: center
            .fall-author-img
              width: 16px
              background: $color-background
              min-width: @width
              height: @width
              min-height: @width
              border-radius: 50%
              margin-right: 5px
              object-fit: cover
              overflow: hidden
            .fall-author-name
              line-height: 1.2
              color: #808080
              width: 65px
              no-wrap()
              font-size: $font-size-13
              font-family: $font-family-regular
          .fall-author-right
            display: flex
            align-items: center
            .fall-author-icon
              width: 14px
              height: 14px
              margin-right: 4.25px
            .fall-author-like
              font-size: $font-size-12
              color: #111111
              font-family: $font-family-regular
        .fall-title
          font-size: 12px
          font-family: $font-family-medium
          no-wrap()
          margin: 7.8px 0 11.76px
          line-height: 1.2
          padding: 0 10px
          box-sizing: border-box

</style>
