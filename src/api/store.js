import request from '@utils/request'

export default {
  /**
   * 库位列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getStoreList(data, loading = true) {
    let url = '/scm/api/backend/warehouse/position'
    return request.get(url, data, loading)
  },
  /**
   * 顶级库位新增
   * @param orderId
   * @param loading
   * @returns {*}
   */
  addStoreList(data, loading = false) {
    let url = '/scm/api/backend/warehouse/position'
    return request.post(url, data, loading)
  },
  /**
   * 顶级库位删除
   * @param orderId
   * @param loading
   * @returns {*}
   */
  delStore(id, data, loading = false) {
    let url = `/scm/api/backend/warehouse/position/${id}`
    return request.delete(url, data, loading)
  },
  /**
   * 顶级库位编辑
   * @param orderId
   * @param loading
   * @returns {*}
   */
  editStore(id, data, loading = false) {
    let url = `/scm/api/backend/warehouse/position/${id}`
    return request.put(url, data, loading)
  },
  /**
   * 子库位新增
   * @param orderId
   * @param loading
   * @returns {*}
   */
  addSmallStore(data, loading = false) {
    let url = `/scm/api/backend/warehouse/son-position`
    return request.post(url, data, loading)
  },
  /**
   * 子库位编辑
   * @param orderId
   * @param loading
   * @returns {*}
   */
  editSmallStore(id, data, loading = false) {
    let url = `/scm/api/backend/warehouse/son-position/${id}`
    return request.put(url, data, loading)
  },
  /**
   * 子库位删除
   * @param orderId
   * @param loading
   * @returns {*}
   */
  delSmallStore(id, data, loading = false) {
    let url = `/scm/api/backend/warehouse/son-position/${id}`
    return request.delete(url, data, loading)
  },
  /**
   * 通过上级获取下级列表
   * @param orderId
   * @param loading
   * @returns {*}
   */
  findChild(id, data, loading = false) {
    let url = `/scm/api/backend/warehouse/son-position/${id}`
    return request.get(url, data, loading)
  },
  /**
   * 入库单列表
   * @param orderId
   * @param loading
   * @returns {*}
   */
  getEnterList(data, loading = true) {
    let url = `/scm/api/backend/warehouse/entry-orders`
    return request.get(url, data, loading)
  },
  /**
   * 入库单列表
   * @param orderId
   * @param loading
   * @returns {*}
   */
  getOutList(data, loading = true) {
    let url = `/scm/api/backend/warehouse/out-orders`
    return request.get(url, data, loading)
  },
  /**
   * 入库单明细
   * @param orderId
   * @param loading
   * @returns {*}
   */
  getEnterDetail(id, data, loading = true) {
    let url = `/scm/api/backend/warehouse/entry-details/${id}`
    return request.get(url, data, loading)
  },
  /**
   * 出库单明细
   * @param orderId
   * @param loading
   * @returns {*}
   */
  getOutDetail(id, data, loading = true) {
    let url = `/scm/api/backend/warehouse/out-details/${id}`
    return request.get(url, data, loading)
  },
  /**
   * 出库单提交
   * @param orderId
   * @param loading
   * @returns {*}
   */
  putOutSubmit(id, data, loading = true) {
    let url = `/scm/api/backend/warehouse/out-details/${id}`
    return request.post(url, data, loading)
  },
  /**
   * 入库单提交
   * @param orderId
   * @param loading
   * @returns {*}
   */
  putEnterSubmit(id, data, loading = true) {
    let url = `/scm/api/backend/warehouse/entry-details/${id}`
    return request.post(url, data, loading)
  },
  /**
   * 出库批次列表
   * @param orderId
   * @param loading
   * @returns {*}
   */
  outBatchList(data, loading = false) {
    let url = `/scm/api/backend/warehouse/out-batch`
    return request.get(url, data, loading)
  },
  /**
   * 出库商品列表
   * @param orderId
   * @param loading
   * @returns {*}
   */
  getGoodsList(data, loading = false) {
    let url = `/scm/api/backend/goods/goods`
    return request.get(url, data, loading)
  },
  /**
   * 仓库货架详情
   * @param data
   * @param loading
   * @returns {*}
   */
  goodsCategory(data, loading = false) {
    let url = `/scm/api/backend/goods/goods-category`
    return request.get(url, data, loading)
  },
  /**
   * 出库单创建（自建的）
   * @param data
   * @param loading
   * @returns {*}
   */
  editOutOrder(data, loading = false) {
    let url = `/scm/api/backend/warehouse/self-out-orders`
    return request.post(url, data, loading)
  },
  /**
   * 出库单的统计
   * @param data
   * @param loading
   * @returns {*}
   */
  outOrdersStatistic(data, loading = false) {
    let url = `/scm/api/backend/warehouse/out-orders-statistic`
    return request.get(url, data, loading)
  },
  /**
   * 入库单的统计
   * @param data
   * @param loading
   * @returns {*}
   */
  entryOrdersStatistic(data, loading = false) {
    let url = `/scm/api/backend/warehouse/entry-orders-statistic`
    return request.get(url, data, loading)
  },
  /**
   * 批量出库【1.2】
   * @param data
   * @param loading
   * @returns {*}
   */
  batchOut(data, loading = false) {
    let url = `/scm/api/backend/warehouse/batch-out`
    return request.post(url, data, loading)
  },
  /**
   * 库存列表
   * @param data
   * @param loading
   * @returns {*}
   */
  warehouseStock(data, loading = false) {
    let url = `/scm/api/backend/stock/warehouse-stock`
    return request.get(url, data, loading)
  },
  /**
   * 库存列表
   * @param data
   * @param loading
   * @returns {*}
   */
  warehouseStockType(data, loading = false) {
    let url = `/scm/api/backend/stock/warehouse-stock-type`
    return request.get(url, data, loading)
  },
  /**
   * 库存详情
   * @param data
   * @param loading
   * @returns {*}
   */
  warehouseStockLogs(code, data, loading = false) {
    let url = `/scm/api/backend/stock/warehouse-stock-logs/${code}`
    return request.get(url, data, loading)
  },
  /**
   * 批次库存详情
   * @param data
   * @param loading
   * @returns {*}
   */
  warehouseBatchStock(code, data, loading = false) {
    let url = `/scm/api/backend/stock/warehouse-batch-stock/${code}`
    return request.get(url, data, loading)
  },
  /**
   * 批次库存修改库位
   * @param data
   * @param loading
   * @returns {*}
   */
  editWarehouseBatch(code, data, loading = false) {
    let url = `/scm/api/backend/stock/warehouse-batch-stock/${code}`
    return request.put(url, data, loading)
  },
  /**
   * 盘点单列表
   * @param data
   * @param loading
   * @returns {*}
   */
  adjustOrder(data, loading = false) {
    let url = `/scm/api/backend/stock/adjust-order`
    return request.get(url, data, loading)
  },
  /**
   * 导入库存清单
   * @param data
   * @param loading
   * @returns {*}
   */
  importStock(data, loading = false) {
    let url = `/scm/api/backend/stock/warehouse-stock-list-import`
    return request.post(url, data, loading)
  },
  /**
   * 库存清单调整
   * @param data
   * @param loading
   * @returns {*}
   */
  editStockList(data, loading = false) {
    let url = `/scm/api/backend/stock/warehouse-stock-list`
    return request.post(url, data, loading)
  },
  /**
   * 库存清单调整
   * @param data
   * @param loading
   * @returns {*}
   */
  adjustOorderDetail(id, data, loading = false) {
    let url = `/scm/api/backend/stock/adjust-order-detail/${id}`
    return request.get(url, data, loading)
  },
  /**
   *  盘点单详情
   * @param data
   * @param loading
   * @returns {*}
   */
  adjustOorderMsg(id, data, loading = false) {
    let url = `/scm/api/backend/stock/adjust-order/${id}`
    return request.get(url, data, loading)
  }
}
