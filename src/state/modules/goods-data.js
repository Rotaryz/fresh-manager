import API from '@api'
import app from '@src/main'

export const state = {
  // 分类列表
  categoryList: [],
  saleRankList: [],
  stockRankList: [],
  // sec1
  saleData: {
    list: [],
    xAx: [],
    series: []
  },
  // sec2
  serveData: {
    xAx: [],
    series: []
  },
  // sec3
  purchaseData: {
    xAx: [],
    series: []
  },
  // sec4
  supplyData: {
    xAx: [],
    series: []
  }
}

export const getters = {
  categoryList(state) {
    return state.categoryList
  },
  saleRankList(state) {
    return state.saleRankList
  },
  stockRankList(state) {
    return state.stockRankList
  },
  saleData(state) {
    return state.saleData
  },
  serveData(state) {
    return state.serveData
  },
  purchaseData(state) {
    return state.purchaseData
  },
  supplyData(state) {
    return state.supplyData
  },
}

export const mutations = {
  SET_CATEGORY_LIST(state, list) {
    state.categoryList = list
  },
  SALE_RANK_LIST(state, list) {
    state.saleRankList = list
  },
  STOCK_RANK_LIST(state, list) {
    state.stockRankList = list
  },
  SET_SALE_DATA(state, data) {
    state.saleData = data
  },
  SET_SALE_DATA_GOODS(state, data) {
    state.saleData.list = data
  },
  SET_SERVE_DATA(state, data) {
    state.serveData = data
  },
  SET_PURCHASE_DATA(state, data) {
    state.purchaseData = data
  },
  SET_SUPPLY_DATA(state, data) {
    state.supplyData = data
  }
}

export const actions = {
  // 分类列表
  getCategoryList({commit}, data) {
    return API.GoodsData.getCategoryList(data)
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
  // 分类下商品列表
  getGoodsList({state, commit}, data) {
    return API.GoodsData.getGoodsList(data, false)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data
        let categoryArr = state.categoryList.map(item => {
          let val = JSON.parse(JSON.stringify(item))
          if (val.id === data.goods_category_id) {
            val.total = res.meta.total
            val.list = arr
          }
          return val
        })
        commit('SET_CATEGORY_LIST', categoryArr)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getSaleRank({commit}, data, loading = false) {
    return API.GoodsData.getSaleRank(data, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let data = res.data
        commit('SALE_RANK_LIST', data)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getStockRank({commit}, data, loading = false) {
    return API.GoodsData.getStockRank(data, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let data = res.data
        commit('STOCK_RANK_LIST', data)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getSaleData({commit}, msg) {
    let {data, index} = msg
    let apiArr = ['getStructure', 'getSaleRank', 'getSellRatio', 'getSellOut']
    let api = apiArr[index]
    return API.GoodsData[api](data, false)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        if (index === 1) {
          commit('SET_SALE_DATA_GOODS', res.data)
          return true
        }
        let arr = ['pv', 'e_customer', 'order']
        let data = dataHandle(arr, res.data)
        commit('SET_SALE_DATA', data)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getServeData({commit}, data) {
    return API.GoodsData.getAfterServe(data, false)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let data = res.data
        // let arr = ['sales_num', 'rate', 'order']
        // let data = dataHandle(arr, res.data, index)
        commit('SET_SERVE_DATA', data)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getPurchaseData({commit}, data) {
    return API.GoodsData.getGoodsPurchase(data, false)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = ['pv', 'e_customer', 'order']
        let data = dataHandle(arr, res.data)
        commit('SET_PURCHASE_DATA', data)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getSupplyData({commit}, data) {
    let apiArr = ['getStockRank', 'getStockRatio']
    let api = apiArr[data.index]
    return API.GoodsData[api](data, false)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = ['pv', 'e_customer', 'order']
        let data = dataHandle(arr, res.data)
        commit('SET_SUPPLY_DATA', data)
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
  let dataArr = arr.map(item => {
    let time = data[item].data.map(val => {
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
      series: valueArr
    }
  })
  return dataArr
}
