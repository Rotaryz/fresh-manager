// import API from '@api'
// import app from '@src/main'

export const state = {
  requestData: {
    page: 1,
    limit: 10,
    keyword: ''
  }
}
export const getters = {
  requestData(state) {
    return state.requestData
  }
}

export const mutations = {
  SET_REQUEST_DATA(state, data) {
    state.requestData = Object.assign({}, state.requestData, data)
  },
  RESET_REQUEST_DATA(state) {
    state.requestData = {
      page: 1,
      limit: 10,
      keyword: ''
    }
  }
}

export const actions = {
  setRequestData({commit}, data) {
    commit('SET_REQUEST_DATA', data)
  },
  resetData({commit}) {
    commit('RESET_REQUEST_DATA')
  }
}
