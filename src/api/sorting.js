import request from '@utils/request'

export default {
  //  √ 分拣列表
  getSortingTaskList(data, loading = true) {
    let url = '/scm/api/backend/sorting/picking-order'
    // let url = '/mock/sortingTaskList.json'
    return request.get(url, data, loading)
  },
  // √ 商品分拣任务明细--- 配貨明細
  getSortingDeliveryDetail(id, params, loading = true) {
    // let url = '/mock/sortingTaskDetail.json'
    let url = `/scm/api/backend/sorting/allocation-detail/${id}`
    return request.get(url, params, loading)
  },
  // √  商品分拣任务明细--- 拣货明细
  getSortingPickingDetail(id, loading = false) {
    // let url = '/mock/sortingPickDetail.json'
    let url = `/scm/api/backend/sorting/picking-order-detail/${id}`
    return request.get(url, {}, loading)
  },
  // √ 订单分拣任务明细--- 配貨明細
  getSortingOrderDetail(id, loading = true) {
    // let url = '/mock/sortingTaskDetail.json'
    let url = `/scm/api/backend/sorting/order-sorting/${id}`
    return request.get(url, {}, loading)
  },
  // √  订单分拣任务明细--- 列表
  getSortingOrderGoodsList(orderId, params, loading = false) {
    // let url = '/mock/sortingPickDetail.json'
    let url = `/scm/api/backend/sorting/order-sorting-details/${orderId}`
    return request.get(url, params, loading)
  },
  // √ 分类列表
  getClassifyList(params = {}) {
    let defautParams = {
      parent_id: 0,
      goods_id: 0
    }
    params = {...defautParams, ...params}
    let url = '/scm/api/backend/goods/goods-category'
    return request.get(url, params)
  },
  //  √ 状态数据
  getStausData(params) {
    // let url = '/mock/StausData.json'
    let url = '/scm/api/backend/sorting/picking-order-statistic'
    return request.get(url, params)
  },
  // √ 导出分拣单
  exportPickingOrder(paramsStr) {
    let url = '/scm/api/backend/sorting/picking-order-export'
    window.open(url + paramsStr, '_parent')
  },
  // √ 导出配货单
  async exportAllocationOrder(paramsStr) {
    let url = '/scm/api/backend/sorting/allocation-export'
    return window.open(url + paramsStr, '_parent')
  },
  // √ 导出配送单
  exportDistributionOrder(paramsStr) {
    let url = '/scm/api/backend/sorting/picking-order-delivery-export'
    window.open(url + paramsStr, '_parent')
  },
  // 订单分拣导出拣货单【1.3.1】
  exportSortingOrder(paramsStr) {
    let url = '/scm/api/backend/sorting/order-sorting-export'
    window.open(url + paramsStr, '_parent')
  },
  // √ 导出消费者清单
  exportCustomerOrder(paramsStr) {
    let url = '/scm/api/backend/delivery/download-order-excels'
    window.open(url + paramsStr, '_parent')
  },
  // 批量完成分拣
  batchFinishSorting(data, loading = true) {
    let url = '/scm/api/backend/sorting/batch-finish-sorting'
    return request.post(url, data, loading)
  },
  getPrintData(id, loading = true) {
    let url = '/scm/api/backend/sorting/batch-finish-sorting/' + id
    return request.get(url, {}, loading)
  },
  // √ 配货位列表 √
  getAllocationList(loading = true) {
    // let url = '/mock/sortingConfigList.json'
    let url = '/scm/api/backend/sorting/allocation-position'
    return request.get(url, {page: ''}, loading)
  },
  //  √ 线路列表
  getRoadList() {
    // let url = '/mock/roadList.json'
    let url = '/scm/api/backend/delivery/road'
    return request.get(url)
  },
  // √ 设置线路 √
  setRoad(id, params, loading = false) {
    // let url = '/mock/roadList.json'
    let url = `/scm/api/backend/sorting/picking-set-address/${id}`
    return request.put(url, params, loading)
  },
  //  √ 跟换配货位 √
  changeAllocationPostion(dataArr, loading = false) {
    // let url = '/mock/roadList.json'
    let url = '/scm/api/backend/sorting/allocation-position'
    return request.post(url, {data: dataArr}, loading)
  },

  //  √ 导出配货位
  exportAllocationList(paramsStr) {
    let url = '/scm/api/backend/sorting/allocation-position-export'
    window.open(url + paramsStr, '_parent')
  }
}
