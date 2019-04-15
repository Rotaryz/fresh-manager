import API from '@api'
import {CONTENT} from '@state/mutations-types/outreach-group'
import app from '@src/main'
export const state = {
  staffList: [],
  limit: 10,
  currentStaff: {},
  teamData: {},
  pageDetail: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
}

export const getters = {}

export const mutations = {
  [CONTENT.ADD_STAFF] (state, staff) {
    state.staffList.unshift(staff)
    if (state.staffList.length > state.limit) {
      state.staffList.pop()
    }
  },
  [CONTENT.EDIT_STAFF] (state, newStaff) {
    state.currentStaff.name = newStaff.name
  },
  [CONTENT.SET_CURRENT_STAFF] (state, staff) {
    state.currentStaff = staff
  },
  [CONTENT.CLEAR_STAFF_LIST] (state) {
    state.staffList = []
  },
  [CONTENT.REQ_STAFF_LIST] (state, res) {
    state.pageDetail = {
      total: res.meta.total,
      per_page: res.meta.per_page,
      total_page: res.meta.last_page
    }
    state.staffList = res.data || []
    state.teamData = res
  }
}

export const actions = {
  reqStaffList({commit, state, rootState}, args) {
    if (!rootState.oGTab.addPosition.current) return
    const data = {
      ...args,
      id: rootState.oGTab.addPosition.current.id
    }
    return API.OutreachGroup.getStaffList(data).then((res) => {
      if (res.error !== app.$ERR_OK) {
        app.$toast.show(res.message)
        return
      }
      commit(CONTENT.REQ_STAFF_LIST, res)
    }).catch((e) => {
      console.warn(e)
    }).finally(() => {
      app.$loading.hide()
    })
  },
  addStaff({commit, state, rootState}, args) {
    console.log(args)
    const id = args.currentTeam.id
    if (!id) {
      return
    }
    let data = {
      name: rootState.oGModal.name,
      mobile: rootState.oGModal.mobile,
      department_id: id
    }
    return API.OutreachGroup.createStaff(data).then((res) => {
      if (res.error !== app.$ERR_OK) {
        return false
      }
      console.log(res)
      // const staff = {
      //   name: rootState.oGModal.name
      // }
      // commit(CONTENT.ADD_STAFF, staff)
    }).catch((e) => {
      console.warn(e)
    }).finally(() => {
      app.$loading.hide()
    })
  },
  editorStaff({commit, state, rootState}, args) {
    return API.OutreachGroup.addDepartment().then(() => {
      const staff = {
        name: rootState.oGModal.name
      }
      commit(CONTENT.EDIT_STAFF, staff)
    })
  },
}
