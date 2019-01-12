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
  billList: [],
  billType: '',
  billAcceptType: 2,
  billAcceptId: '',
  billPageDetail: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  billPage: 1
}

export const getters = {
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
  }
}

export const mutations = {
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
  }
}

export const actions = {
  // 团长列表
  getLeaderList({state, commit, dispatch}, {page, loading = true}) {
    return API.Leader.getLeaderList({page}, loading)
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
        commit('SET_LEADER_LIST', arr)
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
  getDeliveryOrder({commit}, {page, shopId, loading = true}) {
    return API.Leader.getDeliveryOrder({page, shop_id: shopId}, loading)
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
  getSettlementList({state, commit, dispatch}, {page, keyword, loading = true}) {
    return API.Leader.settlementList({page, keyword}, loading)
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
  getSettlementDetail({state, commit, dispatch}, {page, shopId, orderSn, status, settlementType, loading = true}) {
    return API.Leader.settlementDetail(
      {page, shop_id: shopId, order_sn: orderSn, status, type: settlementType},
      loading
    )
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
    const {withdrawalPage, withdrawalSn, withdrawalType, withdrawalKeyword, withdrawalStatus} = state
    let data = {
      withdraw_sn: withdrawalSn,
      type: withdrawalType,
      keyword: withdrawalKeyword,
      page: withdrawalPage,
      status: withdrawalStatus
    }
    return API.Leader.getWithdrawalList(data)
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
  }
}
