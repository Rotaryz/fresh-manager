import API from '@api'
import app from '@src/main'

export const state = {
  outreachList: [],
  outreachDetail: {},
  outreachPage: {
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
  }
}

export const mutations = {
  SET_OUTREACH_LIST(state, outreachList) {
    state.outreachList = outreachList
  },
  SET_OUTREACH_DETAIL(state, outreachDetail) {
    state.outreachDetail = outreachDetail
  },
  SET_OUTREACH_PAGE(state, outreachPage) {
    state.outreachPage = outreachPage
  }
}

export const actions = {
  getOutreachList({state, commit, dispatch}, {page, startTime = '', endTime = '', loading = false}) {
    return API.Outreach.getOutreachList({page: page, start_at: startTime, end_at: endTime, activity_type: 'offline'}, loading)
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
  }
}
