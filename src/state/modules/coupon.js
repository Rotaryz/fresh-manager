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
  startTime: '',
  endTime: '',
  status: '',
  page: 1
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
  time(state) {
    return [state.startTime, state.endTime]
  },
  status(state) {
    return state.status
  },
  page(state) {
    return state.page
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
  SET_TIME(state, time) {
    state.startTime = time.startTime
    state.endTime = time.endTime
  },
  SET_STATUS(state, status) {
    state.status = status
  },
  SET_PAGE(stata, page) {
    state.page = page
  }
}

export const actions = {
  getCouponList({commit, state}) {
    const {startTime, endTime, status, page} = state
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
  },
  setTime({commit, dispatch}, time) {
    time = {
      startTime: time[0],
      endTime: time[1]
    }
    commit('SET_TIME', time)
    commit('SET_PAGE', 1)
    dispatch('getCouponList')
  },
  setStatus({commit, dispatch}, selectStatus) {
    commit('SET_STATUS', selectStatus.status)
    commit('SET_PAGE', 1)
    dispatch('getCouponList')
  },
  setPage({commit, dispatch}, page) {
    commit('SET_PAGE', page)
    dispatch('getCouponList')
  }
}
