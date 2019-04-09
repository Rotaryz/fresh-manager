import request from '@utils/request'

export default {
  /**
   * 团长数据
   * @param data
   * @param loading
   * @returns {*}
   */
  managerData(data, loading = true) {
    let url = '/social-shopping/api/backend/statistics-manager-data'
    return request.get(url, data, loading)
  },
  /**
   * 交易数据
   * @param data
   * @param loading
   * @returns {*}
   */
  tradeData(data, loading = true) {
    let url = '/social-shopping/api/backend/statistics-trade-data'
    return request.get(url, data, loading)
  },
  /**
   *  商品数据
   * @param data
   * @param loading
   * @returns {*}
   */
  goodsData(data, loading = true) {
    let url = '/social-shopping/api/backend/statistics-goods-data'
    return request.get(url, data, loading)
  },
  /**
   *  供应链基础数据统计
   * @param data
   * @param loading
   * @returns {*}
   */
  getBaseData(data, loading = false) {
    let url = '/scm/api/backend/statistics/base-data'
    return request.get(url, data, loading)
  },
  /**
   *  基础数据统计
   * @param data
   * @param loading
   * @returns {*}
   */
  getStatisticsBaseData(data, loading = false) {
    let url = '/social-shopping/api/backend/statistics-base-data'
    return request.get(url, data, loading)
  },
  /**
   *  供应链待处理任务统计
   * @param data
   * @param loading
   * @returns {*}
   */
  getTaskData(data, loading = false) {
    let url = '/scm/api/backend/statistics/task-data'
    return request.get(url, data, loading)
  },
  /**
   *  商城待处理任务统计
   * @param data
   * @param loading
   * @returns {*}
   */
  getStatisticsTaskData(data, loading = false) {
    let url = '/social-shopping/api/backend/statistics-task-data'
    return request.get(url, data, loading)
  },
  /**
   *  商城待处理任务统计
   * @param data
   * @param loading
   * @returns {*}
   */
  echartData(data, loading = false) {
    let url = '/social-shopping/api/backend/statistics-week-data'
    return request.get(url, data, loading)
  }
}
