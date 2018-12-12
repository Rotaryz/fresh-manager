import axios from 'axios'
import storage from 'storage-controller'

export const state = {
  currentUser: storage.get('auth.currentUser', null)
}

export const getters = {
  // 判断用户是否已经登录
  loggedIn(state) {
    return !!state.currentUser
  }
}

export const mutations = {
  SET_CURRENT_USER(state, newValue) {
    state.currentUser = newValue
    storage.set('auth.currentUser', newValue)
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
    // todo return promise and set currentUser state
    return new Promise((resolve, reject) => {
      commit('SET_CURRENT_USER' , username + password)
      resolve(username + password)
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
    // todo return promise and set currentUser state
  }
}

/**
 * 设置默认请求头 Authorization
 * @param state
 */
function setDefaultAuthHeaders(state) {
  axios.defaults.headers.common['Authorization'] = state.currentUser ? state.currentUser.token : ''
}
