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
      goods_category_id: '',
      page: 1,
      limit: 10,
      start_time: '',
      end_time: '',
      keyword: "",
      status: 0,   // 待分拣
      sorting_mode:0
    }
  },
  sortingConfig: {
    list: [],
    detail: {}
  },
  sortingTaskDetail: {
    pickingDetail: {
      goods_name: "",
      goods_sku_encoding: '',
      position_name: '',
      merchant_num: '',
      wait_allocation_num: '',
      sale_unit: ''
    },
    deliveryDetail: []
  },
  // TODO
  sortingTaskDetailByOrder: {
    filter: {
      goods_category_id: '',
      page: 1,
      limit: 10,
      start_time: '',
      end_time: '',
      keyword: "",
      status: ""   // 待分拣
    },
    pageTotal: {
      // 页码详情
      total: 1,
      per_page: 10,
      total_page: 1
    },
    list: [],
    pickingDetail: {
      goods_name: "",
      goods_sku_encoding: '',
      position_name: '',
      merchant_num: '',
      wait_allocation_num: '',
      sale_unit: ''
    }
  },
  barCodePreviewInfo:{
    goods_name:"自然生长240克 鲜百合",
    standard: "100kg + 10kg",
    code: 12132132132323,
    package_time: "2012-12-22"
  }
}

export const getters = {
  barCodePreviewInfo(){
    return state.barCodePreviewInfo
  },
  sortingConfig(state) {
    return state.sortingConfig
  },
  sortingTask(state) {
    return state.sortingTask
  },
  sortingTaskDetail(state) {
    return state.sortingTaskDetail
  },
  sortingTaskDetailByOrder(state) {
    return state.sortingTaskDetailByOrder
  }
}

export const mutations = {
  SET_PARAMS(state, {type = 'sortingTask', ...params}) {
    console.log(state[type])
    state[type].filter = {...state[type].filter, ...params}
  },
  SET_TASK_DETAIL(state, {type = 'deliveryDetail', value}) {
    state.sortingTaskDetail[type] = value
  },
  SET_PAGE_TOTAL(state, {pageTotal, type = 'sortingTask'}) {
    state[type].pageTotal = pageTotal
  },
  SET_LIST(state, {list, type = 'sortingTask'}) {
    state[type].list = list
  },
  SET_BARCODE_PERVIEW_INFO(state,value){
    state.barCodePreviewInfo= value || {}
  }
}
// export const

export const actions = {
  // 拣货列表 √
  getSortingTaskList({state, commit, dispatch}) {
    return API.Sorting.getSortingTaskList(state.sortingTask.filter)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let pageTotal = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        commit('SET_LIST', {list: res.data})
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
  getBarCodePreviewInfo({state, commit, dispatch},params){
    return true
    // return API.Sorting.getPrintData(params.id)
    //   .then((res) => {
    //     if (res.error !== app.$ERR_OK) {
    //       return false
    //     }
    //     commit('SET_BARCODE_PERVIEW_INFO', res.data)
    //     return true
    //   })
    //   .catch(() => {
    //     return false
    //   })
    //   .finally(() => {
    //     app.$loading.hide()
    //   })
  },
  // 详情
  getSortingTaskDetail({commit}, {id, ...params}) {
    return Promise.all([
      API.Sorting.getSortingDeliveryDetail(id, params),
      API.Sorting.getSortingPickingDetail(id)
    ]).then(res => {
      if (res[0].error !== app.$ERR_OK && res[1].error !== app.$ERR_OK) {
        return false
      }
      commit('SET_TASK_DETAIL', {value: res[0].data})// 配送
      commit('SET_TASK_DETAIL', {value: res[1].data, type: 'pickingDetail'})// 拣货
      return true
    })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  // 按订单分拣详情
  getSortingTaskDetailByOrder({state, commit}) {
    // TODO
    return Promise.all([
      API.Sorting.getSortingPickingDetail(state.sortingTaskDetailByOrder.filter.id),
      API.Sorting.getSortingTaskList(state.sortingTaskDetailByOrder.filter,state.sortingTaskDetailByOrder.filter.id)

    ]).then(res => {
      if (res[0].error !== app.$ERR_OK && res[1].error !== app.$ERR_OK) {
        return false
      }
      console.log(res,9999999999999999)
      let pageTotal = {
        total: res[1].meta.total || 0,
        per_page: res[1].meta.per_page || 1,
        total_page: res[1].meta.last_page || 1
      }
      commit('SET_PAGE_TOTAL', {pageTotal,type:'sortingTaskDetailByOrder'})
      commit('SET_LIST', {list: res[1].data, type: 'sortingTaskDetailByOrder'})
      return true
    })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  // 分页
  getSortingDetailByOrderList({commit},page) {
    API.Sorting.getSortingTaskList({...state.sortingTaskDetailByOrder.filter,page}).then((res) => {
      if (res.error !== app.$ERR_OK) {
        return false
      }
      let pageTotal = {
        total: res.meta.total || 0,
        per_page: res.meta.per_page || 1,
        total_page: res.meta.last_page || 1
      }
      commit('SET_PAGE_TOTAL', {pageTotal,type:'sortingTaskDetailByOrder'})
      commit('SET_LIST', {list: res.data, type: 'sortingTaskDetailByOrder'})
      return true
    }).catch(() => {
      return false
    })
      .finally(() => {
        app.$loading.hide()
      })
  },
  // 配置列表
  getSortingConfigList({state, commit, dispatch}, {loading = true}) {
    return API.Sorting.getAllocationList(state.sortingTask.filter, loading)
      .then((res) => {

        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data
        commit('SET_LIST', {list: arr, type: 'sortingConfig'})
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
