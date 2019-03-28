import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'
import NProgress from 'nprogress/nprogress'
import store from '@state/store'
import routes from './routes'

NProgress.configure({showSpinner: false})

Vue.use(VueRouter)
Vue.use(VueMeta, {
  keyName: 'page'
})

const router = new VueRouter({
  routes,
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {x: 0, y: 0}
    }
  }
})

router.beforeEach((routeTo, routeFrom, next) => {
  // 判断不是初始页面开始加载进度条
  if (routeFrom.name !== null) {
    NProgress.start()
  }

  // 判断该路由是否需要检验用户信息
  const authRequired = routeTo.matched.some((route) => route.meta.authRequired)

  if (!authRequired) {
    return next()
  }

  // 判断是否已经登录
  if (store.getters['auth/loggedIn']) {
    // 检验登录的有效性，执行相应的操作
    return store.dispatch('auth/validate').then((validUser) => {
      validUser ? next() : redirectToLogin()
    })
  }

  // 如果需要检验用户信息，但是当前却没登录,
  // 重定向到登录页面。
  redirectToLogin()

  function redirectToLogin() {
    // 跳转到登录页面并且把当前的路由信息传递给登录页面
    next({name: 'login', query: {redirectFrom: routeTo.fullPath}})
  }
})

router.beforeResolve(async (routeTo, routeFrom, next) => {
  try {
    for (const route of routeTo.matched) {
      await new Promise((resolve, reject) => {
        if (route.meta && route.meta.beforeResolve) {
          route.meta.beforeResolve(routeTo, routeFrom, (...args) => {
            if (args.length) {
              if (routeFrom.name === args[0].name) {
                NProgress.done()
              }
              next(...args)
              reject(new Error('Redirected'))
            } else {
              resolve()
            }
          })
        } else {
          resolve()
        }
      })
    }
  } catch (error) {
    return
  }
  next()
})

const ADD_TEXT = '新建'
const EDIT_TEXT = '编辑'

router.afterEach((routeTo, routeFrom) => {
  // 动态添加页面标题
  const name = routeTo.params.name
  const marginBottom = routeTo.meta.marginBottom || 0
  const variableIndex = routeTo.meta.variableIndex
  let titles = routeTo.meta.titles ? [...routeTo.meta.titles] : []
  // 判断该页面是否是变动的标题
  if (variableIndex || variableIndex === 0) {
    titles[variableIndex] = (routeTo.query.id || routeTo.params.id ? EDIT_TEXT : ADD_TEXT) + titles[variableIndex]
  }
  titles[titles.length - 1] = name || titles[titles.length - 1]
  if (titles) {
    store.commit('global/SET_CURRENT_TITLES', titles)
  }
  store.commit('global/SET_MARGIN_BOTTOM', marginBottom)
  NProgress.done()
})

export default router
