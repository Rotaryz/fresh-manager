import request from '@utils/request'

export default {
  /**
   * 商品分类列表
   */
  getCategoryList(data, loading = true) {
    let url = '/social-shopping/api/backend/community/groups'
    return request.get(url, data, loading)
  },
  // ----------------模块1各项数据接口-------------------
  /**
   * 商品结构
   */
  getStructure(data, loading = false) {
    let url = `/social-shopping/api/backend/community/groups`
    return request.get(url, data, loading)
  },
  /**
   * 商品排行
   */
  getRank(data, loading = false) {
    let url = `/social-shopping/api/backend/community/groups`
    return request.get(url, data, loading)
  },
  /**
   * 动销率
   */
  getSellRatio(data, loading = false) {
    let url = `/social-shopping/api/backend/community/groups`
    return request.get(url, data, loading)
  },
  /**
   * 售罄率
   */
  getSellOut(data, loading = false) {
    let url = `/social-shopping/api/backend/community/groups`
    return request.get(url, data, loading)
  },
  // ----------------模块2各项数据接口-------------------
  /**
   * 退货数
   */
  getReturnGoods(data, loading = false) {
    let url = `/social-shopping/api/backend/community/groups`
    return request.get(url, data, loading)
  },
  /**
   * 退货率
   */
  getReturnRatio(data, loading = false) {
    let url = `/social-shopping/api/backend/community/groups`
    return request.get(url, data, loading)
  },
  // ----------------模块3各项数据接口-------------------
  /**
   * 全部采购匹配度
   */
  getMatch(data, loading = false) {
    let url = `/social-shopping/api/backend/community/groups`
    return request.get(url, data, loading)
  },
  /**
   * 全部商品SKU数
   */
  getSKU(data, loading = false) {
    let url = `/social-shopping/api/backend/community/groups`
    return request.get(url, data, loading)
  },
  /**
   * 毛利率
   */
  getRate(data, loading = false) {
    let url = `/social-shopping/api/backend/community/groups`
    return request.get(url, data, loading)
  },
  /**
   * 采购数
   */
  getPurchase(data, loading = false) {
    let url = `/social-shopping/api/backend/community/groups`
    return request.get(url, data, loading)
  },
  // ----------------模块4各项数据接口-------------------
  /**
   * 库存排行
   */
  getStockRank(data, loading = false) {
    let url = `/social-shopping/api/backend/community/groups`
    return request.get(url, data, loading)
  },
  /**
   * 库存周转率
   */
  getStockRatio(data, loading = false) {
    let url = `/social-shopping/api/backend/community/groups`
    return request.get(url, data, loading)
  },
}
