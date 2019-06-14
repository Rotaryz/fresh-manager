import request from '@utils/request'

export default {
  /**
   * 新建团长
   * @param data
   * @param loading
   * @returns {*}
   */
  storeLeader(data, loading = true) {
    let url = '/social-shopping/api/backend/shop-manager'
    return request.post(url, data, loading)
  },
  /**
   * 获取团长列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getLeaderList(data, loading = true) {
    let url = '/social-shopping/api/backend/shop-manager'
    return request.get(url, data, loading)
  },
  /**
   * 获取团长详情
   * @param id
   * @param loading
   * @returns {*}
   */
  getLeaderDetail(id, loading = true) {
    let url = `/social-shopping/api/backend/shop-manager/${id}`
    return request.get(url, null, loading)
  },
  /**
   * 编辑团长
   * @param id
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  editLeader(id, data, loading = true) {
    let url = `/social-shopping/api/backend/shop-manager/${id}`
    return request.put(url, data, loading)
  },
  /**
   * 配送列表
   * @param id
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  getDeliveryOrder(data, loading = true) {
    let url = `/social-shopping/api/backend/store-delivery`
    return request.get(url, data, loading)
  },
  /**
   * 社区下拉列表
   * @param id
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  shopDropdownList(loading = false) {
    let url = `/social-shopping/api/backend/shop-dropdown-list`
    return request.get(url, null, loading)
  },
  /**
   * 社区下拉列表
   * @param id
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  deliveryDetail(id, loading = false) {
    let url = `/social-shopping/api/backend/store-delivery/${id}`
    return request.get(url, {}, loading)
  },
  /**
   * 生成小程序码
   * @param id
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  createQrcode(data, loading = false) {
    let url = `/social-shopping/api/create-qrcode`
    return request.post(url, data, loading)
  },
  /**
   * 冻结/解冻团长
   * @param id
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  shopToggleFrozen(data, loading = false) {
    let url = `/social-shopping/api/backend/shop-toggle-frozen`
    return request.post(url, data, loading)
  },
  /**
   * 团长结算列表
   * @param id
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  settlementList(data, loading = false) {
    let url = `/social-shopping/api/backend/settlement-index`
    return request.get(url, data, loading)
  },
  /**
   * 指定团长结算明细
   * @param id
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  settlementDetail(data, loading = false) {
    let url = `/social-shopping/api/backend/settlement-detail`
    return request.get(url, data, loading)
  },
  /**
   * 获取团长提现列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getWithdrawalList(data = {}, loading = true) {
    let url = '/social-shopping/api/backend/backend-shop-manager/withdrawal'
    return request.get(url, data, loading)
  },
  /**
   * 提现审核
   * @param data
   * @param loading
   * @returns {*}
   */
  applyWithdrawal(data, loading = true) {
    let url = '/social-shopping/api/backend/backend-shop-manager/withdrawal-apply'
    return request.get(url, data, loading)
  },
  /**
   * 获取提现状态列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getWithdrawalStatus(data = {}, loading = false) {
    let url = '/social-shopping/api/backend/backend-shop-manager/withdrawal-status'
    return request.get(url, data, loading)
  },
  /**
   * 获取收支明细
   * @param data
   * @param loading
   * @returns {*}
   */
  getShopBill(data = {}, loading = true) {
    let url = '/social-shopping/api/backend/backend-shop-manager/shop-bill'
    return request.get(url, data, loading)
  },
  /**
   * 获取收支明细类型
   * @param data
   * @param loading
   * @returns {*}
   */
  getShopBillType(data = {}, loading = false) {
    let url = '/social-shopping/api/backend/backend-shop-manager/shop-order-type'
    return request.get(url, data, loading)
  },
  /**
   * 同步店铺数据
   * @param data
   * @param loading
   * @returns {*}
   */
  syncShop(data = {}, loading = true) {
    let url = '/social-shopping/api/backend/guanmai/sync-shop'
    return request.get(url, data, loading)
  },

  /**
   * 团长分类统计
   * @param loading
   * @returns {*}
   */
  getLeaderStatus(data, loading = false) {
    console.log(data)
    let url = '/social-shopping/api/backend/shop-manager-status'
    return request.get(url, data, loading)
  },

  /**
   * 团长可使用帐号
   * @param loading
   * @returns {*}
   */
  getTopData(data, loading = false) {
    let url = '/social-shopping/api/backend/shop-manager-account-summary'
    return request.get(url, data, loading)
  },
  /**
   * 团长申请列表
   * @param loading
   * @returns {*}
   */
  getLeaderApplicationList(data, loading = false) {
    let url = '/social-shopping/api/backend/shop-distribution-invite-index'
    return request.get(url, data, loading)
  },
  /**
   * 团长申请审核
   * @param loading
   * @returns {*}
   */
  submitCheck(id,data,loading = false){
    let url = `/social-shopping/api/backend/shop-distribution-invite-audit/${id}`
    return request.post(url, data, loading)
  },
  /**
   * 团长邀请排行榜
   * @param loading
   * @returns {*}
   */
  leaderDistributionRankingList(data,loading = false){
    let url = `/social-shopping/api/backend/shop-distribution-index`
    return request.get(url, data, loading)
  },
  /**
   * 开启邀请设置
   * @param loading
   * @returns {*}
   */
  leaderInviteSetting(data,loading = false){
    let url = `/social-shopping/api/backend/shop-distribution-config`
    return request.post(url, data, loading)
  },
  /**
   * 获取团长设置状态
   * @param loading
   * @returns {*}
   */
  getSettingStatus(loading = false){
    let url = `/social-shopping/api/backend/shop-distribution-config`
    return request.get(url, {}, loading)
  },
  /**
   * 查询团长结算统计
   * @param loading
   * @returns {*}
   */
  getAccountData(id,loading = false){
    let url = `/social-shopping/api/backend/shop-distribution-entry-count`
    return request.get(url, {invite_shop_id:id}, loading)
  },
  setAccountData(data,loading = false){
    let url = `/social-shopping/api/backend/shop-distribution-settlement`
    return request.post(url, data, loading)
  },
  getLogList(data,loading = false){
    let url = `/social-shopping/api/backend/shop-distribution-settlement-log-list`
    return request.get(url, data, loading)
  },
}
