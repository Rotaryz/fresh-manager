import {mapState, mapGetters, mapActions} from 'vuex'

export const authComputed = {
  ...mapState('auth', {
    currentUser: (state) => state.currentUser
  }),
  ...mapGetters('auth', ['loggedIn'])
}

export const authMethods = mapActions('auth', ['logIn', 'logOut'])

export const globalComputed = {
  ...mapState('global', {
    currentTitles: (state) => state.currentTitles,
    marginBottom: (state) => state.marginBottom
  })
}

// 团长
export const leaderComputed = {
  ...mapGetters('leader', ['leaderList', 'pageTotal', 'leaderDetail', 'deliveryOrder'])
}

export const leaderMethods = mapActions('leader', [
  'getLeaderList',
  'getDeliveryOrder',
  'getDeliveryDetail',
  'setDeliveryOrder'
])

// 今日采购
export const rushComputed = {
  ...mapGetters('rush', ['rushList', 'rushPage', 'rushDetail'])
}

export const rushMethods = mapActions('rush', ['getRushList', 'getRushDetail', 'setRushList'])

export const auxiliaryComputed = {
  ...mapState('auxiliary', {
    unitsList: (state) => state.unitsList
  })
}

export const auxiliaryMethods = mapActions('auxiliary', ['getAuxiliaryList', 'setAuxiliary'])

export const categoriesComputed = {
  ...mapState('categories', {
    reqCategoryList: (state) => state.reqCategoryList
  })
}

export const categoriesMethods = mapActions('categories', ['getCategoryList', 'setCategory', 'addChild'])

export const goodsComputed = {
  ...mapState('editgoods', {
    productList: (state) => state.productList,
    statePageTotal: (state) => state.statePageTotal
  })
}

export const goodsMethods = mapActions('editgoods', ['getGoodsData'])

// 轮播广告
export const adverComputed = {
  ...mapGetters('advertisement', ['infoBannerList'])
}

export const adverMethods = mapActions('advertisement', ['getInfoBannerList'])

// 订单
export const orderComputed = {
  ...mapGetters('order', ['list', 'pageDetail', 'detail', 'shopId', 'time', 'keyword', 'status', 'page'])
}

export const orderMethods = {
  ...mapActions('order', ['setShopId', 'setTime', 'setKeyword', 'setStatus', 'setPage'])
}

// 退货
export const returnsComputed = {
  ...mapGetters('returns', ['list', 'pageDetail', 'detail', 'shopId', 'time', 'keyword', 'status', 'page'])
}

export const returnsMethods = {
  ...mapActions('returns', ['setShopId', 'setTime', 'setKeyword', 'setStatus', 'setPage'])
}

// 轮播广告
export const purchaseComputed = {
  ...mapGetters('purchase', ['pageTotal', 'purchaseList', 'purchaseDetail'])
}

export const purchaseMethods = mapActions('purchase', ['getPurchaseList', 'getPurchaseDetail'])
