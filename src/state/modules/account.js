export const state = {
  tabIndex: 0
}

export const getters = {
  tabIndex(state) {
    return state.tabIndex
  }
}

export const mutations = {
  SET_TAB_INDEX(state, index) {
    state.tabIndex = index
  }
}

export const actions = {
  setTabIndex({commit, state}, index) {
    commit('SET_TAB_INDEX', index)
  }
}
