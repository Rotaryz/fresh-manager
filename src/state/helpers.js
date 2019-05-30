import {mapState, mapGetters, mapActions, mapMutations} from 'vuex'
import {MODAL, TAB, TOOLS, CONTENT} from './mutations-types/outreach-group'

export const authComputed = {
  ...mapState('auth', {
    currentUser: (state) => state.currentUser
  }),
  ...mapGetters('auth', ['loggedIn'])
}

export const authMethods = mapActions('auth', ['logIn', 'logOut'])

export const globalComputed = {
  ...mapState('global', {
    currentTitles: (state) => state.currentTitles,
    marginBottom: (state) => state.marginBottom
  })
}
export const globalMethods = {
  ...mapMutations('global', ['SET_CURRENT_TITLES'])
}

// 团长
export const leaderComputed = {
  ...mapGetters('leader', [
    'leaderList',
    'pageTotal',
    'leaderDetail',
    'deliveryOrder',
    'settlementList',
    'settlementDetail',
    'withdrawalList',
    'withdrawalPageDetail',
    'withdrawalPage',
    'withdrawalSn',
    'withdrawalType',
    'withdrawalKeyword',
    'withdrawalStatus',
    'billList',
    'billType',
    'billAcceptType',
    'billAcceptId',
    'billPageDetail',
    'billPage',
    'startAt',
    'endAt'
  ])
}

export const leaderMethods = mapActions('leader', [
  'getLeaderList',
  'getDeliveryOrder',
  'getDeliveryDetail',
  'setDeliveryOrder',
  'getSettlementList',
  'getSettlementDetail',
  'getWithdrawalList',
  'setWithdrawalPage',
  'setWithdrawalType',
  'setWithdrawalStatus',
  'setWithdrawalSearch',
  'setBillPage',
  'setBillType',
  'setWidthTime',
  'infoStatus'
])

// 今日采购
export const rushComputed = {
  ...mapGetters('rush', ['rushList', 'rushPage', 'rushDetail'])
}

export const rushMethods = mapActions('rush', ['getRushList', 'getRushDetail', 'setRushList'])

// 限时抢购
export const saleComputed = {
  ...mapGetters('sale', ['saleList', 'salePage', 'saleDetail'])
}

export const saleMethods = mapActions('sale', ['getSaleList', 'getSaleDetail', 'setSaleList'])

// 活动管理
export const activityComputed = {
  ...mapGetters('activity', ['popularList', 'preferenceList', 'collageList', 'collageDetail', 'popularPage', 'preferencePage', 'collagePage', 'activityTab'])
}

export const activityMethods = mapActions('activity', ['getPopularList', 'getPreferenceList', 'getCollageList', 'getCollageDetail', 'addPreferenceList', 'setActivityTab'])

// 拓展活动
export const outreachComputed = {
  ...mapGetters('outreach', [
    'outreachList',
    'outreachPage',
    'outreachDetail',
    'memberList',
    'memberData',
    'memberPage'
  ])
}

export const outreachMethods = mapActions('outreach', ['getOutreachList', 'getOutreachDetail', 'getMemberList'])

// 优惠券
export const couponComputed = {
  ...mapGetters('coupon', ['couponList', 'pageDetail', 'couponDetail'])
}

export const couponMethods = mapActions('coupon', ['getCouponList', 'getCouponDetail'])

// 营销计划
export const marketComputed = {
  ...mapGetters('market', ['marketList', 'marketPageDetail', 'marketDetail'])
}

export const marketMethods = {
  ...mapActions('market', ['getMarketList', 'getMarketDetail'])
}

export const auxiliaryComputed = {
  ...mapState('auxiliary', {
    unitsList: (state) => state.unitsList
  })
}

export const auxiliaryMethods = mapActions('auxiliary', ['getAuxiliaryList', 'setAuxiliary'])

export const categoriesComputed = {
  ...mapState('categories', {
    reqCategoryList: (state) => state.reqCategoryList
  })
}

export const categoriesMethods = mapActions('categories', ['getCategoryList', 'setCategory', 'addChild'])

export const goodsComputed = {
  ...mapState('editgoods', {
    productList: (state) => state.productList,
    statePageTotal: (state) => state.statePageTotal
  })
}

export const goodsMethods = mapActions('editgoods', ['getGoodsData'])

