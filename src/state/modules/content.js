// import API from '@api'
// import app from '@src/main'

export const state = {
  /**
   * -------------------------------
   * 内容分类
   */
  contentClassList: [{}],
  contentClassPage: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  contentPage: 1,
  /**
   * -------------------------------
   * 我的作品
   */
  workList: [{id: 1}],
  workPage: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  /**
   * -------------------------------
   * 内容中心
   */
  centerList: [{id: 1, is_select: false}, {id: 2, is_select: false}],
  centerPage: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  contentCenterPage: 1,
  centerStatus: '',
  centerKeyword: '',
  centerTabIndex: 0
}

export const getters = {
  contentClassList: (state) => state.contentClassList,
  contentClassPage: (state) => state.contentClassPage,
  contentPage: (state) => state.contentPage,
  workList: (state) => state.workList,
  workPage: (state) => state.workPage,
  centerList: (state) => state.centerList,
  centerPage: (state) => state.centerPage,
  contentCenterPage: (state) => state.contentCenterPage,
  centerStatus: (state) => state.centerStatus,
  centerKeyword: (state) => state.centerKeyword,
  centerTabIndex: (state) => state.centerTabIndex
}

export const mutations = {
  /**
   * -------------------------------
   * 内容分类
   * @param state
   * @param workPage
   * @constructor
   */
  SET_CONTENT_CLASS_LIST(state, contentClassList) {
    state.contentClassList = contentClassList
  },
  SET_CONTENT_CLASS_PAGE(state, contentClassPage) {
    state.contentClassPage = contentClassPage
  },
  SET_CONTENT_PAGE(state, contentPage) {
    state.contentPage = contentPage
  },
  /**
   * -------------------------------
   * 我的作品
   * @param state
   * @param workPage
   * @constructor
   */
  SET_WORK_LIST(state, workList) {
    state.workList = workList
  },
  SET_WORK_PAGE(state, workPage) {
    state.workPage = workPage
  },
  /**
   * -------------------------------
   * 内容中心
   * @param state
   * @param workPage
   * @constructor
   */
  SET_CENTER_PAGE(state, workPage) {
    state.workPage = workPage
  },
  SET_CENTER_LIST(state, workPage) {
    state.workPage = workPage
  },
  SET_CENTER_CONTENT_PAGE(state, contentCenterPage) {
    state.contentCenterPage = contentCenterPage
  },
  SET_CENTER_STATUS(state, centerStatus) {
    state.centerStatus = centerStatus
  },
  SET_CENTER_KEYWORD(state, centerKeyword) {
    state.centerKeyword = centerKeyword
  },
  SET_CENTER_TAB_INDEX(state, centerTabIndex) {
    state.centerTabIndex = centerTabIndex
  }
  /**
   * ---------------------------------
   */
}

export const actions = {
  getContentClassList({commit, state}, loading = false) {
    // let {contentPage} = state
    // return API.Content.getContentClassList({page:contentPage}, loading)
    //   .then((res) => {
    //     if (res.error !== app.$ERR_OK) {
    //       app.$toast.show(res.message)
    //       return
    //     }
    //     let list = res.data
    //     let pages = res.meta
    //     let pageDetail = {
    //       total: pages.total,
    //       per_page: pages.per_page,
    //       total_page: pages.last_page
    //     }
    //     commit('SET_CONTENT_CLASS_LIST', list)
    //     commit('SET_CONTENT_CLASS_PAGE', pageDetail)
    //     return list
    //   })
    //   .catch(() => {
    //     return false
    //   })
    //   .finally(() => {
    //     app.$loading.hide()
    //   })
    console.log('ddd')
    return true
  },
  contentAddPage({commit, dispatch}, obj) {
    obj.page && commit('SET_CONTENT_PAGE', obj.page)
    dispatch('getContentClassList')
  },
  infoContent({commit, dispatch}, obj) {
    commit('SET_CONTENT_PAGE', 1)
  },
  getWorkList({commit}, obj) {
    // let {page,status, keyword, loading} = obj
    // return API.Content.getWorkList({page}, loading)
    // .then((res) => {
    //   if (res.error !== app.$ERR_OK) {
    //     app.$toast.show(res.message)
    //     return
    //   }
    //   let list = res.data
    //   let pages = res.meta
    //   let pageDetail = {
    //     total: pages.total,
    //     per_page: pages.per_page,
    //     total_page: pages.last_page
    //   }
    //   commit('SET_WORK_LIST', list)
    //   commit('SET_WORK_PAGE', pageDetail)
    //   return list
    // })
    // .catch(() => {
    //   return false
    // })
    // .finally(() => {
    //   app.$loading.hide()
    // })
    console.log('ddd')
    return true
  },
  selectWork({commit, state}, obj) {
    let {type, index, value, ids} = obj
    let arr = JSON.parse(JSON.stringify(state.workList))

    if (type === 'all') {
      arr = arr.map((item) => {
        item.select = value
        if (value) {
          ids.push(item.id)
        }
        return item
      })
    } else {
      arr[index].select = !arr[index].select
      if (arr[index].select) {
        ids.push(arr[index].id)
      } else {
        let idIndex = ids.findIndex((item) => item.id === arr[index].id)
        ids.splice(idIndex, 1)
      }
    }
    commit('SET_WORK_LIST', arr)
    return ids
  },
  /**
   * -------------------------------
   * 内容中心
   * @param state
   * @param workPage
   * @constructor
   */
  getCenterList({commit}) {
    // let {page,status, keyword,type, loading} = state
    // return API.Content.getCenterList({page}, loading)
    // .then((res) => {
    //   if (res.error !== app.$ERR_OK) {
    //     app.$toast.show(res.message)
    //     return
    //   }
    //   let list = res.data
    //   let pages = res.meta
    //   let pageDetail = {
    //     total: pages.total,
    //     per_page: pages.per_page,
    //     total_page: pages.last_page
    //   }
    //   commit('SET_CENTER_LIST', list)
    //   commit('SET_CENTER_PAGE', pageDetail)
    //   return list
    // })
    // .catch(() => {
    //   return false
    // })
    // .finally(() => {
    //   app.$loading.hide()
    // })
    console.log('666')
    return true
  },
  infoCenter({commit}, obj) {
    commit('SET_CENTER_CONTENT_PAGE', 1)
    commit('SET_CENTER_STATUS', '')
    commit('SET_CENTER_KEYWORD', '')
  },
  getCenterListMore({commit, dispatch}, obj) {
    typeof (obj.tabIndex) === 'number' && commit('SET_CENTER_TAB_INDEX', obj.tabIndex)
    obj.page && commit('SET_CENTER_CONTENT_PAGE', obj.page)
    obj.status && commit('SET_CENTER_STATUS', obj.status)
    obj.keyword && commit('SET_CENTER_KEYWORD', obj.keyword)
    // console.log(state)
    dispatch('getCenterList')
  },
}
