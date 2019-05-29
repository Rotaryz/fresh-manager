import request from '@utils/request'

export default {
  /**
   * 运营数据 - 流量
   * @param data
   * @param loading
   * @returns {*}
   */
  getOperationFlowData(data, loading = false) {
    let url = '/social-shopping/api/backend/data-center/operation/page-view-data'
    return request.get(url, data, loading)
  },
  /**
   * 运营数据 - 交易
   * @param data
   * @param loading
   * @returns {*}
   */
  getOperationBusinessData(data, loading = false) {
    let url = '/social-shopping/api/backend/data-center/operation/trade-data'
    return request.get(url, data, loading)
  },
  /**
   * 运营数据 - 订单
   * @param data
   * @param loading
   * @returns {*}
   */
  getOperationOrderData(data, loading = false) {
    let url = '/social-shopping/api/backend/data-center/operation/order-data'
    return request.get(url, data, loading)
  },
  /**
   * 运营数据 - 用户
   * @param data
   * @param loading
   * @returns {*}
   */
  getOperationUserData(data, loading = false) {
    let url = `/social-shopping/api/backend/community/statistic/customers`
    return request.get(url, data, loading)
  },
  /**
   * 运营数据 - 效率
   * @param data
   * @param loading
   * @returns {*}
   */
  getOperationBenefitData(data, loading = false) {
    let url = '/social-shopping/api/backend/data-center/operation/pin-rate-data'
    return request.get(url, data, loading)
  },
  /**
   * 运营数据 - 售后
   * @param data
   * @param loading
   * @returns {*}
   */
  getOperationServicesData(data, loading = false) {
    let url = '/social-shopping/api/backend/data-center/operation/after-server-data'
    return request.get(url, data, loading)
  },
  /**
   * 拓展数据 - 拓展
   * @param data
   * @param loading
   * @returns {*}
   */
  getExpandData(data, loading = false) {
    let url = '/social-shopping/api/backend/data-center/operation/offline-order-data'
    return request.get(url, data, loading)
  },
  /**
   * 拓展数据 - 团长
   * @param data
   * @param loading
   * @returns {*}
   */
  getExpandLeaderData(data, loading = false) {
    let url = '/social-shopping/api/backend/data-center/operation/shop-data'
    return request.get(url, data, loading)
  },
  /**
   * 拓展数据 - 社群
   * @param data
   * @param loading
   * @returns {*}
   */
  getExpandCommunityData(data, loading = false) {
    let url = '/social-shopping/api/backend/data-center/operation/wx-group-data'
    return request.get(url, data, loading)
  },
  /**
   * 管理数据 - 供应链
   * @param data
   * @param loading
   * @returns {*}
   */
  getMerchantData(data, loading = false) {
    let url = '/social-shopping/api/backend/data-center/operation/delivery-data'
    return request.get(url, data, loading)
  },
  /**
   * 管理数据 - 采购
   * @param data
   * @param loading
   * @returns {*}
   */
  getPurchaseData(data, loading = false) {
    let url = '/social-shopping/api/backend/data-center/operation/purchase-data'
    return request.get(url, data, loading)
  },
  /**
   * 管理数据 - 仓库
   * @param data
   * @param loading
   * @returns {*}
   */
  getWarehouseData(data, loading = false) {
    let url = '/social-shopping/api/backend/data-center/operation/turnover-rate-data'
    return request.get(url, data, loading)
  }
}
