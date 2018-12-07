export const state = {
  userInfo:{hello: 'world'}
}

export const getters = {
  info: state => state.userInfo
}

export const actions = {
  update({commit, state}, info) {
    commit('update', info)
  }
}

export const mutations = {
  update(state, info) {
    state.userInfo = info
  }
}
