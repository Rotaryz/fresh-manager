import API from '@api'
import app from '@src/main'

export const state = {
  list: [],
  pageDetail: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  detail: {},
  page: 1,
  shopId: '',
  startTime: '',
  endTime: '',
  keyword: '',
  status: 'c_shop',
  orderStatus: '',
  defaultIndex: 0
}

export const getters = {
  list(state) {
    return state.list
  },
  pageDetail(state) {
    return state.pageDetail
  },
  shopId(state) {
    return state.shopId
  },
  detail(state) {
    return state.detail
  },
  time(state) {
    return [state.startTime, state.endTime]
  },
  keyword(state) {
    return state.keyword
  },
  status(state) {
    return state.status
  },
  orderStatus(state) {
    return state.orderStatus
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
  defaultIndex(state) {
    return state.defaultIndex
  }
}

export const mutations = {
  SET_ORDER_LIST(state, list) {
    state.list = list
  },
  SET_ORDER_PAGE(state, pageDetail) {
    state.pageDetail = pageDetail
  },
  SET_ORDER_DETAIL(state, detail) {
    state.detail = detail
  },
  SET_SHOP_ID(state, shopId) {
    state.shopId = shopId
  },
  SET_TIME(state, time) {
    state.startTime = time.startTime
    state.endTime = time.endTime
  },
  SET_KEYWORD(state, keyword) {
    state.keyword = keyword
  },
  SET_STATUS(state, status) {
    state.status = status
  },
  SET_PAGE(state, page) {
    state.page = page
  },
  SET_DEFAULT_INDEX(state, index) {
    state.defaultIndex = index
  },
  SET_ORDER_STATUS(state, status) {
    state.orderStatus = status
  },
  RESET_DATA(state) {
    state.page = 1
    state.startTime = ''
    state.endTime = ''
    state.status = 'c_shop'
    state.shopId = ''
    state.keyword = ''
    state.orderStatus = ''
    state.defaultIndex = 0
  }
}

export const actions = {
  getOrderList({commit, state}) {
    let {page, startTime, endTime, status, shopId, keyword, orderStatus} = state
    let data = {
      status: orderStatus,
      page,
      start_time: startTime,
      end_time: endTime,
      shop_id: shopId,
      keyword: keyword,
      source: status
    }
    if (status === 'c_freeShipping') {
      // 全国包邮不传source，source_type=2代表全国包邮
      data.source_type = 2
      delete data.source
    }
    return API.Order.getOrderList(data)
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
        commit('SET_ORDER_PAGE', pageDetail)
        commit('SET_ORDER_LIST', list)
        return list
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getOrderDetail({commit}, id) {
    return API.Order.getOrderDetail(id)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return
        }
        commit('SET_ORDER_DETAIL', res.data)
        return res.data
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  setShopId({commit, dispatch}, shop) {
    let shopId = shop.id
    commit('SET_SHOP_ID', shopId)
    commit('SET_PAGE', 1)
    dispatch('getOrderList')
  },
  setTime({commit, dispatch}, time) {
    time = {
      startTime: time[0],
      endTime: time[1]
    }
    commit('SET_TIME', time)
    commit('SET_PAGE', 1)
    dispatch('getOrderList')
  },
  setKeyword({commit, dispatch}, keyword) {
    commit('SET_KEYWORD', keyword)
    commit('SET_PAGE', 1)
    dispatch('getOrderList')
  },
  setStatus({commit, dispatch}, selectStatus) {
    commit('SET_STATUS', selectStatus.status)
    commit('SET_ORDER_STATUS', '')
    commit('SET_PAGE', 1)
    commit('SET_TIME', ['', ''])
    commit('SET_KEYWORD', '')
    commit('SET_DEFAULT_INDEX', 0)
    commit('SET_SHOP_ID', '')
    dispatch('getOrderList')
  },
  setOrderStatus({commit, dispatch}, selectStatus) {
    commit('SET_ORDER_STATUS', selectStatus)
    commit('SET_PAGE', 1)
    dispatch('getOrderList')
  },
  setPage({commit, dispatch}, page) {
    commit('SET_PAGE', page)
    dispatch('getOrderList')
  },
  resetData({commit}) {
    commit('RESET_DATA')
  },
  setDefaultIndex({commit}, index) {
    commit('SET_DEFAULT_INDEX', index)
  }
}
