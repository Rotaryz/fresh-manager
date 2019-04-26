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
      status: 0   // 待分拣
    }
  },
  sortingConfig: {
    list: [],
    detail: {}
  },
  sortingTaskDetail: {
    pickingDetail: {
      goods_name: "",
      goods_sku_encoding:'',
      position_name: '',
      merchant_num: '',
      wait_allocation_num: '',
      sale_unit:''
    },
    deliveryDetail: []
  }
}

export const getters = {
  sortingConfig(state) {
    return state.sortingConfig
  },
  sortingTask(state) {
    return state.sortingTask
  },
  sortingTaskDetail(state) {
    return state.sortingTaskDetail
  }
}

export const mutations = {
  SET_PARAMS(state, {type = 'sortingTask', ...params}) {
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
        let arr = res.data
        commit('SET_LIST', {list: arr})
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
  getSortingTaskDetail({commit}, {id,...params}) {
    return Promise.all([
      API.Sorting.getSortingDeliveryDetail(id,params),
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
  // 配置列表
  getSortingConfigList({state, commit, dispatch},{loading=true}) {
    return API.Sorting.getAllocationList(state.sortingTask.filter,loading)
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
