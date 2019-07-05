import request from '@utils/request'

export default {
  /**
   * 内容分类列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getContentClassList(data, loading = false) {
    let url = ''
    return request.get(url, data, loading)
  },
  /**
   * 内容分类删除
   * @param data
   * @param loading
   * @returns {*}
   */
  delContentClass(id, data = {}, loading = false) {
    let url = `${id}`
    return request.delete(url, data, loading)
  },
  /**
   * 内容分类编辑
   * @param data
   * @param loading
   * @returns {*}
   */
  editClassify(data, id, loading = false) {
    let url = `${id}`
    return request.post(url, data, loading)
  },
  /**
   * 内容分类新建
   * @param data
   * @param loading
   * @returns {*}
   */
  newClassify(data, loading = false) {
    let url = ``
    return request.post(url, data, loading)
  },
  /**
   * 我的作品列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getWorkList(data, loading = false) {
    let url = ``
    return request.get(url, data, loading)
  },
  /**
   * 我的作品列表
   * @param data
   * @param loading
   * @returns {*}
   */
  createQrcode(data, loading = false) {
    let url = ``
    return request.get(url, data, loading)
  },
  /**
   * 我的作品列表
   * @param data
   * @param loading
   * @returns {*}
   */
  delWork(id, data = {}, loading = true) {
    let url = ``
    return request.delete(url, data, loading)
  },
  /**
   * 选择内容分类
   * @param data
   * @param loading
   * @returns {*}
   */
  selectContent(id, data = {}, loading = true) {
    let url = `/${id}`
    return request.delete(url, data, loading)
  }
}
