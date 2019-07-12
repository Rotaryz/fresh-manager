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
  },
  stockFilter: {
    page: 1,
    limit: 10,
    start_time: '',
    end_time: '',
    time: '',
    keyword: ''
  },
  warehouseFilter: {
    page: 1,
    limit: 10,
    warehouse_position_id: '',
    goods_material_category_id: '',
    is_presale: '',
    keyword: ''
  },
  selectData: {
    oneName: '一级类目',
    twoName: '二级类目',
    thrName: '三级类目',
    twoList: [],
    thrList: [],
    storeName: '库区名',
    shelfName: '货架名',
    shelfList: [],
    saleName: '全部'
  },
  warehouseDetailFilter: {
    page: 1,
    limit: 10,
    order_sn: '',
    type: ''
  },
  typeName: '变动类型'
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
  },
  stockFilter(state) {
    return state.stockFilter
  },
  warehouseFilter(state) {
    return state.warehouseFilter
  },
  selectData(state) {
    return state.selectData
  },
  warehouseDetailFilter(state) {
    return state.warehouseDetailFilter
  },
  typeName(state) {
    return state.typeName
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
  },
  SET_STOCK_PARAMS(state, params) {
    state.stockFilter = {...state.stockFilter, ...params}
  },
  SET_WAREHOUSE_PARAMS(state, params) {
    state.warehouseFilter = {...state.warehouseFilter, ...params}
  },
  SET_SELECT_PARAMS(state, params) {
    state.selectData = {...state.selectData, ...params}
  },
  SET_WAREHOUSE_DETAIL_PARAMS(state, params) {
    state.warehouseDetailFilter = {...state.warehouseDetailFilter, ...params}
  },
  SET_TYPE_NAME(state, typeName) {
    state.typeName = typeName
  }
}

export const actions = {
  getWarehouseList({state, commit}, {loading = false}) {
    return API.Store.warehouseStock(state.warehouseFilter, loading)
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
  getWarehouseDetailList({state, commit}, {code, loading = true}) {
    return API.Store.warehouseStockLogs(code, state.warehouseDetailFilter, loading)
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
  getAdjustOrder({state, commit}, {loading = false}) {
    return API.Store.adjustOrder(state.stockFilter, loading)
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
  },
  resetTakingData({commit}) {
    commit('SET_STOCK_PARAMS', {
      page: 1,
      limit: 10,
      start_time: '',
      end_time: '',
      time: '',
      keyword: ''
    })
  },
  resetWarehouseData({commit}) {
    commit('SET_WAREHOUSE_PARAMS', {
      page: 1,
      limit: 10,
      warehouse_position_id: '',
      goods_material_category_id: '',
      is_presale: '',
      keyword: ''
    })
    commit('SET_SELECT_PARAMS', {
      oneName: '一级类目',
      twoName: '二级类目',
      thrName: '三级类目',
      twoList: [],
      thrList: [],
      storeName: '库区名',
      shelfName: '货架名',
      shelfList: [],
      saleName: '全部'
    })
  },
  resetWarehouseDetail({commit}) {
    commit('SET_WAREHOUSE_DETAIL_PARAMS', {
      page: 1,
      limit: 10,
      order_sn: '',
      type: ''
    })
    commit('SET_TYPE_NAME', '变动类型')
  }
}
