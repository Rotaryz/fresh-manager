import API from '@api'
import app from '@src/main'

export const state = {
  rushDetail: {},
  rushList: [],
  rushPage: {
    total: 1,
    per_page: 10,
    total_page: 1
  }
}

export const getters = {
  rushDetail(state) {
    return state.rushDetail
  },
  rushList(state) {
    return state.rushList
  },
  rushPage(state) {
    return state.rushPage
  }
}

export const mutations = {
  SET_RUSH_DETAIL(state, rushDetail) {
    state.rushDetail = rushDetail
  },
  SET_RUSH_LIST(state, rushList) {
    state.rushList = rushList
  },
  SET_RUSH_PAGE(state, detail) {
    state.rushPage = detail
  }
}

export const actions = {
  getRushDetail({state, commit, dispatch}, {id, loading = true}) {
    commit('SET_RUSH_DETAIL', [])
    return API.Rush.rushDetail(id, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        commit('SET_RUSH_DETAIL', res.data)
        return res.data
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getRushList({state, commit, dispatch}, {page, startTime = '', endTime = '', loading = false}) {
    return API.Rush.getRushList({page: page, start_at: startTime, end_at: endTime,activity_type: 'fixed'}, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data
        let rushPage = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        commit('SET_RUSH_LIST', arr)
        commit('SET_RUSH_PAGE', rushPage)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  setRushList({state, commit, dispatch}, arr) {
    commit('SET_RUSH_DETAIL', arr)
  }
}
