import request from '@utils/request'

export default {
  /**
   * 成员列表
   * @param data
   * @param loading
   * @returns {*}
   */
  customerList(data, loading = true) {
    let url = '/social-shopping/api/backend/customer-index'
    return request.get(url, data, loading)
  }
}
