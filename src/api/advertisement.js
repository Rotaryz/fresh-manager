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
  /**
   * 新建轮播图
   * @param data
   * @returns {*}
   */
  storeBanner(data) {
    let url = '/social-shopping/api/backend/ad/wheel-planting'
    return request.post(url, data, false)
  },
  /**
   * 更新轮播图
   * @param data
   * @param id
   * @returns {*|AxiosPromise<any>|IDBRequest|Promise<void>}
   */
  updateBanner(data, id) {
    let url = `/social-shopping/api/backend/ad/wheel-planting/${id}`
    return request.put(url, data, false)
  },
  /**
   * 删除轮播图
   * @param data
   * @param id
   * @returns {*|AxiosPromise<any>|IDBRequest|Promise<void>}
   */
  deleteBanner(id) {
    let url = `/social-shopping/api/backend/ad/wheel-planting/${id}`
    return request.delete(url, null, false)
  },
  /**
   * 轮播图排序
   * @param data
   * @param id
   * @returns {*|AxiosPromise<any>|IDBRequest|Promise<void>}
   */
  wheelPlantingSort(data) {
    let url = `/social-shopping/api/backend/ad/wheel-planting-sort`
    return request.post(url, data, false)
  }
}
