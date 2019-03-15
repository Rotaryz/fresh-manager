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
  purchaseDetail: {} // 采购详情
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
  }
}

export const actions = {
  // 采购列表
  getPurchaseList({state, commit, dispatch}, {time, startTime, endTime, keyword, page, loading = true}) {
    return API.Supply.purchaseOrder({time, start_time: startTime, end_time: endTime, keyword, page}, loading)
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
    return API.Purchase.purchaseDetail(id, true)
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
  }
}
