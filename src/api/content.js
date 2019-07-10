import request from '@utils/request'

export default {
  /**
   * 内容分类列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getContentClassList(data, loading = false) {
    let url = `/social-shopping/api/backend/article-category-index`
    return request.get(url, data, loading)
  },
  /**
   * 内容分类删除
   * @param data
   * @param loading
   * @returns {*}
   */
  delContentClass(id, data = {}, loading = false) {
    let url = `/social-shopping/api/backend/article-category-destory/${id}`
    return request.delete(url, data, loading)
  },
  /**
   * 内容分类编辑
   * @param data
   * @param loading
   * @returns {*}
   */
  editClassify(data, id, loading = true) {
    let url = `/social-shopping/api/backend/article-category-update/${id}`
    return request.get(url, data, loading)
  },
  /**
   * 内容分类新建
   * @param data
   * @param loading
   * @returns {*}
   */
  newClassify(data, loading = false) {
    let url = `/social-shopping/api/backend/article-category-store`
    return request.get(url, data, loading)
  },
  /**
   * 分类状态变更
   * @param data
   * @param loading
   * @returns {*}
   */
  changeClassify(id, data, loading = false) {
    let url = `/social-shopping/api/backend/article-category-set-status/${id}`
    return request.get(url, data, loading)
  },
  /**
   * 我的作品列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getWorkList(data, loading = false) {
    let url = `/social-shopping/api/backend/article-index`
    return request.get(url, data, loading)
  },
  /**
   * 文章列表状态
   * 内容分類列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getSortList(data = {keyword: '', page: 1, limit: 0, status: 1}, loading = false) {
    let url = `/social-shopping/api/backend/article-category-index`
    return request.get(url, data, loading)
  },
  addSort(data, loading = false) {
    let url = `/social-shopping/api/backend/article-category-store`
    return request.get(url, data, loading)
  },
  addContent(data, loading = true) {
    let url = `/social-shopping/api/backend/article-store`
    return request.post(url, data, loading)
  },
  addDraft(data, loading = true) {
    let url = `/social-shopping/api/backend/article-draft`
    return request.post(url, data, loading)
  },
  getCoverImage(data, loading = false) {
    let url = `/social-shopping/api/cos/get-file-info`
    return request.get(url, data, loading)
  },
  getAuth(loading=false){
    let url = `/social-shopping/api/backend/article-last-author`
    return request.get(url, {}, loading)
  },
  /**
   * 内容詳情
   *
   */
  getWorkStatusList(data, loading = false) {
    let url = `/social-shopping/api/backend/article-status`
    return request.get(url, data, loading)
  },
  /**
   * 我的作品列表
   * @param data
   * @param loading
   * @returns {*}
   */
  createQrcode(data, loading = false) {
    let url = `/social-shopping/api/create-qrcode`
    return request.post(url, data, loading)
  },
  /**
   * 删除我的作品列表
   * @param data
   * @param loading
   * @returns {*}
   */
  delWork(id, data = false, loading = true) {
    let url = `/social-shopping/api/backend/article-destory/${id}`
    return request.delete(url, data, loading)
  },
  /**
   * 上下线我的作品列表
   * @param data
   * @param loading
   * @returns {*}
   */
  downLineWork(id, data = {status: 2}, loading = true) {
    let url = `/social-shopping/api/backend/article-set-status/${id}`
    return request.get(url, data, loading)
  },
  /**
   * 上下线我的作品列表
   */
  getArticleDetail({id}, loading = true) {
    let url = `/social-shopping/api/backend/article-show/${id}`
    return request.get(url, {}, loading)
  },
  editContetnArticle({id, ...data}, loading = true) {
    let url = ` /social-shopping/api/backend/article-update/${id}`
    return request.post(url, data, loading)
  },
  /**
   * 根據video 返回的 file_id获取cover_image
   * @param data
   * @param loading
   * @returns {*}
   */
  upLineWork(id, data = {status: 1}, loading = true) {
    let url = `/social-shopping/api/backend/article-set-status/${id}`
    return request.get(url, data, loading)
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
  },
  /**
   * 内容中心列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getCenterList(data, loading = true) {
    let url = `/social-shopping/api/backend/article-material-index`
    return request.get(url, data, loading)
  },
  /**
   * 素材分类列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getMaterialList(data, loading = false) {
    let url = `/social-shopping/api/backend/article-category-material-index`
    return request.get(url, data, loading)
  }
}
