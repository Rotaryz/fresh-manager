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
  }
}
