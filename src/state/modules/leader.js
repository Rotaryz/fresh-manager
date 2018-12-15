import API from '@api'
import app from '@src/main'

export const state = {
  leaderList: [],
  pageTotal: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  leaderDetail: {}
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
  },
  SET_LEADER_DETAIL(state, detail) {
    state.leaderDetail = detail
  }
}

export const actions = {
  getLeaderList({state, commit, dispatch}, {page, loading = true}) {
    return API.Leader.getLeaderList({page}, loading)
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
        return true
      })
      .catch(() => {
        return false
      }).finally(() => {
        app.$loading.hide()
      })
  },
  getLeaderDetail({commit}, id) {
    return API.Leader.getLeaderDetail(id)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let leaderDetail = res.data
        commit('SET_LEADER_DETAIL', leaderDetail)
        return leaderDetail
      }).catch(() => {
        return false
      }).finally(() => {
        app.$loading.hide()
      })
  }
}
