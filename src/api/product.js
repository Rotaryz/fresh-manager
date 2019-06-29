import request from '@utils/request'

export default {
  /**
   * 单位列表
   * @returns {*}
   */
  getUnitsList(data, loading = true) {
    let url = `/social-shopping/api/backend/goods-manage/goods-units`
    return request.get(url, data, loading)
  },
  /**
   * 创建单位
   * @returns {*}
   */
  createUnits(data, loading = false) {
    let url = `/social-shopping/api/backend/goods-manage/goods-units`
    return request.post(url, data, loading)
  },
  /**
   * 编辑单位
   * @returns {*}
   */
  delUnits(id, data, loading = false) {
    let url = `/social-shopping/api/backend/goods-manage/goods-units/${id}`
    return request.delete(url, data, loading)
  },
  /**
   * 删除单位
   * @returns {*}
   */
  editUnits(id, data, loading = false) {
    let url = `/social-shopping/api/backend/goods-manage/goods-units/${id}`
    return request.put(url, data, loading)
  },
  /**
   * 商品系统分类列表
   * @returns {*}
   */
  getCategory(data, loading = true) {
    let url = `/social-shopping/api/backend/goods-manage/goods-category-list`
    return request.get(url, data, loading)
  },
  /**
   * 商品系统分类列表（无权限）
   * @returns {*}
   */
  getCategoryList(data, loading = true) {
    let url = `/social-shopping/api/backend/goods-manage/goods-category-list`
    return request.get(url, data, loading)
  },
  /**
   * 创建商品系统分类
   * @returns {*}
   */
  createCategory(data, loading = false) {
    let url = `/social-shopping/api/backend/goods-manage/goods-category`
    return request.post(url, data, loading)
  },
  /**
   * 更新商品系统分类
   * @returns {*}
   */
  editCategory(id, data, loading = false) {
    let url = `/social-shopping/api/backend/goods-manage/goods-category/${id}`
    return request.put(url, data, loading)
  },
  /**
   * 删除商品系统分类
   * @returns {*}
   */
  delCategory(id, loading = false) {
    let url = `/social-shopping/api/backend/goods-manage/goods-category/${id}`
    return request.delete(url, null, loading)
  },
  /**
   * 获取商品详情[v2.8]
   * @param id
   * @param loading
   * @returns {*}
   */
  getGoodsDetail(id, data, loading = true) {
    let url = `/social-shopping/api/backend/goods-manage/goods/${id}`
    return request.get(url, data, loading)
  },
  /**
   * 创建商品[v2.8]
   * @param id
   * @param loading
   * @returns {*}
   */
  createGoodsDetail(data, loading = true) {
    let url = `/social-shopping/api/backend/goods-manage/goods`
    return request.post(url, data, loading)
  },
  /**
   * 商品列表[v2.8]
   * @param id
   * @param loading
   * @returns {*}
   */
  getGoodsList(data, loading = true) {
    let url = `/social-shopping/api/backend/goods-manage/goods`
    return request.get(url, data, loading)
  },
  /**
   * 编辑商品详情
   * @param id
   * @param loading
   * @returns {*}
   */
  editGoodsDetail(id, data, loading = true) {
    let url = `/social-shopping/api/backend/goods-manage/goods/${id}`
    return request.put(url, data, loading)
  },
  /**
   * 删除商品
   * @param id
   * @param loading
   * @returns {*}
   */
  delGoodsDetail(id, data, loading = false) {
    let url = `/social-shopping/api/backend/goods-manage/goods/${id}`
    return request.delete(url, data, loading)
  },
  /**
   * 商品上下架
   * @param id
   * @param loading
   * @returns {*}
   */
  upDownGoods(data, loading = false) {
    let url = `/social-shopping/api/backend/goods-manage/goods-toggle-online`
    return request.post(url, data, loading)
  },
  /**
   * 同步商品相关数据
   * @param id
   * @param loading
   * @returns {*}
   */
  syncGoodsInfo(data = null, loading = true) {
    let url = `/social-shopping/api/backend/guanmai/sync-goods-info`
    return request.get(url, data, loading)
  },
  /**
   * 供应商列表
   * @param id
   * @param loading
   * @returns {*}
   */
  getSupplier(data, loading = true) {
    let url = `/social-shopping/api/backend/goods-manage/supplier`
    return request.get(url, data, loading)
  },

  /**
   * 订单的统计
   * @param loading
   * @returns {*}
   */
  purchaseTaskStatistic(data, loading = false) {
    let url = '/scm/api/backend/purchase/purchase-task-statistic'
    return request.get(url, data, loading)
  },

  /**
   * 商品类型统计
   * @param loading
   * @returns {*}
   */
  getGoodsStatus(data, loading = false) {
    let url = '/social-shopping/api/backend/goods-manage/goods-status'
    return request.get(url, data, loading)
  },

  /**
   * 商品分类统计
   * @param loading
   * @returns {*}
   */
  getCategoryStatus(data, loading = false) {
    let url = '/social-shopping/api/backend/goods-manage/goods-category-status'
    return request.get(url, data, loading)
  },
  /**
   * 商品新建模板导入
   * @param data
   * @param loading
   * @returns {*}
   */
  goodsNewInto(data, loading = false, timeout) {
    let url = `/social-shopping/api/backend/goods-manage/import-create-goods`
    return request.post(url, data, loading, timeout)
  },
  /**
   * 商品编辑模板
   * @param data
   * @param loading
   * @returns {*}
   */
  goodsNewEdit(data, loading = false, timeout) {
    let url = `/social-shopping/api/backend/goods-manage/import-update-goods`
    return request.post(url, data, loading, timeout)
  },
  /**
   * 检查切换库存类型
   * @param data
   * @param loading
   * @returns {*}
   */
  checkStockType(id, loading = false) {
    let url = `/social-shopping/api/backend/goods-manage/goods-change-stock/${id}`
    return request.get(url, loading)
  },
  /**
   * 商品素材系统类目列表-scm
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  getScmCategoryList(data, loading = true) {
    let url = `/social-shopping/api/backend/goods-material/goods-material-category`
    return request.get(url, data, loading)
  },
  /**
   * 商品素材列表-scm
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  getScmStoreList(data, loading = true) {
    let url = `/social-shopping/api/backend/goods-material/goods-material`
    return request.get(url, data, loading)
  },
  /**
   * 商品素材添加列表-scm
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  addScmGoods(id, data, loading = false) {
    let url = `/social-shopping/api/backend/goods-material/goods-material-add/${id}`
    return request.get(url, data, loading)
  },
  /**
   * 商品新建模板导入【供应链专用】[v2.8]-scm
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  scmGoodsImport(data, loading = false) {
    let url = `/social-shopping/api/backend/goods-manage/import-create-scm-goods`
    return request.post(url, data, loading)
  },
  /**
   * 商品新建模板导入【供应链专用】[v2.8]-scm
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  checkGoodsImport(data, loading = false) {
    let url = `/social-shopping/api/backend/goods-manage/import-create-scm-goods-check`
    return request.post(url, data, loading)
  },
  /**
   * 检查是否有采购任务[v2.8]
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  checkGoodsTask(data, loading = false) {
    let url = `/social-shopping/api/backend/goods-manage/check-task`
    return request.get(url, data, loading)
  }
}
