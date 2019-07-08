import {mapState, mapGetters, mapActions, mapMutations} from 'vuex'
import {MODAL, TAB, TOOLS, CONTENT} from './mutations-types/outreach-group'

export const authComputed = {
  ...mapState('auth', {
    currentUser: (state) => state.currentUser
  }),
  ...mapGetters('auth', ['loggedIn'])
}

export const resetMethods = {
  ...mapActions('resetModule', ['resetHooks']),
  ...mapMutations('resetModule', ['ADD_HOOKS'])
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
    'leaderListFilter',
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
    'endAt',
    'deliveryRequest',
    'selectContent',
    'firstIn',
    'endAt',
    'headFitter',
    'headDetailFitter'
  ])
}

export const leaderMethods = {
  ...mapActions('leader', [
    'getList',
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
    'infoStatus',
    'resetHeadDetailData',
    'infoStatus',
    'resetDeliveryRequest',
    'setDeliveryRequest',
    'setSelectContent',
    'setFirstIn'
  ]),
  ...mapMutations('leader', ['SET_lEADER_LIST_FILTER','SET_PAGE_TOTAL','SET_PARAMS','SET_DETAIL_PARAMS'])
}

// 团长邀请
export const inviteComputed = {
  ...mapGetters('leaderInvite', ['requestData'])
}

export const inviteMethods = mapActions('leaderInvite', ['resetData', 'setRequestData'])

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
  ...mapGetters('activity', [
    'popularList',
    'preferenceList',
    'collageList',
    'collageDetail',
    'popularPage',
    'preferencePage',
    'collagePage',
    'activityTab',
    'defaultIndex',
    'tabIndex',
    'requestData',
    'firstIn'
  ])
}

export const activityMethods = mapActions('activity', [
  'getPopularList',
  'getPreferenceList',
  'getCollageList',
  'getCollageDetail',
  'addPreferenceList',
  'setActivityTab',
  'resetData',
  'setRequestData',
  'setDefaultIndex',
  'setTabIndex',
  'setFirstIn'
])

// 拓展活动
export const outreachComputed = {
  ...mapGetters('outreach', [
    'outreachList',
    'outreachPage',
    'outreachDetail',
    'memberList',
    'memberData',
    'memberPage',
    'defaultIndex',
    'requestData'
  ])
}

export const outreachMethods = mapActions('outreach', ['getOutreachList', 'getOutreachDetail', 'getMemberList', 'setRequestData', 'setDefaultIndex', 'setPage'])

// 优惠券
export const couponComputed = {
  ...mapGetters('coupon', ['couponList', 'pageDetail', 'couponDetail', 'infoTabIndex', 'goodsCoupon', 'requestData', 'defaultIndex'])
}

export const couponMethods = mapActions('coupon', ['getCouponList', 'getCouponDetail', 'setInfoIndex', 'resetData', 'setRequestData', 'setDefaultIndex'])

// 营销计划
export const marketComputed = {
  ...mapGetters('market', ['marketList', 'marketPageDetail', 'marketDetail', 'marketStaPageDetail', 'marketStaLists','inviteCount', 'defaultIndex', 'requestData'])
}

export const marketMethods = {
  ...mapActions('market', ['getMarketList', 'getMarketDetail', 'getMarketingStatisticsList', 'resetData', 'setDefaultIndex', 'setRequestData'])
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
  ...mapGetters('editgoods', [
    'productList',
    'statePageTotal',
    'goodsFitter',
    'taskData'
  ])
}

export const goodsMethods = {
    ...mapActions('editgoods', ['getGoodsData']),
  ...mapMutations('editgoods', ['SET_PARAMS', 'SET_TASK_DATA'])
}

// 轮播广告
export const adverComputed = {
  ...mapGetters('advertisement', ['infoBannerList', 'infoTabIndex'])
}

export const adverMethods = mapActions('advertisement', ['getInfoBannerList', 'checkTab'])

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
    'endTime',
    'defaultIndex'
  ])
}

export const orderMethods = {
  ...mapActions('order', ['setShopId', 'setTime', 'setKeyword', 'setStatus', 'setPage', 'setOrderStatus', 'resetData', 'setDefaultIndex'])
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
    'socialName',
    'firstIn'
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
    'infoTab',
    'setFirstIn',
    'resetData'
  ])
}

// 轮播广告
export const purchaseComputed = {
  ...mapGetters('purchase', ['pageTotal', 'purchaseList', 'purchaseDetail', 'requestData'])
}

