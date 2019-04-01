import request from '@utils/request'

export default {
  /**
   * 查询社区订单列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getOmsOrders(data, loading = true) {
    let url = '/scm/api/backend/oms/orders'
    return request.get(url, data, loading)
  },
  /**
   * 查询社区订单详情
   * @param orderId
   * @param loading
   * @returns {*}
   */
  getOmsOrderDetail(orderId, loading = true) {
    let url = `/scm/api/backend/oms/orders/${orderId}`
    return request.get(url)
  },
  /**
   * 获取订单的状态列表
   * @param loading
   * @returns {*}
   */
  getOmsOrderStatus(loading = false) {
    let url = '/scm/api/backend/oms/order-status'
    return request.get(url)
  },
  /**
   * 订单的统计
   * @param loading
   * @returns {*}
   */
  outOrdersStatistic(data, loading = false) {
    let url = '/scm/api/backend/oms/order-statistic'
    return request.get(url, data,loading)
  }
}
