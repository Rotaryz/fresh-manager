import API from '@api'
import app from '@src/main'

export const state = {
  merchant: {
    pageTotal: {
      // 页码详情
      total: 1,
      per_page: 10,
      total_page: 1
    },
    list: [],
    detail: {
      buyer_name: '',
      order_sn: '',
      created_at: '',
      status: '',
      status_str: '',
      type_str: '',
      parent_order_id: '',
      details: []
    },
    filter: {
      page: 1,
      limit: 10,
      start_time: '',
      end_time: '',
      status: 0,
      keyword: '',
      type: '',
      exception_status: ''
    }
  },
  tabIndex: 0
}

export const getters = {
  // 商户订单
  pageTotal(state) {
    return state.merchant.pageTotal
  },
  orderList(state) {
    return state.merchant.list
  },
  merchantFilter(state) {
    return state.merchant.filter
  },
  merchantDetail(state) {
    return state.merchant.detail
  },
  tabIndex(state) {
    return state.tabIndex
  }
}

export const mutations = {
  SET_PARAMS(state, params) {
    state.merchant.filter = {...state.merchant.filter, ...params}
  },
  SET_PAGE_TOTAL(state, pageTotal) {
    state.merchant.pageTotal = pageTotal
  },
  SET_MERCHANT_LIST(state, list) {
    state.merchant.list = list
  },
  SET_MERCHANT_DETAIL(state, value) {
    state.merchant.detail = value
  },
  SET_TAB_INDEX(state, tabIndex) {
    state.tabIndex = tabIndex
  }
}

export const actions = {
  // 商户订单列表
  getMerchantOrderList({state, commit, dispatch}, loading) {
    return API.MerchantOrder.getMerchantOrderList(state.merchant.filter, loading)
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
        commit('SET_MERCHANT_LIST', arr)
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
  // 消费者订单列表
  getConsumerOrderList({state, commit}, loading) {
    return API.MerchantOrder.getConsumerOrderslist(state.merchant.filter, loading)
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
        commit('SET_MERCHANT_LIST', arr)
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
  // 商户订单详情
  getMerchantOrderDetail({state, commit}, {id}) {
    return API.MerchantOrder.getMerchantOrderDetail({id})
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        commit('SET_MERCHANT_DETAIL', res.data)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  resetData({commit}) {
    commit('SET_PARAMS', {
      page: 1,
      limit: 10,
      start_time: '',
      end_time: '',
      status: 0,
      keyword: '',
      usual: ''
    })

    commit('SET_TAB_INDEX', 0)
  }
}
