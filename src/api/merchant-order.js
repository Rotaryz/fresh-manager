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

  // √ 汇总订单 √
  getConsumerOrderslist(params, loading = false) {
    let url = '/scm/api/backend/oms/merge-orders'
    // let url = '/mock/mergeOrderslist.json'
    return request.get(url, params, loading)
  },

  // 保存消费者订单
  saveConsumerOrder(params, loading = false) {
    let url = '/scm/api/backend/oms/merge-orders'
    return request.post(url, params, loading)
  },

  // 消费者订单状态
  getConsumerStatus(params = {}) {
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
}
