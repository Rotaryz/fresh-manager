import API from '@api'
import app from '@src/main'

export const state = {
  allocationList: [],
  operation: {}
}

export const getters = {
  allocationList(state) {
    return state.allocationList
  },
  operation(state) {
    return state.operation
  }
}

export const mutations = {
  SET_ALLOCATION_LIST(state, list) {
    state.allocationList = list
  },
  SET_OPERATION(state, operation) {
    state.operation = operation
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
  getOperation({commit}, loading = true) {
    return API.Allocation.runTimeConfig()
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let obj = res.data
        commit('SET_OPERATION', obj)
        return obj
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  }
}
