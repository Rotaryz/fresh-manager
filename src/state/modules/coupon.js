import API from '@api'
import app from '@src/main'

export const state = {
  couponList: [],
  pageDetail: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  couponDetail: {}
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
  }
}

export const actions = {
  getCouponList({commit}, msg) {
    let {startTime, endTime, status, page} = msg
    let data = {
      status,
      page,
      limit: 10,
      created_start_at: startTime,
      created_end_at: endTime
    }
    return API.Coupon.getCouponList(data)
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
  getCouponDetail({commit}, id) {
    return API.Coupon.getCouponDetail(id)
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
  }
}
