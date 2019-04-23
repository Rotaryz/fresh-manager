import request from '@utils/request'

export default {
  /**
   * 拓展活动列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getOutreachList(data, loading = true) {
    let url = '/social-shopping/api/backend/activity-manage/activity'
    return request.get(url, data, loading)
  },
  /**
   * 拓展活动详情
   * @param data
   * @param loading
   * @returns {*}
   */
  getOutreachDetail(id, loading = true) {
    let url = `/social-shopping/api/backend/activity-manage/activity-offline/${id}`
    return request.get(url, {}, loading)
  },
  /**
   * 拓展活动成员列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getMemberList({page, id}, loading = true) {
    let url = `/social-shopping/api/backend/activity-manage/activity-offline-members/${id}`
    return request.get(url, {page}, loading)
  },
  /**
   * 拓展任务详情
   * @param data
   * @param loading
   * @returns {*}
   */
  getTaskDetail({page, id}, loading = true) {
    let url = `/social-shopping/api/backend/activity-manage/member-activity-list/${id}`
    return request.get(url, {page}, loading)
  },
  /**
   * 删除活动
   * @param data
   * @param loading
   * @returns {*}
   */
  deleteActivity(id, loading = false) {
    // let url = `/social-shopping/api/backend/activity-manage/activity-offline/${id}`
    let url = `/social-shopping/api/backend/activity-manage/activity/${id}`
    return request.delete(url, null, loading)
  },
  /**
   * 团长列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getGroupList(data, loading = false) {
    let url = `/social-shopping/api/backend/shop-manager`
    return request.get(url, data, loading)
  },
  /**
   * 商品列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getGoodsList(data, loading = false) {
    let url = `/social-shopping/api/backend/goods-manage/goods`
    return request.get(url, data, loading)
  },
  /**
   * 二级分类列表
   * @param data
   * @param loading
   * @returns {*}
   */
  goodsCategory(data, loading = false) {
    let url = `/social-shopping/api/backend/goods-manage/goods-category`
    return request.get(url, data, loading)
  },
  /**
   * 新建活动
   * @param data
   * @param loading
   * @returns {*}
   */
  storeActivity(data, loading = false) {
    let url = `/social-shopping/api/backend/activity-manage/activity-offline`
    return request.post(url, data, loading)
  },
  /**
   * 下载二维码
   * @param data
   * @param loading
   * @returns {*}
   */
  getQrCode(data, loading = false) {
    let url = `/social-shopping/api/create-qrcode`
    return request.post(url, data, loading)
  },
  /**
   * 部门列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getBranchList(data, loading = false) {
    let url = `/social-shopping/api/backend/activity-manage/department`
    return request.get(url, data, loading)
  },
  /**
   * 成员列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getTeamList(data, loading = false) {
    let url = `/social-shopping/api/backend/activity-manage/member`
    return request.get(url, data, loading)
  },

  /**
   * 拓展任务状态统计
   * @param loading
   * @returns {*}
   */
  getOutreachStatus(data, loading = false) {
    let url = '/social-shopping/api/backend/activity-manage/activity-status'
    return request.get(url, data, loading)
  }
}
