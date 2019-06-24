import API from '@api'
import app from '@src/main'

export const state = {
  productList: [],
  statePageTotal: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  msg: {}
}

export const getters = {
  productList(state) {
    return state.productList
  },
  msg(state) {
    return state.msg
  }
}

export const mutations = {
  SET_PRODUCT_LIST(state, list) {
    state.productList = list
  },
  SET_GOODS_DETAIL(state, detail) {
    state.msg = detail
  },
  SET_PAGE_TOTAL(state, statePageTotal) {
    state.statePageTotal = statePageTotal
  }
}

export const actions = {
  getGoodsData({state, commit, dispatch}, online) {
    let data = {is_online: online, keyword: '', goods_category_id: '', limit: 10, page: 1, has_stock: '', source: '', complete_status: '', is_presale: '', goods_material_category_id: ''}
    return API.Product.getGoodsList(data, true)
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
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getGoodsDetailData({commit}, {id, showType}) {
    return API.Product.getGoodsDetail(id, {show_type: showType})
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let goodsDetail = res.data
        commit('SET_GOODS_DETAIL', goodsDetail)
        return goodsDetail
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  }
}
