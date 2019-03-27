import API from '@api'
import app from '@src/main'

export const state = {
  tabIndex: 0,
  orderList: [],
  orderPageDetail: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  orderPage: 1,
  orderStartTime: '',
  orderEndTime: '',
  orderKeyword: '',
  driverList: '',
  driverPageDetail: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  driverPage: 1,
  driverStartTime: '',
  driverEndTime: '',
  orderStatus: ''
}

export const getters = {
  tabIndex(state) {
    return state.tabIndex
  },
  orderList(state) {
    return state.orderList
  },
  orderPageDetail(state) {
    return state.orderPageDetail
  },
  orderPage(state) {
    return state.orderPage
  },
  orderStartTime(state) {
    return state.orderStartTime
  },
  orderEndTime(state) {
    return state.orderEndTime
  },
  orderKeyword(state) {
    return state.orderKeyword
  },
  orderStatus(state) {
    return state.orderStatus
  },
  driverList(state) {
    return state.driverList
  },
  driverPageDetail(state) {
    return state.driverPageDetail
  },
  driverPage(state) {
    return state.driverPage
  },
  driverStartTime(state) {
    return state.driverStartTime
  },
  driverEndTime(state) {
    return state.driverEndTime
  }
}

export const mutations = {
  SET_TAB_INDEX(state, index) {
    state.tabIndex = index
  },
  SET_ORDER_LIST(state, list) {
    state.orderList = list
  },
  SET_ORDER_PAGE_DETAIL(state, pageDetail) {
    state.orderPageDetail = pageDetail
  },
  SET_ORDER_PAGE(state, page) {
    state.orderPage = page
  },
  SET_ORDER_START_TIME(state, time) {
    state.orderStartTime = time
  },
  SET_ORDER_END_TIME(state, time) {
    state.orderEndTime = time
  },
  SET_ORDER_STATUS(state, orderStatus) {
    state.orderStatus = orderStatus
  },
  SET_ORDER_KEYWORD(state, keyword) {
    state.orderKeyword = keyword
  },
  SET_DRIVER_LIST(state, list) {
    state.driverList = list
  },
  SET_DRIVER_PAGE_DETAIL(state, pageDetail) {
    state.driverPageDetail = pageDetail
  },
  SET_DRIVER_PAGE(state, page) {
    state.driverPage = page
  },
  SET_DRIVER_START_TIME(state, time) {
    state.driverStartTime = time
  },
  SET_DRIVER_END_TIME(state, time) {
    state.driverEndTime = time
  }
}


export const actions = {
  setTabIndex({commit, dispatch, state}, index) {
    commit('SET_TAB_INDEX', index)
    if (state.tabIndex === 0) {
      dispatch('getOrderList', false)
    } else if (state.tabIndex === 1) {
      dispatch('getDriverList', false)
    }
  },
  getOrderList({commit, state}, loading = true) {
    const {orderStartTime, orderEndTime, orderKeyword, orderPage, orderStatus} = state
    let data = {
      start_time: orderStartTime,
      end_time: orderEndTime,
      keyword: orderKeyword,
      page: orderPage,
      status: orderStatus
    }
    return API.Delivery.getDeliveryOrder(data, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return
        }
        let list = res.data
        let pages = res.meta
        let pageDetail = {
          total: pages.total,
          per_page: pages.per_page,
          total_page: pages.last_page
        }
        commit('SET_ORDER_LIST', list)
        commit('SET_ORDER_PAGE_DETAIL', pageDetail)
        return list
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  setOrderStartTime({commit, dispatch}, startTime) {
    console.log(startTime)
    commit('SET_ORDER_START_TIME', startTime)
    commit('SET_ORDER_PAGE', 1)
    dispatch('getOrderList')
  },
  setOrderEndTime({commit, dispatch}, endTime) {
    commit('SET_ORDER_END_TIME', endTime)
    commit('SET_ORDER_PAGE', 1)
    dispatch('getOrderList')
  },
  setOrderKeyword({commit, dispatch}, keyword) {
    commit('SET_ORDER_KEYWORD', keyword)
    commit('SET_ORDER_PAGE', 1)
    dispatch('getOrderList')
  },
  setOrderPage({commit, dispatch}, page) {
    commit('SET_ORDER_PAGE', page)
    dispatch('getOrderList')
  },
  setOrderStatus({commit, dispatch}, status) {
    commit('SET_ORDER_STATUS', status)
    dispatch('getOrderList')
  },
  getDriverList({commit, state}, loading = true) {
    const {driverStartTime, driverEndTime, driverPage} = state
    let data = {
      start_time: driverStartTime,
      end_time: driverEndTime,
      page: driverPage
    }
    return API.Delivery.getDeliveryDriver(data, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return
        }
        let list = res.data
        let pages = res.meta
        let pageDetail = {
          total: pages.total,
          per_page: pages.per_page,
          total_page: pages.last_page
        }
        commit('SET_DRIVER_LIST', list)
        commit('SET_DRIVER_PAGE_DETAIL', pageDetail)
        return list
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  setDriverStartTime({commit, dispatch}, startTime) {
    console.log(startTime)
    commit('SET_DRIVER_START_TIME', startTime)
    commit('SET_DRIVER_PAGE', 1)
    dispatch('getDriverList')
  },
  setDriverEndTime({commit, dispatch}, endTime) {
    commit('SET_DRIVER_END_TIME', endTime)
    commit('SET_DRIVER_PAGE', 1)
    dispatch('getDriverList')
  },
  setDriverPage({commit, dispatch}, page) {
    commit('SET_DRIVER_PAGE', page)
    dispatch('getDriverList')
  },
}
