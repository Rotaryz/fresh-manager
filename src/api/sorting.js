import request from '@utils/request'

export default {
  /**
   * 分拣列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getSortingTaskList(data, loading = true) {
    // let url = '/social-shopping/api/backend/activity-manage/activity'
    let url = '/mock/sortingTaskList.json'
    return request.get(url, data, loading)
  },
  // 配貨明細
  getSortingDeliveryDetail({id, goodsSkuCode}, loading = false) {
    // /scm/api/backend/sorting/allocation-detail/{id}
    let url = '/mock/sortingTaskDetail.json'
    return request.get(url, {goods_sku_code: goodsSkuCode}, loading)
  },
  // 拣货明细
  getSortingPickingDetail({id, goodsSkuCode}, loading = true) {
    // /scm/api/backend/sorting/picking-order-detail/{id}
    let url = '/mock/sortingPickDetail.json'
    return request.get(url, {goods_sku_code: goodsSkuCode}, loading)
  },
  // 分类列表
  getClassifyList() {
    // let url = '/mock/ClassifyList.json'
    // return request.get(url)
    return new Promise((resolve, reject) => {
      var res = {
        data: [{
          name: "111112okfpodg",
          id: 1,
          children: [{name: 123, id: "234325df"}, {name: "12sad3", id: "234325sdsddf"}]
        }, {
          name: "2222dsfsdfgdsgcv",
          id: 2,
          children: [{name: "22222dsfjdlk", id: "sadsaf"}, {name: "1d323332sadsadsasad3", id: "2343asdsadsd25sdsddf"}]
        }]
      }
      resolve(res)
    })
  },
  getStausData() {
    let url = '/mock/StausData.json'
    return request.get(url)
  },
  exportPickingOrder() {

  },
  exportDeliveryOrder() {

  },
  // 配货位列表
  getAllocationList() {
    let url = '/mock/sortingConfigList.json'
    // /scm/api/backend/sorting/allocation-position
    return request.get(url)
  },
//  线路列表
  getRoadList() {
    let url = '/mock/roadList.json'
    return request.get(url)
  },
  setRoad(id, params) {
    let url = '/mock/roadList.json'
    // /scm/api/backend/sorting/picking-set-address/{id}
    return request.put(url, params)
  },
  changeAllocationPostion(dataArr) {
    let url = '/mock/roadList.json'
    // /scm/api/backend/sorting/allocation-position
    return request.post(url, {data: dataArr})
  },
  exportAllocationList() {
    let url = "/scm/api/backend/sorting/allocation-position-export"
    return request.post(url)

  }
}
