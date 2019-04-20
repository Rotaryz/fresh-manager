import API from '@api'
import app from '@src/main'

export const state = {
  tabIndex: 0,
  accountList: [],
  pageDetail: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  accountPage: 1,
  permissionsList: [],
  keyword: ''
}

export const getters = {
  tabIndex(state) {
    return state.tabIndex
  },
  accountList(state) {
    return state.accountList
  },
  pageDetail(state) {
    return state.pageDetail
  },
  accountPage(state) {
    return state.accountPage
  },
  permissionsList(state) {
    return state.permissionsList
  },
  keyword(state) {
    return state.keyword
  }
}

export const mutations = {
  SET_TAB_INDEX(state, index) {
    state.tabIndex = index
  },
  SET_ACCOUNT_LIST(state, accountList) {
    state.accountList = accountList
  },
  SET_PAGE_DETAIL(state, pageDetail) {
    state.pageDetail = pageDetail
  },
  SET_ACCOUNT_PAGE(state, accountPage) {
    state.accountPage = accountPage
  },
  SET_PERMISSIONS_LIST(state, permissionsList) {
    state.permissionsList = permissionsList
  },
  SET_KEY_WORD(state, keyword) {
    state.keyword = keyword
  }
}

export const actions = {
  setTabIndex({commit, state}, index) {
    commit('SET_TAB_INDEX', index)
  },
  getAccountList({commit, state}, loading = true) {
    const {keyword} = state
    let data = {
      page: state.accountPage,
      keyword
    }
    return API.Account.getAccountData(data, loading)
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
        commit('SET_ACCOUNT_LIST', list)
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
  getPermissionsList({commit, state}, loading = true) {
    return API.Account.getRolesData('', loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return
        }
        let list = res.data
        commit('SET_PERMISSIONS_LIST', list)
        return list
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  setKeyword({commit, dispatch}, keyword) {
    commit('SET_KEY_WORD', keyword)
    commit('SET_ACCOUNT_PAGE', 1)
    dispatch('getAccountList')
  },
  setAccount({commit, dispatch}, page) {
    commit('SET_ACCOUNT_PAGE', page)
    dispatch('getAccountList')
  }
}
