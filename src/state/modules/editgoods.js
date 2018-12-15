import API from '@api'
import app from '@src/main'

export const state = {
  msg: {}
}

export const getters = {
  msg(state) {
    return state.msg
  }
}

export const mutations = {
  SET_GOODS_DETAIL(state, detail) {
    state.msg = detail
  }
}

export const actions = {
  getGoodsDetailData({commit}, id) {
    return API.Leader.getGoodsDetail(id)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let goodsDetail = res.data
        commit('SET_GOODS_DETAIL', goodsDetail)
        return goodsDetail
      }).catch(() => {
        return false
      }).finally(() => {
        app.$loading.hide()
      })
  }
}
