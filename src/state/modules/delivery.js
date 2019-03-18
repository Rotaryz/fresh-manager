import API from '@api'
import app from '@src/main'

export const state = {
  tabIndex: 0,
  driverList: [],
  driverPageDetail: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  driverPage: 1,
  roads: []
}

export const getters = {
  tabIndex(state) {
    return state.tabIndex
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
  roads(state) {
    return state.roads
  }
}

export const mutations = {
  SET_TAB_INDEX(state, index) {
    state.tabIndex = index
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
  SET_ROADS(state, roads) {
    state.roads = roads
  }
}

export const actions = {
  setTabIndex({commit, dispatch, state}, index) {
    commit('SET_TAB_INDEX', index)
    if (state.tabIndex === 1) {
      dispatch('getDriverList', false)
    }
  },
  getDriverList({commit, state, dispatch}, loading = true) {
    if (loading) {
      dispatch('getRoads')
    }
    let data = {
      page: state.page
    }
    return API.Delivery.getDriverList(data, loading)
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
  getRoads({commit}, loading) {
    return API.Delivery.getRoads({}, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return
        }
        let list = res.data
        commit('SET_ROADS', list)
        return list
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  setPage({commit, dispatch}, page) {
    commit('SET_DRIVER_PAGE', page)
    dispatch('getDriverList')
  }
}
