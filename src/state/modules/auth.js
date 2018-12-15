import axios from 'axios'
import storage from 'storage-controller'
import API from '@api'
import app from '@src/main'

export const state = {
  currentUser: storage.get('auth.currentUser', 0)
}

export const getters = {
  // 判断用户是否已经登录
  loggedIn(state) {
    return !!state.currentUser
  }
}

export const mutations = {
  SET_CURRENT_USER(state, user) {
    state.currentUser = user
    storage.set('auth.currentUser', user)
    setDefaultAuthHeaders(state)
  }
}

export const actions = {
  // 初始化用户登录状态
  init({state, dispatch}) {
    setDefaultAuthHeaders(state)
    dispatch('validate')
  },
  // 登录
  logIn({commit, dispatch, getters}, {username, password}) {
    if (getters.loggedIn) {
      return dispatch('validate')
    }
    return API.Auth.logIn({username, password})
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          app.$toast.show(res.message)
          return null
        }
        const user = res.data
        commit('SET_CURRENT_USER', user)
        return user
      })
      .catch(() => {
        return null
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  // 退出
  logOut({commit}) {
    commit('SET_CURRENT_USER', null)
  },
  // 验证用户身份的有效性
  validate({commit, state}) {
    if (!state.currentUser) {
      return Promise.resolve(null)
    }
    return API.Auth.validate()
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          commit('SET_CURRENT_USER', null)
          return null
        }
        const user = res.data
        commit('SET_CURRENT_USER', user)
        return user
      })
      .catch(() => {
        commit('SET_CURRENT_USER', null)
        return null
      })
  }
}

/**
 * 设置默认请求头 Authorization
 * @param state
 */
function setDefaultAuthHeaders(state) {
  let commonHeaders = {
    'Current-Corp': 1,
    'Current-Shop': 1,
    Authorization: state.currentUser ? state.currentUser.access_token : ''
  }
  axios.defaults.headers.common = commonHeaders
}
