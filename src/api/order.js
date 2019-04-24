import request from '@utils/request'

export default {
  getOrderList(data, loading = true) {
    let url = '/social-shopping/api/backend/order'
    return request.get(url, data, loading)
  },
  getOrderDetail(id, data = {}, loading = true) {
    let url = `/social-shopping/api/backend/order/${id}`
    return request.get(url, data, loading)
  },
  getOrderExecel(data, loading = false) {
    let url = `/social-shopping/api/backend/order-excel`
    return request.get(url, data, loading)
  },
  getReturnsList(data, loading = true) {
    let url = '/social-shopping/api/backend/after-sale-orders'
    return request.get(url, data, loading)
  },
  getReturnsDetail(id, data = {}, loading = true) {
    let url = `/social-shopping/api/backend/after-sale-orders/${id}`
    return request.get(url, data, loading)
  },
  checkApply(data, loading = true) {
    let url = `/social-shopping/api/backend/check-after-sale`
    return request.post(url, data, loading)
  },
  /**
   * 退货订单状态统计[v2.2.3]
   * @param data
   * @param loading
   * @returns {*}
   */
  afterSaleOrdersStatus(data, loading = false) {
    let url = `/social-shopping/api/backend/after-sale-orders-status`
    return request.get(url, data, loading)
  },
  /**
   * 售后补偿规则添加
   * @param data
   * @param loading
   * @returns {*}
   */
  couponActivity(loading = false) {
    let url = `/social-shopping/api/backend/coupon-activity-manage/coupon-activity-types`
    return request.get(url, {source_type: 2}, loading)
  },
  /**
   * 售后补偿规则添加
   * @param data
   * @param loading
   * @returns {*}
   */
  addCouponActivity(data, loading = false) {
    let url = `/social-shopping/api/backend/coupon-activity-manage/coupon-activity`
    return request.post(url, data, loading)
  },
  /**
   * 售后补偿规则开启/关闭
   * @param data
   * @param loading
   * @returns {*}
   */
  openActivity(id, status, loading = false) {
    let url = `/social-shopping/api/backend/coupon-activity-manage/coupon-activity/${id}/status/${status}`
    return request.post(url, {}, loading)
  },
  /**
   * 售后补偿规则删除
   * @param data
   * @param loading
   * @returns {*}
   */
  delCouponActivity(id, loading = false) {
    let url = `/social-shopping/api/backend/coupon-activity-manage/coupon-activity/${id}`
    return request.delete(url, {}, loading)
  }
}
