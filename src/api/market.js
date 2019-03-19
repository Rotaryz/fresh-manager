import request from '@utils/request'

export default {
  /**
   * 营销列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getMarketList(data, loading = true) {
    let url = '/social-shopping/api/backend/activity-manage/activity'
    return request.get(url, data, loading)
  },
  /**
   * 营销详情
   * @param data
   * @param loading
   * @returns {*}
   */
  getMarketDetail(id, loading = true) {
    let url = `/social-shopping/api/backend/activity-manage/activity-offline/${id}`
    return request.get(url, {}, loading)
  },
  /**
   * 删除营销
   * @param data
   * @param loading
   * @returns {*}
   */
  deleteMarket(id, loading = false) {
    let url = `/social-shopping/api/backend/activity-manage/activity-offline/${id}`
    return request.delete(url, null, loading)
  },

  /**
   * 新建营销
   * @param data
   * @param loading
   * @returns {*}
   */
  storeMarket(data, loading = false) {
    let url = `/social-shopping/api/backend/activity-manage/activity-offline`
    return request.post(url, data, loading)
  }
}
