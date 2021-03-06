import API from '@api'
import app from '@src/main'

export const state = {
  leaderList: [], // 团长列表
  pageTotal: {
    // 页码详情
    total: 1,
    per_page: 10,
    total_page: 1
  },
  leaderListFilter: {
    page: 1,
    limit: 10,
    keyword: '',
    status: 0,
    model_type: 0,
    is_certification: ''
  },
  leaderDetail: {}, // 团长详情
  deliveryOrder: {}, // 配送订单列表
  deliveryDetail: {}, // 团长配送订单详情
  settlementList: {}, // 团长结算列表
  settlementDetail: {}, // 团长结算详情列表
  withdrawalList: [],
  withdrawalPageDetail: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  withdrawalPage: 1,
  withdrawalSn: '',
  withdrawalStatus: '',
  withdrawalType: 2,
  withdrawalKeyword: '',
  startAt: '',
  endAt: '',
  billList: [],
  billType: '',
  billAcceptType: 2,
  billAcceptId: '',
  billPageDetail: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  billPage: 1,
  headFitter: {
    page: 1,
    limit: 10,
    keyword: ''
  },
  headDetailFitter: {
    page: 1,
    shop_id: '',
    order_sn: '',
    status: '',
    type: ''
  },
  deliveryRequest: {
    page: 1,
    shop_id: '',
    start_time: '',
    end_time: ''
  },
  selectContent: {
    deliveryContent: ''
  },
  firstIn: true
}
export const getters = {
  leaderListFilter(state) {
    return state.leaderListFilter
  },
  leaderList(state) {
    return state.leaderList
  },
  pageTotal(state) {
    return state.pageTotal
  },
  deliveryOrder(state) {
    return state.deliveryOrder
  },
  deliveryDetail(state) {
    return state.deliveryDetail
  },
  settlementList(state) {
    return state.settlementList
  },
  settlementDetail(state) {
    return state.settlementDetail
  },
  withdrawalList(state) {
    return state.withdrawalList
  },
  withdrawalPageDetail(state) {
    return state.withdrawalPageDetail
  },
  withdrawalPage(state) {
    return state.withdrawalPage
  },
  withdrawalSn(state) {
    return state.withdrawalSn
  },
  withdrawalType(state) {
    return state.withdrawalType
  },
  withdrawalKeyword(state) {
    return state.withdrawalKeyword
  },
  withdrawalStatus(state) {
    return state.withdrawalStatus
  },
  billList(state) {
    return state.billList
  },
  billType(state) {
    return state.billType
  },
  billAcceptType(state) {
    return state.billAcceptType
  },
  billAcceptId(state) {
    return state.billAcceptId
  },
  billPageDetail(state) {
    return state.billPageDetail
  },
  billPage(state) {
    return state.billPage
  },
  deliveryRequest(state) {
    return state.deliveryRequest
  },
  selectContent(state) {
    return state.selectContent
  },
  firstIn(state) {
    return state.firstIn
  },
  startAt(state) {
    return state.startAt
  },
  endAt(state) {
    return state.endAt
  },
  headFitter(state) {
    return state.headFitter
  },
  headDetailFitter(state) {
    return state.headDetailFitter
  }
}

