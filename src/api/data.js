import request from '@utils/request'

export default {
  /**
   * 团长数据
   * @param data
   * @param loading
   * @returns {*}
   */
  managerData(data, loading = false) {
    // let url = '/social-shopping/api/backend/statistics-manager-data'
    let url = '/social-shopping/v2/api/backend/data-statistics-ranking-shop'
    return request.get(url, data, loading)
  },
  /**
   * 实时总览数据
   * @param data
   * @param loading
   * @returns {*}
   */
  tradeData(data, loading = true) {
    // let url = '/social-shopping/api/backend/statistics-trade-data'
    let url = '/social-shopping/v2/api/openapi/data-center/over-view/statistics'
    return request.get(url, data, loading)
  },
  /**
   * 实时总览折线图数据
   * @param data
   * @param loading
   * @returns {*}
   */
  tradeDayData(data, loading = true) {
    // let url = '/social-shopping/api/backend/statistics-trade-data'
    let url = '/social-shopping/v2/api/backend/data-center/over-view/statistics-day'
    return request.get(url, data, loading)
  },
  /**
   *  商品数据
   * @param data
   * @param loading
   * @returns {*}
   */
  goodsData(data, loading = false) {
    // let url = '/social-shopping/api/backend/statistics-goods-data'
    let url = '/social-shopping/v2/api/backend/data-statistics-ranking-goods'
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
    // let url = '/social-shopping/api/backend/statistics-base-data'
    let url = '/social-shopping/v2/api/backend/data-statistics-base-data'
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
  },
  /**
   *  搜索词排行数据
   * @param data
   * @param loading
   * @returns {*}
   */
  searchData(data, loading = false) {
    let url = '/social-shopping/v2/api/backend/data-statistics-ranking-search-keyword'
    return request.get(url, data, loading)
  },
}
