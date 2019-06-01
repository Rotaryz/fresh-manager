import API from '@api'
import app from '@src/main'

export const state = {
  // 分类列表
  categoryList: [],
  saleRankList: [],
  stockRankList: [],
  // sec1
  saleData: {
    xAx: [],
    series: [],
    list: []
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
    series: [],
    list: []
  },
  bigChartData: {}
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
  bigChartData(state) {
    return state.bigChartData
  }
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
  },
  SET_SUPPLY_DATA_GOODS(state, data) {
    state.supplyData.list = data
  },
  SET_BIG_CHART_DATA(state, data) {
    state.bigChartData = data
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
    let {dataSale, index} = msg
    let apiArr = ['getStructure', 'getSaleRank', 'getSellRatio', 'getSellOut']
    let api = apiArr[index]
    let data = JSON.parse(JSON.stringify(dataSale))
    if (index === 0) {
      delete data.group_by
    }
    return API.GoodsData[api](data, false)
      .then((res) => {
        let data = JSON.parse(JSON.stringify(res))
        if (res.error !== app.$ERR_OK) {
          return false
        }
        if (+dataSale.limit === 0) {
          commit('SET_BIG_CHART_DATA', res.data)
          return true
        }
        if (index === 1) {
          commit('SALE_RANK_LIST', res.data)
        } else if (index === 0) {
          data.data.t = res.data.b + res.data.l + res.data.n + res.data.o + res.data.y
        }
        // let arr = ['pv', 'e_customer', 'order']
        // let data = dataHandle(arr, res.data)
        commit('SET_SALE_DATA', res)
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
        // let arr = ['sales_num', 'rate', 'order']
        // let data = dataHandle(arr, res.data, index)
        if (data.limit === 0) {
          commit('SET_BIG_CHART_DATA', res.data)
          return true
        }
        commit('SET_SERVE_DATA', res)
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
        if (+data.limit === 0) {
          commit('SET_BIG_CHART_DATA', res.data)
          return true
        }
        commit('SET_PURCHASE_DATA', res)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getSupplyData({commit}, msg) {
    let {dataSupply, index} = msg
    return API.GoodsData.getStockData(dataSupply, false)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        if (+dataSupply.limit === 0) {
          commit('SET_BIG_CHART_DATA', res.data)
          return true
        }
        if (index === 0) {
          commit('STOCK_RANK_LIST', res.data)
        }
        // let arr = ['pv', 'e_customer', 'order']
        // let data = dataHandle(arr, res.data)
        commit('SET_SUPPLY_DATA', res)
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
