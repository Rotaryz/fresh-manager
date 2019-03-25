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
    let url = `/social-shopping/api/backend/activity-manage/activity-fixed/${id}`
    return request.delete(url, {}, loading)
  },
}