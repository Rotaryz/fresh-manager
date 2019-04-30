import API from '@api'
import {TAB} from '@state/mutations-types/outreach-group'
import app from '@src/main'
export const state = {
  groupList: [],
  addPosition: [],
  delPosition: {},
  editPosition: {},
  movePosition: {},
  isLastDepartment: false,
  current: {},
  parentObj: {}
}

export const getters = {}

export const mutations = {
  [TAB.REQ_GROUP_LIST](state, res) {
    state.groupList = initGroupList(res.data || [])
  },
  [TAB.CHANGE_TAB_STATUS](state, args) {
    const {current, isLastDepartment, parentObj} = args
    state.isLastDepartment = isLastDepartment
    state.current = current
    state.parentObj = parentObj
  },
  [TAB.ADD_DEPARTMENT](state, department) {
    state.addPosition.position.unshift(department)
  },
  [TAB.SET_ADD_POSITION](state, addPosition) {
    state.addPosition = addPosition
    state.isLastDepartment = addPosition.isLastDepartment
  },
  [TAB.SET_DEL_POSITION](state, delPosition) {
    state.delPosition = delPosition
  },
  [TAB.SET_EDIT_POSITION](state, editPosition) {
    state.editPosition = editPosition.current
  },
  [TAB.SET_MOVE_POSITION](state, movePosition) {
    state.movePosition = movePosition
  },
  [TAB.DELETE_DEPARTMENT](state) {
    const {parent, index} = state.delPosition
    parent.splice(index, 1)
  },
  [TAB.EDIT_DEPARTMENT](state, name) {
    state.editPosition.name = name
  },
  [TAB.MOVE_DEPARTMENT](state, args) {
    const {moveType} = args
    const {index, current, parent} = state.movePosition
    if (moveType === 'up' && index === 0) {
      app.$toast.show('不能再上移了！')
      return false
    }
    if (moveType === 'down' && index === parent.length - 1) {
      app.$toast.show('不能再下移了！')
      return false
    }
    if (moveType === 'up' && index !== 0) {
      parent.splice(index, 1)
      parent.splice(index - 1, 0, current)
    } else if (moveType === 'down' && index !== parent.length - 1) {
      parent.splice(index, 1)
      parent.splice(index + 1, 0, current)
    }
    closeAll(state.groupList)
  }
}

export const actions = {
  reqGroupList({commit, state, dispacth}, {parentId, loading = true}) {
    return API.OutreachGroup.getGroupList({parent_id: parentId}, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        commit(TAB.REQ_GROUP_LIST, res)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  addDepartment({commit, state, rootState}, args) {
    const data = {
      parent_id: (state.addPosition.current || {}).id || 0,
      name: rootState.oGModal.name
    }
    return API.OutreachGroup.createDepartment(data, true)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          app.$toast.show(res.message)
          return
        }
        const department = {
          ...res.data,
          list: [],
          isChecked: false
        }
        commit(TAB.ADD_DEPARTMENT, department)
        app.$toast.show('操作成功!')
      })
      .catch((e) => {
        console.warn(e)
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  deleteDepartment({commit, state}, args) {
    const {current} = state.delPosition
    if (current.list && current.list.length) {
      app.$toast.show('不能删除')
      return
    }
    return API.OutreachGroup.deleteDepartment({id: current.id}, true)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          app.$toast.show(res.message)
          return
        }
        commit(TAB.DELETE_DEPARTMENT)
        app.$toast.show('操作成功!')
      })
      .catch((e) => {
        console.warn(e)
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  editDepartment({commit, state, rootState}, args) {
    const data = {
      id: state.editPosition.id,
      name: rootState.oGModal.name
    }
    return API.OutreachGroup.editDepartment(data, true)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          app.$toast.show(res.message)
          return
        }
        commit(TAB.EDIT_DEPARTMENT, rootState.oGModal.name)
        app.$toast.show('操作成功!')
      })
      .catch((e) => {
        console.warn(e)
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  moveDepartment({commit, state}, args) {
    const flag = commit(TAB.MOVE_DEPARTMENT, args)
    if (!flag) return
    const list = state.movePosition.parent
    return API.OutreachGroup.moveDepartment({list}, true)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          app.$toast.show(res.message)
          return
        }
        app.$toast.show('操作成功!')
      })
      .catch((e) => {
        console.warn(e)
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  changeTab({commit, state, dispatch, rootState}, args) {
    commit(TAB.CHANGE_TAB_STATUS, args)
    dispatch(`oGContent/setPage`, 1, {root: true})
    // dispatch(`oGContent/reqStaffList`, {}, {root: true})
    // if (state.isLastDepartment) {
    //   dispatch(`oGContent/reqStaffList`, {}, {root: true})
    // } else {
    //   commit(`oGContent/${CONTENT.RESET_PAGE}`, {}, {root: true})
    // }
  }
}

function closeAll(arr) {
  arr.forEach((item) => {
    item.isChecked = false
    if (item.list) {
      return closeAll(item.list)
    }
  })
}

function initGroupList(arr) {
  arr.forEach((item) => {
    item.isChecked = false
    if (item.list) {
      return initGroupList(item.list)
    }
  })
  return arr
}