export const mutations = {
  SET_lEADER_LIST_FILTER(state, params) {
    state.leaderListFilter = Object.assign({}, state.leaderListFilter, params)
  },
  SET_LEADER_LIST(state, list) {
    state.leaderList = list
  },
  SET_PAGE_TOTAL(state, pageTotal) {
    state.pageTotal = pageTotal
  },
  SET_LEADER_DETAIL(state, detail) {
    state.leaderDetail = detail
  },
  SET_DELIVERY_ORDER(state, detail) {
    state.deliveryOrder = detail
  },
  SET_DELIVERY_DETAIL(state, detail) {
    state.deliveryDetail = detail
  },
  SET_SETTLEMENT_LIST(state, list) {
    state.settlementList = list
  },
  SET_SETTLEMENT_DETAIL(state, list) {
    state.settlementDetail = list
  },
  SET_WITHDRAWAL_LIST(state, list) {
    state.withdrawalList = list
  },
  SET_WITHDRAWAL_PAGE_DETAIL(state, pageDetail) {
    state.withdrawalPageDetail = pageDetail
  },
  SET_WITHDRAWAL_PAGE(state, page) {
    state.withdrawalPage = page
  },
  SET_WITHDRAWAL_KEYWORD(state, keyword) {
    state.withdrawalKeyword = keyword
  },
  SET_WITHDRAWAL_TYPE(state, type) {
    state.withdrawalType = type
  },
  SET_WITHDRAWAL_SN(state, withdrawalSn) {
    state.withdrawalSn = withdrawalSn
  },
  SET_WITHDRAWAL_STATUS(state, status) {
    state.withdrawalStatus = status
  },
  SET_BILL_ACCEPT_ID(state, id) {
    state.billAcceptId = id
  },
  SET_BILL_LIST(state, list) {
    state.billList = list
  },
  SET_BILL_PAGE_DETAIL(state, pageDetail) {
    state.billPageDetail = pageDetail
  },
  SET_BILL_PAGE(state, page) {
    state.billPage = page
  },
  SET_BILL_TYPE(state, billType) {
    state.billType = billType
  },
  SET_TIME_AT(state, value) {
    state.startAt = value[0]
    state.endAt = value[1]
  },
  SET_PARAMS(state, params) {
    state.headFitter = {...state.headFitter, ...params}
  },
  SET_DETAIL_PARAMS(state, params) {
    state.headDetailFitter = {...state.headDetailFitter, ...params}
  },
  RESET_DELIVERY_REQUEST(state) {
    state.deliveryRequest = {
      page: 1,
      shop_id: '',
      start_time: '',
      end_time: ''
    }
    state.selectContent.deliveryContent = ''
  },
  SET_DELIVERY_REQUEST(state, data) {
    state.deliveryRequest = Object.assign({}, state.deliveryRequest, data)
  },
  SET_SELECT_CONTENT(state, data) {
    state.selectContent = Object.assign({}, state.selectContent, data)
  },
  RESET_DATA(state) {
    state.leaderListFilter = {
      page: 1,
      limit: 10,
      keyword: '',
      status: 0,
      model_type: 0,
      is_certification:  ''
    }
    state.firstIn = true
  },
  SET_FIRST_IN(state, type) {
    state.firstIn = type
  }
}
export const actions = {
  // 团长分销列表
  getList({state, commit, dispatch}, loading = true) {
    /* eslint-disable */
    let {model_type, ...params} = state.leaderListFilter
    let name = state.leaderListFilter.model_type ? 'getLeaderApplicationList' : 'getLeaderList'
    // console.log(model_type)
    return API.Leader[name](params)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          this.$toast.show(res.message)
          return false
        }
        // console.log(res)
        let pageTotal = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        commit('SET_LEADER_LIST', res.data)
        commit('SET_PAGE_TOTAL', pageTotal)

        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  // 团长详情
  getLeaderDetail({commit}, id) {
    return API.Leader.getLeaderDetail(id)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let leaderDetail = res.data
        commit('SET_LEADER_DETAIL', leaderDetail)
        return leaderDetail
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  // 配送订单列表
  getDeliveryOrder({commit, state}, loading = false) {
    return API.Leader.getDeliveryOrder(state.deliveryRequest, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data.map((item) => {
          item.select = false
          item.url0 = `${process.env.VUE_APP_API}/social-shopping/api/backend/store-delivery-export/`
          item.url1 = `${process.env.VUE_APP_API}/social-shopping/api/backend/user-order-export/`
          return item
        })
        let pageTotal = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }

        commit('SET_DELIVERY_ORDER', arr)
        commit('SET_PAGE_TOTAL', pageTotal)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  // 配送订单详情
  getDeliveryDetail({commit}, id) {
    return API.Leader.deliveryDetail(id)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let detail = res.data
        commit('SET_DELIVERY_DETAIL', detail)
        return detail
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  setDeliveryOrder({commit}, arr) {
    commit('SET_DELIVERY_ORDER', arr)
  },
  //  团长结算列表
  // 团长列表
  getSettlementList({state, commit, dispatch}, {loading = true}) {
    return API.Leader.settlementList(state.headFitter, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data
        let pageTotal = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        commit('SET_SETTLEMENT_LIST', arr)
        commit('SET_PAGE_TOTAL', pageTotal)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  // 团长结算详情列表
  // getSettlementDetail({state, commit, dispatch}, {page, shopId, orderSn, status, settlementType, loading = true}) {
  getSettlementDetail({state, commit, dispatch}, {loading = false}) {
    return API.Leader.settlementDetail(state.headDetailFitter, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data
        let pageTotal = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        commit('SET_SETTLEMENT_DETAIL', arr)
        commit('SET_PAGE_TOTAL', pageTotal)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getWithdrawalList({commit, state}) {
    const {withdrawalPage, withdrawalSn, withdrawalType, withdrawalKeyword, withdrawalStatus, startAt, endAt} = state
    let data = {
      withdraw_sn: withdrawalSn,
      type: withdrawalType,
      keyword: withdrawalKeyword,
      page: withdrawalPage,
      status: withdrawalStatus,
      start_at: startAt,
      end_at: endAt
    }
    return API.Leader.getWithdrawalList(data)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return
        }
        let list = res.data
        let pages = res.meta
        let pageDetail = res.meta && {
          total: pages.total,
          per_page: pages.per_page,
          total_page: pages.last_page
        }
        commit('SET_WITHDRAWAL_LIST', list)
        commit('SET_WITHDRAWAL_PAGE_DETAIL', pageDetail)
        return list
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  setWithdrawalPage({commit, dispatch}, page) {
    commit('SET_WITHDRAWAL_PAGE', page)
    dispatch('getWithdrawalList')
  },
  setWithdrawalType({commit, dispatch}, type) {
    commit('SET_WITHDRAWAL_TYPE', type)
    commit('SET_WITHDRAWAL_PAGE', 1)
    dispatch('getWithdrawalList')
  },
  setWithdrawalSearch({commit, dispatch}, {orderSn, keyword}) {
    commit('SET_WITHDRAWAL_SN', orderSn)
    commit('SET_WITHDRAWAL_KEYWORD', keyword)
    commit('SET_WITHDRAWAL_PAGE', 1)
    dispatch('getWithdrawalList')
  },
  setWithdrawalStatus({commit, dispatch}, withdrawalStatus) {
    commit('SET_WITHDRAWAL_STATUS', withdrawalStatus.id)
    commit('SET_WITHDRAWAL_PAGE', 1)
    dispatch('getWithdrawalList')
  },
  infoStatus({commit}, withdrawalStatus) {
    commit('SET_WITHDRAWAL_STATUS', withdrawalStatus.status * 1)
  },
  setWidthTime({commit, dispatch}, time) {
    commit('SET_TIME_AT', time)
    commit('SET_WITHDRAWAL_PAGE', 1)
    dispatch('getWithdrawalList')
  },
  getBillList({commit, state}, id) {
    let {billPage, billType, billAcceptType, billAcceptId} = state
    if (id) {
      commit('SET_BILL_ACCEPT_ID', id)
      billAcceptId = id
    }
    let data = {
      order_type: billType,
      payee_id: billAcceptId,
      type: billAcceptType,
      page: billPage
    }
    return API.Leader.getShopBill(data)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return
        }
        let list = res.data
        let pages = res.meta
        let pageDetail = {
          total: pages.total,
          per_page: pages.per_page,
          total_page: pages.last_page
        }
        commit('SET_BILL_LIST', list)
        commit('SET_BILL_PAGE_DETAIL', pageDetail)
        return list
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  setBillPage({commit, dispatch}, page) {
    commit('SET_BILL_PAGE', page)
    dispatch('getBillList')
  },
  setBillType({commit, dispatch}, select) {
    commit('SET_BILL_TYPE', select.id)
    commit('SET_BILL_PAGE', 1)
    dispatch('getBillList')
  },
  resetDeliveryRequest({commit}) {
    commit('RESET_DELIVERY_REQUEST')
  },
  setDeliveryRequest({commit, dispatch}, data) {
    commit('SET_DELIVERY_REQUEST', data)
    dispatch('getDeliveryOrder')
  },
  setSelectContent({commit}, data) {
    commit('SET_SELECT_CONTENT', data)
  },
  resetData({commit}) {
    commit('RESET_DATA')
  },
  setFirstIn({commit}) {
    commit('SET_FIRST_IN', false)
  },
  resetWithdrawal({commit}) {
    commit('SET_WITHDRAWAL_PAGE', 1)
    commit('SET_WITHDRAWAL_SN', '')
    commit('SET_WITHDRAWAL_KEYWORD', '')
    commit('SET_WITHDRAWAL_STATUS', '')
    commit('SET_WITHDRAWAL_TYPE', 2)
    commit('SET_TIME_AT', ['', ''])
  },
  resetHeadData({commit}) {
    commit('SET_PARAMS', {
      page: 1,
      limit: 10,
      keyword: ''
    })
  },
  resetHeadDetailData({commit}) {
    commit('SET_DETAIL_PARAMS', {
      page: 1,
      shop_id: '',
      order_sn: '',
      status: '',
      type: ''
    })
  }
}
