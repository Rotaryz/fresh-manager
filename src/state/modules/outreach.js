import API from '@api'
import app from '@src/main'

export const state = {
  outreachList: [],
  outreachDetail: {},
  memberList: [],
  memberData: {
    order_counts: 0,
    total_sum: 0,
    repurchase_rate: '0%',
    activity_name: ''
  },
  outreachPage: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  memberPage: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  defaultIndex: 0,
  requestData: {
    page: 1,
    start_at: '',
    end_at: '',
    status: '',
    activity_theme: 'offline'
  }
}

export const getters = {
  outreachList() {
    return state.outreachList
  },
  outreachDetail() {
    return state.outreachDetail
  },
  outreachPage() {
    return state.outreachPage
  },
  memberList() {
    return state.memberList
  },
  memberData() {
    return state.memberData
  },
  memberPage() {
    return state.memberPage
  },
  requestData() {
    return state.requestData
  },
  defaultIndex() {
    return state.defaultIndex
  }
}

export const mutations = {
  SET_OUTREACH_LIST(state, outreachList) {
    state.outreachList = outreachList
  },
  SET_OUTREACH_DETAIL(state, outreachDetail) {
    state.outreachDetail = outreachDetail
  },
  SET_MEMBER_LIST(state, memberList) {
    state.memberList = memberList
  },
  SET_MEMBER_DATA(state, memberData) {
    state.memberData = memberData
  },
  SET_OUTREACH_PAGE(state, outreachPage) {
    state.outreachPage = outreachPage
  },
  SET_MEMBER_PAGE(state, memberPage) {
    state.memberPage = memberPage
  },
  SET_DEFAULT_INDEX(state, index) {
    state.defaultIndex = index
  },
  SET_REQUEST_DATA(state, data) {
    state.requestData = Object.assign({}, state.requestData, data)
  },
  RESET_DATA(state) {
    state.requestData = {
      page: 1,
      startTime: '',
      endTime: '',
      status: '',
      activity_theme: 'offline'
    }
  }
}

export const actions = {
  getOutreachList({state, commit, dispatch}, loading = false) {
    return API.Outreach.getOutreachList(
      state.requestData,
      loading
    )
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data
        let outreachPage = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        commit('SET_OUTREACH_LIST', arr)
        commit('SET_OUTREACH_PAGE', outreachPage)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getOutreachDetail({state, commit, dispatch}, {id, loading = true}) {
    commit('SET_OUTREACH_DETAIL', [])
    return API.Outreach.getOutreachDetail(id, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        commit('SET_OUTREACH_DETAIL', res.data)
        return res.data
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getMemberList({state, commit, dispatch}, {id, page, loading = true}) {
    commit('SET_MEMBER_LIST', [])
    return API.Outreach.getMemberList({page, id}, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data
        let memberPage = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        let data = {
          order_counts: res.order_counts || 0,
          total_sum: res.total_sum || 0,
          repurchase_rate: res.repurchase_rate || '0%',
          activity_name: res.activity_name || ''
        }
        commit('SET_MEMBER_LIST', arr)
        commit('SET_MEMBER_DATA', data)
        commit('SET_MEMBER_PAGE', memberPage)
        return true
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
    commit('SET_DEFAULT_INDEX', 0)
  },
  setRequestData({commit, dispatch}, data) {
    commit('SET_REQUEST_DATA', data)
    dispatch('getOutreachList')
  },
  setDefaultIndex({commit, dispatch}, data) {
    commit('SET_DEFAULT_INDEX', data.index)
    commit('SET_REQUEST_DATA', {status: data.status, page: 1})
    dispatch('getOutreachList')
  }
}
