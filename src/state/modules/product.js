import API from '@api'
import app from '@src/main'
import {getCurrentTime} from '@utils/tool'

export const state = {
  storeList: [],
  enterList: [],
  statePageTotal: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  outList: [],
  outPageTotal: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  enterDetail: {},
  outDetail: {}
}

export const getters = {
  storeList(state) {
    return state.storeList
  },
  enterList(state) {
    return state.enterList
  },
  statePageTotal(state) {
    return state.statePageTotal
  },
  outList(state) {
    return state.outList
  },
  outPageTotal(state) {
    return state.outPageTotal
  },
  enterDetail(state) {
    return state.enterDetail
  },
  outDetail(state) {
    return state.outDetail
  }
}

export const mutations = {
  SET_STORE_LIST(state, storeList) {
    state.storeList = storeList
  },
  SET_ENTER_LIST(state, list) {
    state.enterList = list
  },
  SET_PAGE_TOTAL(state, statePageTotal) {
    state.statePageTotal = statePageTotal
  },
  SET_OUT_LIST(state, list) {
    state.outList = list
  },
  SET_OUT_PAGE_TOTAL(state, statePageTotal) {
    state.outPageTotal = statePageTotal
  },
  SET_ENTER_MSG(state, enterDetail) {
    state.enterDetail = enterDetail
  },
  SET_OUT_MSG(state, enterDetail) {
    state.outDetail = enterDetail
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
  },
  async getEnterData({state, commit, dispatch}, {startTime, endTime, page, loading = true}) {
    // let time = await getCurrentTime()
    // let startTime = new Date(time.timestamp - (86400 * 1000 * 1))
    // startTime = startTime.toLocaleDateString().replace(/\//g, '-')
    // let endTime = new Date(time.timestamp)
    // endTime = endTime.toLocaleDateString().replace(/\//g, '-')
    let data = {status: '', keyword: '', start_time: startTime, end_time: endTime, limit: 10, page: 1}
    return API.Store.getEnterList(data, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data
        let statePageTotal = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        commit('SET_ENTER_LIST', arr)
        commit('SET_PAGE_TOTAL', statePageTotal)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  async getOutData({state, commit, dispatch}, {page, loading = true}) {
    let time = await getCurrentTime()
    let startTime = new Date(time.timestamp - (86400 * 1000 * 1))
    startTime = startTime.toLocaleDateString().replace(/\//g, '-')
    let endTime = new Date(time.timestamp)
    endTime = endTime.toLocaleDateString().replace(/\//g, '-')
    let data = {status: '', keyword: '', start_time: startTime, end_time: endTime, limit: 10, page: 1}
    return API.Store.getOutList(data, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data
        let statePageTotal = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        commit('SET_OUT_LIST', arr)
        commit('SET_OUT_PAGE_TOTAL', statePageTotal)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getEnterDetailData({commit}, id) {
    return API.Store.getEnterDetail(id)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let goodsDetail = res
        commit('SET_ENTER_MSG', goodsDetail)
        return goodsDetail
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getOutDetailData({commit}, id) {
    return API.Store.getOutDetail(id)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let goodsDetail = res
        commit('SET_OUT_MSG', goodsDetail)
        return goodsDetail
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  }
}
