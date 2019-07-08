import request from '@utils/request'

export default {
  /**
   * 内容分類列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getSortList(data={keyword:'',page:1,limit:0,status:1}, loading = false) {
    let url = `/social-shopping/api/backend/article-category-index`
    return request.get(url, data, loading)
  },
  addSort(data,loading=false){
    let url = `/social-shopping/api/backend/article-category-store`
    return request.get(url, data, loading)
  },
  addContent(data,loading=true){
    let url = `/social-shopping/api/backend/article-store`
    return request.post(url, data, loading)
  },
  addDraft(data,loading=true){
    let url = `/social-shopping/api/backend/article-draft`
    return request.post(url, data, loading)
  },
  /**
   * 内容詳情
   * @param data
   * @param loading
   * @returns {*}
   */
  getArticleDetail({id}, loading = true) {
    let url = `/social-shopping/api/backend/article-show/${id}`
    return request.get(url, {}, loading)
  },
  editContetnArticle({id,...data}, loading = true){
    let url = ` /social-shopping/api/backend/article-update/${id}`
    return request.post(url, data, loading)
  },
  /**
   * 根據video 返回的 file_id获取cover_image
   * @param data
   * @param loading
   * @returns {*}
   */
  getCoverImage(data, loading = false) {
    let url = `/social-shopping/api/cos/get-file-info`
    return request.get(url, data, loading)
  }
}
