import API from '@api'
import app from '@src/main'

export const state = {
  // 今日爆款
  popularList: [],
  popularPage: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  // 新人特惠
  preferenceList: [],
  preferencePage: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  // 拼团返现
  collageList: [],
  collageDetail: {},
  collagePage: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  // 记录活动管理tab栏
  activityTab: 0,
  defaultIndex: 0,
  tabIndex: 0,
  firstIn: true,
  requestData: {
    page: 1,
    status: '',
    start_at: '',
    end_at: '',
    activity_theme: 'fixed'
  }
}

export const getters = {
  popularList: (state) => state.popularList,
  popularPage: (state) => state.popularPage,
  preferenceList: (state) => state.preferenceList,
  preferencePage: (state) => state.preferencePage,
  collageList: (state) => state.collageList,
  collagePage: (state) => state.collagePage,
  collageDetail: (state) => state.collageDetail,
  activityTab: (state) => state.activityTab,
  requestData: (state) => state.requestData,
  defaultIndex: (state) => state.defaultIndex,
  tabIndex: (state) => state.tabIndex,
  firstIn: (state) => state.firstIn
}

export const mutations = {
  SET_POPULAR_LIST(state, list) {
    state.popularList = list
  },
  SET_POPULAR_PAGE(state, page) {
    state.popularPage = page
  },
  SET_PREFERENCE_LIST(state, list) {
    state.preferenceList = list
  },
  SET_PREFERENCE_PAGE(state, page) {
    state.preferencePage = page
  },
  ADD_PREFERENCE_LIST(state, arr) {
    state.preferenceList = state.preferenceList.concat(arr)
  },
  SET_COLLAGE_LIST(state, list) {
    state.collageList = list
  },
  SET_COLLAGE_PAGE(state, page) {
    state.collagePage = page
  },
  SET_COLLAGE_DETAIL(state, data) {
    state.collageDetail = data
  },
  SET_ACTIVITY_TYPE(state, index) {
    state.activityTab = index
  },
  RESET_REQUEST_DATA(state) {
    state.requestData = {
      page: 1,
      status: '',
      start_at: '',
      end_at: '',
      activity_theme: 'fixed'
    }
    state.firstIn = true
  },
  SET_REQUEST_DATA(state, data) {
    state.requestData = Object.assign({}, state.requestData, data)
  },
  SET_DEFAULT_INDEX(state, index) {
    state.defaultIndex = index
  },
  SET_TAB_INDEX(state, index) {
    state.tabIndex = index
  },
  SET_FIRST_IN(state, type) {
    state.firstIn = type
  }
}

export const actions = {
  // 获取今日爆款列表
  getPopularList({commit}, page) {
    return API.Activity.getActiveList({page, limit: 10, activity_theme: 'hot_tag'})
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          app.$toast.show(res.message)
          return
        }
        let list = res.data
        let pages = res.meta
        let pageDetail = {
          total: pages.total,
          per_page: pages.per_page,
          total_page: pages.last_page
        }
        commit('SET_POPULAR_LIST', list)
        commit('SET_POPULAR_PAGE', pageDetail)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  // 获取新人特惠列表
  getPreferenceList({commit}, page) {
    return API.Activity.getPreferenceGoods({page, limit: 10})
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          app.$toast.show(res.message)
          return
        }
        let list = res.data
        let pages = res.meta
        let pageDetail = {
          total: pages.total,
          per_page: pages.per_page,
          total_page: pages.last_page
        }
        commit('SET_PREFERENCE_LIST', list)
        commit('SET_PREFERENCE_PAGE', pageDetail)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  addPreferenceList({commit}, arr) {
    commit('ADD_PREFERENCE_LIST', arr)
  },
  // 获取拼团列表
  getCollageList({commit}, data) {
    let {page, startAt, endAt, status, activityType, loading} = data
    let msg = {
      page,
      limit: 10,
      start_at: startAt,
      end_at: endAt,
      status,
      activity_type: activityType,
      activity_theme: activityType
    }
    return API.Activity.getCollageList(msg, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          app.$toast.show(res.message)
          return
        }
        let list = res.data
        let pages = res.meta
        let pageDetail = {
          total: pages.total,
          per_page: pages.per_page,
          total_page: pages.last_page
        }
        commit('SET_COLLAGE_PAGE', pageDetail)
        commit('SET_COLLAGE_LIST', list)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getCollageDetail({state, commit, dispatch}, id) {
    commit('SET_COLLAGE_DETAIL', {})
    return API.Activity.getCollageDetail(id, true)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        commit('SET_COLLAGE_DETAIL', res.data)
        return res.data
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },

  // 设置活动管理tab栏
  setActivityTab({commit}, index) {
    commit('SET_ACTIVITY_TYPE', index)
  },
  resetData({commit}) {
    commit('RESET_REQUEST_DATA')
    commit('SET_DEFAULT_INDEX', 0)
    commit('SET_TAB_INDEX', 0)
    commit('SET_FIRST_IN', true)
  },
  setRequestData({commit}, data) {
    commit('SET_REQUEST_DATA', data)
  },
  setDefaultIndex({commit}, data) {
    commit('SET_DEFAULT_INDEX', data.index)
    commit('SET_REQUEST_DATA', {status: data.status, page: 1})
  },
  setTabIndex({commit}, index) {
    commit('SET_TAB_INDEX', index)
  },
  setFirstIn({commit}) {
    commit('SET_FIRST_IN', false)
  }
}
