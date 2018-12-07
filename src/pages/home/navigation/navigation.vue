<template>
  <div class="navigation">
    <header>
      <img src="./pic-logo@2x.png" class="icon">
      <p>赞播优鲜</p>
    </header>
    <dl v-for="(item, index) in navList" :key="index">
      <dt @click="navHandle(item, index)" :class="item | isActive">
        <img :src="item.isLight ? item.iconSelected : item.icon" alt="">
        <p>{{item.title}}</p>
        <i :class="item.children.length ? 'rotate' : ''"></i>
      </dt>
      <dd :style="item | childrenActive">
        <template v-for="(child, index) in item.children">
          <p :key="index" :class="child | isActive" @click="navHandle(child, index, item)">{{child.title}}</p>
        </template>
      </dd>
    </dl>
  </div>
</template>

<script type="text/ecmascript-6">
  const HEIGHT = 60 + 10
  const NAV_LIST = [
    {
      title: '用户管理',
      url: '/test-page1',
      icon: require('./icon-user@2x.png'),
      iconSelected: require('./icon-user_select@2x.png'),
      childrenIndex: 0,
      showHeight: HEIGHT,
      isRouter: true, // 是否跳转
      isLight: false, // 是否亮灯
      children: []
    },
    {
      title: '商家管理',
      url: '/test-page',
      icon: require('./icon-shop@2x.png'),
      iconSelected: require('./icon-shop_select@2x.png'),
      childrenIndex: 0,
      isRouter: true,
      isLight: false,
      children: []
    },
    {
      title: '商品管理',
      url: '/sample',
      icon: require('./icon-goods@2x.png'),
      iconSelected: require('./icon-goods_select@2x.png'),
      childrenIndex: 0,
      isRouter: false,
      isLight: false,
      children: [
        {
          title: '折扣商品',
          url: '/sample/one',
          isRouter: true,
          isLight: false
        },
        {
          title: '播豆商品',
          url: '/sample/two',
          isRouter: true,
          isLight: false
        }
      ]
    },
    {
      title: '订单管理',
      icon: require('./icon-indent@2x.png'),
      iconSelected: require('./icon-indent_select@2x.png'),
      url: '/other-pages',
      childrenIndex: 0,
      children: [
        {
          title: '用户订单',
          url: '/other-pages/one',
          isRouter: true,
          isLight: false
        },
        {
          title: '商家订单',
          url: '/other-pages/two',
          isRouter: true,
          isLight: false
        }
      ]
    },
    // {
    //   title: '大礼包',
    //   icon: require('./icon-gifts@2x.png'),
    //   iconSelected: require('./icon-gifts_select@2x.png'),
    //   url: '/gifts',
    //   childrenIndex: 0,
    //   isRouter: false,
    //   isLight: false,
    //   children: [
    //     {
    //       title: '用户礼包',
    //       url: '/gifts/user-gifts',
    //       isRouter: true,
    //       isLight: false
    //     },
    //     {
    //       title: '商家礼包',
    //       url: '/gifts/business-gifts',
    //       isRouter: true,
    //       isLight: false
    //     }
    //   ]
    // }
  ]
  export default {
    name: 'NAVIGATION_BAR',
    filters: {
      // 子路有的激活状态过滤
      childrenActive(value) {
        let styles = ''
        if (value.children.length && value.isLight) {
          styles = `height:${value.children.length * HEIGHT}px`
        }
        return styles
      },
      // 本路由的激活状态过滤
      isActive (value) {
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
    data () {
      return {
        navList: NAV_LIST
      }
    },
    created () {
      console.log(12312)
      this._initNavList()
    },
    methods: {
      navHandle (item, index, father) {
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
      _resetNavStatus (arr) {
        arr.map(item => {
          item.isLight = false
          item.children.map(it => {
            it.isLight = false
          })
        })
        // 没有子路由结束递归
        if (arr.children && arr.children.length) {
          this._resetNavStatus(arr.children)
        }
      },
      // 刷新页面输出路由
      _initNavList () {
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
  $tab-height = 60px
  $color-menu-tag = #FF533C
  $color-menu-text = #6E748B
  $color-menu-text-active = #fff
  $color-menu-bg-active = rgba(255, 255, 255, 0.1)
  $color-menu-bg = rgba(255, 255, 255, 0)
  $color-white = #fff
  $menu-width = 200px

  @import "~@design"

  .navigation
    user-select: none
    position: fixed
    top: 0
    left: 0
    background: #222742
    box-shadow: 3px 0 4px 0 rgba(0, 8, 39, 0.30)
    width: $menu-width
    min-height: 100vh
    z-index: 2000
    overflow-y: auto
    user-select: none
    header
      layout(row)
      height: 80px
      align-items: center
      justify-content: center
      border-bottom: 1px solid $color-menu-line
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
      font-family: PingFangSC-Regular
      color: $color-menu-text
      font-size: 16px
      cursor: pointer
      dt
        layout(row, block, nowrap)
        align-items: center
        width: 100%
        height: $tab-height
        overflow: hidden
        background: $color-menu-bg
        box-sizing: border-box
        border-left: 5px solid transparent
        transition: all .2s
        &:hover
          background: $color-menu-bg-active
        &.active
          border-left: 5px solid $color-menu-tag
          background: $color-menu-bg-active
          &.no-border
            border-color: transparent
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
          height: 19px
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
          background: $color-menu-bg
          align-items: center
          justify-content: center
          flex: 1
          box-sizing :border-box
          border-left: 5px solid transparent
          margin: 5px 0
          transition: all .2s
          &:hover
            background: $color-menu-bg-active
          &.active
            border-left: 5px solid $color-menu-tag
            background: $color-menu-bg-active
            color: $color-white
</style>
