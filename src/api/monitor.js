import request from '@utils/request'
const commonParams = {
  request_type: 1
}

export default {
  /**
   * 物流监控采购
   * @param data
   * @param loading
   */
  getPurchase(data = {}, loading = false) {
    let url = '/scm/api/backend/purchase/purchase-task-statistic'
    return request.get(url, Object.assign(data, commonParams), loading)
  },
  /**
   * 物流监控入库
   * @param data
   * @param loading
   */
  getEntryWarehouse(data = {}, loading = false) {
    let url = '/scm/api/backend/warehouse/entry-orders-statistic'
    return request.get(url, Object.assign(data, commonParams), loading)
  },
  /**
   * 物流监控分拣
   * @param data
   * @param loading
   */
  getPicking(data = {}, loading = false) {
    let url = '/scm/api/backend/sorting/picking-order-statistic'
    return request.get(url, Object.assign(data, commonParams), loading)
  },
  /**
   * 物流监控出库
   * @param data
   * @param loading
   */
  getOutWarehouse(data = {}, loading = false) {
    let url = '/scm/api/backend/warehouse/out-orders-statistic'
    return request.get(url, Object.assign(data, commonParams), loading)
  },
  /**
   * 物流监控配送
   * @param data
   * @param loading
   */
  getDelivery(data = {}, loading = false) {
    let url = '/scm/api/backend/delivery/delivery-statistic-new'
    return request.get(url, Object.assign(data, commonParams), loading)
  },
  /**
   * 物流监控售后
   * @param data
   * @param loading
   */
  getAfterSale(data = {}, loading = false) {
    let url = '/scm/api/backend/oms/after-sale-status'
    return request.get(url, Object.assign(data, commonParams), loading)
  }
}
