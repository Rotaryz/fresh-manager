import API from '@api'
import app from '@src/main'

export const state = {
  groupList: [],
  outreachList: [],
  outreachDetail: {},
  outreachPage: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  teamData: {}
}

export const getters = {
  groupList: state => state.groupList,
  outreachPage: state => state.outreachPage,
  outreachList: state => state.outreachList,
  teamData: state => state.teamData
}

export const mutations = {
  GET_GROUP_LIST(state, list) {
    state.groupList = list || []
  },
  // UPDATE_LIST(state, obj) {
  //   state.groupList = obj || []
  // },
  ADD_DEPARTMENT(state, object) {
    // const parentId = res.data.parent_id
    const {res, obj} = object
    const newItem = {
      ...res.data,
      index: -1,
      rotate: false
    }
    if (!state.groupList.length) {
      state.groupList.push(newItem)
    } else {
      let current = obj.current
      current.list.push(newItem)
    }
  },
  DELETE_LIST(state, obj) {
    const {parent, childIndex} = obj
    if (!parent) {
      state.groupList = []
    } else {
      parent.list.splice(childIndex, 1)
    }
  },
  SET_OUTREACH_LIST(state, outreachList) {
    state.outreachList = outreachList
  },
  SET_OUTREACH_PAGE(state, outreachPage) {
    state.outreachPage = outreachPage
  },
  CAHNGE_TAB(state, obj) {
    // todo
    state.groupList.forEach(item => {
      item.index = -1
      item.list && item.list.forEach((item) => {
        item.index = -1
        item.list && item.list.forEach((item) => {
          item.index = -1
        })
      })
    })
    const {item, index} = obj
    item.index = index === item.index ? -1 : index
    item.rotate = !item.rotate
  },
  SET_TEAM_DATA(state, res) {
    state.teamData = res
  }
}

export const actions = {
  // 获取组织架构
  getGroupList({state, commit, dispatch}, {parentId, loading = true}) {
    return API.OutreachGroup.getGroupList({parent_id: parentId}, loading)
    .then((res) => {
      if (res.error !== app.$ERR_OK) {
        return false
      }
      let arr = res.data
      // todo
      arr.map((item) => {
        item.index = -1
        item.rotate = false
        item.list && item.list.map((item) => {
          item.index = -1
          item.rotate = false
          item.list && item.list.map((item) => {
            item.index = -1
            item.rotate = false
          })
        })
      })
      commit('GET_GROUP_LIST', arr)
      return true
    })
    .catch(() => {
      return false
    })
    .finally(() => {
      app.$loading.hide()
    })
  },
  // 显示添加弹框
  showModal({state, commit}, obj) {
    const {ctx, key} = obj
    ctx && ctx.$refs[key] && ctx.$refs[key].show(obj)
  },
  // 添加子部门
  groupListAddChildren({state, commit}, obj) {
    API.OutreachGroup.createDepartment(obj).then((res) => {
      if (res.error !== app.$ERR_OK) {
        return false
      }
      commit('ADD_DEPARTMENT', {res, obj})
    }).catch(() => {
    })
    .finally(() => {
      app.$loading.hide()
    })
  },
  // 删除部门
  deleteDepartment({state, commit}, obj) {
    const {current} = obj
    if (current.list && current.list.length) {
      app.$toast.show('无法删除')
      return
    }
    API.OutreachGroup.deleteDepartment(current).then((res) => {
      if (res.error !== app.$ERR_OK) {
        app.$toast.show(res.message)
        return
      }
      commit('DELETE_LIST', obj)
    }).catch(() => {
    })
    .finally(() => {
      app.$loading.hide()
    })
  },
  // 切换tab
  changeTab({state, commit}, obj) {
    commit('CAHNGE_TAB', obj)
  },
  // 获取成员列表
  getStaffList({state, commit, dispatch}, {id, page, loading = false}) {
    API.OutreachGroup.getStaffList({id, page}).then((res) => {
      if (res.error !== app.$ERR_OK) {
        return false
      }
      let arr = res.data
      let outreachPage = {
        total: res.meta.total,
        per_page: res.meta.per_page,
        total_page: res.meta.last_page
      }
      console.log(res)
      commit('SET_OUTREACH_LIST', arr)
      commit('SET_OUTREACH_PAGE', outreachPage)
      commit('SET_TEAM_DATA', res)
      return true
    }).catch(() => {
      return false
    })
    .finally(() => {
      app.$loading.hide()
    })
  },
  // getOutreachList({state, commit, dispatch}, {page, startTime = '', endTime = '', loading = false}) {
  //   return API.Outreach.getOutreachList(
  //     {page: page, start_at: startTime, end_at: endTime, activity_type: 'offline'},
  //     loading
  //   )
  //   .then((res) => {
  //     if (res.error !== app.$ERR_OK) {
  //       return false
  //     }
  //     let arr = res.data
  //     let outreachPage = {
  //       total: res.meta.total,
  //       per_page: res.meta.per_page,
  //       total_page: res.meta.last_page
  //     }
  //     commit('SET_OUTREACH_LIST', arr)
  //     commit('SET_OUTREACH_PAGE', outreachPage)
  //     return true
  //   })
  //   .catch(() => {
  //     return false
  //   })
  //   .finally(() => {
  //     app.$loading.hide()
  //   })
  // },
}