export const purchaseMethods = mapActions('purchase', ['getPurchaseList', 'getPurchaseDetail', 'resetData', 'setRequestData'])
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

// 商品数据
export const goodsDataComputed = {
  ...mapGetters('goodsData', [
    'categoryList',
    'saleData',
    'serveData',
    'purchaseData',
    'supplyData',
    'saleRankList',
    'stockRankList',
    'bigChartData'
  ])
}

export const goodsDataMethods = mapActions('goodsData', [
  'getCategoryList',
  'getGoodsList',
  'getSpu',
  'getSaleData',
  'getServeData',
  'getPurchaseData',
  'getSupplyData',
  'initSaleRankList',
  'initStockRankList'
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
  ...mapGetters('supply', ['pageTotal', 'purchaseList', 'purchaseDetail', 'timeStart', 'timeEnd', 'page', 'keyword', 'status'])
}

export const supplyMethods = mapActions('supply', ['getPurchaseList', 'getPurchaseDetail', 'infoPurchaseTime', 'setKeyword', 'setPage', 'setStatus'])

// 采购任务
export const proTaskComputed = {
  ...mapGetters('proTask', [
    'pageTotal',
    'purchaseTaskList',
    'select',
    'editTaskList',
    'timeStart',
    'timeEnd',
    'goBackNumber',
    'timeDay'
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
    'setExceptionStatus',
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
    'outDetail',
    'enterFilter',
    'outFilter'
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
  ]),
  ...mapMutations('product', ['SET_ENTER_PARAMS', 'SET_OUT_PARAMS'])
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
    'adjustDetailPageTotal',
    'stockFilter',
    'warehouseFilter',
    'selectData',
    'warehouseDetailFilter',
    'typeName'
  ])
}
export const storeMethods = {
  ...mapActions('store', [
    'getWarehouseList',
    'getWarehouseDetailList',
    'getStockList',
    'getAdjustOrder',
    'getAdjustOrderDetail',
    'resetWarehouseDetail'
  ]),
  ...mapMutations('store', ['SET_STOCK_PARAMS', 'SET_WAREHOUSE_PARAMS', 'SET_SELECT_PARAMS', 'SET_WAREHOUSE_DETAIL_PARAMS', 'SET_TYPE_NAME'])
}
// todo 分拣任务
export const sortingComputed = {
  ...mapGetters('sorting', [
    'sortingTask',
    'sortingConfig',
    'sortingTaskDetail',
    'sortingTaskDetailByOrder',
    'barCodePreviewInfo',
    'taskData'
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
  ...mapMutations('sorting', ['SET_PARAMS', 'SET_TASK_DATA'])
}
// 商户订单
export const merchantOrderComputed = {
  ...mapGetters('merchantOrder', [
    'pageTotal',
    'orderList',
    'mergerDetail',
    'mergerPageTotal',
    'mergerList',
    'mergerFilter',
    'merchantDetail',
    'merchantFilter',
    'consumerDetailTotal',
    'consumerDetail',
    'mergerDetail',
    'tabIndex'
  ])
}
export const merchantOrderMethods = {
  ...mapActions('merchantOrder', [
    'getMerchantOrderList',
    'getMergerOrderList',
    'getMerchantOrderDetail',
    'getConsumerOrderDetail',
    'getMergerOrderDetail'
  ]),
  ...mapMutations('merchantOrder', ['SET_PARAMS', 'SET_PAGE_TOTAL', 'SET_MERGER_PARAMS', 'SET_TAB_INDEX'])
}
// 售后订单
export const afterSalesOrderComputed = {
  ...mapGetters('afterSalesOrder', ['pageTotal', 'afterSalesList', 'afterSalesDetail', 'afterSalesFilter', 'exceptionText'])
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
    'SET_DETAIL_PAGE',
    'SET_IS_FIRST',
    'SET_EXCEPTION_TEXT'
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
// 配置
export const allocationComputed = {
  ...mapGetters('allocation', ['allocationList', 'operation'])
}

export const allocationMethods = {
  ...mapActions('allocation', ['getAllocationList', 'getOperation'])
}
// 供应链商品
export const scmGoodsComputed = {
  ...mapGetters('scmGoods', ['productList', 'statePageTotal', 'goodsStoreList', 'storePageTotal', 'goodsReqData', 'selectDown'])
}

export const scmGoodsMethods = {
  ...mapActions('scmGoods', ['getProductList', 'getScmStoreData', 'setKeyword', 'setPage', 'setMaterialCategory', 'setCompleteStatus', 'saveSelectDown', 'setPageSubtract', 'resetData'])
}
