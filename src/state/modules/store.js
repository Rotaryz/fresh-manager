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
  detailPageTotal: {
    // 库存详情页码
    total: 1,
    per_page: 10,
    total_page: 1
  },
  stockPageTotal: {
    // 库存批次页码
    total: 1,
    per_page: 10,
    total_page: 1
  },
  stockList: [],
  adjustOrder: [],
  adjustPageTotal: {
    // 盘点列表页码
    total: 1,
    per_page: 10,
    total_page: 1
  },
  adjustOrderDetail: [],
  adjustDetailPageTotal: {
    // 盘点详情页码
    total: 1,
    per_page: 10,
    total_page: 1
  }
}

export const getters = {
  // 库存管理
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
  },
  //  库存盘点
  adjustOrder(state) {
    return state.adjustOrder
  },
  adjustPageTotal(state) {
    return state.adjustPageTotal
  },
  adjustOrderDetail(state) {
    return state.adjustOrderDetail
  },
  adjustDetailPageTotal(state) {
    return state.adjustDetailPageTotal
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
  },
  SET_DETAIL_PAGE_TOTAL(state, detailPageTotal) {
    state.detailPageTotal = detailPageTotal
  },
  SET_STOCK_PAGE_TOTAL(state, stockPageTotal) {
    state.stockPageTotal = stockPageTotal
  },
  SET_STOCK_LIST(state, stockList) {
    state.stockList = stockList
  },
  // 库存盘点
  SET_ADJUST_ORDER(state, adjustOrder) {
    state.adjustOrder = adjustOrder
  },
  SET_ADJUST_PAGE_TOTAL(state, adjustPageTotal) {
    state.adjustPageTotal = adjustPageTotal
  },
  SET_ADJUST_ORDER_DETAIL(state, adjustOrderDetail) {
    state.adjustOrderDetail = adjustOrderDetail
  },
  SET_ADJUST_DETAIL_PAGE_TOTAL(state, adjustDetailPageTotal) {
    state.adjustDetailPageTotal = adjustDetailPageTotal
  }
}

export const actions = {
  getWarehouseList({state, commit}, {page, goodsCategoryId, isPresale, keyword, warehousePositionId, loading = true}) {
    let data = {
      page,
      keyword,
      warehouse_position_id: warehousePositionId,
      goods_category_id: goodsCategoryId,
      is_presale: isPresale
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
        return res
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getStockList({state, commit}, {code, page = 1, loading = true}) {
    return API.Store.warehouseBatchStock(code, {page}, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data
        commit('SET_STOCK_LIST', arr)
        return res
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getAdjustOrder({state, commit}, {page = 1, startTime, endTime, keyword, loading = true}) {
    let data = {
      page,
      start_time: startTime,
      end_time: endTime,
      keyword
    }
    return API.Store.adjustOrder(data, loading)
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
        commit('SET_ADJUST_PAGE_TOTAL', pageTotal)
        commit('SET_ADJUST_ORDER', arr)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getAdjustOrderDetail({state, commit}, {id, page = 1, loading = true}) {
    return API.Store.adjustOorderDetail(id, {page}, loading)
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
        commit('SET_ADJUST_DETAIL_PAGE_TOTAL', pageTotal)
        commit('SET_ADJUST_ORDER_DETAIL', arr)
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
