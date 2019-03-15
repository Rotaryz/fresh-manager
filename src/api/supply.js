import request from '@utils/request'

export default {
  /**
   * 采购单列表
   * @param data
   * @param loading
   * @returns {*}
   */
  purchaseOrder(data, loading = true) {
    let url = '/scm/api/backend/purchase/purchase-order'
    return request.get(url, data, loading)
  }
}
