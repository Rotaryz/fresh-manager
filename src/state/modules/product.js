import API from '@api'
import app from '@src/main'

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
  outDetail: {},
  isEnterFirst: true,
  enterFilter: {
    status: 0,
    keyword: '',
    start_time: '',
    end_time: '',
    limit: 10,
    page: 1,
    type: '',
    exception_status: ''
  },
  isOutFirst: true,
  outFilter: {
    status: 0,
    keyword: '',
    start_time: '',
    end_time: '',
    limit: 10,
    page: 1,
    type: '',
    exception_status: ''
  }
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
  },
  enterFilter(state) {
    return state.enterFilter
  },
  isEnterFirst(state) {
    return state.isEnterFirst
  },
  outFilter(state) {
    return state.outFilter
  },
  isOutFirst(state) {
    return state.isOutFirst
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
  },
  SET_IS_ENTER_FRIRST(state, isEnterFirst) {
    state.isEnterFirst = isEnterFirst
  },
  SET_ENTER_PARAMS(state, params) {
    state.enterFilter = {...state.enterFilter, ...params}
  },
  SET_IS_OUT_FRIRST(state, isOutFirst) {
    state.isOutFirst = isOutFirst
  },
  SET_OUT_PARAMS(state, params) {
    state.outFilter = {...state.outFilter, ...params}
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
  // async getEnterData({state, commit, dispatch}, {startTime, endTime, status, page, exceptionStatus, loading = true}) {
  async getEnterData({state, commit, dispatch}, {loading = false}) {
    // let data = {
    //   status: status,
    //   keyword: '',
    //   start_time: startTime,
    //   end_time: endTime,
    //   limit: 10,
    //   page: 1,
    //   exception_status: exceptionStatus
    // }
    return API.Store.getEnterList(state.enterFilter, loading)
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
  // async getOutData({state, commit, dispatch}, {startTime, endTime, status, page, exceptionStatus, loading = true}) {
  async getOutData({state, commit, dispatch}, {loading = false}) {
    // let data = {
    //   status: status,
    //   keyword: '',
    //   start_time: startTime,
    //   end_time: endTime,
    //   limit: 10,
    //   page: 1,
    //   exception_status: exceptionStatus
    // }
    return API.Store.getOutList(state.outFilter, loading)
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
  },
  resetProductData({commit}) {
    commit('SET_ENTER_PARAMS', {
      status: 0,
      keyword: '',
      start_time: '',
      end_time: '',
      limit: 10,
      page: 1,
      type: '',
      exception_status: ''
    })
    commit('SET_IS_ENTER_FRIRST', true)
  },
  resetOutData({commit}) {
    commit('SET_OUT_PARAMS', {
      status: 2,
      keyword: '',
      start_time: '',
      end_time: '',
      limit: 10,
      page: 1,
      exception_status: ''
    })
    commit('SET_IS_OUT_FRIRST', true)
  }
}
