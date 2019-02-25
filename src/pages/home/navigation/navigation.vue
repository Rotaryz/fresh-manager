<template>
  <div class="navigation">
    <div class="first">
      <header class="logo">
        <img class="logo-img" src="./pic-logo@2x.png">
      </header>
      <ul v-for="(item, index) in firstMenu" :key="index" class="menu">
        <li class="nav-item" :class="item | isActive" @click="clickNav(item)">
          <img :src="item.icon" class="nav-item-icon">
          <p class="nav-item-name">{{item.name}}</p>
        </li>
      </ul>
    </div>
    <div class="second">
      <div class="second-item">
        <p class="second-title">dsf</p>
        <div class="second-link hand">sdf</div>
        <div class="second-link hand">sdf</div>
      </div>
    </div>
    <!--<dl v-for="(item, index) in navList" :key="index" :class="item | isActive" class="nav-item">-->
    <!--<dt :class="item | isActive" @click="clickNav(item)">-->
    <!--<img :src="item.isLight ? item.iconSelected : item.icon" alt="">-->
    <!--<p>{{item.title}}</p>-->
    <!--<i :class="item.children.length ? 'rotate' : ''"></i>-->
    <!--</dt>-->
    <!--<dd :style="item | childrenActive">-->
    <!--<template v-for="(child, i) in item.children">-->
    <!--<p :key="i" :class="child | isActive" @click="clickNav(child, index)">{{child.title}}</p>-->
    <!--</template>-->
    <!--</dd>-->
    <!--</dl>-->
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'NAVIGATION_BAR'
  // const HEIGHT = 40
  const NAV_LIST = [
    {
      title: '数据统计',
      url: '/home/data-survey',
      isLight: false,
      children: []
    },
    {
      title: '商品管理',
      url: '/home/product-list',
      isLight: false, // 是否亮灯
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
      title: '内容管理',
      url: '/home/advertisement',
      isLight: false,
      children: []
    },
    {
      title: '活动管理',
      url: '/home/rush-purchase',
      isLight: false,
      children: [
        {
          title: '今日抢购',
          url: '/home/rush-purchase',
          isLight: false
        }
      ]
    },
    {
      title: '订单管理',
      url: '/home/order-list',
      isLight: false,
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
      title: '采购管理',
      url: '/home/purchase-management',
      isLight: false,
      children: []
    },
    {
      title: '客户管理',
      url: '/home/customer-management',
      isLight: false,
      children: []
    },
    {
      title: '团长管理',
      url: '/home/leader-list',
      isLight: false,
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
    },
    {
      title: '财务管理',
      url: '/home/business-overview',
      isLight: false,
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
  const FIRST_MENU = [
    {name: '概况', icon: require('./icon-dashboard@2x.png'), isLight: false, second: []},
    {name: '商城', icon: require('./icon-tmall@2x.png'), isLight: true, second: []},
    {name: '供应链', icon: require('./icon-supply_chain@2x.png'), isLight: false, second: []},
    {name: '统计', icon: require('./icon-statistics@2x.png'), isLight: false, second: []},
    {name: '财务', icon: require('./icon-finance@2x.png'), isLight: false, second: []},
    {name: '系统', icon: require('./icon-system@2x.png'), isLight: false, second: []}]
  export default {
    name: COMPONENT_NAME,
    filters: {
      // 子路有的激活状态过滤
      childrenActive(value) {
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
        navList: JSON.parse(JSON.stringify(NAV_LIST)),
        currentIndex: '',
        firstMenu: FIRST_MENU,
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
      this._handleNavList()
    },
    methods: {
      _handleNavList() {
      },
      _resetNavList(currentIndex) {
      },
      clickNav(nav, index) {
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
    width: 200px
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
        width: 1200px
        height: 1200px
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
    padding: 0 16px
    box-sizing: border-box
    overflow: hidden
    min-height: 100vh
    width: $menu-width
    background: $color-white
    .second-title
      margin: 40px 0 10px
      color: #888888
      font-size: $font-size-14
    .second-link
      height: 34px
      line-height: 34px
      color: $color-text-main
      font-size: $font-size-14
</style>
