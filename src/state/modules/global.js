export const state = {
  currentTitles: [],
  marginBottom: 0
}

export const getters = {}

export const mutations = {
  SET_CURRENT_TITLES(state, newValue) {
    state.currentTitles = newValue
  },
  SET_MARGIN_BOTTOM(state, newValue) {
    state.marginBottom = newValue
  }
}

export const actions = {}
