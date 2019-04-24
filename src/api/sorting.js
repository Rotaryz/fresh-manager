import request from '@utils/request'

export default {
  //  √ 分拣列表
  getSortingTaskList(data, loading = true) {
    let url = '/scm/api/backend/sorting/picking-order'
    // let url = '/mock/sortingTaskList.json'
    return request.get(url, data, loading)
  },
  // √  配貨明細 下
  getSortingDeliveryDetail(id,params, loading = true) {
    // let url = '/mock/sortingTaskDetail.json'
    let url = `/scm/api/backend/sorting/allocation-detail/${id}`
    return request.get(url, params,loading)
  },
  // √  拣货明细
  getSortingPickingDetail(id, loading = false) {
    // let url = '/mock/sortingPickDetail.json'
    let url = `/scm/api/backend/sorting/picking-order-detail/${id}`
    return request.get(url,{}, loading)
  },
  // √ 分类列表
  getClassifyList() {
    let url = '/scm/api/backend/goods/goods-category'
    return request.get(url)
  },
  //  √ 状态数据
  getStausData(params) {
    // let url = '/mock/StausData.json'
    let url ='/scm/api/backend/sorting/picking-order-statistic'
    return request.get(url,params)
  },
  // √ 导出分拣单
  exportPickingOrder(paramsStr) {
    let url ='/scm/api/backend/sorting/picking-order-export'
    window.open(url+ paramsStr,'_blank')
  },
  // √ 导出配货单
  exportDeliveryOrder(paramsStr) {
    let url ='/scm/api/backend/sorting/allocation-export'
    window.open(url+paramsStr,'_blank')
  },
  // √ 配货位列表 √
  getAllocationList(loading=true) {
    // let url = '/mock/sortingConfigList.json'
    let url = '/scm/api/backend/sorting/allocation-position'
    return request.get(url,{page:''},loading)
  },
//  √ 线路列表
  getRoadList() {
    // let url = '/mock/roadList.json'
    let url = '/scm/api/backend/delivery/road'
    return request.get(url)
  },
  // √ 设置线路 √
  setRoad(id, params,loading=true) {
    // let url = '/mock/roadList.json'
    let url = `/scm/api/backend/sorting/picking-set-address/${id}`
    return request.put(url, params,loading)
  },
  //  √ 跟换配货位 √
  changeAllocationPostion(dataArr,loading=true) {
    // let url = '/mock/roadList.json'
    let url = '/scm/api/backend/sorting/allocation-position'
    return request.post(url, {data: dataArr},loading)
  },

  //  √ 导出配货单
  exportAllocationList(paramsStr) {
    let url = "/scm/api/backend/sorting/allocation-position-export"
    window.open(url+ paramsStr,'_blank')

  }
}
