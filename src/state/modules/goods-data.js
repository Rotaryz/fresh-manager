import API from '@api'
import app from '@src/main'

export const state = {
  // 分类列表
  categoryList: [
    {
      name: '时令水果',
      goods: [
        {
          name: '苹果'
        }
      ]
    },{
      name: '时令水果',
      goods: [
        {
          name: '苹果'
        },{
          name: '苹果'
        }
      ]
    },{
      name: '时令水果',
      goods: [
        {
          name: '苹果'
        },{
          name: '苹果'
        }
      ]
    },{
      name: '时令水果',
      goods: [
        {
          name: '苹果'
        },{
          name: '苹果'
        }
      ]
    },{
      name: '时令水果',
      goods: [
        {
          name: '苹果'
        },{
          name: '苹果'
        }
      ]
    }
  ],
  // sec1
  secData1: {
    titleData: [],
    data: []
  },
  // sec2
  secData2: {
    titleData: [],
    data: []
  },
  // sec3
  secData3: {
    titleData: [],
    data: []
  },
  // sec4
  secData4: {
    titleData: [],
    data: []
  }
}

export const getters = {
  categoryList(state) {
    return state.categoryList
  },
  secData1(state) {
    return state.secData1
  },
  secData2(state) {
    return state.secData2
  },
  secData3(state) {
    return state.secData3
  },
  secData4(state) {
    return state.secData4
  },
}

export const mutations = {
  SET_CATEGORY_LIST(state, data) {
    state.categoryList = data
  },
  SET_SEC_DATA_1(state, data) {
    state.secData1 = data
  },
  SET_SEC_DATA_2(state, data) {
    state.secData2 = data
  },
  SET_SEC_DATA_3(state, data) {
    state.secData3 = data
  },
  SET_SEC_DATA_4(state, data) {
    state.secData4 = data
  }
}

export const actions = {
  getCategoryList({commit}, {page}, loading = false) {
    return API.GoodsData.getCategoryList({page}, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data
        commit('SET_CATEGORY_LIST', arr)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getSecData1({commit}, data, loading = false) {
    let apiArr = ['getStructure', 'getRank', 'getSellRatio', 'getSellOut']
    let api = apiArr[data.index]
    return API.GoodsData[api]({}, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = ['pv', 'e_customer', 'order']
        let data = dataHandle(arr, res.data)
        commit('SET_SEC_DATA_1', data)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getSecData2({commit}, data, loading = false) {
    let apiArr = ['getReturnGoods', 'getReturnRatio']
    let api = apiArr[data.index]
    return API.GoodsData[api]({}, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = ['pv', 'e_customer', 'order']
        let data = dataHandle(arr, res.data)
        commit('SET_SEC_DATA_2', data)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getSecData3({commit}, data, loading = false) {
    let apiArr = ['getMatch', 'getSKU', 'getRate', 'getPurchase']
    let api = apiArr[data.index]
    return API.GoodsData[api]({}, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = ['pv', 'e_customer', 'order']
        let data = dataHandle(arr, res.data)
        commit('SET_SEC_DATA_3', data)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getSecData4({commit}, data, loading = false) {
    let apiArr = ['getStockRank', 'getStockRatio']
    let api = apiArr[data.index]
    return API.GoodsData[api]({}, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = ['pv', 'e_customer', 'order']
        let data = dataHandle(arr, res.data)
        commit('SET_SEC_DATA_4', data)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },


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
      if (typeof(val.value) === 'string') {
        return val.value.replace(',', '')
      } else {
        return val.value || 0
      }
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
