import API from '@api'
import app from '@src/main'

export const state = {
  pageTotal: {
    // 页码详情
    total: 1,
    per_page: 10,
    total_page: 1
  },
  orderList: [],
  detail: {},
  filter: {
    page: 1,
    limit: 10,
    start_time: '',
    end_time: '',
    type: "",
    status: "",
    keyword: ""
  }
}

export const getters = {
  pageTotal(state) {
    return state.pageTotal
  },
  orderList(state) {
    return state.orderList
  },
  detail(state){
    return state.detail
  },
  filter(state){
    return state.filter
  }
}

export const mutations = {
  SET_TASK_DETAIL(state, {value}){
    state.sortingTaskDetail =value
  },
  SET_REFRESH(state){
    state.filter={
      page: 1,
        limit: 10,
        start_time: '',
        end_time: '',
        type: "",
        status: "",
        keyword: ""
    }
  },
  SET_FILTER(state, { name = 'type', value}) {
    state.filter[name] = value
  },
  SET_PAGE(state, {page}) {
    state.filter.page = page
  },
  SET_STATUS(state, {status}) {
    state.filter.status = status
  },
  SET_PAGE_TOTAL(state, {pageTotal}) {
    state.pageTotal = pageTotal
  },
  SET_LIST(state, {list}) {
    state.orderList = list
  },
  SET_TIME(state, timeArr) {
    state.filter.start_time = timeArr[0]
    state.filter.end_time = timeArr[1]
  },
  SET_KEYWORD(state, {text}) {
    state.filter.keyword = text
  },
}

export const actions = {
  // 商户订单列表
  getMerchantOrderList({state, commit, dispatch},params={}) {
    return API.MerchantOrder.getMerchantOrderList({...state.filter,...params},{loading:true})
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let pageTotal = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        let arr = res.data
        commit('SET_LIST', {list:arr})
        commit('SET_PAGE_TOTAL', {pageTotal})
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  // 商户订单详情
  getMerchantOrderDetail({commit}, data) {
    // TODO
    API.Sorting.getMerchantOrderDetail(data)
      .then((res) => {

        if (res.error !== app.$ERR_OK) {
          return false
        }
        commit('SET_TASK_DETAIL', {value:res.data})
        return true
      })
  }
}
