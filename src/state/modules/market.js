import API from '@api'
import app from '@src/main'

export const state = {
  marketList: [],
  pageDetail: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  marketDetail : {}
}

export const getters = {
  marketList(state) {
    return state.marketList
  },
  pageDetail(state) {
    return state.pageDetail
  },
  marketDetail (state) {
    return state.marketDetail
  }
}

export const mutations = {
  SET_MARKET_LIST(state, marketList) {
    state.marketList = marketList
  },
  SET_MARKET_PAGE(state, pageDetail) {
    state.pageDetail = pageDetail
  },
  SET_MARKET_DETAIL(state, detail) {
    state.marketDetail  = detail
  }
}

export const actions = {
  getMarketList({commit, state}, data) {
    return API.Market.getMarketList(data)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          app.$toast.show(res.message)
          return
        }
        let marketList = res.data
        let pages = res.meta
        let pageDetail = {
          total: pages.total,
          per_page: pages.per_page,
          total_page: pages.last_page
        }
        commit('SET_MARKET_PAGE', pageDetail)
        commit('SET_MARKET_LIST', marketList)
        return marketList
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getMarketDetail({commit}, id) {
    return API.Market.getMarketDetail(id)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          app.$toast.show(res.message)
          return
        }
        commit('SET_MARKET_DETAIL', res.data)
        return res.data
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  }
}
