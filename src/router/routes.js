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
          titles: ['商品管理', '商品列表'],
          beforeResolve(routeTo, routeFrom, next) {
            //  团长列表
            store
              .dispatch('editgoods/getGoodsData', 1)
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 商品分类
      {
        path: 'product-categories',
        name: 'product-categories',
        component: () => lazyLoadView(import('@pages/product-categories/product-categories')),
        meta: {
          titles: ['商品管理', '商品分类'],
          beforeResolve(routeTo, routeFrom, next) {
            //  商品分类
            store
              .dispatch('categories/getCategoryList', -1)
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 辅助资料
      {
        path: 'auxiliary-information',
        name: 'auxiliary-information',
        component: () => lazyLoadView(import('@pages/auxiliary-information/auxiliary-information')),
        meta: {
          titles: ['商品管理', '辅助资料'],
          beforeResolve(routeTo, routeFrom, next) {
            //  辅助资料
            store
              .dispatch('auxiliary/getAuxiliaryList', 1)
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 编辑商品
      {
        path: 'product-list/edit-goods',
        name: 'edit-goods',
        component: () => lazyLoadView(import('@pages/edit-goods/edit-goods')),
        meta: {
          titles: ['商品管理', '商品列表', '新建商品'],
          beforeResolve(routeTo, routeFrom, next) {
            if (!routeTo.query.id) {
              return next()
            }
            store
              .dispatch('editgoods/getGoodsDetailData', routeTo.query.id)
              .then((response) => {
                if (!response) {
                  return next({name: '404'})
                }
                routeTo.params.detail = response
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
          }
        },
        props: (route) => ({detail: route.params.detail})
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
          titles: ['商城管理', '轮播广告'],
          beforeResolve(routeTo, routeFrom, next) {
            //  团长列表
            store
              .dispatch('advertisement/getInfoBannerList')
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 今日抢购
      {
        path: 'rush-purchase',
        name: 'rush-purchase',
        component: () => lazyLoadView(import('@pages/rush-purchase/rush-purchase')),
        meta: {
          titles: ['商城管理', '今日抢购'],
          beforeResolve(routeTo, routeFrom, next) {
            //  团长列表
            store
              .dispatch('rush/getRushList', {page: 1})
              .then((res) => {
                console.log(res)
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                console.log('dsf')
                return next({name: '404'})
              })
          }
        }
      },
      // 新建编辑今日抢购
      {
        path: 'rush-purchase/edit-rush',
        name: 'edit-rush',
        component: () => lazyLoadView(import('@pages/edit-rush/edit-rush')),
        meta: {
          titles: ['商城管理', '今日抢购', '新建活动'],
          beforeResolve(routeTo, routeFrom, next) {
            let id = routeTo.query.id
            //  团长列表
            store
              .dispatch('rush/getRushDetail', {id})
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                console.log('dsf')
                return next({name: '404'})
              })
          }
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
          titles: ['采购管理'],
          beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('purchase/getPurchaseList', {page: 1, orderSn: ''})
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                routeTo.params.detail = res
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
          }
        }
      },
      // 采购详情
      {
        path: 'purchase-management/purchase-detail',
        name: 'purchase-detail',
        component: () => lazyLoadView(import('@pages/purchase-detail/purchase-detail')),
        meta: {
          titles: ['采购管理', '采购详情'],
          beforeResolve(routeTo, routeFrom, next) {
            if (!routeTo.query.id) {
              return next()
            }
            store
              .dispatch('purchase/getPurchaseDetail', routeTo.query.id)
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                routeTo.params.detail = res
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
          }
        },
        props: (route) => ({detail: route.params.detail})
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
          titles: ['团长管理', '团长列表'],
          beforeResolve(routeTo, routeFrom, next) {
            //  团长列表
            store
              .dispatch('leader/getLeaderList', 1)
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 配送单
      {
        path: 'dispatching-list',
        name: 'dispatching-list',
        component: () => lazyLoadView(import('@pages/dispatching-list/dispatching-list')),
        meta: {
          titles: ['团长管理', '团长配送单'],
          beforeResolve(routeTo, routeFrom, next) {
            //  团长列表
            store
              .dispatch('leader/getDeliveryOrder', {page: 1, shopId: ''})
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 团长配送单详情
      {
        path: 'dispatching-list/dispatching-detail',
        name: 'dispatching-detail',
        component: () => lazyLoadView(import('@pages/dispatching-detail/dispatching-detail')),
        meta: {
          titles: ['团长管理', '团长配送单', '配送单详情'],
          beforeResolve(routeTo, routeFrom, next) {
            if (!routeTo.query.id) {
              return next()
            }
            store
              .dispatch('leader/getDeliveryDetail', routeTo.query.id)
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                routeTo.params.detail = res
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
          }
        },
        props: (route) => ({detail: route.params.detail})
      },
      // 新建团长
      {
        path: 'leader-list/edit-leader',
        name: 'edit-leader',
        component: () => lazyLoadView(import('@pages/edit-leader/edit-leader')),
        meta: {
          titles: ['团长管理', '团长配送单', '新建团长'],
          beforeResolve(routeTo, routeFrom, next) {
            if (!routeTo.query.id) {
              return next()
            }
            store
              .dispatch('leader/getLeaderDetail', routeTo.query.id)
              .then((response) => {
                if (!response) {
                  return next({name: '404'})
                }
                routeTo.params.detail = response
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
          }
        },
        props: (route) => ({detail: route.params.detail})
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
