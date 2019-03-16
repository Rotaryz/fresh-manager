import API from '@api'
import app from '@src/main'

export const state = {
  storeList: []
}

export const getters = {
  storeList(state) {
    return state.storeList
  }
}

export const mutations = {
  SET_STORE_LIST(state, storeList) {
    state.storeList = storeList
  }
}

export const actions = {
  // 获取仓库库位管理
  getStore({state, commit}) {
    return API.Store.getStoreList()
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let storeData = res.data
        commit('SET_STORE_LIST', storeData)
        return storeData
      })
      .finally(() => {
        app.$loading.hide()
      })
  }
}
