import API from '@api'
import app from '@src/main'

export const state = {
  communityList: [], // 社群列表
  qualityData: [], // 群质量
  businessData: [], // 群运营数据
  groupData: [], // 群分组人数
  goodsList: [] // 商品TOP10
}

export const getters = {
  communityList(state) {
    return state.communityList
  },
  qualityData(state) {
    return state.qualityData
  },
  businessData(state) {
    return state.businessData
  },
  groupData(state) {
    return state.groupData
  },
  goodsList(state) {
    return state.goodsList
  }
}

export const mutations = {
  SET_COMMUNITY_LIST(state, list) {
    state.communityList = list
  },
  SET_QUALITY_DATA(state, list) {
    state.qualityData = list
  },
  SET_BUSINESS_DATA(state, list) {
    state.businessData = list
  },
  SET_GROUP_DATA(state, list) {
    state.groupData = list
  },
  SET_GOODS_LIST(state, list) {
    state.goodsList = list
  }
}

export const actions = {
  getCommunityList({commit}, {page, loading = true}) {
    return API.Community.getCommunityList({page}, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data
        commit('SET_COMMUNITY_LIST', arr)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getQualityData({commit}, {startTime, endTime, time, page = 1, loading = false}) {
    return API.Community.getQualityData({start_time: startTime, end_time: endTime, time: time}, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data
        commit('SET_QUALITY_DATA', arr)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getBusinessData({commit}, {startTime, endTime, time, page = 1, loading = false}) {
    return API.Community.getBusinessData({start_time: startTime, end_time: endTime, time: time}, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data
        commit('SET_BUSINESS_DATA', arr)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getGroupData({commit}, {startTime, endTime, time, page = 1, loading = false}) {
    return API.Community.getGroupData({start_time: startTime, end_time: endTime, time: time}, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data
        commit('SET_GROUP_DATA', arr)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getGoodsList({commit}, {startTime, endTime, time, page = 1, loading = false}) {
    return API.Community.getGoodsList({start_time: startTime, end_time: endTime, time: time}, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data

        commit('SET_GOODS_LIST', arr)
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
