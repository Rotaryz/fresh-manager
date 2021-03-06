import request from '@utils/request'

export default {
  /**
   * 限时抢购列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getSaleList(data, loading = true) {
    let url = '/social-shopping/api/backend/activity-manage/activity'
    return request.get(url, data, loading)
  },
  /**
   * 限时抢购详情
   * @param data
   * @param loading
   * @returns {*}
   */
  saleDetail(id, loading = false) {
    let url = `/social-shopping/api/backend/activity-manage/activity-fixed/${id}`
    return request.get(url, {}, loading)
  },
  /**
   * 删除限时抢购
   * @param data
   * @param loading
   * @returns {*}
   */
  saleDelete(id, loading = false) {
    let url = `/social-shopping/api/backend/activity-manage/activity/${id}`
    return request.delete(url, {}, loading)
  },
  /**
   * 终止活动
   * @param data
   * @param loading
   * @returns {*}
   */
  stopActive(id, loading = false) {
    let url = `/social-shopping/api/backend/activity-manage/activity/terminate/${id}`
    return request.post(url, {}, loading)
  },

  /**
   * 新建限时抢购
   * @param data
   * @param loading
   * @returns {*}
   */
  storeSale(data, loading = false) {
    let url = `/social-shopping/api/backend/activity-manage/activity-fixed`
    return request.post(url, data, loading)
  },
  /**
   *
   * @param data
   * @param loading
   * @returns {*}
   */
  getGoodsList(data, loading = false) {
    let url = `/social-shopping/api/backend/goods-manage/goods`
    return request.get(url, data, loading)
  },
  /**
   * 限时抢购类型统计
   * @param loading
   * @returns {*}
   */
  getSaleStatus(data, loading = false) {
    let url = '/social-shopping/api/backend/activity-manage/activity-status'
    return request.get(url, data, loading)
  },
  /**
   * 限时抢购类型统计
   * @param loading
   * @returns {*}
   */
  getDeliveryTime(data, loading = false) {
    let url = '/social-shopping/api/backend/activity-manage/delivery-time'
    return request.post(url, data, loading)
  }
}
