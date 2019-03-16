import request from '@utils/request'

export default {
  /**
   * 库位列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getStoreList(data, loading = true) {
    let url = '/scm/api/backend/warehouse/position'
    return request.get(url, data, loading)
  },
  /**
   * 顶级库位新增
   * @param orderId
   * @param loading
   * @returns {*}
   */
  addStoreList(data, loading = false) {
    let url = '/scm/api/backend/warehouse/position'
    return request.post(url, data, loading)
  },
  /**
   * 顶级库位删除
   * @param orderId
   * @param loading
   * @returns {*}
   */
  delStore(id, data, loading = false) {
    let url = `/scm/api/backend/warehouse/position/${id}`
    return request.delete(url, data, loading)
  },
  /**
   * 顶级库位编辑
   * @param orderId
   * @param loading
   * @returns {*}
   */
  editStore(id, data, loading = false) {
    let url = `/scm/api/backend/warehouse/position/${id}`
    return request.put(url, data, loading)
  },
  /**
   * 子库位新增
   * @param orderId
   * @param loading
   * @returns {*}
   */
  addSmallStore(data, loading = false) {
    let url = `/scm/api/backend/warehouse/son-position`
    return request.post(url, data, loading)
  },
  /**
   * 子库位编辑
   * @param orderId
   * @param loading
   * @returns {*}
   */
  editSmallStore(id, data, loading = false) {
    let url = `/scm/api/backend/warehouse/son-position/${id}`
    return request.put(url, data, loading)
  },
  /**
   * 子库位删除
   * @param orderId
   * @param loading
   * @returns {*}
   */
  delSmallStore(id, data, loading = false) {
    let url = `/scm/api/backend/warehouse/son-position/${id}`
    return request.delete(url, data, loading)
  },
  /**
   * 通过上级获取下级列表
   * @param orderId
   * @param loading
   * @returns {*}
   */
  findChild(id, data, loading = false) {
    let url = `/scm/api/backend/warehouse/son-position/${id}`
    return request.get(url, data, loading)
  },
  /**
   * 入库单列表
   * @param orderId
   * @param loading
   * @returns {*}
   */
  getEnterList(data, loading = true) {
    let url = `/scm/api/backend/warehouse/entry-orders`
    return request.get(url, data, loading)
  },
  /**
   * 入库单列表
   * @param orderId
   * @param loading
   * @returns {*}
   */
  getOutList(data, loading = true) {
    let url = `/scm/api/backend/warehouse/out-orders`
    return request.get(url, data, loading)
  },
  /**
   * 入库单明细
   * @param orderId
   * @param loading
   * @returns {*}
   */
  getEnterDetail(id, data, loading = true) {
    let url = `/scm/api/backend/warehouse/entry-details/${id}`
    return request.get(url, data, loading)
  },
  /**
   * 出库单明细
   * @param orderId
   * @param loading
   * @returns {*}
   */
  getOutDetail(id, data, loading = true) {
    let url = `/scm/api/backend/warehouse/out-details/${id}`
    return request.get(url, data, loading)
  }
}
