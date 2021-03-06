import API from '@api'
import app from '@src/main'

export const state = {
  pageTotal: {
    // 页码详情
    total: 1,
    per_page: 10,
    total_page: 1
  },
  afterSalesList: [],
  afterSalesDetail: {
    data: {
      buyer_name: '',
      order_sn: '',
      created_at: '',
      type_count: '',
      status_str: '',
      details: []
    }
  },
  afterSalesFilter: {
    start_time: '',
    end_time: '',
    keyword: '',
    status: '',
    exception_status: '',
    page: 1,
    limit: 10
  },
  isFirst: true,
  exceptionText: '全部'
}

export const getters = {
  pageTotal(state) {
    return state.pageTotal
  },
  afterSalesList(state) {
    return state.afterSalesList
  },
  afterSalesDetail(state) {
    return state.afterSalesDetail
  },
  afterSalesFilter(state) {
    return state.afterSalesFilter
  },
  isFirst(state) {
    return state.isFirst
  },
  exceptionText(state) {
    return state.exceptionText
  }
}

export const mutations = {
  SET_DETAIL(state, {value}) {
    state.afterSalesDetail.data = value
  },
  SET_PARAMS(state, params) {
    state.afterSalesFilter = {...state.afterSalesFilter, ...params}
  },
  SET_PAGE_TOTAL(state, {pageTotal}) {
    state.pageTotal = pageTotal
  },
  SET_LIST(state, {list}) {
    state.afterSalesList = list
  },
  SET_IS_FIRST(state, isFirst) {
    state.isFirst = isFirst
  },
  SET_EXCEPTION_TEXT(state, exceptionText) {
    state.exceptionText = exceptionText
  }
}

export const actions = {
  // 售后订单列表
  getAfterSalesOrderList({state, commit, dispatch}) {
    return API.AfterSalesOrder.getAfterSalesOrderList(state.afterSalesFilter, {loading: true})
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
  // 详情
  getAfterSalesOrderDetail({state, commit}, {id}) {
    return API.AfterSalesOrder.getAfterSalesOrderDetail({id})
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }

        commit('SET_DETAIL', {value: res.data})
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
      start_time: '',
      end_time: '',
      keyword: '',
      status: '',
      exception_status: '',
      page: 1,
      limit: 10
    })
    commit('SET_IS_FIRST', true)
    commit('SET_EXCEPTION_TEXT', '全部')
  }
}
