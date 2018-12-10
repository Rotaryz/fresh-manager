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
    redirect: 'home/test-page1',
    children: [
      {
        path: 'sample/one',
        name: 'sample-one',
        component: () => lazyLoadView(import('@pages/sample/sample'))
      },
      {
        path: 'sample/two',
        name: 'sample-two',
        component: () => lazyLoadView(import('@pages/sample/sample'))
      },
      {
        path: 'other-pages/two',
        name: 'other-pages-two',
        component: () => lazyLoadView(import('@pages/other-pages/other-pages'))
      },
      {
        path: 'other-pages/one',
        name: 'other-pages-one',
        component: () => lazyLoadView(import('@pages/other-pages/other-pages'))
      },
      // 测试页面配置
      {
        path: 'test-page1',
        name: 'test-page1',
        component: () => lazyLoadView(import('@pages/test-page1/test-page1'))
      },
      // 测试页面注释
      {
        path: 'test-page',
        name: 'test-page',
        component: () => lazyLoadView(import('@pages/test-page/test-page'))
      }
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
