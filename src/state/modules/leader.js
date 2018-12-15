import API from '@api'
import app from '@src/main'

export const state = {
  leaderList: [],
  pageTotal: {
    total: 1,
    per_page: 10,
    total_page: 1
  }
}

export const getters = {
  leaderList(state) {
    return state.leaderList
  },
  pageTotal(state) {
    return state.pageTotal
  }
}

export const mutations = {
  SET_LEADER_LIST(state, list) {
    state.leaderList = list
  },
  SET_PAGE_TOTAL(state, pageTotal) {
    state.pageTotal = pageTotal
  }
}

export const actions = {
  getLeaderList({state, commit, dispatch}, {page, loading = true}) {
    return API.Leader.leaderList({page}, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data
        let pageTotal = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page

        }
        console.log(pageTotal)
        commit('SET_LEADER_LIST', arr)
        commit('SET_PAGE_TOTAL', pageTotal)
        app.$loading.hide()
        return true
      })
      .catch(() => {
        app.$loading.hide()
        return false
      })
  }
}
