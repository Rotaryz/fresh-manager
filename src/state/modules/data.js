import API from '@api'
import app from '@src/main'

export const state = {
  orderDetail: {}, // 交易数据
  leaderDetail: {}, // 团长数据
  shopDetail: {} // 商品数据
}

export const getters = {
  orderDetail(state) {
    return state.orderDetail
  },
  leaderDetail(state) {
    return state.leaderDetail
  },
  shopDetail(state) {
    return state.shopDetail
  }
}

export const mutations = {
  SET_ORDER_DETAIL(state, list) {
    state.orderDetail = list
  },
  SET_LEADER_DETAIL(state, list) {
    state.leaderDetail = list
  },
  SET_SHOP_DETAIL(state, list) {
    state.shopDetail = list
  }
}

export const actions = {
  getOrderDetail({state, commit, dispatch}, {startTime, endTime, time, loading = true}) {
    return API.Data.tradeData({start_time: startTime, end_time: endTime, time: time}, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data
        console.log(arr)
        commit('SET_ORDER_DETAIL', arr)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getLeaderDetail({state, commit, dispatch}, {startTime, endTime, time, loading = false}) {
    return API.Data.managerData({start_time: startTime, end_time: endTime, time: time}, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data
        commit('SET_LEADER_DETAIL', arr)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getShopDetail({state, commit, dispatch}, {startTime, endTime, time, loading = false}) {
    return API.Data.goodsData({start_time: startTime, end_time: endTime, time: time}, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data
        commit('SET_SHOP_DETAIL', arr)
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
