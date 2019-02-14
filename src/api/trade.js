import request from '@utils/request'

export default {
  /**
   * 获取交易记录类型列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getTradeOrderType(data = {}, loading = false) {
    let url = '/social-shopping/api/backend/finance/trade-order-type'
    return request.get(url, data, loading)
  },
  /**
   * 获取交易记录列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getTradeList(data = {}, loading = false) {
    let url = '/social-shopping/api/backend/finance/trade'
    return request.get(url, data, loading)
  },
  /**
   * 获取交易记录概况
   * @param data
   * @param loading
   * @returns {*}
   */
  getTradeDetail(data = {}, loading = false) {
    let url = '/social-shopping/api/backend/finance/trade-detail'
    return request.get(url, data, loading)
  }
}
