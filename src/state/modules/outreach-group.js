export const state = {
  groupList: []
}

export const getters = {
  groupList: state => state.groupList
}

export const mutations = {
  GET_GROUP_LIST(state, list) {
    state.groupList = list || []
  },
  UPDATE_LIST(state, obj) {
    state.groupList.push(obj)
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
  }
}
