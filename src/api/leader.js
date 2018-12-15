import request from '@utils/request'

export default {
  storeLeader(data, loading = true) {
    let url = '/social-shopping/api/backend/shop-manager'
    return request.post(url, data, loading)
  },
  leaderList(data, loading = true) {
    let url = '/social-shopping/api/backend/shop-manager'
    return request.get(url, data, loading)
  }
}
