<template>
  <div class="navigation">
    <div class="first">
      <header class="logo">
        <img class="logo-img" src="./pic-logo@2x.png">
      </header>
      <ul v-for="(item, index) in firstMenu" :key="index" :class="['menu',{'beginner-guide':item.url==='/home/beginner-guide'}]">
        <li class="nav-item hand" :class="item | isActive" @click="_setFirstMenu(index,item.url)">
          <img :src="item.icon" class="nav-item-icon">
          <p class="nav-item-name">{{item.name}}</p>
        </li>
      </ul>
    </div>
    <div class="second">
      <div v-for="(item, index) in navList" :key="index" class="second-item">
        <p class="second-title">{{item.title}}</p>
        <div v-for="(child, i) in item.children" :key="i" class="second-link hand" @click="_setChildActive(child)">
          <span :class="child | childrenActive" class="second-link-content">{{child.title}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'NAVIGATION_BAR'
  const INFO_INDEX = 0
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
        // {
        //   title: '今日抢购',
        //   url: '/home/rush-purchase',
        //   isLight: false
        // },
        {
          title: '限时抢购',
          url: '/home/flash-sale',
          isLight: false
        }
      ]
    },
    {
      title: '拓展',
      children: [
        {
          title: '拓展任务',
          url: '/home/outreach-activity',
          isLight: false
        },
        {
          title: '拓展团队',
          url: '/home/outreach-group',
          isLight: false
        }
      ]
    },
    {
      title: '营销',
      children: [
        {
          title: '优惠券',
          url: '/home/coupon-manage',
          isLight: false
        },
        {
          title: '营销计划',
          url: '/home/coupon-market',
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
        }
      // {
      //   title: '团长结算',
      //   url: '/home/head-settlement',
      //   isLight: false
      // },
      // {
      //   title: '团长提现',
      //   url: '/home/leader-withdrawal',
      //   isLight: false
      // }
      ]
    }
  ]
  const FINANCE = [
    // {
    //   title: '财务',
    //   children: [
    //     {
    //       title: '营业概况',
    //       url: '/home/business-overview',
    //       isLight: false
    //     }
    //     // {
    //     //   title: '交易记录',
    //     //   url: '/home/transaction-record',
    //     //   isLight: false
    //     // }
    //   ]
    // },
    {
      title: '账户',
      children: [
        {
          title: '账户总览',
          url: '/home/account-overview',
          isLight: false
        },
        {
          title: '交易明细',
          url: '/home/transaction-detail',
          isLight: false
        }
      ]
    },
    {
      title: '团长',
      children: [
        {
          title: '团长佣金',
          url: '/home/head-settlement',
          isLight: false
        },
        {
          title: '提现记录',
          url: '/home/leader-withdrawal',
          isLight: false
        }
      ]
    }
  ]
  // const STATISTICS = [
  //   {
  //     title: '统计',
  //     children: [
  //       {
  //         title: '数据统计',
  //         url: '/home/data-survey',
  //         isLight: false
  //       }
  //     ]
  //   }
  // ]
  const DATA = [
    {
      title: '概况',
      children: [
        {
          title: '数据概况',
          url: '/home/new-data',
          isLight: false
        }
      ]
    }
  ]
  const SUPPLY = [
    {
      title: '订单',
      children: [
        {
          title: '商戶订单',
          url: '/home/merchant-order',
          isLight: false
        },{
          title: '售后订单',
          url: '/home/after-sales-order',
          isLight: false
        }
      ]
    },
    {
      title: '采购',
      children: [
        {
          title: '采购任务',
          url: '/home/procurement-task',
          isLight: false
        },
        {
          title: '采购单',
          url: '/home/purchase-order',
          isLight: false
        },
        {
          title: '采购员',
          url: '/home/buyer',
          isLight: false
        },
        {
          title: '供应商',
          url: '/home/supplier',
          isLight: false
        }
      ]
    },
    {
      title: '仓库',
      children: [
        {
          title: '成品入库',
          url: '/home/product-enter',
          isLight: false
        },
        {
          title: '成品出库',
          url: '/home/product-out',
          isLight: false
        },
        {
          title: '库位管理',
          url: '/home/store-manage',
          isLight: false
        }
      ]
    },
    {
      title: '分拣',
      children: [
        {
          title: '分拣任务',
          url: '/home/sorting-task',
          isLight: false
        },
        {
          title: '分拣配置',
          url: '/home/sorting-config',
          isLight: false
        }
      ]
    },
    {
      title: '配送',
      children: [
        {
          title: '配送任务',
          url: '/home/distribution-task',
          isLight: false
        },
        {
          title: '调度管理',
          url: '/home/dispatching-management',
          isLight: false
        }
      ]
    }
  ]
  const BEGINNER_GUIDE = [
    {
      title: '新手指引',
      children: [
        {
          title: '新手指引',
          url: '/home/beginner-guide',
          isLight: true
        }
      ]
    }
  ]
  const FIRST_MENU = [
    {name: '概况', icon: require('./icon-dashboard@2x.png'), isLight: false, second: DATA, url: '/home/new-data'},
    // {
    //   name: '统计',
    //   icon: require('./icon-statistics@2x.png'),
    //   isLight: true,
    //   second: STATISTICS,
    //   url: '/home/data-survey'
    // },
    {
      name: '商城',
      icon: require('./icon-tmall@2x.png'),
      isLight: false,
      second: SHOP,
      url: '/home/product-list'
    },
    {
      name: '供应链',
      icon: require('./icon-supply_chain@2x.png'),
      isLight: false,
      second: SUPPLY,
      url: '/home/merchant-order'
    },
    {
      name: '财务',
      icon: require('./icon-finance@2x.png'),
      isLight: false,
      second: FINANCE,
      url: '/home/account-overview'
    },
    {
      name: '',
      icon: require('./icon-guide@2x.png'),
      isLight: false,
      second: BEGINNER_GUIDE,
      url: '/home/beginner-guide'
    }
  // {name: '系统', icon: require('./icon-system@2x.png'), isLight: false, second: [], url: ''},
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
                this.navList = index !== -1 ? JSON.parse(JSON.stringify(item.second)) : this.navList
              }
            })
          }
          item.isLight = idx === index
          return item
        })
      },
      // 点击一级导航
      _setFirstMenu(i, url) {
        if (url === '/home/beginner-guide') {
          this.$store.commit('beginner/SET_ACTIVE', 0)
        }
        if (this.firstMenu[i].isLight) {
          return
        } else if (!this.firstMenu[i].second.length) {
          this.$toast.show('该功能正在开发中')
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
        console.log(child,'child')
        this.$router.push(child.url)
      },
      // 监听页面变化
      _handleNavList() {
        let currentPath = this.$route.fullPath
        let currentNav
        this.firstMenu.forEach((item, idx) => {
          if (currentPath.includes(item.url)) {
            currentNav = item.second
            this.firstMenu[idx].isLight = true
            this.firstMenu[idx].second[0].children[0].isLight = true
          } else {
            this.firstMenu[idx].isLight = false
          }
          item.second &&
            item.second.forEach((it, id) => {
              it.children &&
                it.children.forEach((child, i) => {
                  if (currentPath.includes(child.url)) {
                    currentNav = item.second
                    this.firstMenu[idx].isLight = true
                    this.firstMenu[idx].second[id].children[i].isLight = true
                  } else {
                    this.firstMenu[idx].second[id].children[i].isLight = false
                  }
                })
            })
        })
        this.navList = currentNav || []
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
      background: #363B4B

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

    .beginner-guide
      position absolute
      left: 0
      bottom: 0px

      .nav-item-active
        background-color #464C5E
      /*&:hover .nav-item*/
      /*background-color #464C5E*/
      .nav-item
        height: auto
        padding-bottom 18px
        padding-top 16px
        .nav-item-icon
          width 62px
          height 68px
          margin-left: 10px

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
      width: 0
      height: 0
      transition: all 0.2s

    &::-webkit-scrollbar-thumb
      background-color: rgba(0, 0, 0, .15)
      border-radius: 10px

    &::-webkit-scrollbar-thumb:hover
      background-color: rgba(0, 0, 0, .3)

    &::-webkit-scrollbar-track
      box-shadow: inset 0 0 6px rgba(0, 0, 0, .15)
      border-radius: 10px

    &:hover
      &::-webkit-scrollbar
        transition: all 0.2s
        width: 6px
        height: 8px
    .second-title
      transition: all 0.2s
      margin: 30px 0 10px
      color: #888888
      font-size: $font-size-14
      line-height: 1

    .second-link
      transition: all 0.2s
      height: 34px
      line-height: 34px
      color: $color-text-main
      font-size: $font-size-14

      &:hover
        color: $color-main

    .second-link-active
      background: rgba(79, 189, 102, 0.17)
      color: $color-main
    .second-link-content
      margin-left: -6px
      border-radius: 2px
      padding: 5px 6px
</style>
