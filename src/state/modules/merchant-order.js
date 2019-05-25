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
      buyer_name: "",
      order_sn: "",
      created_at: "",
      status: "",
      status_str: "",
      type_str: "",
      parent_order_id: "",
      details: []
    },
    filter: {
      page: 1,
      limit: 10,
      start_time: '',
      end_time: '',
      status: 0,
      keyword: ""
    },
  },
  consumerDetail: {
    pageTotal: {
      // 页码详情
      total: 1,
      per_page: 10,
      total_page: 1
    },
    filter: {
      page: 1,
      limit: 10,
      goods_sku_code: "",
      parent_order_id: ""
    },
    detail: {
      baseData: {
        goods_name: "",
        goods_sku_code: "",
        goods_category: "",
        sale_out_of_num: "",
        sale_wait_pick_num: "",
        sale_num: ""
      },
      details: []
    }
  },
  mergerDetail: {}
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
  // 消费者详情
  consumerDetailTotal(state) {
    return state.consumerDetail.pageTotal
  },
  consumerDetail(state) {
    return state.consumerDetail
  },
  mergerDetail(state) {
    return state.mergerDetail
  },

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
  SET_CONSUMER_DETAIL(state, value) {
    state.consumerDetail.detail = value
  },
  SET_MERGER_DETAIL(state, {value}) {
    state.mergerDetail = value
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
        commit('SET_PAGE_TOTAL', {pageTotal})
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
      }).catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  // 商品详情
  getConsumerDetails({state, commit}, params) {
    commit('SET_PARAMS', {
      key: 'consumerDetail',
      ...params
    })
    return Promise.all([
      API.MerchantOrder.getConsumerDetails(state.consumerDetail.filter),
      API.MerchantOrder.getConsumerDetailBase(params.id)
    ]).then(res => {
      if (res[0].error !== app.$ERR_OK && res[1].error !== app.$ERR_OK) {
        return false
      }
      commit('SET_CONSUMER_DETAIL', {details: res[0].data, baseData: res[1].data})

      let pageTotal = {
        total: res[0].meta.total,
        per_page: res[0].meta.per_page,
        total_page: res[0].meta.last_page
      }
      commit('SET_PAGE_TOTAL', {key: 'consumerDetail', pageTotal})
      return true
    })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getConsumerDetailBase({state, commit}, {id}) {
    return API.MerchantOrder.getConsumerDetailBase({id})
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
      })
  },
  getMergerOrderDetail({state, commit}, params) {
    return API.MerchantOrder.getMergerOrderDetail(params)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        commit('SET_MERGER_DETAIL', {value: res.data})
        return true
      }).catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  }
}
