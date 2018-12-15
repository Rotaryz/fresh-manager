import API from '@api'
import app from '@src/main'

export const state = {
  leaderList: []
}

export const getters = {
  leaderList(state) {
    return state.leaderList
  }
}

export const mutations = {
  SET_LEADER_LIST(state, list) {
    state.leaderList = list
  }
}

export const actions = {
  getLeaderList({state, commit, dispatch}, {page, loading = true}) {
    return API.Leader.leaderList({page}, loading)
      .then((res) => {
        let arr = res.error === app.$ERR_OK ? res.data : []
        commit('SET_LEADER_LIST', arr)
        app.$loading.hide()
        return arr
      })
      .catch(() => {
        app.$loading.hide()
        return []
      })
  }
}
