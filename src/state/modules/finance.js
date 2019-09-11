import API from '@api'
import app from '@src/main'

export const state = {
  settleStatus: [],
  statusTabIndex: 0,
  settleLogs: [],
  settleLogsPageTotal: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  settleLogsPage: 1,
  settleLogsDate: [],
  settleLogsStatus: '',
  settleLogsKeyword: '',
  account: {},
  payList: [],
  payListPageTotal: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  payListPage: 1,
  tabStatus: ''
}

export const getters = {
  settleStatus(state) {
    return state.settleStatus
  },
  statusTabIndex(state) {
    return state.statusTabIndex
  },
  settleLogs(state) {
    return state.settleLogs
  },
  settleLogsPageTotal(state) {
    return state.settleLogsPageTotal
  },
  settleLogsPage(state) {
    return state.settleLogsPage
  },
  settleLogsDate(state) {
    return state.settleLogsDate
  },
  settleLogsStatus(state) {
    return state.settleLogsStatus
  },
  settleLogsKeyword(state) {
    return state.settleLogsKeyword
  },
  account(state) {
    return state.account
  },
  payList(state) {
    return state.payList
  },
  payListPageTotal(state) {
    return state.payListPageTotal
  },
  payListPage(state) {
    return state.payListPage
  },
  tabStatus(state) {
    return state.tabStatus
  }
}

export const mutations = {
  SET_SETTLE_STATUS(state, data) {
    state.settleStatus = data
  },
  SET_SETTLE_LOGS(state, list) {
    state.settleLogs = list
  },
  SET_SETTLE_LOGS_PAGE_TOTAL(state, pageTotal) {
    state.settleLogsPageTotal = pageTotal
  },
  SET_SETTLE_LOGS_PAGE(state, page) {
    state.settleLogsPage = page
  },
  SET_SETTLE_LOGS_DATE(state, date) {
    state.settleLogsDate = date
  },
  SET_SETTLE_LOGS_STATUS(state, status) {
    state.settleLogsStatus = status
    state.statusTabIndex = status !== '' ? parseInt(status) + 1 : 0
  },
  SET_SETTLE_LOGS_KEYWORD(state, keyword) {
    state.settleLogsKeyword = keyword
  },
  SET_ACCOUNT(state, account) {
    state.account = account
  },
  SET_PAY_LIST(state, list) {
    state.payList = list
  },
  SET_PAY_LIST_PAGE_TOTAL(state, pageTotal) {
    state.payListPageTotal = pageTotal
  },
  SET_PAY_LIST_PAGE(state, page) {
    state.payListPage = page
  },
  SET_TAB_STATUS(state, tabStatus) {
    state.tabStatus = tabStatus
  }
}

export const actions = {
  getAccount({commit, dispatch}) {
    return API.Finance.getAccount()
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        commit('SET_ACCOUNT', res.data)
        return dispatch('getPayList')
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getPayList({state, commit}) {
    return API.Finance.getPayList({page: state.payListPage}, true)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let data = res.data
        let pageTotal = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        commit('SET_PAY_LIST', data)
        commit('SET_PAY_LIST_PAGE_TOTAL', pageTotal)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getSettleStatus({state, commit, dispatch}) {
    const {settleLogsDate, settleLogsKeyword, tabStatus} = state
    // source_type：1 自提，2 代表全国包邮
    let data = {
      date: settleLogsDate.join(','),
      keyword: settleLogsKeyword,
      source_type: tabStatus + 1
    }
    return API.Finance.getSettleStatus(data)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data
        let data = arr.map((item) => {
          return {
            name: item.status_str,
            value: item.status,
            num: item.statistic
          }
        })
        commit('SET_SETTLE_STATUS', data)
        return dispatch('getSettleLogs')
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getSettleLogs({state, commit}) {
    const {settleLogsPage, settleLogsDate, settleLogsStatus, settleLogsKeyword, tabStatus} = state
    // source_type：1 自提，2 代表全国包邮
    let data = {
      date: settleLogsDate.join(','),
      keyword: settleLogsKeyword,
      page: settleLogsPage,
      status: settleLogsStatus,
      source_type: tabStatus + 1
    }
    return API.Finance.getSettleLogs(data, true)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let data = res.data
        let pageTotal = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        commit('SET_SETTLE_LOGS', data)
        commit('SET_SETTLE_LOGS_PAGE_TOTAL', pageTotal)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  setSettleDate({commit, dispatch}, date) {
    commit('SET_SETTLE_LOGS_DATE', date)
    commit('SET_SETTLE_LOGS_PAGE', 1)
    dispatch('getSettleStatus')
  },
  setSettleKeyword({commit, dispatch}, keyword) {
    commit('SET_SETTLE_LOGS_KEYWORD', keyword)
    commit('SET_SETTLE_LOGS_PAGE', 1)
    dispatch('getSettleStatus')
  },
  setSettleLogsStatus({commit, dispatch}, {status, isFetch}) {
    commit('SET_SETTLE_LOGS_STATUS', status)
    commit('SET_SETTLE_LOGS_PAGE', 1)
    isFetch && dispatch('getSettleLogs')
  },
  setSettleLogsPage({commit, dispatch}, page) {
    commit('SET_SETTLE_LOGS_PAGE', page)
    dispatch('getSettleLogs')
  },
  setPayListPage({commit, dispatch}, page) {
    commit('SET_PAY_LIST_PAGE', page)
    dispatch('getPayList')
  },
  setTabStatus({commit, dispatch}, tabStatus) {
    commit('SET_TAB_STATUS', tabStatus)
    dispatch('getSettleStatus')
  },
  resetData({commit}) {
    commit('SET_SETTLE_LOGS_PAGE', 1)
    commit('SET_SETTLE_LOGS_KEYWORD', '')
    commit('SET_SETTLE_LOGS_STATUS', '')
    commit('SET_SETTLE_LOGS_DATE', [])
    commit('SET_TAB_STATUS', '')
  }
}
