import request from '@utils/request'

export default {
  /**
   * 获取交易明细状态列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getSettleStatus(data = {}, loading = false) {
    let url = '/social-shopping/api/backend/finance/settle-status'
    return request.get(url, data, loading)
  },
  /**
   * 获取交易明细列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getSettleLogs(data = {}, loading = false) {
    let url = '/social-shopping/api/backend/finance/settle-logs'
    return request.get(url, data, loading)
  },
  /**
   * 获取账户总览
   * @param data
   * @param loading
   * @returns {*}
   */
  getAccount(data = {}, loading = false) {
    let url = '/social-shopping/api/backend/finance/maney-account'
    return request.get(url, data, loading)
  },
  /**
   * 获取打款记录列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getPayList(data = {}, loading = false) {
    let url = '/social-shopping/api/backend/finance/payoffs'
    return request.get(url, data, loading)
  }
}
