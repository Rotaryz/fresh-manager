import API from '@api'
import app from '@src/main'

export const state = {
  productList: [],
  goodsStoreList: [],
  statePageTotal: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  storePageTotal: {
    total: 1,
    per_page: 10,
    total_page: 1
  }
}

export const getters = {
  productList(state) {
    return state.productList
  },
  goodsStoreList(state) {
    return state.goodsStoreList
  },
  statePageTotal(state) {
    return state.statePageTotal
  },
  storePageTotal(state) {
    return state.storePageTotal
  }
}

export const mutations = {
  SET_PRODUCT_LIST(state, list) {
    state.productList = list
  },
  SET_GOODS_STORE_LIST(state, list) {
    state.goodsStoreList = list
  },
  SET_PAGE_TOTAL(state, statePageTotal) {
    state.statePageTotal = statePageTotal
  },
  SET_STORE_PAGE_TOTAL(state, statePageTotal) {
    state.storePageTotal = statePageTotal
  }
}

export const actions = {
  // 商品列表
  getProductList({state, commit}, {keyword = '', page = 1, categoryId = '', materialId = '', completeStatus = '', isOnline = '', limit = 10, loading = true}) {
    return API.Product.getGoodsList({
      keyword,
      page,
      goods_category_id: categoryId,
      complete_status: completeStatus,
      goods_material_category_id: materialId,
      is_online: isOnline,
      limit
    }, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data
        let statePageTotal = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        commit('SET_PRODUCT_LIST', arr)
        commit('SET_PAGE_TOTAL', statePageTotal)
        app.$loading.hide()
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  // 获取商品详情
  getGoodsDetailData({commit}, {id, showType}) {
    return API.Product.getGoodsDetail(id, {show_type: showType})
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let goodsDetail = res.data
        return goodsDetail
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  // 获取商品素材中心
  getScmStoreData({state, commit}, {keyword = '', materialId = '', page = 1, limit = 21, loading = true}) {
    return API.Product.getScmStoreList({
      keyword,
      goods_material_category_id: materialId,
      page,
      limit
    }, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data
        let statePageTotal = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        commit('SET_GOODS_STORE_LIST', arr)
        commit('SET_STORE_PAGE_TOTAL', statePageTotal)
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
