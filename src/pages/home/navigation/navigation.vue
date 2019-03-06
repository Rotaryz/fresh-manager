<template>
  <div class="navigation">
    <div class="first">
      <header class="logo">
        <img class="logo-img" src="./pic-logo@2x.png">
      </header>
      <ul v-for="(item, index) in firstMenu" :key="index" class="menu">
        <li class="nav-item hand" :class="item | isActive" @click="_setFirstMenu(index)">
          <img :src="item.icon" class="nav-item-icon">
          <p class="nav-item-name">{{item.name}}</p>
        </li>
      </ul>
    </div>
    <div class="second">
      <div v-for="(item, index) in navList" :key="index" class="second-item">
        <p class="second-title">{{item.title}}</p>
        <div v-for="(child, i) in item.children" :key="i" :class="child | childrenActive" class="second-link hand" @click="_setChildActive(child)">{{child.title}}</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'NAVIGATION_BAR'
  const INFO_INDEX = 1
  // const HEIGHT = 40
  const SHOP = [
    {
      title: '商品',
      children: [
        {
          title: '商品列表',
          url: '/home/product-list',
          isLight: false
        },
        {
          title: '商品分类',
          url: '/home/product-categories',
          isLight: false
        },
        {
          title: '辅助资料',
          url: '/home/auxiliary-information',
          isLight: false
        }
      ]
    },
    {
      title: '内容',
      children: [
        {
          title: '内容管理',
          url: '/home/advertisement',
          isLight: false
        }
      ]
    },
    {
      title: '活动',
      children: [
        {
          title: '今日抢购',
          url: '/home/rush-purchase',
          isLight: false
        }
      ]
    },
    {
      title: '订单',
      children: [
        {
          title: '订单列表',
          url: '/home/order-list',
          isLight: false
        },
        {
          title: '退货管理',
          url: '/home/returns-management',
          isLight: false
        }
      ]
    },
    {
      title: '采购',
      children: [
        {
          title: '采购管理',
          url: '/home/purchase-management',
          isLight: false
        }
      ]
    },
    {
      title: '客户',
      children: [
        {
          title: '客户管理',
          url: '/home/customer-management',
          isLight: false
        }
      ]
    },
    {
      title: '团长',
      children: [
        {
          title: '团长列表',
          url: '/home/leader-list',
          isLight: false
        },
        {
          title: '团长配送单',
          url: '/home/dispatching-list',
          isLight: false
        },
        {
          title: '团长结算',
          url: '/home/head-settlement',
          isLight: false
        },
        {
          title: '团长提现',
          url: '/home/leader-withdrawal',
          isLight: false
        }
      ]
    }
  ]
  const FINANCE = [
    {
      title: '财务',
      children: [
        {
          title: '营业概况',
          url: '/home/business-overview',
          isLight: false
        },
        {
          title: '交易记录',
          url: '/home/transaction-record',
          isLight: false
        }
      ]
    }
  ]
  const STATISTICS = [
    {
      title: '统计',
      children: [
        {
          title: '数据统计',
          url: '/home/data-survey',
          isLight: false
        }
      ]
    }
  ]
  const FIRST_MENU = [
    {name: '概况', icon: require('./icon-dashboard@2x.png'), isLight: false, second: [], url: ''},
    {name: '商城', icon: require('./icon-tmall@2x.png'), isLight: true, second: SHOP, url: '/home/product-list'},
    // {name: '供应链', icon: require('./icon-supply_chain@2x.png'), isLight: false, second: [], url: ''},
    {
      name: '统计',
      icon: require('./icon-statistics@2x.png'),
      isLight: false,
      second: STATISTICS,
      url: '/home/data-survey'
    },
    {
      name: '财务',
      icon: require('./icon-finance@2x.png'),
      isLight: false,
      second: FINANCE,
      url: '/home/business-overview'
    },
    {name: '系统', icon: require('./icon-system@2x.png'), isLight: false, second: [], url: ''}
  ]
  export default {
    name: COMPONENT_NAME,
    filters: {
      // 子路有的激活状态过滤
      childrenActive(value) {
        if (value.isLight) {
          return 'second-link-active'
        }
        return ''
      },
      // 本路由的激活状态过滤
      isActive(value) {
        if (value.isLight) {
          return 'nav-item-active'
        }
        return ''
      }
    },
    data() {
      return {
        currentIndex: '',
        firstMenu: FIRST_MENU,
        firstIndex: INFO_INDEX,
        navList: []
      }
    },
    watch: {
      $route(newVal, oldVal) {
        if (newVal.fullPath === oldVal.fullPath) {
          return
        }
        this._handleNavList()
      }
    },
    created() {
      this._getMenuIndex()
      this._handleNavList()
    },
    methods: {
      // 初始化一级菜单的高亮
      _getMenuIndex() {
        let currentPath = this.$route.fullPath
        let index = ''
        let smallIndex = -1
        this.firstMenu = this.firstMenu.map((item, idx) => {
          if (item.second.length) {
            item.second.forEach((end) => {
              if (smallIndex === -1 && index === '') {
                smallIndex = end.children.findIndex((child) => {
                  return currentPath.includes(child.url)
                })
                index = smallIndex !== -1 ? idx : ''
                this.firstIndex = index
                this.navList = index ? JSON.parse(JSON.stringify(item.second)) : this.navList
              }
            })
          }
          item.isLight = idx === index
          return item
        })
      },
      // 点击一级导航
      _setFirstMenu(i) {
        if (this.firstMenu[i].isLight) {
          return
        } else if (!this.firstMenu[i].second.length) {
          this.$toast.show('该功能正在开发')
          return
        }
        this.firstMenu = this.firstMenu.map((item, index) => {
          item.isLight = index === i
          return item
        })
        this.firstIndex = i
        this.navList = JSON.parse(JSON.stringify(this.firstMenu[i].second))
        this.$router.push(this.firstMenu[i].url)
      },
      // 跳转二级菜单页面
      _setChildActive(child) {
        this.$router.push(child.url)
      },
      // 监听页面变化
      _handleNavList() {
        let currentPath = this.$route.fullPath
        let currentIndex = this.navList.findIndex((item) => {
          return item.children.some((child) => currentPath.includes(child.url))
        })
        this.navList.map((item) => {
          item.children = item.children.map((child) => {
            child.isLight = false
            return child
          })
          return item
        })
        let urlIndex = -1
        this.navList[currentIndex].children.map((item, index) => {
          if (urlIndex === -1) {
            urlIndex = currentPath.includes(item.url) ? index : -1
          }
          item.isLight = currentPath.includes(item.url)
          return item
        })
        this.firstMenu[this.firstIndex].url = this.navList[currentIndex].children[urlIndex].url
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  $tab-height = 56px
  $color-menu-tag = #4dbd73
  $color-menu-text = #6E748B
  $color-menu-text-active = #fff
  $color-menu-bg-active = #0F1922
  $color-menu-bg = #1D2B36
  $color-white = #fff
  $menu-width = 100px

  .navigation
    user-select: none
    position: fixed
    top: 0
    left: 0
    z-index: 2000
    width: 210px
    display: flex
    .first
      overflow: hidden
      min-height: 100vh
      width: $menu-width
      position: relative
      &:after
        content: ''
        position: absolute
        top: 0
        left: 0
        width: 100vh
        height: 100vh
        background-image: radial-gradient(#32292F 50%, #292A30 100%)
    .menu
      position: relative
      z-index: 1
      width: 100px
    .nav-item
      height: 54px
      display: flex
      align-items: center
      color: #EFD8E1
      padding: 0 10px
      box-sizing: border-box
      transition: all 0.3s
      .nav-item-icon
        width: 14px
        height: 14px
        margin-right: 5px
      .nav-item-name
        font-size: $font-size-14
    .nav-item-active
      color: $color-text-main
      background: $color-white

  .logo
    position: relative
    z-index: 1
    height: 57px
    display: flex
    align-items: center
    justify-content: center
    .logo-img
      overflow: hidden
      width: 32px

  .second
    padding: 10px 16px 20px
    box-sizing: border-box
    height: 100vh
    width: 110px
    background: $color-white
    overflow: auto
    white-space: nowrap
    transition: all 0.2s
    border-right-1px($color-line)
    &::-webkit-scrollbar
      width: 8px
      height: 10px
    &::-webkit-scrollbar-thumb
      background-color: rgba(0, 0, 0, .15)
      border-radius: 10px
    &::-webkit-scrollbar-thumb:hover
      background-color: rgba(0, 0, 0, .3)
    &::-webkit-scrollbar-track
      box-shadow: inset 0 0 6px rgba(0, 0, 0, .15)
      border-radius: 10px
    .second-title
      transition: all 0.2s
      margin: 30px 0 8px
      color: #888888
      font-size: $font-size-14
    .second-link
      transition: all 0.2s
      height: 30px
      line-height: 30px
      color: $color-text-main
      font-size: $font-size-14
      &:hover
        color: $color-main
    .second-link-active
      color: $color-main
</style>
