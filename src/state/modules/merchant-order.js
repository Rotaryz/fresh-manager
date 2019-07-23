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
      keyword: ''
    }
  },
  consumer: {
    pageTotal: {
      // 页码详情
      total: 1,
      per_page: 10,
      total_page: 1
    },
    list: [],
    filter: {
      start_time: '',
      end_time: '',
      keyword: '',
      status: 0,
      page: 1,
      limit: 10
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
  // 商品汇总单
  consumerPageTotal(state) {
    return state.consumer.pageTotal
  },
  consumerList(state) {
    return state.consumer.list
  },
  consumerFilter(state) {
    return state.consumer.filter
  },
  tabIndex(state) {
    return state.tabIndex
  }
}

export const mutations = {
  SET_PARAMS(state, {key = 'merchant', ...params}) {
    state[key].filter = {...state[key].filter, ...params}
  },
  SET_PAGE_TOTAL(state, {key = 'merchant', pageTotal}) {
    state[key].pageTotal = pageTotal
  },
  SET_MERCHANT_LIST(state, {list}) {
    state.merchant.list = list
  },
  SET_MERCHANT_DETAIL(state, {key = 'merchant', value}) {
    state.merchant.detail = value
  },
  SET_CONSUMER_LIST(state, {list}) {
    state.consumer.list = list
  },
  SET_TAB_INDEX(state, tabIndex) {
    state.tabIndex = tabIndex
  }
}

export const actions = {
  // 商户订单列表
  getMerchantOrderList({state, commit, dispatch}) {
    return API.MerchantOrder.getMerchantOrderList(state.merchant.filter, {loading: true})
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
        commit('SET_MERCHANT_LIST', {list: arr})
        commit('SET_PAGE_TOTAL', {key: 'merchant',...pageTotal})
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
  getConsumerOrderList({state, commit}) {
    return API.MerchantOrder.getConsumerOrderslist(state.consumer.filter, {loading: true})
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
        commit('SET_CONSUMER_LIST', {list: arr})
        commit('SET_PAGE_TOTAL', {key: 'consumer', ...pageTotal})
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
        commit('SET_MERCHANT_DETAIL', {value: res.data})
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
      key: 'merchant',
      page: 1,
      limit: 10,
      start_time: '',
      end_time: '',
      status: '',
      keyword: ''
    })
    commit('SET_PARAMS', {
      key: 'consumer',
      page: 1,
      limit: 10,
      start_time: '',
      end_time: '',
      status: '',
      keyword: ''
    })
    commit('SET_TAB_INDEX', 0)
  }
}
