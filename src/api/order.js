import request from '@utils/request'

export default {
  getOrderList(data, loading = true) {
    let url = '/social-shopping/api/backend/order'
    return request.get(url, data, loading)
  },
  getOrderDetail(id, data = {}, loading = true) {
    let url = `/social-shopping/api/backend/order/${id}`
    return request.get(url, data, loading)
  },
  getOrderExecel(data, loading = false) {
    let url = `/social-shopping/api/backend/order-excel`
    return request.get(url, data, loading)
  },
  getReturnsList(data, loading = true) {
    let url = '/social-shopping/api/backend/after-sale-orders'
    return request.get(url, data, loading)
  },
  getReturnsDetail(id, data = {}, loading = true) {
    let url = `/social-shopping/api/backend/after-sale-orders/${id}`
    return request.get(url, data, loading)
  },
  checkApply(data, loading = true) {
    let url = `/social-shopping/api/backend/check-after-sale`
    return request.post(url, data, loading)
  }
}
