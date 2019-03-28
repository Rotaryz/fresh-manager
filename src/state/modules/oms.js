import API from '@api'
import app from '@src/main'
import {getCurrentTime} from '@utils/tool'
let yesterdayTime = new Date() - (86400 * 1000 * 1)
yesterdayTime = new Date(yesterdayTime)
yesterdayTime = yesterdayTime.toLocaleDateString().replace(/\//g, '-')
let beforeDayTime = new Date() - (86400 * 1000 * 2)
beforeDayTime = new Date(beforeDayTime)
beforeDayTime = beforeDayTime.toLocaleDateString().replace(/\//g, '-')
export const state = {
  orders: [], // OMS订单
  pageTotal: {
    // OMS订单列表页码
    total: 1,
    per_page: 10,
    total_page: 1
  },
  page: 1,
  startTime: beforeDayTime,
  endTime: yesterdayTime,
  status: '',
  keyword: '',
  detail: {}, // OMS订单详情
  isFirst: 1
}

export const getters = {
  orders(state) {
    return state.orders
  },
  pageTotal(state) {
    return state.pageTotal
  },
  page(state) {
    return state.page
  },
  startTime(state) {
    return state.startTime
  },
  endTime(state) {
    return state.endTime
  },
  status(state) {
    return state.status
  },
  keyword(state) {
    return state.keyword
  },
  detail(state) {
    return state.detail
  },
  isFirst(state) {
    return state.isFirst
  }
}

export const mutations = {
  SET_ORDERS(state, orders) {
    state.orders = orders
  },
  SET_PAGE_TOTAL(state, pageTotal) {
    state.pageTotal = pageTotal
  },
  SET_PAGE(state, page) {
    state.page = page
  },
  SET_START_TIME(state, startTime) {
    state.startTime = startTime
  },
  SET_END_TIME(state, endTime) {
    state.endTime = endTime
  },
  SET_STATUS(state, status) {
    state.status = status
  },
  SET_KEYWORD(state, keyword) {
    state.keyword = keyword
  },
  SET_DETAIL(state, detail) {
    state.detail = detail
  },
  SET_IS_FIRST(state, isFirst) {
    state.isFirst = isFirst
  }
}

export const actions = {
  // 获取社区订单列表
  async getOmsOrders({state, commit}) {
    console.log(state)
    let time = await getCurrentTime()
    let yesterdayTime = new Date(time.timestamp - (86400 * 1000 * 1))
    yesterdayTime = yesterdayTime.toLocaleDateString().replace(/\//g, '-')
    let beforeDayTime = new Date(time.timestamp - (86400 * 1000 * 2))
    beforeDayTime = beforeDayTime.toLocaleDateString().replace(/\//g, '-')
    console.log(time.timestamp, yesterdayTime, beforeDayTime)
    const {page, startTime, endTime, status, keyword} = state
    let data = {
      status,
      page,
      start_time: startTime,
      end_time: endTime,
      keyword: keyword,
      is_merge_order: true // 后台需要的标识
    }
    console.log(data)
    return API.Oms.getOmsOrders(data)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data
        let pageTotal = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        commit('SET_ORDERS', arr)
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
  // 获取社区订单详情
  getOmsOrderDetail({commit}, orderId) {
    return API.Oms.getOmsOrderDetail(orderId)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let orderDetail = res.data
        commit('SET_DETAIL', orderDetail)
        return orderDetail
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  setStartTime({commit, dispatch}, startTime) {
    commit('SET_START_TIME', startTime)
    commit('SET_PAGE', 1)
    dispatch('getOmsOrders')
  },
  setEndTime({commit, dispatch}, endTime) {
    commit('SET_END_TIME', endTime)
    commit('SET_PAGE', 1)
    dispatch('getOmsOrders')
  },
  setKeyword({commit, dispatch}, keyword) {
    commit('SET_KEYWORD', keyword)
    commit('SET_PAGE', 1)
    dispatch('getOmsOrders')
  },
  setStatus({commit, dispatch}, selectStatus) {
    console.log(selectStatus)
    commit('SET_STATUS', selectStatus.status)
    commit('SET_PAGE', 1)
    dispatch('getOmsOrders')
  },
  setPage({commit, dispatch}, page) {
    commit('SET_PAGE', page)
    dispatch('getOmsOrders')
  }
}
