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
      page: 1,
      limit: 10,
      start_time: '',
      end_time: '',
      keyword: '',
      status: 0, // 待分拣
      sorting_mode: 0,
      exception_status:'',
    }
  },
  sortingConfig: {
    list: [],
    detail: {}
  },
  sortingTaskDetail: {
    details: {
      goods_name: '',
      goods_sku_encoding: '',
      position_name: '',
      merchant_num: '',
      wait_allocation_num: '',
      sale_unit: ''
    },
    list: []
  },
  // TODO
  sortingTaskDetailByOrder: {
    filter: {
      page: 1,
      limit: 10
    },
    pageTotal: {
      // 页码详情
      total: 1,
      per_page: 10,
      total_page: 1
    },
    list: [],
    details: {
      merchant_name: '',
      order_sn: '',
      build_time: '',
      status_str: '',
      sale_price: ''
    }
  },
  barCodePreviewInfo: {
    goodsName: '',
    code: ''
  },
  taskData: {
    isTaskFirst: true,
    oneName: '一级类目',
    twoName: '二级类目',
    thrName: '三级类目',
    twoList: [],
    thrList: []
  }
}

export const getters = {
  barCodePreviewInfo() {
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
  },
  taskData(state) {
    return state.taskData
  }
}

export const mutations = {
  SET_PARAMS(state, {type = 'sortingTask', ...params}) {
    state[type].filter = {...state[type].filter, ...params}
  },
  SET_TASK_DETAILS(state, {type = 'sortingTaskDetailByOrder', details}) {
    state[type].details = details
  },
  SET_PAGE_TOTAL(state, {pageTotal, type = 'sortingTask'}) {
    state[type].pageTotal = pageTotal
  },
  SET_LIST(state, {list, type = 'sortingTask'}) {
    state[type].list = list
  },
  SET_BARCODE_PERVIEW_INFO(state, value) {
    state.barCodePreviewInfo.goodsName = value.goods_name || '无定义名'
    state.barCodePreviewInfo.code = value.goods_sku_encoding || ''
  },
  SET_TASK_DATA(state, params) {
    state.taskData = {...state.taskData, ...params}
  }
}
// export const

export const actions = {
  // 拣货列表 √
  getSortingTaskList({state, commit, dispatch}, {loading = false}) {
    commit('SET_LIST', {list: []})
    return API.Sorting.getSortingTaskList(state.sortingTask.filter, loading)
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
  // 条码打印预览
  getBarCodePreviewInfo({state, commit, dispatch}, params) {
    return API.Sorting.getSortingPickingDetail(params.id)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        commit('SET_BARCODE_PERVIEW_INFO', res.data)
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
  getSortingTaskDetail({commit}, {id, ...params}) {
    return Promise.all([API.Sorting.getSortingDeliveryDetail(id, params), API.Sorting.getSortingPickingDetail(id)])
      .then((res) => {
        if (res[0].error !== app.$ERR_OK && res[1].error !== app.$ERR_OK) {
          return false
        }
        commit('SET_LIST', {list: res[0].data, type: 'sortingTaskDetail'}) // 配送
        commit('SET_TASK_DETAILS', {details: res[1].data, type: 'sortingTaskDetail'}) // 拣货
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
  getSortingTaskDetailByOrder({state, commit, dispatch}, params) {
    // TODO
    return Promise.all([API.Sorting.getSortingOrderDetail(params.id), dispatch('getSortingTaskGoodsDetails', params)])
      .then((res) => {
        if (res[0].error !== app.$ERR_OK && res[1].error !== app.$ERR_OK) {
          return false
        }
        // let pageTotal = {
        //   total: res[1].meta.total || 0,
        //   per_page: res[1].meta.per_page || 1,
        //   total_page: res[1].meta.last_page || 1
        // }
        commit('SET_TASK_DETAILS', {details: res[0].data}) // 详情
        // commit('SET_PAGE_TOTAL', {pageTotal,type:'sortingTaskDetailByOrder'})
        // commit('SET_LIST', {list: res[1].data, type: 'sortingTaskDetailByOrder'})
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
  getSortingTaskGoodsDetails({commit}, params) {
    return API.Sorting.getSortingOrderGoodsList(params.order_id, state.sortingTaskDetailByOrder.filter, true)
      .then((res) => {
        let pageTotal = {
          total: res.meta.total || 0,
          per_page: res.meta.per_page || 1,
          total_page: res.meta.last_page || 1
        }
        commit('SET_PAGE_TOTAL', {pageTotal, type: 'sortingTaskDetailByOrder'})
        commit('SET_LIST', {list: res.data, type: 'sortingTaskDetailByOrder'})
        return res
      })
      .catch((err) => {
        return err
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
  },
  resetData({commit}) {
    commit('SET_TASK_DATA', {
      isTaskFirst: true,
      oneName: '一级类目',
      twoName: '二级类目',
      thrName: '三级类目',
      twoList: [],
      thrList: []
    })
  }
}
