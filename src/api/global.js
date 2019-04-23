import request from '@utils/request'
import {defaultProcess} from '@utils/api-utils'

export default {
  /**
   * 获取微信JSSDK配置
   * @returns {*}
   */
  jssdkConfig(data, loading = false) {
    let url = '/api/wechat/jssdk'
    return request.get(url, data, loading)
  },
  jssdkConfigDemo(data, loading = false, toast = true) {
    let url = '/api/wechat/jssdk'
    return defaultProcess('get', url, data, loading, toast, fn)
  },
  /**
   * 获取服务器时间
   * @param loading
   * @returns {*}
   */
  getCurrentTime(loading = false) {
    let url = '/scm/api/backend/common/current-time'
    return request.get(url, false, loading)
  },
  /**
   * 获取系统升级状态
   * @param loading
   * @returns {*}
   */
  getSystemStatus(loading = false) {
    let url = '/social-shopping/api/get-system-status'
    return request.get(url, false, loading)
  }
}

function fn(res) {
  return res
}
