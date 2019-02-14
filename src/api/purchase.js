import request from '@utils/request'

export default {
  /**
   * 采购列表
   * @param data
   * @param loading
   * @returns {*}
   */
  purchaseList(data, loading = false) {
    let url = '/social-shopping/api/backend/store-purchase'
    return request.get(url, data, loading)
  },
  /**
   * 获取采购单详情
   * @param data
   * @param loading
   * @returns {*}
   */
  purchaseDetail(id, loading = false) {
    let url = `/social-shopping/api/backend/store-purchase/${id}`
    return request.get(url, null, loading)
  }
}
