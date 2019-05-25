import request from '@utils/request'

export default {
  /**
   * 今日爆款列表
   * @param data
   * @returns {*}
   */
  getPopularList(data, loading = false) {
    let url = '/social-shopping/api/backend/goods-manage/goods-hot-tag'
    return request.get(url, data, loading)
  },
  /**
   * 今日爆款添加商品
   * @param data
   * @returns {*}
   */
  addPopular(data, loading = false) {
    let url = '/social-shopping/api/backend/goods-manage/goods-hot-tag'
    return request.post(url, data, loading)
  },
  /**
   * 删除今日爆款
   * @param data
   * @returns {*}
   */
  delPopular(data, loading = false) {
    let url = '/social-shopping/api/backend/goods-manage/goods-hot-tag'
    return request.delete(url, data, loading)
  },
  /**
   * 新人特惠活动列表
   * @param data
   * @returns {*}
   */
  getPreferenceGoods(data, loading = false) {
    let url = '/social-shopping/api/backend/activity-manage/activity-new-client/goods-sku'
    return request.get(url, data, loading)
  },
  /**
   * 新人特惠活动详情
   * @param data
   * @returns {*}
   */
  getPreferenceDetail(loading = true) {
    let url = '/social-shopping/api/backend/activity-manage/activity-new-client'
    return request.get(url, {}, loading)
  },
  /**
   * 编辑新人特惠
   * @param data
   * @returns {*}
   */
  editPreference(data, loading = false) {
    let url = '/social-shopping/api/backend/activity-manage/activity-new-client'
    return request.post(url, data, loading)
  },
  /**
   * 删除新人特惠
   * @param data
   * @returns {*}
   */
  delPreference(data, loading = false) {
    let url = '/social-shopping/api/backend/activity-manage/activity-new-client'
    return request.delete(url, data, loading)
  },
  /**
   * 拼团列表
   * @param data
   * @returns {*}
   */
  getCollageList(data, loading = true) {
    let url = '/social-shopping/api/backend/activity-manage/activity'
    return request.get(url, data, loading)
  },
  /**
   * 新建拼团活动
   * @param data
   * @returns {*}
   */
  newCollage(data, loading = false) {
    let url = '/social-shopping/api/backend/activity-manage/activity-groupon'
    return request.post(url, data, loading)
  },
  /**
   * 拼团活动详情
   * @param data
   * @returns {*}
   */
  getCollageDetail(id, loading = true) {
    let url = `/social-shopping/api/backend/activity-manage/activity-groupon/${id}`
    return request.get(url, {}, loading)
  },
  /**
   * 删除拼团活动
   * @param data
   * @returns {*}
   */
  delCollage(id, loading = false) {
    let url = `/social-shopping/api/backend/activity-manage/activity/${id}`
    return request.delete(url, {}, loading)
  },
  // 活动列表[v2.3.4]
  getActiveList(data, loading = false) {
    let url = '/social-shopping/api/backend/activity-manage/activity'
    return request.get(url, data, loading)
  },
  // 活动状态统计[v2.3.4]
  getActiveStatus(data, loading = false) {
    let url = '/social-shopping/api/backend/activity-manage/activity-status'
    return request.get(url, data, loading)
  },
}
