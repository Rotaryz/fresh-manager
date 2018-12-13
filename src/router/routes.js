import store from '@state/store'

export default [
  // 登录界面
  {
    path: '/login',
    name: 'login',
    component: () => lazyLoadView(import('@pages/login/login')),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        // 判断用户是否已经登录
        if (store.getters['auth/loggedIn']) {
          next({name: 'home'})
        } else {
          next()
        }
      }
    }
  },
  {
    path: '/home',
    name: 'home',
    component: () => lazyLoadView(import('@pages/home/home')),
    meta: {
      authRequired: true
    },
    redirect: 'home/product-list',
    children: [
      /**
       * 商品管理
       */
      // 商品列表
      {
        path: 'product-list',
        name: 'product-list',
        component: () => lazyLoadView(import('@pages/product-list/product-list')),
        meta: {
          titles: ['商品管理', '商品列表']
        }
      },
      // 商品分类
      {
        path: 'product-categories',
        name: 'product-categories',
        component: () => lazyLoadView(import('@pages/product-categories/product-categories')),
        meta: {
          titles: ['商品管理', '商品分类']
        }
      },
      // 辅助资料
      {
        path: 'auxiliary-information',
        name: 'auxiliary-information',
        component: () => lazyLoadView(import('@pages/auxiliary-information/auxiliary-information')),
        meta: {
          titles: ['商品管理', '辅助资料']
        }
      },
      /**
       * 商品管理
       *
       * ------------------------------------------------------------------------------------------
       *
       * 商城管理
       */
      // 轮播广告
      {
        path: 'advertisement',
        name: 'advertisement',
        component: () => lazyLoadView(import('@pages/advertisement/advertisement')),
        meta: {
          titles: ['商城管理', '轮播广告']
        }
      },
      // 今日抢购
      {
        path: 'rush-purchase',
        name: 'rush-purchase',
        component: () => lazyLoadView(import('@pages/rush-purchase/rush-purchase')),
        meta: {
          titles: ['商城管理', '今日抢购']
        }
      },
      /**
       * 商城管理
       *
       * ------------------------------------------------------------------------------------------
       *
       * 订单管理
       */
      // 订单列表
      {
        path: 'order-list',
        name: 'order-list',
        component: () => lazyLoadView(import('@pages/order-list/order-list')),
        meta: {
          titles: ['订单管理', '订单列表']
        }
      },
      // 退货管理
      {
        path: 'returns-management',
        name: 'returns-management',
        component: () => lazyLoadView(import('@pages/returns-management/returns-management')),
        meta: {
          titles: ['订单管理', '退货管理']
        }
      },
      // 退款详情
      {
        path: 'refund-detail',
        name: 'refund-detail',
        component: () => lazyLoadView(import('@pages/refund-detail/refund-detail')),
        meta: {
          titles: ['订单管理', '退货管理', '退款详情']
        }
      },
      /**
       * 订单管理
       *
       * ------------------------------------------------------------------------------------------
       *
       * 订单详情
       */
      {
        path: 'order-detail',
        name: 'order-detail',
        component: () => lazyLoadView(import('@pages/order-detail/order-detail')),
        meta: {
          titles: ['订单管理', '订单列表', '订单详情']
        }
      },
      /**
       * 订单管理
       *
       * ------------------------------------------------------------------------------------------
       *
       * 采购管理
       */
      {
        path: 'purchase-management',
        name: 'purchase-management',
        component: () => lazyLoadView(import('@pages/purchase-management/purchase-management')),
        meta: {
          titles: ['采购管理']
        }
      },
      /**
       * 采购管理
       *
       * ------------------------------------------------------------------------------------------
       *
       * 团长管理
       */
      // 团长列表
      {
        path: 'leader-list',
        name: 'leader-list',
        component: () => lazyLoadView(import('@pages/leader-list/leader-list')),
        meta: {
          titles: ['团长管理', '团长列表']
        }
      },
      // 配送单
      {
        path: 'dispatching-list',
        name: 'dispatching-list',
        component: () => lazyLoadView(import('@pages/dispatching-list/dispatching-list')),
        meta: {
          titles: ['团长管理', '团长配送单']
        }
      }
      /**
       * 团长管理
       */
    ]
  },
  {
    path: '/404',
    name: '404',
    component: require('@pages/_404/_404').default,
    props: true
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '*',
    redirect: '404'
  }
]

function lazyLoadView(AsyncView) {
  const AsyncHandler = () => ({
    component: AsyncView,
    loading: require('@pages/_loading/_loading').default,
    delay: 400,
    error: require('@pages/_timeout/_timeout').default,
    timeout: 10000
  })

  return Promise.resolve({
    functional: true,
    render(h, {data, children}) {
      // 将属性和方法传递给所有展示组件
      return h(AsyncHandler, data, children)
    }
  })
}
