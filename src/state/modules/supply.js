import API from '@api'
import app from '@src/main'

export const state = {
  pageTotal: {
    // 页码详情
    total: 1,
    per_page: 10,
    total_page: 1
  },
  purchaseList: [], // 采购列表
  purchaseDetail: {}, // 采购详情
  timeStart: '',
  timeEnd: '',
  page: 1,
  keyword: '',
  status: 1
}

export const getters = {
  purchaseList(state) {
    return state.purchaseList
  },
  purchaseDetail(state) {
    return state.purchaseDetail
  },
  pageTotal(state) {
    return state.pageTotal
  },
  timeStart(state) {
    return state.timeStart
  },
  timeEnd(state) {
    return state.timeEnd
  },
  page(state) {
    return state.page
  },
  keyword(state) {
    return state.keyword
  },
  status(state) {
    return state.status
  }
}

export const mutations = {
  SET_PAGE_TOTAL(state, pageTotal) {
    state.pageTotal = pageTotal
  },
  SET_PURCHASE_LIST(state, list) {
    state.purchaseList = list
  },
  SET_PURCHASE_DETAIL(state, pageTotal) {
    state.purchaseDetail = pageTotal
  },
  SET_TIME_START(state, timeStart) {
    state.timeStart = timeStart
  },
  SET_TIME_END(state, timeEnd) {
    state.timeEnd = timeEnd
  },
  SET_PAGE(state, page) {
    state.page = page
  },
  SET_KEYWORD(state, keyword) {
    state.keyword = keyword
  },
  SET_STATUS(state, status) {
    state.status = status
  }
}

export const actions = {
  // 采购列表
  getPurchaseList({state, commit, dispatch}, {loading = true}) {
    const {time, timeStart, timeEnd, keyword, page, status} = state
    return API.Supply.purchaseOrder(
      {
        time,
        start_time: timeStart,
        end_time: timeEnd,
        keyword,
        page,
        limit: 10,
        status
      },
      loading
    )
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
        commit('SET_PURCHASE_LIST', arr)
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
  getPurchaseDetail({commit}, id) {
    return API.Supply.purchaseDetail(id, true)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let detail = res.data
        commit('SET_PURCHASE_DETAIL', detail)
        return detail
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  infoPurchaseTime({commit, dispatch}, {start, end}) {
    commit('SET_TIME_START', start)
    commit('SET_TIME_END', end)
    commit('SET_PAGE', 1)
    dispatch('getPurchaseList', {loading: false})
  },
  setKeyword({commit, dispatch}, keyword) {
    commit('SET_KEYWORD', keyword)
    commit('SET_PAGE', 1)
    dispatch('getPurchaseList', {loading: false})
  },
  setStatus({commit, dispatch}, status) {
    commit('SET_STATUS', status)
    commit('SET_PAGE', 1)
    dispatch('getPurchaseList', {loading: false})
  },
  setPage({commit, dispatch}, page) {
    commit('SET_PAGE', page)
    dispatch('getPurchaseList', {loading: false})
  },
  resetData({commit}) {
    commit('SET_TIME_START', '')
    commit('SET_TIME_END', '')
    commit('SET_KEYWORD', '')
    commit('SET_STATUS', 1)
    commit('SET_PAGE', 1)
  }
}
