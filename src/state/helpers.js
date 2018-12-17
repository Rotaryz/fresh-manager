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
    currentTitles: (state) => state.currentTitles
  })
}

// 团长
export const leaderComputed = {
  ...mapGetters('leader', ['leaderList', 'pageTotal', 'leaderDetail'])
}

export const leaderMethods = mapActions('leader', ['getLeaderList'])

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
    categoryList: (state) => state.categoryList
  })
}

export const categoriesMethods = mapActions('categories', ['getCategoryList', 'setCategory', 'addChild'])

export const goodsComputed = {
  ...mapState('editgoods', {
    productList: (state) => state.productList,
    pageTotal: (state) => state.pageTotal
  })
}

export const goodsMethods = mapActions('editgoods', ['getGoodsData'])

// 轮播广告

export const adverComputed = {
  ...mapGetters('advertisement', ['infoBannerList'])
}

export const adverMethods = mapActions('advertisement', ['getInfoBannerList'])
