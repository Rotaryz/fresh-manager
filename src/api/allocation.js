import request from '@utils/request'

export default {
  /**
   *  配货配置列表[v1.3]
   * @param data
   * @param loading
   * @returns {*}
   */
  allocationList(data, loading) {
    let url = `/scm/api/backend/oms/allocation-stock-configs`
    return request.get(url, data, loading)
  },
  /**
   *  设定配货方式[v1.3]
   * @param data
   * @param loading
   * @returns {*}
   */
  setSiteConfig(data, loading = true) {
    let url = `/scm/api/backend/oms/set-site-config`
    return request.post(url, data, loading)
  },
  /**
   *  配送配置详情[v1.3]
   * @param data
   * @param loading
   * @returns {*}
   */
  runTimeConfig(data, loading = true) {
    let url = `/scm/api/backend/oms/run-time-config`
    return request.get(url, data, loading)
  },
  /**
   *  编辑配送配置[v1.3]
   * @param data
   * @param loading
   * @returns {*}
   */
  setRunTimeConfig(data, loading = true) {
    let url = `/scm/api/backend/oms/set-run-time-config`
    return request.post(url, data, loading)
  }
}
