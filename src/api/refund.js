import request from '@utils/request'

export default {
  getRefundList(data, loading = true) {
    let url = '/social-shopping/api/backend/after-sale-orders'
    return request.get(url, data, loading)
  },
  getRefundDetail(id) {
    let url = `/social-shopping/api/backend/after-sale-orders/${id}`
    return request.get(url)
  }
}
