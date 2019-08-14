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
  },
  goodsReqData: {
    keyword: '',
    page: 1,
    goods_category_id: '',
    complete_status: '',
    goods_material_category_id: '',
    is_online: '',
    limit: 10,
    goods_type: '',
    platform: 'scm'
  },
  selectDown: {
    oneMaterialTitle: '一级类目',
    twoMaterialTitle: '二级类目',
    thrMaterialTitle: '三级类目',
    oneMaterialList: [],
    twoMaterialList: [],
    thrMaterialList: [],
    completeStatusTitle: '全部',
    typeTitle: '全部'
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
  },
  goodsReqData(state) {
    return state.goodsReqData
  },
  selectDown(state) {
    return state.selectDown
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
  },
  SET_GOODS_REQ_DATA(state, goodsReqData) {
    state.goodsReqData = goodsReqData
  },
  SET_KEYWORD(state, keyword) {
    state.goodsReqData.keyword = keyword
  },
  SET_PAGE(state, page) {
    state.goodsReqData.page = page
  },
  SET_PAGE_SUBTRACT(state) {
    state.goodsReqData.page--
  },
  SET_MATERIAL_CATEGORY(state, id) {
    state.goodsReqData.goods_material_category_id = id
  },
  SET_COMPLETE_STATUS(state, id) {
    state.goodsReqData.complete_status = id
  },
  SET_GOODS_TYPE(state, id) {
    state.goodsReqData.goods_type = id
  },
  SET_SELECT_DOWN(state, data) {
    switch (data.type) {
      case 1:
        state.selectDown.oneMaterialTitle = data.content
        break
      case 2:
        state.selectDown.twoMaterialTitle = data.content
        break
      case 3:
        state.selectDown.thrMaterialTitle = data.content
        break
      case 4:
        state.selectDown.oneMaterialList = data.content
        break
      case 5:
        state.selectDown.twoMaterialList = data.content
        break
      case 6:
        state.selectDown.thrMaterialList = data.content
        break
      case 7:
        state.selectDown.completeStatusTitle = data.content
        break
      case 8:
        state.selectDown.typeTitle = data.content
        break
    }
  },
  SET_SELECT_DOWN_RESET(state, data) {
    state.selectDown = data
  }
}

export const actions = {
  // 商品列表
  getProductList({state, commit}, {loading = true}) {
    return API.Product.getGoodsList(state.goodsReqData, loading)
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
  getScmStoreData({state, commit}, {keyword = '', materialId = '', page = 1, limit, loading = true}) {
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
  },
  setKeyword({commit, dispatch}, keyword) {
    commit('SET_KEYWORD', keyword)
    commit('SET_PAGE', 1)
    dispatch('getProductList', {loading: false})
  },
  setPage({commit, dispatch}, page) {
    commit('SET_PAGE', page)
    dispatch('getProductList', {loading: false})
  },
  setMaterialCategory({commit, dispatch}, id) {
    commit('SET_MATERIAL_CATEGORY', id)
    commit('SET_PAGE', 1)
    dispatch('getProductList', {loading: false})
  },
  setCompleteStatus({commit, dispatch}, id) {
    commit('SET_COMPLETE_STATUS', id)
    commit('SET_PAGE', 1)
    dispatch('getProductList', {loading: false})
  },
  setGoodsType({commit, dispatch}, id) {
    commit('SET_GOODS_TYPE', id)
    commit('SET_PAGE', 1)
    dispatch('getProductList', {loading: false})
  },
  saveSelectDown({commit}, data) {
    commit('SET_SELECT_DOWN', data)
  },
  setPageSubtract({commit}) {
    commit('SET_PAGE_SUBTRACT')
  },
  resetData({commit}) {
    commit('SET_GOODS_REQ_DATA', {
      keyword: '',
      page: 1,
      goods_category_id: '',
      complete_status: '',
      goods_material_category_id: '',
      is_online: '',
      limit: 10,
      platform: 'scm'
    })
    commit('SET_SELECT_DOWN_RESET', {
      oneMaterialTitle: '一级类目',
      twoMaterialTitle: '二级类目',
      thrMaterialTitle: '三级类目',
      oneMaterialList: [],
      twoMaterialList: [],
      thrMaterialList: [],
      completeStatusTitle: '全部'
    })
  }
}