// 轮播广告
export const adverComputed = {
  ...mapGetters('advertisement', ['infoBannerList'])
}

export const adverMethods = mapActions('advertisement', ['getInfoBannerList'])

// 订单
export const orderComputed = {
  ...mapGetters('order', [
    'list',
    'pageDetail',
    'detail',
    'shopId',
    'time',
    'keyword',
    'status',
    'page',
    'orderStatus',
    'startTime',
    'endTime'
  ])
}

export const orderMethods = {
  ...mapActions('order', ['setShopId', 'setTime', 'setKeyword', 'setStatus', 'setPage', 'setOrderStatus'])
}

// 退货
export const returnsComputed = {
  ...mapGetters('returns', [
    'list',
    'pageDetail',
    'detail',
    'shopId',
    'time',
    'keyword',
    'status',
    'page',
    'tabIndex',
    'socialName'
  ])
}

export const returnsMethods = {
  ...mapActions('returns', [
    'getReturnsList',
    'setShopId',
    'setTime',
    'setKeyword',
    'setStatus',
    'setPage',
    'infoStatus',
    'infoTab'
  ])
}

// 轮播广告
export const purchaseComputed = {
  ...mapGetters('purchase', ['pageTotal', 'purchaseList', 'purchaseDetail'])
}

export const purchaseMethods = mapActions('purchase', ['getPurchaseList', 'getPurchaseDetail'])
// 成员管理
export const customerComputed = {
  ...mapGetters('customer', ['customerList', 'pageTotal'])
}

export const customerMethods = mapActions('customer', ['getCustomerList'])
// 数据管理
export const dataComputed = {
  ...mapGetters('data', ['orderDetail', 'leaderDetail', 'shopDetail', 'pageDetail', 'goodsPageDetail'])
}

export const dataMethods = mapActions('data', ['getOrderDetail', 'getLeaderDetail', 'getShopDetail'])

// 社群数据
export const communityComputed = {
  ...mapGetters('community', ['communityList', 'qualityData', 'businessData', 'groupData', 'goodsList'])
}

export const communityMethods = mapActions('community', [
  'getCommunityList',
  'getQualityData',
  'getBusinessData',
  'getGroupData',
  'getGoodsList'
])

// 交易记录
export const tradeComputed = {
  ...mapGetters('trade', ['trades', 'pageDetail', 'page', 'date', 'keyword', 'type'])
}

export const tradeMethods = {
  ...mapActions('trade', ['setPage', 'setTradeType', 'setDate', 'setKeyword'])
}

// OMS
export const omsComputed = {
  ...mapGetters('oms', [
    'orders',
    'pageTotal',
    'page',
    'startTime',
    'endTime',
    'status',
    'keyword',
    'detail',
    'timeStart',
    'timeEnd'
  ])
}

export const omsMethods = {
  ...mapActions('oms', [
    'getOmsOrders',
    'getOmsOrderDetail',
    'setStartTime',
    'setEndTime',
    'setKeyword',
    'setStatus',
    'setPage',
    'infoOrderTime',
    'infoDriverTime',
    'setResetStartTime'
  ])
}
// 采购单
export const supplyComputed = {
  ...mapGetters('supply', ['pageTotal', 'purchaseList', 'purchaseDetail', 'timeStart', 'timeEnd'])
}

export const supplyMethods = mapActions('supply', ['getPurchaseList', 'getPurchaseDetail', 'infoPurchaseTime'])

// 采购任务
export const proTaskComputed = {
  ...mapGetters('proTask', [
    'pageTotal',
    'purchaseTaskList',
    'select',
    'editTaskList',
    'timeStart',
    'timeEnd',
    'goBackNumber'
  ])
}

export const proTaskMethods = mapActions('proTask', [
  'getPurchaseTaskList',
  'selectPurchase',
  'setTaskList',
  'setGoBackNumber',
  'setGoBackNumberSub',
  'infoTaskTime'
])

// 调度任务
export const deliveryComputed = {
  ...mapGetters('delivery', ['tabIndex', 'driverList', 'driverPageDetail', 'driverPage', 'roads'])
}

export const deliveryMethods = {
  ...mapActions('delivery', ['getRouteData', 'setTabIndex', 'getDriverList', 'getRoads'])
}

