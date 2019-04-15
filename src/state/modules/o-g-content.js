import API from '@api'
import {CONTENT} from '@state/mutations-types/outreach-group'

export const state = {
  staffList: [],
  limit: 10,
  currentStaff: {}
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
  }
}

export const actions = {
  reqStaffList({commit, state, dispacth}, args) {
    return API.OutreachGroup.addDepartment().then(() => {
      console.log('req staff list')
    })
  },
  addStaff({commit, state, rootState}, args) {
    return API.OutreachGroup.addDepartment().then(() => {
      const staff = {
        name: rootState.oGModal.name
      }
      commit(CONTENT.ADD_STAFF, staff)
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
