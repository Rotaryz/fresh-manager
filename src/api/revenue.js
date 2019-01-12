import request from '@utils/request'

export default {
  /**
   * 获取营收概况
   * @param data
   * @param loading
   * @returns {*}
   */
  getRevenueDetail(data = {}, loading = false) {
    let url = '/social-shopping/api/backend/finance/revenue-detail'
    return request.get(url, data, loading)
  },
  /**
   * 获取营收趋势
   * @param data
   * @param loading
   * @returns {*}
   */
  getRevenueTrend(data = {}, loading = false) {
    let url = '/social-shopping/api/backend/finance/revenue-trend'
    return request.get(url, data, loading)
  }
}
