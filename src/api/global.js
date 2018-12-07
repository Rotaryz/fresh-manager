import request from '@utils/request'
import {defaultProcess} from './api-utils'

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
  }
}

function fn(res) {
  return res
}
