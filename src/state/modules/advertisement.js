import API from '@api'
import app from '@src/main'

export const state = {
  infoBannerList: []
}

export const getters = {
  infoBannerList(state) {
    return state.infoBannerList
  }
}

export const mutations = {
  SET_INFO_LIST(state, list) {
    state.infoBannerList = list
  }
}

export const actions = {
  getInfoBannerList({state, commit, dispatch}) {
    return API.Advertisement.cmsMsg({page_name: 'index'})
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data
        commit('SET_INFO_LIST', arr)
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
