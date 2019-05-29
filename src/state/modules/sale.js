import API from '@api'
import app from '@src/main'

export const state = {
  saleDetail: {},
  saleList: [],
  salePage: {
    total: 1,
    per_page: 10,
    total_page: 1
  }
}

export const getters = {
  saleDetail(state) {
    return state.saleDetail
  },
  saleList(state) {
    return state.saleList
  },
  salePage(state) {
    return state.salePage
  }
}

export const mutations = {
  SET_SALE_DETAIL(state, saleDetail) {
    state.saleDetail = saleDetail
  },
  SET_SALE_LIST(state, saleList) {
    state.saleList = saleList
  },
  SET_SALE_PAGE(state, detail) {
    state.salePage = detail
  }
}

export const actions = {
  getSaleDetail({state, commit, dispatch}, {id, loading = true}) {
    commit('SET_SALE_DETAIL', [])
    return API.Sale.saleDetail(id, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        commit('SET_SALE_DETAIL', res.data)
        return res.data
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getSaleList({state, commit, dispatch}, {page, startTime = '', endTime = '', status = '', loading = false}) {
    return API.Sale.getSaleList(
      {page: page, start_at: startTime, end_at: endTime, activity_type: 'fixed', status},
      loading
    )
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data
        let salePage = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        commit('SET_SALE_LIST', arr)
        commit('SET_SALE_PAGE', salePage)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  setSaleList({state, commit, dispatch}, arr) {
    commit('SET_SALE_DETAIL', arr)
  }
}
