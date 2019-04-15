import API from '@api'
import app from '@src/main'

export const state = {
  pageTotal: {
    // 页码详情
    total: 1,
    per_page: 10,
    total_page: 1
  },
  purchaseList: [], // 采购列表
  purchaseDetail: {}, // 采购详情
  timeStart: '',
  timeEnd: ''
}

export const getters = {
  purchaseList(state) {
    return state.purchaseList
  },
  purchaseDetail(state) {
    return state.purchaseDetail
  },
  pageTotal(state) {
    return state.pageTotal
  },
  timeStart(state) {
    return state.timeStart
  },
  timeEnd(state) {
    return state.timeEnd
  }
}

export const mutations = {
  SET_PAGE_TOTAL(state, pageTotal) {
    state.pageTotal = pageTotal
  },
  SET_PURCHASE_LIST(state, list) {
    state.purchaseList = list
  },
  SET_PURCHASE_DETAIL(state, pageTotal) {
    state.purchaseDetail = pageTotal
  },
  SET_TIME_START(state, timeStart) {
    state.timeStart = timeStart
  },
  SET_TIME_END(state, timeEnd) {
    state.timeEnd = timeEnd
  }
}

export const actions = {
  // 采购列表
  getPurchaseList({state, commit, dispatch}, {time, startTime, endTime, keyword, page, status, loading = true}) {
    return API.Supply.purchaseOrder(
      {
        time,
        start_time: startTime ? startTime + ' ' + state.timeStart : '',
        end_time: endTime ? endTime + ' ' + state.timeEnd : '',
        keyword,
        page,
        status
      },
      loading
    )
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let pageTotal = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        let arr = res.data
        commit('SET_PURCHASE_LIST', arr)
        commit('SET_PAGE_TOTAL', pageTotal)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  // 团长详情
  getPurchaseDetail({commit}, id) {
    return API.Supply.purchaseDetail(id, true)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let detail = res.data
        commit('SET_PURCHASE_DETAIL', detail)
        return detail
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  infoPurchaseTime({commit, dispatch}, {start, end}) {
    commit('SET_TIME_START', start)
    commit('SET_TIME_END', end)
  }
}
