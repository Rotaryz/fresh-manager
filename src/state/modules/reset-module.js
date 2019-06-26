export const state = {
  resetHooks: []
}

export const getters = {}

export const mutations = {
  ADD_HOOKS(state, hooks) {
    state.resetHooks = state.resetHooks.concat(hooks)
  },
  RESET(state) {
    state.resetHooks = []
  }
}

export const actions = {
  resetHooks({state, commit, dispatch, rootState}) {
    let idx = 0
    state.resetHooks.forEach((item, index) => {
      idx++
      dispatch(item, null, {root: true})
      if (idx >= index) {
        commit('RESET')
      }
    })
  }
}
