import API from '@api'
import app from '@src/main'

export const state = {
  unitsList: []
}

export const getters = {
  unitsList(state) {
    return state.unitsList
  }
}

export const mutations = {
  SET_UNITS_LIST(state, list) {
    state.unitsList = list
  }
}

export const actions = {
  getAuxiliaryList({state, commit, dispatch}, {loading = true}) {
    return API.Product.getUnitsList(loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data
        commit('SET_UNITS_LIST', arr)
        app.$loading.hide()
        return true
      })
      .catch(() => {
        app.$loading.hide()
        return false
      })
  },
  setAuxiliary({commit}, data) {
    commit('SET_UNITS_LIST', data)
  }
}
