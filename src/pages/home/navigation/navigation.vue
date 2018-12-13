<template>
  <div class="navigation">
    <header></header>
    <dl v-for="(item, index) in navList" :key="index" :class="item | isActive">
      <dt :class="item | isActive" @click="navHandle(item, index)">
        <img :src="item.isLight ? item.iconSelected : item.icon" alt="">
        <p>{{item.title}}</p>
        <i :class="item.children.length ? 'rotate' : ''"></i>
      </dt>
      <dd :style="item | childrenActive">
        <template v-for="(child, i) in item.children">
          <p :key="i" :class="child | isActive" @click="navHandle(child, i, item)">{{child.title}}</p>
        </template>
      </dd>
    </dl>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'NAVIGATION_BAR'
  const HEIGHT = 40
  const NAV_LIST = [
    {
      title: '商品管理',
      url: '/home/product-list',
      icon: require('./icon-commodity@2x.png'),
      iconSelected: require('./icon-commodity_white@2x.png'),
      childrenIndex: 0,
      showHeight: HEIGHT,
      isRouter: false, // 是否跳转
      isLight: false, // 是否亮灯
      children: [
        {
          title: '商品列表',
          url: '/home/product-list',
          isRouter: true,
          isLight: false
        },
        {
          title: '商品分类',
          url: '/home/product-categories',
          isRouter: true,
          isLight: false
        },
        {
          title: '辅助资料',
          url: '/home/auxiliary-information',
          isRouter: true,
          isLight: false
        }
      ]
    },
    {
      title: '商城管理',
      url: '/home/advertisement',
      icon: require('./icon-tmall@2x.png'),
      iconSelected: require('./icon-tmall_white@2x.png'),
      childrenIndex: 0,
      isRouter: false,
      isLight: false,
      children: [
        {
          title: '轮播广告',
          url: '/home/advertisement',
          isRouter: true,
          isLight: false
        },
        {
          title: '今日抢购',
          url: '/home/rush-purchase',
          isRouter: true,
          isLight: false
        }
      ]
    },
    {
      title: '订单管理',
      url: '/home/order-list',
      icon: require('./icon-order@2x.png'),
      iconSelected: require('./icon-order_white@2x.png'),
      childrenIndex: 0,
      isRouter: false,
      isLight: false,
      children: [
        {
          title: '订单列表',
          url: '/home/order-list',
          isRouter: true,
          isLight: false
        },
        {
          title: '退货管理',
          url: '/home/returns-management',
          isRouter: true,
          isLight: false
        }
      ]
    },
    {
      title: '采购管理',
      icon: require('./icon-shopping@2x.png'),
      iconSelected: require('./icon-shopping_white@2x.png'),
      url: '/home/purchase-management',
      childrenIndex: 0,
      isRouter: true,
      isLight: false,
      children: []
    },
    {
      title: '团长管理',
      icon: require('./icon-group@2x.png'),
      iconSelected: require('./icon-group_white@2x.png'),
      url: '/home/leader-list',
      childrenIndex: 0,
      isRouter: false,
      isLight: false,
      children: [
        {
          title: '团长列表',
          url: '/home/leader-list',
          isRouter: true,
          isLight: false
        },
        {
          title: '团长配送单',
          url: '/home/dispatching-list',
          isRouter: true,
          isLight: false
        }
      ]
    }
  ]
  export default {
    name: COMPONENT_NAME,
    filters: {
      // 子路有的激活状态过滤
      childrenActive(value) {
        let styles = ''
        if (value.children.length && value.isLight) {
          styles = `height:${value.children.length * (HEIGHT + 4)}px`
        }
        return styles
      },
      // 本路由的激活状态过滤
      isActive(value) {
        let cname = ''
        if (value.isLight) {
          cname = 'active'
        }
        if (value.isLight && value.children && value.children.length) {
          cname += ' no-border'
        }
        return cname
      }
    },
    data() {
      return {
        navList: NAV_LIST
      }
    },
    watch: {
      $route(newVal, oldVal) {
        if (newVal.fullPath === oldVal.fullPath) {
          return
        }
        this._resetNavStatus(this.navList)
        this._resetNavLight(this.navList, newVal.fullPath)
      }
    },
    created() {
      this._initNavList()
    },
    methods: {
      navHandle(item, index, father) {
        // 重置路由器
        this._resetNavStatus(this.navList)
        // 设置父级
        if (father) {
          father.isLight = true
          father.childrenIndex = index
        }
        // 设置自身
        if (item.isRouter) {
          this.$router.push(item.url)
        }
        item.isLight = true
        // 设置子路由
        if (item.children) {
          let children = item.children
          let childrenIndex = item.childrenIndex
          let currentChildren = children[childrenIndex]
          if (children.length) {
            currentChildren.isLight = true
          }
          if (currentChildren && currentChildren.isRouter) {
            this.$router.push(currentChildren.url)
          }
        }
      },
      // 重置路由显示的状态
      _resetNavStatus(arr) {
        arr.map((item) => {
          item.isLight = false
          item.children.map((it) => {
            it.isLight = false
          })
        })
        // 没有子路由结束递归
        if (arr.children && arr.children.length) {
          this._resetNavStatus(arr.children)
        }
      },
      // 刷新页面输出路由
      _initNavList() {
        let path = this.$route.fullPath
        this._resetNavLight(this.navList, path)
      },
      // 重置路由亮灯的状态
      _resetNavLight(arr, path) {
        // 路由包含的路由关系
        let index = arr.findIndex(item => path.includes(item.url))
        // 路由名称全等的路由关系
        let fullIdx = arr.findIndex(item => path === item.url)
        let current = {}
        // 全等权重大于包含
        if (fullIdx > -1 || index > -1) {
          current = fullIdx > -1 ? arr[fullIdx] : arr[Math.max(0, index)]
        }
        current.isLight = true
        // 没有子路由结束递归
        if (index !== -1 && current.children && current.children.length) {
          return this._resetNavLight(current.children, path)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  $tab-height = 40px
  $color-menu-tag = #4dbd73
  $color-menu-text = #6E748B
  $color-menu-text-active = #fff
  $color-menu-bg-active = #0F1922
  $color-menu-bg = #1D2B36
  $color-white = #fff
  $menu-width = 200px

  .navigation
    user-select: none
    position: fixed
    top: 0
    left: 0
    background: $color-menu-bg
    box-shadow: 3px 0 4px 0 rgba(0, 8, 39, 0.30)
    width: $menu-width
    min-height: 100vh
    z-index: 2000
    overflow-y: auto
    header
      width: 199px
      height: 80px
      border-top-left-radius: 18px
      border-bottom: 1px solid $color-menu-line
      background: $color-main
      bg-image('./pic-logo')
      background-repeat: no-repeat
      background-position: center center
      background-size: 129px
      img
        height: 24px
        width: @height
        margin-right: 12.6px
      p
        font-size: 20px
        color: #fff
        font-family: PingFangSC-Semibold
        letter-spacing: 6px
    dl
      padding: 12px 0
      font-family: PingFangSC-Regular
      color: $color-menu-text
      font-size: 16px
      cursor: pointer
      background: $color-menu-bg
      &.active
        background: $color-menu-bg-active
      dt
        layout(row, block, nowrap)
        align-items: center
        width: 100%
        height: $tab-height
        overflow: hidden
        box-sizing: border-box
        border-left: 5px solid transparent
        transition: all .2s
        font-family: $font-family-medium
        &:before
          position: absolute
          left: 0
          display: block
          content: ''
          width: 0
          height: 18px
          transition: width .3s
          background: $color-menu-tag
        &:hover
          color: $color-white
        &.active
          &:before
            width: 4px
          &.no-border:before
            width: 0
          & > p
            color: $color-white
          & > i
            icon-image('icon-pressed_select')
            &.rotate
              transform: rotate(90deg)
        p
          flex: 1
          overflow: hidden
          background: rgba(255, 255, 255, 0)
          box-sizing: border-box
          border-left: 5px solid transparent
          transition: all .2s
        img
          height: 22px
          width: @height
          margin: 0 10px 0 30px
        i
          height: 10px
          width: 10px
          icon-image('icon-pressed')
          justify-self: flex-end
          margin-right: 30px
          transform rotate(0deg)
          transition: transform 0.2s
      dd
        height: 0
        transition: height 0.3s
        layout()
        overflow: hidden
        p
          width: 100%
          layout()
          align-items: center
          justify-content: center
          flex: 1
          box-sizing: border-box
          transition: all .2s
          &:before
            position: absolute
            left: 0
            display: block
            content: ''
            width: 0
            height: 18px
            transition: width .3s
            background: $color-menu-tag
          &:hover
            color: $color-white
          &.active
            color: $color-white
            &:before
              width: 4px
</style>
