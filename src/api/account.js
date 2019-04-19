import request from '@utils/request'

export default {
  getAccountData(data, loading = true) {
    let url = '/social-shopping/api/backend/backend-login'
    return request.get(url, data, loading)
  }
}
