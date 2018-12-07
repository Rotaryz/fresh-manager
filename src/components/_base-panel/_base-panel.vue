<template>
  <div class="base-panel">
    <div class="content">
      <header>
        <section class="userInfo-wrapper" @mouseenter="showLogoutHandle" @mouseleave="hideLogoutHandle">
          <img class="img" :src="userInfo.avatar || defaultAvatar" alt="">
          <p>{{userInfo.name}}</p>
          <em></em>
          <transition name="fade">
            <article v-show="showLogout" class="logout-wrapper">
              <div class="empty"></div>
              <section class="logout" @click.stop="logoutHandle">
                <i></i>
                <p>退出登录</p>
              </section>
            </article>
          </transition>
        </section>
      </header>
      <section v-if="isShowPage" class="router-content">
        <div class="content-panel" :style="styles">
          <section class="base-panel-content" :style="slotStyles">
            <slot name="content"></slot>
            <div v-if="showNull" class="blank">
              <img class="blank-icon" src="./icon-null@2x.png" alt="">
              <div class="blank-title">暂无相关数据</div>
            </div>
          </section>
          <footer v-if="isShowPageDetails">
            <page-detail ref="pageDetail" :pageDtail="pageDetails" :pagination="pagination" @addPage="addPage"></page-detail>
          </footer>
        </div>
      </section>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import pageDetail from '@components/page-detail/page-detail'

  const COMPONENT_NAME = 'BASE_PANEL'
  const DEFAULT_AVATAR = `https://zhidian-img.jkweixin.com/2018%2F11%2F23%2F1542945169074-logo.jpg`

  export default {
    name: COMPONENT_NAME,
    components: {
      pageDetail
    },
    props: {
      // 当前页码
      pagination: {
        type: Number,
        default: 1
      },
      // bottom-panel样式
      styles: {
        type: String,
        default: ''
      },
      // slot样式
      slotStyles: {
        type: String,
        default: ''
      },
      // 是否显示页码
      isShowPageDetails: {
        type: Boolean,
        default: true
      },
      // 是否显示空面
      showNull: {
        type: Boolean,
        default: false
      },
      // 页码信息初始值
      pageDetails: {
        type: Object,
        default: () => {
          return {
            total: 1, // 总数量
            per_page: 1, // 一页条数
            total_page: 1 // 总页数
          }
        }
      }
    },
    data() {
      return {
        showLogout: false,
        showModal: false,
        isShowPage: true,
        userInfo: this.$storage.get('info', {}),
        defaultAvatar: DEFAULT_AVATAR
      }
    },
    methods: {
      // 退出登陆
      logoutHandle() {
      // this.$storage.remove('token')
      // this.$router.replace('/login')
      },
      // 显示头像
      showLogoutHandle() {
        this.showLogout = true
      },
      // 隐藏头像
      hideLogoutHandle() {
        this.showLogout = false
      },
      // 翻页handle
      addPage(page) {
        this.$emit('navToPage', page)
      },
      // 还原页码的状态
      initPage() {
        this.$refs.pageDetail && this.$refs.pageDetail.beginPage()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  $common-height = 76px
  $width-triangle = 4px
  $menu-width = 200px
  @import "~@design"

  .fade-enter-active, .fade-leave-active
    transition: all 0.2s

  .fade-enter, .fade-leave-to
    transition: opacity .2s ease-in-out

  .base-panel
    position: relative
    overflow: auto
    padding-left: $menu-width
    box-sizing: border-box
    flex: 1
    .content
      position: relative
      min-width: 1410px
      min-height: 100vh
      overflow: auto
      common-scroll-bar()
      layout()
      & > header
        layout(row)
        justify-content: flex-end
        height: $common-height
        background: #fff
        border-bottom-1px(#eee)
        z-index :1000
        .userInfo-wrapper
          position: relative
          layout(row)
          min-height: $common-height
          align-items: center
          padding: 0 26.8px
          cursor: pointer
          &:hover > em
            transform: rotate(180deg)
          &:hover
            background: #f5f7fb
          & > p
            font-family: PingFangSC-Regular
            font-size: 14px
            color: #666
            padding: 0 4px 0 13px
          & > .img
            width: 43px
            height: @width
            border-radius: 50%
            background: #eee
            object-fit :cover
            border: 3px solid #FFFFFF;
            box-shadow: 0 2px 4px 0 rgba(51, 51, 51, 0.10)
          & > em
            height: 0
            border: $width-triangle solid #424242
            border-bottom: $width-triangle solid transparent
            border-left: $width-triangle solid transparent
            border-right: $width-triangle solid transparent
            position: relative
            top: 2px
            transform-origin $width-triangle 2px
            transform: rotate(0deg)
            transition: all 0.2s
          .logout-wrapper
            position: absolute
            left: 0
            right: 10px
            top: $common-height
            & > div
              height: 5px
            .logout
              height: 50px
              width: 100%
              background: #fff
              layout(row)
              justify-content: center
              align-items: center
              box-shadow: 0 3px 8px 0 rgba(12, 6, 14, 0.20)
              border-radius: 6px
              & > p
                font-family: PingFangSC-Regular
                font-size: 16px
                color: #666
                margin-left: 30px
              & > i
                height: 22px
                width: @height
                background-repeat: no-repeat
                background-position: center center
                background-size: 100% 100%
                background-image url("./icon-exit@2x.png")

  .router-content
    flex: 1
    overflow: auto
    layout()

  .content-panel
    margin: 22px
    background: #FFFFFF
    box-shadow: 0 1px 6px 0 rgba(0, 8, 39, 0.10)
    overflow: hidden
    border-radius: 6px
    flex:1
    layout()
    & > footer
      height: 121px
      layout(row)
      justify-content: center
      align-items: center
      padding: 0 30px 0 39px
    .base-panel-content
      flex:1
      position :relative
      min-height :400px
      .blank
        row-center()
        top: 55%
        text-align: center
        .blank-icon
          width: 140px
          height: 89px
          margin-bottom: 30px
        .blank-title
          color: #999
</style>
