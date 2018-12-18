import API from '@api'
import app from '@src/main'

export const state = {
  leaderList: [], // 团长列表
  pageTotal: {
    // 页码详情
    total: 1,
    per_page: 10,
    total_page: 1
  },
  leaderDetail: {}, // 团长详情
  deliveryOrder: {}, // 配送订单列表
  deliveryDetail: {} // 团长配送订单详情
}

export const getters = {
  leaderList(state) {
    return state.leaderList
  },
  pageTotal(state) {
    return state.pageTotal
  },
  deliveryOrder(state) {
    return state.deliveryOrder
  },
  deliveryDetail(state) {
    return state.deliveryDetail
  }
}

export const mutations = {
  SET_LEADER_LIST(state, list) {
    state.leaderList = list
  },
  SET_PAGE_TOTAL(state, pageTotal) {
    state.pageTotal = pageTotal
  },
  SET_LEADER_DETAIL(state, detail) {
    state.leaderDetail = detail
  },
  SET_DELIVERY_ORDER(state, detail) {
    state.deliveryOrder = detail
  },
  SET_DELIVERY_DETAIL(state, detail) {
    state.deliveryDetail = detail
  }
}

export const actions = {
  // 团长列表
  getLeaderList({state, commit, dispatch}, {page, loading = true}) {
    return API.Leader.getLeaderList({page}, loading)
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
        console.log(pageTotal)
        commit('SET_LEADER_LIST', arr)
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
  // 团长详情
  getLeaderDetail({commit}, id) {
    return API.Leader.getLeaderDetail(id)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let leaderDetail = res.data
        commit('SET_LEADER_DETAIL', leaderDetail)
        return leaderDetail
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  // 配送订单列表
  getDeliveryOrder({commit}, {page, shopId, loading = true}) {
    return API.Leader.getDeliveryOrder({page, shop_id: shopId}, loading)
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
        commit('SET_DELIVERY_ORDER', arr)
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
  // 配送订单详情
  getDeliveryDetail({commit}, id) {
    return API.Leader.deliveryDetail(id)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let detail = res.data
        commit('SET_DELIVERY_DETAIL', detail)
        return detail
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  }
}
