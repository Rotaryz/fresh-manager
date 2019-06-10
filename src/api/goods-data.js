import request from '@utils/request'

export default {
  /**
   * 商品分类列表
   */
  getCategoryList(data, loading = true) {
    let url = '/social-shopping/api/backend/goods-manage/goods-category'
    return request.get(url, data, loading)
  },
  /**
   * 分类下商品列表
   */
  getGoodsList(data, loading = false) {
    let url = '/social-shopping/api/backend/goods-manage/goods'
    return request.get(url, data, loading)
  },
  // ----------------模块1各项数据接口-------------------
  /**
   * 商品结构
   */
  getStructure(data, loading = false) {
    let url = `/social-shopping/api/backend/data-center/goods/goods-structure`
    return request.get(url, data, loading)
  },
  /**
   * 商品排行
   */
  getSaleRank(data, loading = false) {
    let url = `/social-shopping/api/backend/data-center/goods/sale-rank`
    return request.get(url, data, loading)
  },
  /**
   * 动销率
   */
  getSellRatio(data, loading = false) {
    let url = `/social-shopping/api/backend/data-center/goods/pin-sold-out-rate`
    return request.get(url, data, loading)
  },
  /**
   * 售罄率
   */
  getSellOut(data, loading = false) {
    let url = `/social-shopping/api/backend/data-center/goods/pin-sold-out-rate`
    return request.get(url, data, loading)
  },
  // ----------------模块2各项数据接口-------------------
  /**
   * 商品售后
   */
  getAfterServe(data, loading = false) {
    let url = `/social-shopping/api/backend/data-center/goods/after-server`
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
   * 采购
   */
  getGoodsPurchase(data, loading = false) {
    let url = `/social-shopping/api/backend/data-center/goods/purchase-data`
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
   * 库存数据（供应链）
   */
  getStockData(data, loading = false) {
    let url = `/social-shopping/api/backend/data-center/goods/sku-stock-data`
    return request.get(url, data, loading)
  },
  /**
   * 库存周转率
   */
  getStockRatio(data, loading = false) {
    let url = `/social-shopping/api/backend/community/groups`
    return request.get(url, data, loading)
  }
}
