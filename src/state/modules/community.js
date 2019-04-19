import API from '@api'
import app from '@src/main'

export const state = {
  communityList: [], // 社群列表
  qualityData: {
    titleData: [],
    data: []
  }, // 群质量
  businessData: {
    titleData: [],
    data: []
  }, // 群运营数据
  groupData: {
    titleData: [],
    data: []
  }, // 群分组人数
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
  SET_COMMUNITY_LIST(state, data) {
    state.communityList = data
  },
  SET_QUALITY_DATA(state, data) {
    state.qualityData = data
  },
  SET_BUSINESS_DATA(state, data) {
    state.businessData = data
  },
  SET_GROUP_DATA(state, data) {
    state.groupData = data
  },
  SET_GOODS_LIST(state, list) {
    state.goodsList = list
  }
}

export const actions = {
  getCommunityList({commit}, {page}, loading = false) {
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
  getQualityData({commit}, data, loading = false) {
    return API.Community.getQualityData({wx_group_id: data.wx_group_id, day_type: data.day_type}, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = ['pv', 'order', 'e_customer']
        let data = dataHandle(arr, res.data)
        commit('SET_QUALITY_DATA', data)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getBusinessData({commit}, data, loading = false) {
    return API.Community.getBusinessData({wx_group_id: data.wx_group_id, day_type: data.day_type}, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = ['profit', 'e_customer_order', 'per_order', 'e_customer']
        let data = dataHandle(arr, res.data)
        commit('SET_BUSINESS_DATA', data)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getGroupData({commit}, data, loading = false) {
    return API.Community.getGroupData({wx_group_id: data.wx_group_id, day_type: data.day_type}, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = ['p_customer', 'n_customer', 'e_customer', 's_customer']
        let data = dataHandle(arr, res.data)
        commit('SET_GROUP_DATA', data)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getGoodsList({commit}, data, loading = false) {
    return API.Community.getGoodsList({wx_group_id: data.wx_group_id, day_type: data.day_type}, loading)
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

const dataHandle = (arr, data)=> {
  let titleData = arr.map(item => {
    return data[item].total
  })
  let dataArr = arr.map(item => {
    let time = []
    time = data[item].data.map(val => {
      return val.at.split('-').slice(1).join('/')
    })
    let valueArr = data[item].data.map(val => {
      return val.value || 0
    })
    return {
      x: time,
      rate: valueArr
    }
  })
  let resultData = {
    titleData,
    data: dataArr
  }
  return resultData
}
