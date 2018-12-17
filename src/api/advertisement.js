import request from '@utils/request'

export default {
  /**
   * 轮播图列表
   * @param data
   * @param loading
   * @returns {*}
   */
  bannerList(data, loading = false) {
    let url = '/social-shopping/api/backend/ad/wheel-planting'
    return request.get(url, data, loading)
  },
  storeBanner(data) {
    let url = '/social-shopping/api/backend/ad/wheel-planting'
    return request.post(url, data, false)
  },
  updateBanner(data, id) {
    let url = `/social-shopping/api/backend/ad/wheel-planting/${id}`
    return request.put(url, data, false)
  }
}
