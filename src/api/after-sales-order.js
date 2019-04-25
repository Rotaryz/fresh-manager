import request from '@utils/request'

export default {
  // √ 售后列表
  getAfterSalesOrderList(data, loading = true) {
    let url = '/scm/api/backend/oms/after-sale-orders'
    // let url = '/mock/afterSalesOrder.json'
    return request.get(url, data, loading)
  },
  // √ 详情
  getAfterSalesOrderDetail({id}, loading = true) {
    let url = `/scm/api/backend/oms/after-sale-orders/${id}`
    // let url = '/mock/afterSalesDetail.json'
    return request.get(url, loading)
  },
  // √ 状态
  getStausData(params={}) {
    let defaultParams = {
      start_time: '',
      end_time: '',
      keyword: ''
    }
    params = {...defaultParams,...params}
    // let url = '/mock/StausData.json'
    let url = '/scm/api/backend/oms/after-sale-status'
    return request.get(url, params)
  },
  // 退款
  batchRefund(params) {
    // let url = '/mock/StausData.json'
    let url =`/scm/api/backend/oms/batch-refund`
    return request.post(url, {goods_sku_codes:params })
  },
  // 补货
  batchReplenishment(params) {
    // let url = '/mock/StausData.json'
    let url =`/scm/api/backend/oms/batch-delay`
    return request.post(url, {goods_sku_codes: params})
  },
  // √ 批量列表
  getBatchList(params) {
    let url = '/scm/api/backend/oms/after-sale-order-details'
    // let url = '/mock/batchendSalesList.json'
    return request.get(url, params)
  },

}
