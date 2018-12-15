import request from '@utils/request'

export default {
  getOrderList(data, loading = true) {
    let url = '/social-shopping/api/backend/order'
    return request.get(url, data, loading)
  },
  getOrderDetail(id) {
    let url = `/social-shopping/api/backend/order/${id}`
    return request.get(url)
  }
}
