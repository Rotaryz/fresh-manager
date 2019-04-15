import API from '@api'
import app from '@src/main'

export const state = {
  groupList: [],
  outreachList: [],
  outreachDetail: {},
  taskDetail: [], // 成员任务详情
  outreachPage: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  taskPage: { // 成员任务详情
    total: 1,
    per_page: 10,
    total_page: 1
  }
}

export const getters = {
  groupList: state => state.groupList,
  outreachPage: state => state.outreachPage,
  taskDetail: state => state.taskDetail,
  taskPage: state => state.taskPage
}

export const mutations = {
  GET_GROUP_LIST(state, list) {
    state.groupList = list || [1]
  },
  UPDATE_LIST(state, obj) {
    state.groupList.push(obj)
  },
  SET_OUTREACH_LIST(state, outreachList) {
    state.outreachList = outreachList
  },
  SET_TASK_DETAIL(state, taskDetail) {
    state.taskDetail = taskDetail
  },
  // SET_OUTREACH_DETAIL(state, outreachDetail) {
  //   state.outreachDetail = outreachDetail
  // },
  SET_OUTREACH_PAGE(state, outreachPage) {
    state.outreachPage = outreachPage
  },
  SET_TASK_PAGE(state, taskPage) {
    state.taskPage = taskPage
  }
}

export const actions = {
  // 获取组织架构
  getGroupList({state, commit, dispatch}, list) {
    return new Promise((resolve, reject) => {
      resolve(true)
      commit('GET_GROUP_LIST', list)
    })
  },
  // 显示添加弹框
  showModal({state, commit}, obj) {
    const {ctx, key} = obj
    ctx && ctx.$refs[key] && ctx.$refs[key].show()
  },
  // 添加子部门
  groupListAddChildren({state, commit}, obj) {
    commit('UPDATE_LIST', obj)
  },
  getOutreachList({state, commit, dispatch}, {page, startTime = '', endTime = '', loading = false}) {
    return API.Outreach.getOutreachList(
      {page: page, start_at: startTime, end_at: endTime, activity_type: 'offline'},
      loading
    )
    .then((res) => {
      if (res.error !== app.$ERR_OK) {
        return false
      }
      let arr = res.data
      let outreachPage = {
        total: res.meta.total,
        per_page: res.meta.per_page,
        total_page: res.meta.last_page
      }
      commit('SET_OUTREACH_LIST', arr)
      commit('SET_OUTREACH_PAGE', outreachPage)
      return true
    })
    .catch(() => {
      return false
    })
    .finally(() => {
      app.$loading.hide()
    })
  },

  getTaskDetail({state, commit, dispatch}, {id, page, loading = true}) {
    commit('SET_TASK_DETAIL', [])
    return API.Outreach.getTaskDetail(
      {page, id},
      loading
    )
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data
        let taskPage = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        commit('SET_TASK_DETAIL', arr)
        commit('SET_TASK_PAGE', taskPage)
        console.log(state.taskDetail)
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
