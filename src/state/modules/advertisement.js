import API from '@api'
import app from '@src/main'

export const state = {
  infoBannerList: [],
  infoTabIndex: 0
}

export const getters = {
  infoBannerList(state) {
    return state.infoBannerList
  },
  infoTabIndex(state) {
    return state.infoTabIndex
  }
}

export const mutations = {
  SET_INFO_LIST(state, list) {
    state.infoBannerList = list
  },
  SET_INFO_TAB_INDEX(state, infoTabIndex) {
    state.infoTabIndex = infoTabIndex
  }
}

export const actions = {
  checkTab({commit}, index) {
    commit('SET_INFO_TAB_INDEX', index)
  },
  getInfoBannerList({state, commit, dispatch}, obj) {
    let {pageName} = obj
    return API.Advertisement.cmsMsg({page_name: pageName})
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data
        if (pageName === 'index') {
          commit('SET_INFO_LIST', arr)
        }
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