// 调度任务
export const distributionComputed = {
  ...mapGetters('distribution', [
    'tabIndex',
    'orderList',
    'orderPageDetail',
    'orderPage',
    'orderStartTime',
    'orderEndTime',
    'orderKeyword',
    'orderStatus',
    'driverList',
    'driverPageDetail',
    'driverPage',
    'driverStartTime',
    'driverEndTime'
  ])
}

export const distributionMethods = {
  ...mapActions('distribution', [
    'setTabIndex',
    'getOrderList',
    'setOrderTime',
    'setOrderKeyword',
    'setOrderPage',
    'setOrderStatus',
    'getDriverList',
    'setDriverTime',
    'setDriverPage',
    'infoOrderTime',
    'infoDriverTime'
  ])
}

// 采购员
export const buyerComputed = {
  ...mapGetters('buyer', ['list', 'pageDetail', 'detail', 'keyword', 'page'])
}

export const buyerMethods = {
  ...mapActions('buyer', ['getPurchaseUser', 'getPurchaseUserDetail', 'setKeyword', 'setPage', 'infoSetKeyWord'])
}

// 供应商
export const supplierComputed = {
  ...mapGetters('supplier', ['list', 'pageDetail', 'detail', 'keyword', 'page'])
}

export const supplierMethods = {
  ...mapActions('supplier', ['getSupplier', 'getSupplierDetail', 'setKeyword', 'setPage', 'infoSetKeyWord'])
}

// 库位管理
export const productComputed = {
  ...mapGetters('product', [
    'storeList',
    'enterList',
    'statePageTotal',
    'outList',
    'outPageTotal',
    'enterDetail',
    'outDetail'
  ])
}

export const productMethods = {
  ...mapActions('product', [
    'getStore',
    'getEnterData',
    'getOutData',
    'getEnterDetailData',
    'getOutDetailData',
    'setOutList'
  ])
}

// 财务管理
export const financeComputed = {
  ...mapGetters('finance', [
    'settleStatus',
    'statusTabIndex',
    'settleLogs',
    'settleLogsPageTotal',
    'settleLogsPage',
    'settleLogsDate',
    'settleLogsStatus',
    'settleLogsKeyword',
    'account',
    'payList',
    'payListPageTotal',
    'payListPage'
  ])
}

export const financeMethods = {
  ...mapActions('finance', [
    'getSettleStatus',
    'getSettleLogs',
    'setSettleDate',
    'setSettleKeyword',
    'setSettleLogsStatus',
    'setSettleLogsPage',
    'getAccount',
    'getPayList',
    'setPayListPage'
  ])
}
// 新手指引
export const beginnerGuideComputed = {
  ...mapGetters('beginnerGuide', ['active'])
}
// 拓展团队详情
export const outreachGroupDetailComputed = {
  ...mapGetters('outreachGroup', ['groupList', 'taskDetail', 'taskPage', 'taskData', 'staffId'])
}
export const outreachGroupDetailMethods = {
  ...mapActions('outreachGroup', [
    'getGroupList',
    'showModal',
    'groupListAddChildren',
    'getOutreachList',
    'getTaskDetail'
  ])
}
// 拓展团队
export const outreachGroupComputed = {
  ...mapState('oGModal', {
    isShow: (state) => state.isShow,
    name: (state) => state.name,
    title: (state) => state.title,
    maxLength: (state) => state.maxLength,
    useType: (state) => state.useType,
    modalType: (state) => state.modalType,
    mobile: (state) => state.mobile
  }),
  ...mapState('oGTools', {
    showTools: (state) => state.isShow,
    x: (state) => state.x,
    y: (state) => state.y
  }),
  ...mapState('oGTab', {
    groupList: (state) => state.groupList,
    isLastDepartment: (state) => state.isLastDepartment,
    editPosition: (state) => state.editPosition,
    current: (state) => state.current,
    parentObj: (state) => state.parentObj
  }),
  ...mapState('oGContent', {
    staffList: (state) => state.staffList,
    teamData: (state) => state.teamData,
    pageDetail: (state) => state.pageDetail,
    page: (state) => state.page
  }),
  ...mapGetters('outreachGroup', ['showContent'])
}

