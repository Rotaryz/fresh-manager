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
  requestData: {
    page: 1,
    order_sn: ''
  }
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
  requestData(state) {
    return state.requestData
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
  SET_REQUEST_DATA(state, data) {
    state.requestData = Object.assign({}, state.requestData, data)
  },
  RESET_DATA(state) {
    state.requestData = {
      page: 1,
      order_sn: ''
    }
  }
}

export const actions = {
  // 采购列表
  getPurchaseList({state, commit, dispatch}, loading = false) {
    return API.Purchase.purchaseList(state.requestData, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let pageTotal = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        let arr = res.data.map((item) => {
          item.select = false
          item.url = `${process.env.VUE_APP_API}/social-shopping/api/backend/store-purchase-export/`
          return item
        })
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
  },
  resetData({commit}) {
    commit('RESET_DATA')
  },
  setRequestData({commit, dispatch}, data) {
    commit('SET_REQUEST_DATA', data)
    dispatch('getPurchaseList')
  }
}
