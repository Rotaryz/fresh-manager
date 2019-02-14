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
  SET_PAGE_TOTAL(state, pageTotal) {
    state.pageTotal = pageTotal
  },
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
  getPurchaseList({state, commit, dispatch}, {page, orderSn, loading = true}) {
    return API.Purchase.purchaseList({page, order_sn: orderSn}, loading)
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
  }
}
