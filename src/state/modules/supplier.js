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
  keyword: ''
}

export const getters = {
  list(state) {
    return state.list
  },
  pageDetail(state) {
    return state.pageDetail
  },
  detail(state) {
    return state.detail
  },
  keyword(state) {
    return state.keyword
  },
  page(state) {
    return state.page
  }
}

export const mutations = {
  SET_LIST(state, list) {
    state.list = list
  },
  SET_PAGE_DETAIL(state, pageDetail) {
    state.pageDetail = pageDetail
  },
  SET_DETAIL(state, detail) {
    state.detail = detail
  },
  SET_KEYWORD(state, keyword) {
    state.keyword = keyword
  },
  SET_PAGE(state, page) {
    state.page = page
  }
}

export const actions = {
  getSupplier({commit, state}) {
    const {page, keyword} = state
    let data = {
      page,
      keyword,
      limit: 10
    }
    return API.Supply.getSupplier(data)
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
        commit('SET_LIST', list)
        commit('SET_PAGE_DETAIL', pageDetail)
        return list
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getSupplierDetail({commit}, id) {
    return API.Supply.getSupplierDetail(id)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return
        }
        commit('SET_DETAIL', res.data)
        return res.data
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  setKeyword({commit, dispatch}, keyword) {
    commit('SET_KEYWORD', keyword)
    commit('SET_PAGE', 1)
    dispatch('getSupplier')
  },
  setPage({commit, dispatch}, page) {
    commit('SET_PAGE', page)
    dispatch('getSupplier')
  },
  infoSetKeyWord({commit}) {
    commit('SET_KEYWORD', '')
  }
}
