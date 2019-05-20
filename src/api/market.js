import request from '@utils/request'

export default {
  /**
   * 营销列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getMarketList(data, loading = true) {
    let url = '/social-shopping/api/backend/coupon-activity-manage/coupon-activity'
    return request.get(url, data, loading)
  },
  /**
   * 营销详情
   * @param data
   * @param loading
   * @returns {*}
   */
  getMarketDetail(id, loading = true) {
    let url = `/social-shopping/api/backend/coupon-activity-manage/coupon-activity/${id}`
    return request.get(url, {}, loading)
  },
  /**
   * 删除营销
   * @param data
   * @param loading
   * @returns {*}
   */
  deleteMarket(id, loading = false) {
    let url = `/social-shopping/api/backend/coupon-activity-manage/coupon-activity/${id}`
    return request.delete(url, null, loading)
  },

  /**
   * 新建营销
   * @param data
   * @param loading
   * @returns {*}
   */
  storeMarket(data, loading = false) {
    let url = `/social-shopping/api/backend/coupon-activity-manage/coupon-activity`
    return request.post(url, data, loading)
  },
  /**
   * 营销开启关闭
   * @param data
   * @param loading
   * @returns {*}
   */
  switchMarket(data, loading = false) {
    let url = `/social-shopping/api/backend/coupon-activity-manage/coupon-activity/${data.id}/status/${data.status}`
    return request.post(url, data, loading)
  },

  /**
   * 营销分类统计
   * @param loading
   * @returns {*}
   */
  getMarketStatus(data, loading = false) {
    let url = '/social-shopping/api/backend/coupon-activity-manage/coupon-activity-status'
    return request.get(url, data, loading)
  }
}
