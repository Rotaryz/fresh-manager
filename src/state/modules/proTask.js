import API from '@api'
import app from '@src/main'

export const state = {
  pageTotal: {
    // 页码详情
    total: 1,
    per_page: 10,
    total_page: 1
  },
  purchaseTaskList: [], // 采购任务列表
  select: false
}

export const getters = {
  purchaseTaskList(state) {
    return state.purchaseTaskList
  },
  pageTotal(state) {
    return state.pageTotal
  },
  select(state) {
    return state.select
  }
}

export const mutations = {
  SET_PAGE_TOTAL(state, pageTotal) {
    state.pageTotal = pageTotal
  },
  SET_PURCHASE_TASK_LIST(state, list) {
    state.purchaseTaskList = list
  },
  SET_SELECT(state, select) {
    state.select = select
  }
}

export const actions = {
  // 采购列表
  getPurchaseTaskList({state, commit, dispatch}, {time, startTime, endTime, keyword, status, page, loading = true}) {
    return API.Supply.purchaseTask({time, start_time: startTime, end_time: endTime, keyword, status, page}, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let pageTotal = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        let arr = res.data.map((item) => {
          item.select = false
          return item
        })
        commit('SET_PURCHASE_TASK_LIST', arr)
        commit('SET_PAGE_TOTAL', pageTotal)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  selectPurchase({state, commit, dispatch}, index) {
    let arr = JSON.parse(JSON.stringify(state.purchaseTaskList))
    if (index === 'all') {
      let select = state.select
      select = !select
      arr = arr.map((item) => {
        item.select = select
        return item
      })
      commit('SET_SELECT', select)
    } else {
      arr[index].select = !arr[index].select
      let idx = arr.findIndex((item) => !item.select)
      let select = idx === -1
      commit('SET_SELECT', select)
    }
    commit('SET_PURCHASE_TASK_LIST', arr)
  }
}
