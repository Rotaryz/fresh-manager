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
    member_name: ''
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
}

export const actions = {
  getOutreachList({state, commit, dispatch}, {page, startTime = '', endTime = '', loading = false}) {
    return API.Outreach.getOutreachList(
      {page: page, start_at: startTime, end_at: endTime, activity_type: 'offline'},
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
    return API.Outreach.getMemberList(
      {page, id},
      loading
    )
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
          member_name: res.member_name || ''
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

  }
}
