import API from '@api'
import app from '@src/main'

export const state = {
  warehousePageTotal: {
    total: 1,
    per_page: 10,
    total_page: 1
  }, // 库存页码信息
  warehouseList: [], // 库存列表
  warehouseDetailList: [], // 库存详情列表
  detailPageTotal: { // 库存详情页码
    total: 1,
    per_page: 10,
    total_page: 1
  },
  stockPageTotal: { // 库存批次页码
    total: 1,
    per_page: 10,
    total_page: 1
  },
  stockList: []
}

export const getters = {
  warehousePageTotal(state) {
    return state.warehousePageTotal
  },
  warehouseList(state) {
    return state.warehouseList
  },
  warehouseDetailList(state) {
    return state.warehouseDetailList
  },
  detailPageTotal(state) {
    return state.detailPageTotal
  },
  stockPageTotal(state) {
    return state.stockPageTotal
  },
  stockList(state) {
    return state.stockList
  }
}

export const mutations = {
  SET_WAREHOUSE_PAGE_TOTAL(state, warehousePageTotal) {
    state.warehousePageTotal = warehousePageTotal
  },
  SET_WAREHOUSE_LIST(state, warehouseList) {
    state.warehouseList = warehouseList
  },
  SET_WAREHOUSE_DETAIL_LIST(state, warehouseDetailList) {
    state.warehouseDetailList = warehouseDetailList
    console.log(state.warehouseDetailList)
  },
  SET_DETAIL_PAGE_TOTAL(state, detailPageTotal) {
    state.detailPageTotal = detailPageTotal
  },
  SET_STOCK_PAGE_TOTAL(state, stockPageTotal) {
    state.stockPageTotal = stockPageTotal
  },
  SET_STOCK_LIST(state, stockList) {
    state.stockList = stockList
  }
}

export const actions = {
  getWarehouseList({state, commit}, {page, goodsCategoryId, keyword, warehousePositionId, loading = true}) {
    let data = {
      page,
      keyword,
      warehouse_position_id: warehousePositionId,
      goods_category_id: goodsCategoryId
    }
    return API.Store.warehouseStock(data, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data
        let pageTotal = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        commit('SET_WAREHOUSE_LIST', arr)
        commit('SET_WAREHOUSE_PAGE_TOTAL', pageTotal)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getWarehouseDetailList({state, commit}, {code, page, type, orderSn, loading = true}) {
    let data = {
      page,
      order_sn: orderSn,
      type
    }
    return API.Store.warehouseStockLogs(code, data, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data
        let pageTotal = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        commit('SET_WAREHOUSE_DETAIL_LIST', arr)
        commit('SET_DETAIL_PAGE_TOTAL', pageTotal)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getStockList({state, commit}, {code, page = 1, loading = true}) {
    let data = {
      page
    }
    return API.Store.warehouseBatchStock(code, data, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data
        let pageTotal = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        commit('SET_STOCK_LIST', arr)
        commit('SET_STOCK_PAGE_TOTAL', pageTotal)
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