export const outreachGroupMethods = {
  ...mapActions('outreachGroup', [
    'getGroupList',
    'showModal',
    'groupListAddChildren',
    'getOutreachList',
    'getTaskDetail',
    'setContent',
    'setStaffId'
  ]),
  ...mapMutations('oGModal', [MODAL.SHOW_MODAL, MODAL.SET_NAME, MODAL.SUBMIT, MODAL.CANCEL, MODAL.SET_MOBILE]),
  ...mapMutations('oGTools', [TOOLS.SET_POSITION, TOOLS.SHOW_TOOLS, TOOLS.UPDATE_IS_ENTER]),
  ...mapMutations('oGTab', [TAB.SET_ADD_POSITION, TAB.SET_DEL_POSITION, TAB.SET_EDIT_POSITION, TAB.SET_MOVE_POSITION]),
  ...mapActions('oGTab', ['addDepartment', 'changeTab', 'deleteDepartment', 'editDepartment', 'moveDepartment']),
  ...mapMutations('oGContent', [CONTENT.SET_CURRENT_STAFF, CONTENT.CLEAR_STAFF_LIST, CONTENT.RESET_PAGE]),
  ...mapActions('oGContent', ['reqStaffList', 'addStaff', 'editorStaff', 'setPage'])
}
/**
 * 仓库-库存
 */
export const storeComputed = {
  ...mapGetters('store', [
    'warehouseList',
    'warehousePageTotal',
    'warehouseDetailList',
    'detailPageTotal',
    'stockPageTotal',
    'stockList',
    'adjustOrder',
    'adjustPageTotal',
    'adjustOrderDetail',
    'adjustDetailPageTotal'
  ])
}
export const storeMethods = {
  ...mapActions('store', [
    'getWarehouseList',
    'getWarehouseDetailList',
    'getStockList',
    'getAdjustOrder',
    'getAdjustOrderDetail'
  ])
}
// todo 分拣任务
export const sortingComputed = {
  ...mapGetters('sorting', [
    'sortingTask',
    'sortingConfig',
    'sortingTaskDetail',
    'sortingTaskDetailByOrder',
    'barCodePreviewInfo'
  ])
}

export const sortingMethods = {
  ...mapActions('sorting', [
    'getSortingTaskList',
    'getSortingTaskDetail',
    'getSortingTaskGoodsDetails',
    'getBarCodePreviewInfo',
    'getSortingConfigList'
  ]),
  ...mapMutations('sorting', ['SET_PARAMS'])
}
// 商户订单
export const merchantOrderComputed = {
  ...mapGetters('merchantOrder', [
    'pageTotal',
    'orderList',
    'mergerDetail',
    'merchantDetail',
    'merchantFilter',
    'consumerDetailTotal',
    'consumerDetail',
    'mergerDetail'
  ])
}
export const merchantOrderMethods = {
  ...mapActions('merchantOrder', [
    'getMerchantOrderList',
    'getMerchantOrderDetail',
    'getConsumerOrderDetail',
    'getMergerOrderDetail'
  ]),
  ...mapMutations('merchantOrder', ['SET_PARAMS', 'SET_PAGE_TOTAL'])
}
// 售后订单
export const afterSalesOrderComputed = {
  ...mapGetters('afterSalesOrder', ['pageTotal', 'afterSalesList', 'afterSalesDetail', 'afterSalesFilter'])
}
export const afterSalesOrderMethods = {
  ...mapActions('afterSalesOrder', ['getAfterSalesOrderList', 'getAfterSalesOrderDetail']),
  ...mapMutations('afterSalesOrder', [
    'SET_PARAMS',
    'SET_KEYWORD',
    'SET_PAGE',
    'SET_TIME',
    'SET_PAGE_TOTAL',
    'SET_LIST',
    'SET_DETAIL',
    'SET_STATUS',
    'SET_DETAIL_PAGE'
  ])
}

// 设置权限
export const accountComputed = {
  ...mapGetters('account', ['tabIndex', 'accountList', 'pageDetail', 'accountPage', 'keyword', 'permissionsList'])
}

export const accountMethods = {
  ...mapActions('account', ['setTabIndex', 'getAccountList', 'setKeyword', 'setAccount', 'getPermissionsList'])
}

// 仓库人员
export const warehouseComputed = {
  ...mapGetters('warehouse', ['list', 'pageDetail', 'detail', 'keyword', 'page'])
}

export const warehouseMethods = {
  ...mapActions('warehouse', ['getPurchaseUser', 'getPurchaseUserDetail', 'setKeyword', 'setPage', 'infoSetKeyWord'])
}
