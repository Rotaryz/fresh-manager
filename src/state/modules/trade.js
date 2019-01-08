import API from '@api'
import app from '@src/main'

export const state = {
  trades: [],
  pageDetail: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  page: 1,
  type: '',
  startDate: '',
  endDate: '',
  keyword: ''
}

export const getters = {
  trades(state) {
    return state.trades
  },
  pageDetail(state) {
    return state.pageDetail
  },
  page(state) {
    return state.page
  },
  date(state) {
    return [state.startDate, state.endDate]
  },
  keyword(state) {
    return state.keyword
  },
  type(state) {
    return state.type
  }
}

export const mutations = {
  SET_TRADES(state, trades) {
    state.trades = trades
  },
  SET_PAGE_DETAIL(state, pageDetail) {
    state.pageDetail = pageDetail
  },
  SET_TYPE(state, type) {
    state.type = type
  },
  SET_PAGE(state, page) {
    state.page = page
  },
  SET_DATE(state, date) {
    state.startDate = date[0]
    state.endDate = date[1]
  },
  SET_KEYWORD(state, keyword) {
    state.keyword = keyword
  }
}

export const actions = {
  getTradeList({commit, state}) {
    const {type, keyword, page, startDate, endDate} = state
    let data = {
      type,
      keyword,
      page,
      date: startDate && endDate ? `${startDate},${endDate}` : ''
    }
    return API.Trade.getTradeList(data)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return
        }
        let trades = res.data
        let pages = res.meta
        let pageDetail = {
          total: pages.total,
          per_page: pages.per_page,
          total_page: pages.last_page
        }
        commit('SET_TRADES', trades)
        commit('SET_PAGE_DETAIL', pageDetail)
        return trades
      }).catch(() => {
        return false
      }).finally(() => {
        app.$loading.hide()
      })
  },
  setTradeType({commit, dispatch}, select) {
    commit('SET_TYPE', select.id)
    commit('SET_PAGE', 1)
    dispatch('getTradeList')
  },
  setPage({commit, dispatch}, page) {
    commit('SET_PAGE', page)
    dispatch('getTradeList')
  },
  setDate({commit, dispatch}, date) {
    commit('SET_DATE', date)
    commit('SET_PAGE', 1)
    dispatch('getTradeList')
  },
  setKeyword({commit, dispatch}, keyword) {
    commit('SET_KEYWORD', keyword)
    commit('SET_PAGE', 1)
    dispatch('getTradeList')
  }
}
