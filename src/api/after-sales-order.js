import request from '@utils/request'

export default {
  /**
   * 分拣列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getAfterSalesOrderList(data, loading = true) {
    let url = '/scm/api/backend/oms/after-sale-orders'
    // let url = '/mock/afterSalesOrder.json'
    return request.get(url, data, loading)
  },
  // 明細
  getAfterSalesOrderDetail({id}, loading = true) {
    let url = `/scm/api/backend/oms/after-sale-orders/${id}`
    // let url = '/mock/afterSalesDetail.json'
    return request.get(url, loading)
  },
  // 状态
  getStausData() {
    // let url = '/mock/StausData.json'
    let url = '/scm/api/backend/oms/after-sale-status'
    return request.get(url, {
      start_time: '',
      end_time: '',
      keyword: ''
    })
  },
  batchRefund(params) {
    // let url = '/mock/StausData.json'
    let url =`/scm/api/backend/oms/batch-refund`
    return request.get(url, {goods_sku_codes: params})
  },
  batchReplenishment(params) {
    // let url = '/mock/StausData.json'
    let url =`/scm/api/backend/oms/batch-delay`
    return request.get(url, {goods_sku_codes: params})
  },
  getBatchList(params) {
    let url = '/scm/api/backend/oms/after-sale-order-details'
    // let url = '/mock/batchendSalesList.json'
    return request.get(url, params)
  },

}
