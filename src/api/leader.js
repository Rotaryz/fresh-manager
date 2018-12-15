import request from '@utils/request'

export default {
  /**
   * 新建团长
   * @param data
   * @param loading
   * @returns {*}
   */
  storeLeader(data, loading = true) {
    let url = '/social-shopping/api/backend/shop-manager'
    return request.post(url, data, loading)
  },
  /**
   * 获取团长列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getLeaderList(data, loading = true) {
    let url = '/social-shopping/api/backend/shop-manager'
    return request.get(url, data, loading)
  },
  /**
   * 获取团长详情
   * @param id
   * @param loading
   * @returns {*}
   */
  getLeaderDetail(id, loading = true) {
    let url = `/social-shopping/api/backend/shop-manager/${id}`
    return request.get(url, null, loading)
  },
  /**
   * 编辑团长
   * @param id
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  editLeader(id, data, loading = true) {
    let url = `/social-shopping/api/backend/shop-manager/${id}`
    return request.put(url, data, loading)
  }
}
