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
  select: false,
  editTaskList: [],
  timeStart: '',
  timeEnd: ''
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
  },
  editTaskList(state) {
    return state.editTaskList
  },
  timeStart(state) {
    return state.timeStart
  },
  timeEnd(state) {
    return state.timeEnd
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
  },
  SET_EDIT_TASK_LIST(state, editTaskList) {
    state.editTaskList = editTaskList
  },
  SET_TIME_START(state, timeStart) {
    state.timeStart = timeStart
  },
  SET_TIME_END(state, timeEnd) {
    state.timeEnd = timeEnd
  }
}

export const actions = {
  // 采购列表
  async getPurchaseTaskList({state, commit, dispatch}, {time, startTime, endTime, keyword, status, page, supplyId, loading = true}) {
    return API.Supply.purchaseTask({time, start_time: startTime ? startTime + ' ' + state.timeStart : '', end_time: endTime ? endTime + ' ' + state.timeEnd : '', keyword, status, page, supplier_id: supplyId, limit: 10}, loading)
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
        commit('SET_SELECT', false)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  selectPurchase({state, commit, dispatch}, data) {
    if (data.status * 1 !== 1 && data.status * 1 !== 2) return
    let arr = JSON.parse(JSON.stringify(state.purchaseTaskList))
    let type = typeof data.type
    let index = data.type
    switch (type) {
      case 'string':
        let select = state.select
        select = !select
        arr = arr.map((item) => {
          item.select = item.status !== 3 ? select : false
          return item
        })
        commit('SET_SELECT', select)
        break
      case 'number':
        if (arr[index].status === 3) return
        if (arr[index].status === 1 || arr[index].status === 2) {
          arr[index].select = arr[index].status !== 3 ? !arr[index].select : false
        }
        let idx = arr.findIndex((item) => !item.select)
        let select2 = idx === -1
        commit('SET_SELECT', select2)
        break
      case 'object':
        // index.forEach((item) => {
        //   arr.forEach((arrItem) => {
        //     if (arrItem.id === item) {
        //       console.log(arrItem)
        //     }
        //   })
        // })
        break
    }
    commit('SET_PURCHASE_TASK_LIST', arr)
  },
  setTaskList({state, commit}, arr) {
    commit('SET_EDIT_TASK_LIST', arr)
  },
  infoTaskTime({commit, dispatch},{start, end}) {
    commit('SET_TIME_START', start)
    commit('SET_TIME_END', end)
  }
}
