import {MODAL} from '@state/mutations-types/outreach-group'

export const state = {
  isShow: false,
  title: '',
  name: '',
  maxLength: 6,
  useType: '',
  modalType: '',
  mobile: '',
  // departmentSelect: {
  //   check: false,
  //   show: false,
  //   content: '选择部门',
  //   type: 'default',
  //   data: []
  // },
  // teamSelect: {
  //   check: false,
  //   show: false,
  //   content: '选择团队',
  //   type: 'default',
  //   data: []
  // },
}

export const getters = {}

export const mutations = {
  [MODAL.SHOW_MODAL](state, args) {
    const {name, title, maxLength, useType, isShow, modalType, mobile} = args
    state.isShow = isShow
    state.name = name
    state.title = title
    state.useType = useType
    state.modalType = modalType
    state.mobile = mobile
    maxLength && (state.maxLength = maxLength)
  },
  [MODAL.SET_NAME](state, name) {
    state.name = name
  },
  [MODAL.SUBMIT](state, args) {
    state.isShow = false
  },
  [MODAL.CANCEL](state) {
    state.isShow = false
  },
  [MODAL.SET_MOBILE] (state, mobile) {
    state.mobile = mobile
  }
}

export const actions = {}
