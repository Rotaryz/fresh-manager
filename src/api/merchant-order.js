import request from '@utils/request'

export default {
  //  √ 商户订单 √
  getMerchantOrderList(data, loading = true) {
    let url = '/scm/api/backend/oms/orders'
    // let url = '/mock/merchantOrderList.json'
    return request.get(url, data, loading)
  },
  //  √ 分类列表
  getTypeList() {
    let url = '/scm/api/backend/oms/order-types'
    // let url = '/mock/orderTypeList.json'
    return request.get(url)
  },
  // √ 状态
  getStausData(params = {}) {
    let defaultParams = {
      start_time: '',
      end_time: '',
      keyword: '',
      type: ''
    }
    defaultParams = {...defaultParams, ...params}
    // let url = '/mock/StausData.json'
    let url = `/scm/api/backend/oms/order-statistic`
    return request.get(url, defaultParams)
  },
  // √ 明細 √
  getMerchantOrderDetail({id}, loading = true) {
    let url = `/scm/api/backend/oms/orders/${id}`
    // let url = '/mock/orderDetail.json'
    return request.get(url, {}, loading)
  },
  // √  商品的详情列表 √
  getConsumerDetails(data, loading = true) {
    let url = `/scm/api/backend/oms/order-details`
    // let url = '/mock/consumerOrderDetail.json'
    return request.get(url, data, loading)
  },
  //  √ 商品基本信息  √
  getConsumerDetailBase(id, loading = false) {
    let url = `/scm/api/backend/oms/order-details/${id}`
    // let url = '/mock/consumerOrderDetail.json'
    return request.get(url, {}, loading)
  },

  // √ 汇总订单 √
  getMergeOrderslist(params, loading = false) {
    let url = '/scm/api/backend/oms/merge-orders'
    // let url = '/mock/mergeOrderslist.json'
    return request.get(url, params, loading)
  },
  //  √ 汇总详情  √
  getMergerOrderDetail({mergeOrderId}, loading = true) {
    let url = `/scm/api/backend/oms/merge-orders/${mergeOrderId}`
    // let url = '/mock/mergerDetail.json'
    return request.get(url, {}, loading)
  }
}
