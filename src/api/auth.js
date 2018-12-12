import request from '@utils/request'

export default {
  logIn(data, loading = true) {
    let url = '/social-shopping/api/backend/backend-login'
    return request.post(url, data, loading)
  },
  validate() {
    let url = '/social-shopping/api/backend/token-validate'
    return request.get(url)
  }
}
