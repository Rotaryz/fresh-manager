import {TOOLS} from '@state/mutations-types/outreach-group'

export const state = {
  isShow: true,
  x: 0,
  y: 0,
  isEnter: false
}

export const getters = {}

export const mutations = {
  [TOOLS.SHOW_TOOLS] (state, bool) {
    if (state.isEnter) return
    state.isShow = bool
  },
  [TOOLS.SET_POSITION] (state, position) {
    position.x && (state.x = position.x)
    position.y && (state.y = position.y)
  },
  [TOOLS.UPDATE_IS_ENTER] (state, bool) {
    state.isEnter = bool
  }
}

export const actions = {}
