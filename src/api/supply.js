import request from '@utils/request'

export default {
  /**
   * 采购单列表
   * @param data
   * @param loading
   * @returns {*}
   */
  purchaseOrder(data, loading = true) {
    let url = '/scm/api/backend/purchase/purchase-order'
    return request.get(url, data, loading)
  },
  /**
   * 查询采购单详情
   * @param data
   * @param loading
   * @returns {*}
   */
  purchaseDetail(id, loading = true) {
    let url = `/scm/api/backend/purchase/purchase-order/${id}`
    return request.get(url, null, loading)
  },
  /**
   * 查询采购单详情
   * @param data
   * @param loading
   * @returns {*}
   */
  purchaseOrderExport(id, loading = true) {
    let url = `/scm/api/backend/purchase/purchase-order-export/${id}`
    return request.get(url, null, loading)
  },
  /**
   * 采购任务列表
   * @param data
   * @param loading
   * @returns {*}
   */
  purchaseTask(data, loading = true) {
    let url = `/scm/api/backend/purchase/purchase-task`
    return request.get(url, data, loading)
  },
  /**
   * 发布采购任务
   * @param data
   * @param loading
   * @returns {*}
   */
  purchaseTaskPublish(data, loading = true) {
    let url = `/scm/api/backend/purchase/purchase-task-publish`
    return request.post(url, data, loading)
  },
  /**
   * 新增采购任务
   * @param data
   * @param loading
   * @returns {*}
   */
  storePurchaseTask(data, loading = true) {
    let url = `/scm/api/backend/purchase/purchase-task`
    return request.post(url, data, loading)
  },
  /**
   * 采购任务选择商品列表
   * @param data
   * @param loading
   * @returns {*}
   */
  purchaseTaskGoodsList(data, loading = false) {
    let url = `/scm/api/backend/purchase/purchase-task-goods-list`
    return request.get(url, data, loading)
  },
  /**
   * 获取采购员列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getPurchaseUser(data, loading = true) {
    let url = '/scm/api/backend/purchase/purchase-user'
    return request.get(url, data)
  },
  /**
   * 获取采购员详情
   * @param id
   * @param loading
   * @returns {*}
   */
  getPurchaseUserDetail(id, loading = true) {
    let url = `/scm/api/backend/purchase/purchase-user/${id}`
    return request.get(url, {}, loading)
  },
  /**
   * 新增采购员
   * @param id
   * @param loading
   * @returns {*}
   */
  addPurchaseUser(data, loading = true) {
    let url = `/scm/api/backend/purchase/purchase-user`
    return request.post(url, data, loading)
  },
  /**
   * 编辑采购员
   * @param id
   * @param data
   * @param loading
   * @returns {*|AxiosPromise<any>|IDBRequest<IDBValidKey>|Promise<void>}
   */
  editPurchaseUser(id, data, loading = true) {
    let url = `/scm/api/backend/purchase/purchase-user/${id}`
    return request.put(url, data, loading)
  },
  /**
   * 获取供应商列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getSupplier(data, loading = true) {
    let url = '/scm/api/backend/purchase/supplier'
    return request.get(url, data)
  },
  /**
   * 获取供应商详情
   * @param id
   * @param loading
   * @returns {*}
   */
  getSupplierDetail(id, loading = true) {
    let url = `/scm/api/backend/purchase/supplier/${id}`
    return request.get(url, {}, loading)
  },
  /**
   * 新增供应商
   * @param id
   * @param loading
   * @returns {*}
   */
  addSupplier(data, loading = true) {
    let url = `/scm/api/backend/purchase/supplier`
    return request.post(url, data, loading)
  },
  /**
   * 编辑供应商
   * @param id
   * @param data
   * @param loading
   * @returns {*|AxiosPromise<any>|IDBRequest<IDBValidKey>|Promise<void>}
   */
  editSupplier(id, data, loading = true) {
    let url = `/scm/api/backend/purchase/supplier/${id}`
    return request.put(url, data, loading)
  },
  /**
   * 获取所有采购员
   * @param data
   * @param loading
   * @returns {*}
   */
  getAllBuyer(data = {}, loading = false) {
    let url = '/scm/api/backend/purchase/purchase-user-list'
    return request.get(url, data, loading)
  },
  /**
   * 采购任务是否为同一供应商
   * @param data
   * @param loading
   * @returns {*}
   */
  getDiffSupplier(data = {}, loading = false) {
    let url = '/scm/api/backend/purchase/task-diff-supplier'
    return request.get(url, data, loading)
  },
  /**
   * 按不同供应商任务数排序
   * @param data
   * @param loading
   * @returns {*}
   */
  getSortSupplier(data, loading = false) {
    let url = '/scm/api/backend/purchase/task-list-supplier'
    return request.get(url, data, loading)
  },
  /**
   * 采购单列表
   * @param data
   * @param loading
   * @returns {*}
   */
  submitPurchaseOrder(data, loading = true) {
    let url = '/scm/api/backend/purchase/purchase-order'
    return request.post(url, data, loading)
  },
  /**
   * 采购任务的统计
   * @param data
   * @param loading
   * @returns {*}
   */
  getTaskStatusNumber(data, loading = false) {
    let url = '/scm/api/backend/purchase/purchase-task-statistic'
    return request.get(url, data, loading)
  },
  /**
   * 采购单的统计
   * @param data
   * @param loading
   * @returns {*}
   */
  getPurchaseOrderStatistic(data, loading = false) {
    let url = '/scm/api/backend/purchase/purchase-order-statistic'
    return request.get(url, data, loading)
  },
  /**
   * 批量导入采购任务[v1.3]
   * @param data
   * @param loading
   * @returns {*}
   */
  leadTask(data, loading = false) {
    let url = '/scm/api/backend/purchase/purchase-task-import'
    return request.get(url, data, loading)
  }
}
