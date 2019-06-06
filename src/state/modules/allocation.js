import API from '@api'
import app from '@src/main'

export const state = {
  allocationList: []
}

export const getters = {
  allocationList(state) {
    return state.allocationList
  }
}

export const mutations = {
  SET_ALLOCATION_LIST(state, list) {
    state.allocationList = list
  }
}

export const actions = {
  getAllocationList({commit, state}, loading = false) {
    return API.Allocation.allocationList()
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let list = res.data
        commit('SET_ALLOCATION_LIST', list)
        return list
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  setAllocationList({commit}, list) {
    commit('SET_ALLOCATION_LIST', list)
  }
}
