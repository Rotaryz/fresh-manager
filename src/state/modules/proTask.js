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
  timeEnd: '',
  goBackNumber: 0,
  timeDay: ''
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
  },
  goBackNumber(state) {
    return state.goBackNumber
  },
  timeDay(state) {
    return state.timeDay
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
  },
  SET_Go_Back_Number(state, goBackNumber) {
    state.goBackNumber = goBackNumber
  },
  SET_Time_Day(state, timeDay) {
    state.timeDay = timeDay
  }
}

export const actions = {
  // 采购列表
  async getPurchaseTaskList(
    {state, commit, dispatch},
    {time, startTime, endTime, keyword, status, page, supplyId, exceptionStatus = '', isBlocked = 0, loading = true}
  ) {
    return API.Supply.purchaseTask(
      {
        time,
        start_time: startTime,
        end_time: endTime,
        keyword,
        status,
        page,
        supplier_id: supplyId,
        is_blocked: isBlocked,
        limit: 10,
        exception_status: exceptionStatus
      },
      loading
    )
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
        commit('SET_Time_Day', res.now)
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
  setGoBackNumber({state, commit}, type) {
    commit('SET_Go_Back_Number', type * 1)
  },
  setGoBackNumberSub({state, commit}) {
    commit('SET_Go_Back_Number', state.goBackNumber - 1)
  },
  infoTaskTime({commit, dispatch}, {start, end}) {
    commit('SET_TIME_START', start)
    commit('SET_TIME_END', end)
  }
}
