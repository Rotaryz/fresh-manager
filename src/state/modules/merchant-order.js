import API from '@api'
import app from '@src/main'

export const state = {
  merchant:{
    pageTotal: {
      // 页码详情
      total: 1,
      per_page: 10,
      total_page: 1
    },
    list: [],
    detail: {},
    filter: {
      page: 1,
      limit: 10,
      start_time: '',
      end_time: '',
      type: "",
      status: "",
      keyword: ""
    },
  },
  merchantDetail: {
    buyer_name: "",
    order_sn: "",
    created_at: "",
    status: "",
    status_str: "",
    type_str: "",
    details: []
  },
  mergerDetail: {
    order_sn: "",
    type_count: 0,
    created_at: "",
    details: []
  },
  consumerOrderDetail: {
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
    data: {
      baseData: {
        goods_name: "",
        goods_sku_code: "",
        goods_category: "",
        sale_out_of_num: "",
        sale_wait_pick_num: "",
        sale_num: ""
      },
      detail: []
    }
  }
}

export const getters = {
  pageTotal(state) {
    return state.merchant.pageTotal
  },
  orderList(state) {
    return state.merchant.list
  },
  detail(state) {
    return state.detail
  },
  filter(state) {
    return state.filter
  },
  merchantDetail(state) {
    return state.merchantDetail
  },
  mergerDetail(state) {
    return state.mergerDetail
  },
  consumerOrderDetail(state) {
    return state.consumerOrderDetail
  }
}

export const mutations = {
  SET_PARAMS(state, {key = 'merchant',...params}){
    state[key].filter = {...state[key].filter,...params}
  },
  SET_CONSUMER_PARAMS(state, {goodsSkuCode, parentOrderId, page}) {
    state.consumerOrderDetail.filter.goods_sku_code = goodsSkuCode
    state.consumerOrderDetail.filter.parent_order_id = parentOrderId
    state.consumerOrderDetail.filter.page = page || 1
  },
  SET_CONSUMER_PAGE(state, page) {
    state.consumerOrderDetail.filter.page = page
  },
  SET_CONSUMER_PAGE_TOTAL(state, pageTotal) {
    state.consumerOrderDetail.pageTotal = pageTotal
  },
  SET_CONSUMER_DETAIL(state, {value}) {
    state.consumerOrderDetail.data.details = value
  },
  SET_ORDER_DETAIL(state, {value}) {
    state.merchantDetail = value
  },
  SET_MERGER_DETAIL(state, {value}) {
    state.mergerDetail = value
  },

  SET_PAGE_TOTAL(state, {type='merchant',pageTotal}) {
    state[type].pageTotal = pageTotal
  },
  SET_LIST(state, {list}) {
    state.merchant.list = list
  }
}

export const actions = {
  // 商户订单列表
  getMerchantOrderList({state, commit, dispatch}, params = {}) {
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
        commit('SET_LIST', {list: arr})
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
        commit('SET_ORDER_DETAIL', {value: res.data})
        return true
      })
  },
  // 商品详情
  getConsumerOrderDetail({state, commit}) {
    return API.MerchantOrder.getConsumerOrderDetail(state.consumerOrderDetail.filter)
      .then((res) => {
        console.log(state.consumerOrderDetail.filter)
        if (res.error !== app.$ERR_OK) {
          return false
        }
        commit('SET_CONSUMER_DETAIL', {value: res.data})
        let pageTotal = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        commit('SET_CONSUMER_PAGE_TOTAL', pageTotal)
        return true
      })
  },
  getMergerOrderDetail({state, commit}, data = {}) {
    return API.MerchantOrder.getMergerOrderDetail(data)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        commit('SET_MERGER_DETAIL', {value: res.data})
        return true
      })
  }
}
