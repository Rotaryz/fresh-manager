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
  getShopBill(data ={}, loading = true) {
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
  }
}
