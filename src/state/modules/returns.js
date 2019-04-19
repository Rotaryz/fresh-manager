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
  status: '',
  socialName: '',
  tabIndex: 0
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
  page(state) {
    return state.page
  },
  tabIndex(state) {
    return state.tabIndex
  },
  socialName(state) {
    return state.socialName
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
  SET_SOCIAL_NAME(state, socialName) {
    state.socialName = socialName
  },
  SET_STATUS(state, status) {
    state.status = status
  },
  SET_PAGE(state, page) {
    state.page = page
  },
  SET_TAB_INDEX(state, tabIndex) {
    state.tabIndex = tabIndex
  }
}

export const actions = {
  getReturnsList({commit, state}) {
    const {page, startTime, endTime, status, shopId, keyword} = state
    let data = {
      status,
      page,
      start_time: startTime,
      end_time: endTime,
      shop_id: shopId,
      keyword: keyword
    }
    return API.Order.getReturnsList(data)
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
  getReturnsDetail({commit}, id) {
    return API.Order.getReturnsDetail(id)
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
  setShopId({commit, dispatch}, shop) {
    let shopId = shop.id
    commit('SET_SHOP_ID', shopId)
    commit('SET_PAGE', 1)
    dispatch('getReturnsList')
  },
  setTime({commit, dispatch}, time) {
    time = {
      startTime: time[0],
      endTime: time[1]
    }
    commit('SET_PAGE', 1)
    commit('SET_TIME', time)
    dispatch('getReturnsList')
  },
  setKeyword({commit, dispatch}, value) {
    commit('SET_KEYWORD', value[0])
    commit('SET_SOCIAL_NAME', value[1])
    commit('SET_PAGE', 1)
    dispatch('getReturnsList')
  },
  setStatus({commit, dispatch}, selectStatus) {
    commit('SET_STATUS', selectStatus.status)
    commit('SET_PAGE', 1)
    dispatch('getReturnsList')
  },
  setPage({commit, dispatch}, page) {
    commit('SET_PAGE', page)
    dispatch('getReturnsList')
  },
  infoStatus({commit, dispatch}, status) {
    commit('SET_STATUS', status)
  },
  infoTab({commit, dispatch}, tabIndex) {
    commit('SET_TAB_INDEX', tabIndex)
  }
}
