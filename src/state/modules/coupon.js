import API from '@api'
import app from '@src/main'

export const state = {
  couponList: [],
  pageDetail: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  couponDetail: {},
  pageTotal: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  infoTabIndex: 0,
  defaultIndex: 0,
  requestData: {
    status: '',
    page: 1,
    created_start_at: '',
    created_end_at: '',
    tag_type: 0,
    keyword: '' // todo
  }
}

export const getters = {
  couponList(state) {
    return state.couponList
  },
  pageDetail(state) {
    return state.pageDetail
  },
  couponDetail(state) {
    return state.couponDetail
  },
  infoTabIndex(state) {
    return state.infoTabIndex
  },
  defaultIndex(state) {
    return state.defaultIndex
  },
  pageTotal(state) {
    return state.pageTotal
  },
  requestData(state) {
    return state.requestData
  }
}

export const mutations = {
  SET_COUPON_LIST(state, couponList) {
    state.couponList = couponList
  },
  SET_COUPON_PAGE(state, pageDetail) {
    state.pageDetail = pageDetail
  },
  SET_COUPON_DETAIL(state, detail) {
    state.couponDetail = detail
  },
  SET_INFO_TAB_INDEX(state, infoTabIndex) {
    state.infoTabIndex = infoTabIndex
  },
  SET_DEFAULT_INDEX(state, defaultIndex) {
    state.defaultIndex = defaultIndex
  },
  SET_PAGE_TOTAL(state, pageTotal) {
    state.pageTotal = pageTotal
  },
  SET_REQUEST_DATA(state, data) {
    state.requestData = Object.assign({}, state.requestData, data)
  },
  RESET_DATA(state) {
    state.requestData = {
      status: '',
      page: 1,
      created_start_at: '',
      created_end_at: '',
      tag_type: 0
    }
    state.infoTabIndex = 0
    state.defaultIndex = 0
  }
}

export const actions = {
  getCouponList({commit, state}, loading) {
    // let tagType = state.requestData.tag_type
    return API.Coupon.getCouponList(state.requestData, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          app.$toast.show(res.message)
          return
        }
        let couponList = res.data
        let pages = res.meta
        let pageDetail = {
          total: pages.total,
          per_page: pages.per_page,
          total_page: pages.last_page
        }
        commit('SET_COUPON_PAGE', pageDetail)
        // if (+tagType === 0) {
        //   commit('SET_COUPON_PAGE', pageDetail)
        // } else {
        //   commit('SET_PAGE_TOTAL', pageDetail)
        // }
        commit('SET_COUPON_LIST', couponList)
        return couponList
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  // 兑换券的方法
  getCouponDetail({commit}, {id, tagType}) {
    return API.Coupon.getCouponDetail({tag_type: tagType}, id)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return
        }
        commit('SET_COUPON_DETAIL', res.data)
        return res.data
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  resetData({commit}) {
    commit('RESET_DATA')
  },
  setRequestData({commit, dispatch}, data) {
    commit('SET_REQUEST_DATA', data)
    dispatch('getCouponList')
  },
  setInfoIndex({commit, dispatch}, index) {
    commit('SET_DEFAULT_INDEX', 0)
    commit('SET_INFO_TAB_INDEX', index)
    commit('SET_REQUEST_DATA', {status: '', page: 1, created_start_at: '', created_end_at: '', tag_type: index, keyword: ''})
  },
  setDefaultIndex({commit, dispatch}, data) {
    commit('SET_DEFAULT_INDEX', data.index)
    commit('SET_REQUEST_DATA', {status: data.status, page: 1})
    dispatch('getCouponList')
  }
}
