import API from '@api'
import app from '@src/main'

export const state = {
  sortingTask: {
    pageTotal: {
      // 页码详情
      total: 1,
      per_page: 10,
      total_page: 1
    },
    list: [],
    detail: {},
    filter: {
      goods_category_id:'',
      page: 1,
      limit: 10,
      timeStart: '',
      timeEnd: ''
    }
  },
  sortingConfig: {
    PageTotal: {
      // 页码详情
      total: 1,
      per_page: 10,
      total_page: 1
    },
    list: [],
    detail: {},
    timeStart: '',
    timeEnd: ''
  },
  sortingTaskDetail:{
    pickingDetail:{
      goods_name:"a",
      position_name:'dvb',
      goods_sku_code:'vcb',
      merchant_num:'cvb',
      base_wait_pick_num:'cvb'
    },
    deliveryDetail:{}
  }
}

export const getters = {
  sortingConfig(state) {
    return state.sortingConfig
  },
  sortingTask(state) {
    return state.sortingTask
  },
  sortingTaskDetail(state){
    return state.sortingTaskDetail
  }
}

export const mutations = {
  SET_TASK_DETAIL(state, {type = 'deliveryDetail', value}){
    state.sortingTaskDetail[type] =value
  },
  SET_FILTER(state, {type = 'sortingTask', name = 'goods_category_id', value}) {
    state[type].filter[name] = value
  },
  SET_PAGE(state, {page, type = 'sortingTask'}) {
    state[type].filter.page = page
  },
  SET_STATUS(state, {status, type = 'sortingTask'}) {
    state[type].filter.status = status
  },
  SET_PAGE_TOTAL(state, {pageTotal, type = 'sortingTask'}) {
    state[type].pageTotal = pageTotal
  },
  SET_LIST(state, {list, type = 'sortingTask'}) {
    state[type].list = list
  },
  SET_TIME(state, timeArr, type = 'sortingTask') {
    state[type].filter.timeStart = timeArr[0]
    state[type].filter.timeEnd = timeArr[1]
  },
  SET_KEYWORD(state, {text, type = 'sortingTask'}) {
    state[type].filter.keyword = text
  },
}
// export const

export const actions = {
  // 拣货列表
  getSortingTaskList({state, commit, dispatch},params={}) {
    return API.Sorting.getSortingTaskList({...state.sortingTask.filter,...params},{loading:true})
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
  // 详情
  getSortingTaskDetail({commit}, data) {
    // TODO
    API.Sorting.getSortingPickingDetail(data)
      .then((res) => {

        if (res.error !== app.$ERR_OK) {
          return false
        }
        commit('SET_TASK_DETAIL', {value:res.data,type:'pickingDetail'})
        console.log(state.sortingTaskDetail.pickingDetail,'getSortingPickingDetail11111')
        return true
      })
    return API.Sorting.getSortingDeliveryDetail(data, true)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        commit('SET_TASK_DETAIL', {value:res.data})
        console.log(state.sortingTaskDetail.deliveryDetail,'getSortingPickingDetail11111')

        return res.data
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  // 配置列表
  getSortingConfigList({state, commit, dispatch},params={}){
    return API.Sorting.getAllocationList({...state.sortingTask.filter,...params},{loading:true})
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
        commit('SET_LIST', {list:arr,type:'sortingConfig'})
        commit('SET_PAGE_TOTAL', {pageTotal,type:'sortingConfig'})
        console.log(state.sortingConfig,'states')
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
