import API from '@api'
import app from '@src/main'

export const state = {
  customerList: [], // 成员列表
  pageTotal: {
    // 页码详情
    total: 1,
    per_page: 10,
    total_page: 1
  }
}

export const getters = {
  customerList(state) {
    return state.customerList
  },
  pageTotal(state) {
    return state.pageTotal
  }
}

export const mutations = {
  SET_CUSTOMER_LIST(state, list) {
    state.customerList = list
  },
  SET_PAGE_TOTAL(state, pageTotal) {
    state.pageTotal = pageTotal
  }
}

export const actions = {
  getCustomerList({state, commit, dispatch}, {page, startTime, endTime, keyword, sortType, loading = true}) {
    return API.Customer.customerList(
      {page, start_time: startTime, end_time: endTime, keyword: keyword, sort_type: sortType},
      loading
    )
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          commit('SET_CUSTOMER_LIST', [])
          return false
        }
        let arr = res.data
        let pageTotal = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        commit('SET_CUSTOMER_LIST', arr)
        commit('SET_PAGE_TOTAL', pageTotal)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  }
}
