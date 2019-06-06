import request from '@utils/request'

export default {
  /**
   * 查询司机列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getDriverList(data = {}, loading = true) {
    let url = '/scm/api/backend/delivery/driver'
    return request.get(url, data, loading)
  },
  /**
   * 新增司机
   * @param data
   * @param loading
   * @returns {*}
   */
  addDriver(data, loading = true) {
    let url = '/scm/api/backend/delivery/driver'
    return request.post(url, data, loading)
  },
  /**
   * 编辑司机
   * @param id
   * @param data
   * @param loading
   * @returns {*|AxiosPromise<any>|IDBRequest<IDBValidKey>|Promise<void>}
   */
  editDriver(id, data, loading = true) {
    let url = `/scm/api/backend/delivery/driver/${id}`
    return request.put(url, data, loading)
  },
  /**
   * 获取线路列表
   * @returns {*}
   */
  getRoads() {
    let url = '/scm/api/backend/delivery/road'
    return request.get(url)
  },
  /**
   * 新增线路
   * @param data
   * @param loading
   * @returns {*}
   */
  addRoad(data, loading = true) {
    let url = '/scm/api/backend/delivery/road'
    return request.post(url, data, loading)
  },
  /**
   * 删除线路
   * @param roadId
   * @param loading
   * @returns {*}
   */
  deleteRoad(roadId, loading = true) {
    let url = `/scm/api/backend/delivery/road/${roadId}`
    return request.delete(url, {}, loading)
  },
  /**
   * 商户配置
   * @param data
   * @param loading
   * @returns {*}
   */
  setAddress(data, loading = true) {
    let url = '/scm/api/backend/delivery/road-set-address'
    return request.post(url, data, loading)
  },
  /**
   * 获取配送点列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getDeliveryAddress(data, loading = true) {
    let url = '/scm/api/backend/delivery/delivery-address'
    return request.get(url, data, loading)
  },
  /**
   * 获取配送订单任务列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getDeliveryOrder(data, loading = true) {
    let url = '/scm/api/backend/delivery/delivery'
    return request.get(url, data, loading)
  },
  /**
   * 获取配送司机任务列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getDeliveryDriver(data, loading = true) {
    let url = '/scm/api/backend/delivery/delivery-driver-tasks'
    return request.get(url, data, loading)
  },
  /**
   * 配送任务统计
   * @param data
   * @param loading
   * @returns {*}
   */
  getSeliveryStatistic(data, loading = false) {
    let url = '/scm/api/backend/delivery/delivery-statistic'
    return request.get(url, data, loading)
  },
  /**
   *  配送任务签收
   * @param data
   * @param loading
   * @returns {*}
   */
  deliverySign(id, loading = false) {
    let url = `/scm/api/backend/delivery/delivery-sign/${id}`
    return request.get(url, false, loading)
  },
  /**
   *  配送任务批量签收
   * @param data
   * @param loading
   * @returns {*}
   */
  batchDeliverySign(data, loading = true) {
    let url = `/scm/api/backend/delivery/batch-delivery-sign`
    return request.get(url, data, loading)
  }
}
