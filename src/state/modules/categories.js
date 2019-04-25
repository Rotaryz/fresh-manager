import API from '@api'
import app from '@src/main'

export const state = {
  reqCategoryList: []
}

export const getters = {
  reqCategoryList(state) {
    return state.reqCategoryList
  }
}

export const mutations = {
  SET_CATEGORY_LIST(state, list) {
    state.reqCategoryList = list
  },
  ADD_CHILD_DATA(state, obj) {
    let arr = state.reqCategoryList
    arr.push(obj)
    arr.sort((a, b) => b.sort - a.sort)
    state.reqCategoryList = arr
  }
}

export const actions = {
  getCategoryList({state, commit, dispatch}, number = 0, loading = true) {
    return API.Product.getCategory({parent_id: number, get_goods_count: 1}, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data
        commit('SET_CATEGORY_LIST', arr)
        app.$loading.hide()
        return true
      })
      .catch(() => {
        app.$loading.hide()
        return false
      })
  },
  setCategory({commit}, data) {
    commit('SET_CATEGORY_LIST', data)
  },
  addChild({commit}, obj) {
    commit('ADD_CHILD_DATA', obj)
  }
}
