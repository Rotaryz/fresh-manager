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
    return API.Community.getQualityData(data, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = [['pv', 'uv'], ['customers', 'order', 'transaction']]
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
    return API.Community.getBusinessData(data, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = [['profit'], ['e_customer'], ['e_order_avg'], ['per_order']]
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
    return API.Community.getGroupData(data, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = [['p_customer', 'n_customer', 'e_customer', 's_customer'], ['n_customer']]
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
    return API.Community.getGoodsList(data, loading)
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

const dataHandle = (arr, data) => {
  let titleData = arr.map((item, index) => {
    return arr[index].map(val => {
      return data[val].total
    })
  })
  let dataArr = arr.map(value => {
    let valArr = value.map(item => {
      let x = []
      x = data[item].data.map((val) => {
        return val.at
          .split('-')
          .slice(1)
          .join('/')
      })
      let valueArr = data[item].data.map((val) => {
        if (typeof val.value === 'string') {
          return val.value.replace(',', '')
        } else {
          return val.value || 0
        }
      })
      return {
        x,
        rate: valueArr
      }
    })
    // valArr = [{x, rate}, {x, rate}]
    let rateArr = valArr.map(item => {
      return item.rate
    })
    let xAx = valArr[0].x
    return {
      x: xAx,
      rate: rateArr
    }
  })
  let resultData = {
    titleData,
    data: dataArr
  }
  return resultData
}
