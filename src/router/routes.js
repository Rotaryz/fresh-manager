import store from '@state/store'
import storage from 'storage-controller'
import {getCurrentTime} from '@utils/tool'
import API from '@api'
import {ERR_OK} from '@utils/config'
import {TAB_STATUS} from '../pages/activity-manage/config'

export default [
  // 模板
  {
    path: '/demo',
    name: 'demo',
    component: () => lazyLoadView(import('@pages/demo/demo'))
  },
  // 登录界面
  {
    path: '/login',
    name: 'login',
    component: () => lazyLoadView(import('@pages/login/login')),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        // 判断用户是否已经登录
        // console.log(storage.get('losePermissions'))
        if (store.getters['auth/loggedIn'] && storage.get('losePermissions') !== 1) {
          next({name: 'new-data'})
        } else {
          storage.remove('losePermissions')
          next()
        }
      }
    }
  },
  {
    path: '/home',
    name: 'home',
    component: () => lazyLoadView(import('@pages/home/home')),
    meta: {
      authRequired: true
    },
    redirect: 'home/new-data',
    children: [
      /**
       * 商品
       */
      // 商品列表
      {
        path: 'product-list',
        name: 'product-list',
        component: () => lazyLoadView(import('@pages/product-list/product-list')),
        meta: {
          titles: ['商城', '商品', '商品列表'],
          beforeResolve(routeTo, routeFrom, next) {
            let online = ''
            if (routeTo.query.online) {
              online = routeTo.query.online
            }
            //  商品列表
            store
              .dispatch('editgoods/getGoodsData', online)
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 商品分类
      {
        path: 'product-categories',
        name: 'product-categories',
        component: () => lazyLoadView(import('@pages/product-categories/product-categories')),
        meta: {
          titles: ['商城', '商品', '商品分类'],
          beforeResolve(routeTo, routeFrom, next) {
            //  商品分类
            store
              .dispatch('categories/getCategoryList', -1)
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 辅助资料
      {
        path: 'auxiliary-information',
        name: 'auxiliary-information',
        component: () => lazyLoadView(import('@pages/auxiliary-information/auxiliary-information')),
        meta: {
          titles: ['商城', '商品', '辅助资料'],
          beforeResolve(routeTo, routeFrom, next) {
            //  辅助资料
            store
              .dispatch('auxiliary/getAuxiliaryList', 1)
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 编辑商品
      {
        path: 'product-list/edit-goods',
        name: 'edit-goods',
        component: () => lazyLoadView(import('@pages/edit-goods/edit-goods')),
        meta: {
          titles: ['商城', '商品', '商品列表', '商品'],
          variableIndex: 3,
          marginBottom: 80,
          beforeResolve(routeTo, routeFrom, next) {
            if (!routeTo.query.id) {
              return next()
            }
            store
              .dispatch('editgoods/getGoodsDetailData', {id: routeTo.query.id, showType: 'base'})
              .then((response) => {
                if (!response) {
                  return next({name: '404'})
                }
                routeTo.params.detail = response
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
          }
        },
        props: (route) => ({detail: route.params.detail})
      },
      // 导入商品
      {
        path: 'product-list/lead-supply-goods',
        name: 'lead-supply-goods',
        component: () => lazyLoadView(import('@pages/lead-supply-goods/lead-supply-goods')),
        meta: {
          titles: ['商城', '商品', '商品列表', '商品导入']
        }
      },
      /**
       * 商品
       *
       * ------------------------------------------------------------------------------------------
       *
       * 商城
       */
      // 轮播广告
      {
        path: 'advertisement',
        name: 'advertisement',
        component: () => lazyLoadView(import('@pages/advertisement/advertisement')),
        meta: {
          titles: ['商城', '内容', '内容管理'],
          marginBottom: 80,
          beforeResolve(routeTo, routeFrom, next) {
            //  团长列表
            store
              .dispatch('advertisement/getInfoBannerList')
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 今日抢购
      {
        path: 'rush-purchase',
        name: 'rush-purchase',
        component: () => lazyLoadView(import('@pages/rush-purchase/rush-purchase')),
        meta: {
          titles: ['商城', '活动', '今日抢购'],
          beforeResolve(routeTo, routeFrom, next) {
            //  团长列表
            store
              .dispatch('rush/getRushList', {page: 1})
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 新建编辑今日抢购
      {
        path: 'rush-purchase/edit-rush',
        name: 'edit-rush',
        component: () => lazyLoadView(import('@pages/edit-rush/edit-rush')),
        meta: {
          titles: ['商城', '活动', '今日抢购', '活动'],
          variableIndex: 3,
          marginBottom: 80,
          beforeResolve(routeTo, routeFrom, next) {
            let id = routeTo.query.id
            //  团长列表
            if (id) {
              store
                .dispatch('rush/getRushDetail', {id})
                .then((res) => {
                  if (!res) {
                    return next({name: '404'})
                  }
                  return next()
                })
                .catch(() => {
                  return next({name: '404'})
                })
            } else {
              next()
            }
          }
        }
      },
      // 活动管理
      {
        path: 'activity-manage',
        name: 'activity-manage',
        component: () => lazyLoadView(import('@pages/activity-manage/activity-manage')),
        meta: {
          titles: ['商城', '活动', '活动管理'],
          beforeResolve(routeTo, routeFrom, next) {
            //  抢购列表
            let status = routeTo.query.status || ''
            API.Activity.getActiveList(
              {page: 1, status, activity_theme: TAB_STATUS[window.$$tabIndex || 0].activity_theme},
              true
            )
              .then((res) => {
                if (res.error !== ERR_OK) {
                  return next({name: '404'})
                }
                let dataInfo = res.data
                let pageInfo = {
                  total: res.meta.total,
                  per_page: res.meta.per_page,
                  total_page: res.meta.last_page
                }
                next({params: {dataInfo, pageInfo}})
              })
              .catch((e) => {
                next({name: '404'})
              })
          }
        }
      },
      // 新建查看限时抢购
      {
        path: 'activity-manage/new-sale',
        name: 'new-sale',
        component: () => lazyLoadView(import('@pages/new-sale/new-sale')),
        meta: {
          titles: ['商城', '活动', '活动管理', '活动'],
          variableIndex: 3,
          marginBottom: 80,
          beforeResolve(routeTo, routeFrom, next) {
            let id = routeTo.query.id || routeTo.query.editId
            //  抢购详情
            if (id > 0) {
              store
                .dispatch('sale/getSaleDetail', {id})
                .then((res) => {
                  // if (!res) {
                  //   next({name: '404'})
                  // }
                  next()
                })
                .catch(() => {
                  next({name: '404'})
                })
            } else {
              next()
            }
          }
        }
      },
      // 新建拼团活动
      {
        path: 'activity-manage/new-collage',
        name: 'new-collage',
        component: () => lazyLoadView(import('@pages/new-collage/new-collage')),
        meta: {
          titles: ['商城', '活动', '活动管理', '拼团'],
          variableIndex: 3,
          marginBottom: 80,
          beforeResolve(routeTo, routeFrom, next) {
            let id = routeTo.query.id || routeTo.query.editId
            //  抢购详情
            if (id > 0) {
              store
                .dispatch('activity/getCollageDetail', id)
                .then((res) => {
                  // if (!res) {
                  //   next({name: '404'})
                  // }
                  next()
                })
                .catch(() => {
                  next({name: '404'})
                })
            } else {
              next()
            }
          }
        }
      },
      // 编辑新人特惠
      {
        path: 'activity-manage/edit-preference',
        name: 'edit-preference',
        component: () => lazyLoadView(import('@pages/edit-preference/edit-preference')),
        meta: {
          titles: ['商城', '活动', '活动管理', '编辑活动'],
          variableIndex: 2,
          marginBottom: 80
        }
      },
      // 拓展活动
      {
        path: 'outreach-activity',
        name: 'outreach-activity',
        component: () => lazyLoadView(import('@pages/outreach-activity/outreach-activity')),
        meta: {
          titles: ['商城', '拓展', '拓展任务'],
          beforeResolve(routeTo, routeFrom, next) {
            // 活动列表
            store
              .dispatch('outreach/getOutreachList', {page: 1})
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 拓展活动-团队成员列表
      {
        path: 'outreach-activity/outreach-activity-staff',
        name: 'outreach-activity-staff',
        component: () => lazyLoadView(import('@pages/outreach-activity-staff/outreach-activity-staff')),
        meta: {
          titles: ['商城', '拓展', '拓展任务', '成员'],
          beforeResolve(routeTo, routeFrom, next) {
            // 获取团队成员列表
            let id = routeTo.query.id
            if (id) {
              store
                .dispatch('outreach/getMemberList', {id, page: 1})
                .then((res) => {
                  if (!res) {
                    next({name: '404'})
                  }
                  next()
                })
                .catch(() => {
                  next({name: '404'})
                })
            } else {
              next()
            }
          }
        }
      },
      // 拓展团队
      {
        path: 'outreach-group',
        name: 'outreach-group',
        component: () => lazyLoadView(import('@pages/outreach-group/outreach-group')),
        meta: {
          titles: ['商城', '拓展', '拓展团队'],
          beforeResolve(routeTo, routeFrom, next) {
            // 活动列表
            store
              .dispatch('oGTab/reqGroupList', {parentId: -1}, {root: true})
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 拓展团队-团队成员列表
      {
        path: 'outreach-group/outreach-group-staff',
        name: 'outreach-group-staff',
        component: () => lazyLoadView(import('@pages/outreach-group-staff/outreach-group-staff')),
        meta: {
          titles: ['商城', '拓展', '拓展团队', '详情'],
          beforeResolve(routeTo, routeFrom, next) {
            let id = routeTo.query.id
            // 活动详情
            if (id) {
              store
                .dispatch('outreachGroup/getTaskDetail', {id, page: 1})
                .then((res) => {
                  if (!res) {
                    next({name: '404'})
                  }
                  next()
                })
                .catch(() => {
                  next({name: '404'})
                })
            } else {
              next()
            }
          }
        }
      },
      // 新建查看拓展活动
      {
        path: 'outreach-activity/edit-outreach',
        name: 'edit-outreach',
        component: () => lazyLoadView(import('@pages/edit-outreach/edit-outreach')),
        meta: {
          titles: ['商城', '拓展', '拓展活动', '活动'],
          variableIndex: 3,
          marginBottom: 80,
          beforeResolve(routeTo, routeFrom, next) {
            let id = routeTo.query.id
            // 活动详情
            if (id) {
              store
                .dispatch('outreach/getOutreachDetail', {id})
                .then((res) => {
                  if (!res) {
                    return next({name: '404'})
                  }
                  return next()
                })
                .catch(() => {
                  return next({name: '404'})
                })
            } else {
              next()
            }
          }
        }
      },
      // 优惠券
      {
        path: 'coupon-manage',
        name: 'coupon-manage',
        component: () => lazyLoadView(import('@pages/coupon-manage/coupon-manage')),
        meta: {
          titles: ['商城', '营销', '优惠券'],
          beforeResolve(routeTo, routeFrom, next) {
            let index = store.state.coupon.infoTabIndex
            // 活动列表
            store
              .dispatch('coupon/getCouponList', {page: 1, tagType: index})
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 新建兑换券
      {
        path: 'coupon-manage/edit-commodity',
        name: 'edit-commodity',
        component: () => lazyLoadView(import('@pages/edit-commodity/edit-commodity')),
        meta: {
          titles: ['商城', '营销', '优惠券', '兑换券'],
          variableIndex: 3,
          marginBottom: 80,
          beforeResolve(routeTo, routeFrom, next) {
            let id = routeTo.query.id
            // 活动详情
            if (id) {
              store
                .dispatch('coupon/getCouponDetail', {id, tagType: 1})
                .then((res) => {
                  if (!res) {
                    next({name: '404'})
                  }
                  next()
                })
                .catch(() => {
                  next({name: '404'})
                })
            } else {
              next()
            }
          }
        }
      },
      // 新建查看优惠券
      {
        path: 'coupon-manage/new-coupon',
        name: 'new-coupon',
        component: () => lazyLoadView(import('@pages/new-coupon/new-coupon')),
        meta: {
          titles: ['商城', '营销', '优惠券', '优惠券'],
          variableIndex: 3,
          marginBottom: 80,
          beforeResolve(routeTo, routeFrom, next) {
            let id = routeTo.query.id
            // 活动详情
            if (id) {
              store
                .dispatch('coupon/getCouponDetail', {id, tagType: 0})
                .then((res) => {
                  if (!res) {
                    next({name: '404'})
                  }
                  next()
                })
                .catch(() => {
                  next({name: '404'})
                })
            } else {
              next()
            }
          }
        }
      },
      // 营销计划
      {
        path: 'coupon-market',
        name: 'coupon-market',
        component: () => lazyLoadView(import('@pages/coupon-market/coupon-market')),
        meta: {
          titles: ['商城', '营销', '营销计划'],
          beforeResolve(routeTo, routeFrom, next) {
            // 活动列表
            store
              .dispatch('market/getMarketList', {page: 1})
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 新建查看营销
      {
        path: 'coupon-market/new-market',
        name: 'new-market',
        component: () => lazyLoadView(import('@pages/new-market/new-market')),
        meta: {
          titles: ['商城', '营销', '营销计划', '营销计划'],
          variableIndex: 3,
          marginBottom: 80,
          beforeResolve(routeTo, routeFrom, next) {
            let id = routeTo.query.id
            // 活动详情
            if (id) {
              store
                .dispatch('market/getMarketDetail', id)
                .then((res) => {
                  if (!res) {
                    next({name: '404'})
                  }
                  next()
                })
                .catch(() => {
                  next({name: '404'})
                })
            } else {
              next()
            }
          }
        }
      },
      // 营销统计
      {
        path: 'coupon-market/marketing-statistics',
        name: 'marketing-statistics',
        component: () => lazyLoadView(import('@pages/marketing-statistics/marketing-statistics')),
        meta: {
          titles: ['商城', '营销', '营销计划', '营销统计'],
          beforeResolve(routeTo, routeFrom, next) {
            let id = routeTo.query.id
            // 活动详情
            if (id) {
              store
                .dispatch('market/getMarketingStatisticsList', {id, page: 1, loading: true})
                .then((res) => {
                  if (!res) {
                    next({name: '404'})
                  }
                  next()
                })
                .catch(() => {
                  next({name: '404'})
                })
            } else {
              next()
            }
          }
        }
      },
      /**
       * 商城
       *
       * ------------------------------------------------------------------------------------------
       *
       * 订单
       */
      // 订单列表
      {
        path: 'order-list',
        name: 'order-list',
        component: () => lazyLoadView(import('@pages/order-list/order-list')),
        meta: {
          titles: ['商城', '订单', '订单列表'],
          beforeResolve(routeTo, routeFrom, next) {
            //  订单列表
            store
              .dispatch('order/getOrderList')
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 退货
      {
        path: 'returns-management',
        name: 'returns-management',
        component: () => lazyLoadView(import('@pages/returns-management/returns-management')),
        meta: {
          titles: ['商城', '订单', '退货管理'],
          beforeResolve(routeTo, routeFrom, next) {
            let status = routeTo.query.status || ''
            let tabIndex = store.state.returns.tabIndex
            if (tabIndex === 0) {
              //  售后订单
              store.dispatch('returns/infoStatus', status)
              store
                .dispatch('returns/getReturnsList')
                .then((res) => {
                  if (!res) {
                    return next({name: '404'})
                  }
                  return next()
                })
                .catch(() => {
                  return next({name: '404'})
                })
            } else {
              // 售后补偿
              store
                .dispatch('market/getMarketList', {page: 1, source_type: 2})
                .then((res) => {
                  if (!res) {
                    return next({name: '404'})
                  }
                  return next()
                })
                .catch(() => {
                  return next({name: '404'})
                })
            }
          }
        }
      },
      // 退款详情
      {
        path: 'returns-management/refund-detail/:id',
        name: 'refund-detail',
        component: () => lazyLoadView(import('@pages/refund-detail/refund-detail')),
        meta: {
          titles: ['商城', '订单', '退货管理', '退款详情'],
          beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('returns/getReturnsDetail', routeTo.params.id)
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 退货新增规则
      {
        path: 'returns-management/edit-rules',
        name: 'edit-rules',
        component: () => lazyLoadView(import('@pages/edit-rules/edit-rules')),
        meta: {
          titles: ['商城', '订单', '退货管理', '新建规则'],
          marginBottom: 80,
          beforeResolve(routeTo, routeFrom, next) {
            let id = routeTo.query.id
            // 活动详情
            if (id) {
              store
                .dispatch('market/getMarketDetail', id)
                .then((res) => {
                  if (!res) {
                    next({name: '404'})
                  }
                  next()
                })
                .catch(() => {
                  next({name: '404'})
                })
            } else {
              next()
            }
          }
        }
      },
      {
        path: 'order-list/order-detail/:id',
        name: 'order-detail',
        component: () => lazyLoadView(import('@pages/order-detail/order-detail')),
        meta: {
          titles: ['商城', '订单', '订单列表', '订单详情'],
          beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('order/getOrderDetail', routeTo.params.id)
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      /**
       * 订单
       *
       * ------------------------------------------------------------------------------------------
       *
       * 采购
       */
      {
        path: 'purchase-management',
        name: 'purchase-management',
        component: () => lazyLoadView(import('@pages/purchase-management/purchase-management')),
        meta: {
          titles: ['商城', '采购', '采购管理'],
          beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('purchase/getPurchaseList', {page: 1, orderSn: ''})
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                routeTo.params.detail = res
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
          }
        }
      },
      // 采购详情
      {
        path: 'purchase-management/purchase-detail',
        name: 'purchase-detail',
        component: () => lazyLoadView(import('@pages/purchase-detail/purchase-detail')),
        meta: {
          titles: ['商城', '采购', '采购管理', '采购详情'],
          marginBottom: 80,
          beforeResolve(routeTo, routeFrom, next) {
            if (!routeTo.query.id) {
              return next()
            }
            store
              .dispatch('purchase/getPurchaseDetail', routeTo.query.id)
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                routeTo.params.detail = res
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
          }
        },
        props: (route) => ({detail: route.params.detail})
      },
      /**
       * 采购
       *
       * ------------------------------------------------------------------------------------------
       *
       * 客户
       */
      // 客户
      {
        path: 'customer-management',
        name: 'customer-management',
        component: () => lazyLoadView(import('@pages/customer-management/customer-management')),
        meta: {
          titles: ['商城', '客户', '客户列表'],
          beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('customer/getCustomerList', {page: 1, startTime: '', endTime: '', keyword: '', sortType: 0})
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                routeTo.params.detail = res
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
          }
        }
      },
      /**
       * 客户
       *
       * ------------------------------------------------------------------------------------------
       *
       * 团长
       */
      // 团长列表
      {
        path: 'leader-list',
        name: 'leader-list',
        component: () => lazyLoadView(import('@pages/leader-list/leader-list')),
        meta: {
          titles: ['商城', '团长', '团长列表'],
          resetHooks: ['leader/resetState'], // todo 根据业务编写
          beforeResolve(routeTo, routeFrom, next) {
            //  团长列表
            let params = {
              page:1,
              limit:10,
              keyword:'',
              status:0,
              model_type:0,
              ...routeTo.query
            }
            params.status = Number( params.status)
            params.model_type = Number( params.model_type)
            store.commit('leader/SET_lEADER_LIST_FILTER',params)
            store
              .dispatch('leader/getList')
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 团长邀请
      {
        path: 'leader-invite',
        name: 'leader-invite',
        component: () => lazyLoadView(import('@pages/leader-invite/leader-invite')),
        meta: {
          titles: ['商城', '团长', '团长邀请'],
          beforeResolve(routeTo, routeFrom, next) {
            //  抢购列表
            API.Leader.leaderDistributionRankingList({page: 1, limit:10,keyword:'',...routeTo.query}, true)
            .then((res) => {
              if (res.error !== ERR_OK) {
                return next({name: '404'})
              }
              let dataInfo = res.data
              let pageInfo = {
                total: res.meta.total,
                per_page: res.meta.per_page,
                total_page: res.meta.last_page,
                invite_number_count:res.invite_number_count
              }
              next({params: {dataInfo, pageInfo}})
            })
            .catch(e => {
              next({name: '404'})
            })
          }
        }
      },
      // 配送单
      {
        path: 'dispatching-list',
        name: 'dispatching-list',
        component: () => lazyLoadView(import('@pages/dispatching-list/dispatching-list')),
        meta: {
          titles: ['商城', '团长', '团长配送单'],
          resetHooks: ['leader/resetTodo'], // todo 根据业务编写
          beforeResolve(routeTo, routeFrom, next) {
            //  团长列表
            store
              .dispatch('leader/getDeliveryOrder', {page: 1, shopId: '', startTime: '', endTime: ''})
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 团长配送单详情
      {
        path: 'dispatching-list/dispatching-detail',
        name: 'dispatching-detail',
        component: () => lazyLoadView(import('@pages/dispatching-detail/dispatching-detail')),
        meta: {
          titles: ['商城', '团长', '团长配送单', '配送单详情'],
          marginBottom: 80,
          beforeResolve(routeTo, routeFrom, next) {
            if (!routeTo.query.id) {
              return next()
            }
            store
              .dispatch('leader/getDeliveryDetail', routeTo.query.id)
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                routeTo.params.detail = res
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
          }
        },
        props: (route) => ({detail: route.params.detail})
      },
      // 新建团长
      {
        path: 'leader-list/edit-leader',
        name: 'edit-leader',
        component: () => lazyLoadView(import('@pages/edit-leader/edit-leader')),
        meta: {
          titles: ['商城', '团长', '团长配送单', '团长'],
          variableIndex: 3,
          marginBottom: 80,
          beforeResolve(routeTo, routeFrom, next) {
            if (!routeTo.query.id) {
              return next()
            }
            store
              .dispatch('leader/getLeaderDetail', routeTo.query.id)
              .then((response) => {
                if (!response) {
                  return next({name: '404'})
                }
                routeTo.params.detail = response
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
          }
        },
        props: (route) => ({detail: route.params.detail})
      },
      // 团长结算
      {
        path: 'head-settlement',
        name: 'head-settlement',
        component: () => lazyLoadView(import('@pages/head-settlement/head-settlement')),
        meta: {
          titles: ['财务', '团长', '团长佣金'],
          beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('leader/getSettlementList', {page: 1, keyword: ''})
              .then((response) => {
                if (!response) {
                  return next({name: '404'})
                }
                routeTo.params.detail = response
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
          }
        }
      },
      // 团长结算详情
      {
        path: 'head-settlement/settlement-detail/:id/:name',
        name: 'settlement-detail',
        component: () => lazyLoadView(import('@pages/settlement-detail/settlement-detail')),
        meta: {
          titles: ['商城', '团长', '团长结算', '团长结算详情'],
          beforeResolve(routeTo, routeFrom, next) {
            let data = {page: 1, shopId: routeTo.params.id, orderSn: '', status: '', settlementType: ''}
            store
              .dispatch('leader/getSettlementDetail', data)
              .then((response) => {
                if (!response) {
                  return next({name: '404'})
                }
                routeTo.params.detail = response
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
          }
        }
      },
      // 团长提现
      // {
      //   path: 'leader-withdrawal',
      //   name: 'leader-withdrawal',
      //   component: () => lazyLoadView(import('@pages/leader-withdrawal/leader-withdrawal')),
      //   meta: {
      //     titles: ['商城', '团长', '团长提现'],
      //     beforeResolve(routeTo, routeFrom, next) {
      //       //  订单列表
      //       let status = routeTo.query.status
      //       if (status * 1 === 0) {
      //         store.dispatch('leader/infoStatus', {status})
      //       }
      //       store
      //         .dispatch('leader/getWithdrawalList')
      //         .then((res) => {
      //           if (!res) {
      //             return next({name: '404'})
      //           }
      //           return next()
      //         })
      //         .catch(() => {
      //           return next({name: '404'})
      //         })
      //     }
      //   }
      // },
      // 收支明细
      {
        path: 'leader-withdrawal/budget-detail/:id/:name',
        name: 'budget-detail',
        component: () => lazyLoadView(import('@pages/budget-detail/budget-detail')),
        meta: {
          titles: ['商城', '团长', '团长提现', '收支明细', ''],
          beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('leader/getBillList', routeTo.params.id)
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      /**
       * 客户
       *
       * ------------------------------------------------------------------------------------------
       *
       * 财务
       */
      // 交易记录
      {
        path: 'transaction-record',
        name: 'transaction-record',
        component: () => lazyLoadView(import('@pages/transaction-record/transaction-record')),
        meta: {
          titles: ['财务', '交易记录'],
          beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('trade/getTradeList')
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 营业概况
      {
        path: 'business-overview',
        name: 'business-overview',
        component: () => lazyLoadView(import('@pages/business-overview/business-overview')),
        meta: {
          titles: ['财务', '营业概况']
        }
      },
      // 营业成本
      {
        path: 'business-overview/operating-cost',
        name: 'operating-cost',
        component: () => lazyLoadView(import('@pages/operating-cost/operating-cost')),
        meta: {
          titles: ['财务', '营收概况', '营业成本']
        }
      },
      // 团长佣金
      {
        path: 'leader-commission',
        name: 'leader-commission',
        component: () => lazyLoadView(import('@pages/leader-commission/leader-commission')),
        meta: {
          titles: ['财务', '团长', '团长佣金']
        }
      },
      // 团长提现
      {
        path: 'leader-withdrawal',
        name: 'leader-withdrawal',
        component: () => lazyLoadView(import('@pages/leader-withdrawal/leader-withdrawal')),
        meta: {
          titles: ['财务', '团长', '团长提现'],
          beforeResolve(routeTo, routeFrom, next) {
            //  订单列表
            store
              .dispatch('leader/getWithdrawalList')
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 交易明细
      {
        path: 'transaction-detail',
        name: 'transaction-detail',
        component: () => lazyLoadView(import('@pages/transaction-detail/transaction-detail')),
        meta: {
          titles: ['财务', '账户', '交易明细'],
          beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('finance/getSettleStatus')
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
          }
        }
      },
      // 账户总览
      {
        path: 'account-overview',
        name: 'account-overview',
        component: () => lazyLoadView(import('@pages/account-overview/account-overview')),
        meta: {
          titles: ['财务', '账户', '账户总览'],
          beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('finance/getAccount')
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
          }
        }
      },
      /**
       * 财务
       *
       * ------------------------------------------------------------------------------------------
       *
       * 数据
       */
      // 数据统计
      {
        path: 'data-survey',
        name: 'data-survey',
        component: () => lazyLoadView(import('@pages/data-survey/data-survey')),
        meta: {
          titles: ['统计', '数据统计'],
          beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('data/getOrderDetail', {startTime: '', endTime: '', time: 'today', loading: true})
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                routeTo.params.detail = res
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
          }
        }
      },
      /**
       *
       * ------------------------------------------------------------------------------------------
       *
       * 供应链
       */
      // 商户订单
      {
        path: 'merchant-order',
        name: 'merchant-order',
        meta: {
          titles: ['供应链', '订单', '商户订单'],
          async beforeResolve(routeTo, routeFrom, next) {
            store.commit('merchantOrder/SET_PARAMS', {
              page: 1,
              limit: 10,
              start_time: '',
              end_time: '',
              type: '',
              status: 0, // 待调度
              keyword: ''
            })
            store
              .dispatch('merchantOrder/getMerchantOrderList')
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
          }
        },
        component: () => lazyLoadView(import('@pages/merchant-order/merchant-order'))
      },
      // 商品订单详情
      {
        path: 'merchant-order/merchant-order-detail/:id',
        name: 'merchant-order-detail',
        meta: {
          titles: ['供应链', '订单', '商户订单', '商品明细'],
          async beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('merchantOrder/getMerchantOrderDetail', routeTo.params)
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
          }
        },
        component: () => lazyLoadView(import('@pages/merchant-order-detail/merchant-order-detail'))
      },
      // 商品订单详情的明细
      {
        path: 'merchant-order/consumer-order-detail/:parent_order_id/:goods_sku_code/:id',
        name: 'consumer-order-detail',
        meta: {
          titles: ['供应链', '订单', '商户订单', '商品明细', '消费者明细'],
          async beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('merchantOrder/getConsumerDetails', routeTo.params)
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
          }
        },
        component: () => lazyLoadView(import('@pages/consumer-order-detail/consumer-order-detail'))
      },
      // 汇总订单详情
      {
        path: 'merchant-order/merger-order-detail/:mergeOrderId',
        name: 'merger-order-detail',
        meta: {
          titles: ['供应链', '订单', '商品汇总单', '商品明细'],
          async beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('merchantOrder/getMergerOrderDetail', routeTo.params)
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
          }
        },
        component: () => lazyLoadView(import('@pages/merger-order-detail/merger-order-detail'))
      },
      // 售后订单
      {
        path: 'after-sales-order',
        name: 'after-sales-order',
        meta: {
          titles: ['供应链', '订单', '售后订单'],
          beforeResolve(routeTo, routeFrom, next) {
            let exceptionStatus = routeTo.query.exception_status
            exceptionStatus = typeof exceptionStatus === 'undefined' ? '' : exceptionStatus
            let status = exceptionStatus === 1 ? 1 : routeTo.query.status ? routeTo.query.status : 0
            let startTime = routeTo.query.start_time || ''
            let endTime = routeTo.query.end_time || ''
            store.commit('afterSalesOrder/SET_PARAMS', {
              start_time: startTime,
              end_time: endTime,
              exception_status: exceptionStatus,
              keyword: '',
              status: status,
              page: 1,
              limit: 10
            })
            store
              .dispatch('afterSalesOrder/getAfterSalesOrderList')
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
          }
        },
        component: () => lazyLoadView(import('@pages/after-sales-order/after-sales-order'))
      },
      // 售后订单详情
      {
        path: 'after-sales-order/after-sales-detail/:id',
        name: 'after-sales-detail',
        meta: {
          titles: ['供应链', '订单', '售后订单', '商品明细'],
          beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('afterSalesOrder/getAfterSalesOrderDetail', routeTo.params)
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
          }
        },
        component: () => lazyLoadView(import('@pages/after-sales-detail/after-sales-detail'))
      },
      // 采购任务
      {
        path: 'procurement-task',
        name: 'procurement-task',
        component: () => lazyLoadView(import('@pages/procurement-task/procurement-task')),
        meta: {
          titles: ['供应链', '采购', '采购任务'],
          async beforeResolve(routeTo, routeFrom, next) {
            routeTo.params.start = ''
            routeTo.params.end = ''
            let exceptionStatus = routeTo.query.exception_status
            exceptionStatus = typeof exceptionStatus === 'undefined' ? '' : exceptionStatus
            let status = exceptionStatus === 1 ? 1 : routeTo.query.status ? routeTo.query.status : 1
            let startTime = routeTo.query.start_time || ''
            let endTime = routeTo.query.end_time || ''
            if (store.getters['proTask/goBackNumber'] >= 1) {
              status = 2
            }
            routeTo.params.status = status
            store
              .dispatch('proTask/getPurchaseTaskList', {
                time: '',
                startTime: startTime,
                endTime: endTime,
                keyword: '',
                page: 1,
                status: status,
                exceptionStatus: exceptionStatus,
                supplyId: '',
                loading: true
              })
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                routeTo.params.detail = res
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
          }
        }
      },
      // 生成采购任务
      {
        path: 'procurement-task/edit-task',
        name: 'edit-task',
        component: () => lazyLoadView(import('@pages/edit-task/edit-task')),
        meta: {
          titles: ['供应链', '采购', '采购任务', '生成采购单'],
          beforeResolve(routeTo, routeFrom, next) {
            next()
          }
        }
      },
      // 生成采购任务
      {
        path: 'procurement-task/procurement-lead',
        name: 'procurement-lead',
        component: () => lazyLoadView(import('@pages/procurement-lead/procurement-lead')),
        meta: {
          titles: ['供应链', '采购', '采购任务', '采购任务导入'],
          beforeResolve(routeTo, routeFrom, next) {
            next()
          }
        }
      },
      // 预采建议
      {
        path: 'procurement-task/procurement-suggest',
        name: 'procurement-suggest',
        component: () => lazyLoadView(import('@pages/procurement-suggest/procurement-suggest')),
        meta: {
          titles: ['供应链', '采购', '采购任务', '预采建议单'],
          async beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('proTask/getPurchaseTaskList', {
                time: 'today',
                startTime: '',
                endTime: '',
                keyword: '',
                page: 1,
                status: '',
                supplyId: '',
                isBlocked: 1,
                loading: true
              })
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                routeTo.params.detail = res
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
          }
        }
      },
      // 采购员
      {
        path: 'basics-set/buyer',
        name: 'buyer',
        component: () => lazyLoadView(import('@pages/buyer/buyer')),
        meta: {
          titles: ['供应链', '采购', '基础设置', '采购员列表'],
          resetHooks: ['buyer/infoSetKeyWord'],
          beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('buyer/getPurchaseUser')
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
          }
        }
      },
      // 新建采购员
      {
        path: 'basics-set/buyer/edit-procurement',
        name: 'edit-procurement',
        component: () => lazyLoadView(import('@pages/edit-procurement/edit-procurement')),
        meta: {
          marginBottom: 80,
          titles: ['供应链', '采购', '基础设置', '采购员'],
          variableIndex: 3,
          beforeResolve(routeTo, routeFrom, next) {
            if (!routeTo.query.id) {
              return next()
            }
            store
              .dispatch('buyer/getPurchaseUserDetail', routeTo.query.id)
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                routeTo.params.detail = res
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
          }
        }
      },
      // 采购单列表
      {
        path: 'purchase-order',
        name: 'purchase-order',
        component: () => lazyLoadView(import('@pages/purchase-order/purchase-order')),
        meta: {
          titles: ['供应链', '采购', '采购单'],
          resetHooks: ['supply/resetData'],
          async beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('supply/getPurchaseList', {
                loading: true
              })
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
          }
        }
      },
      // 采购单详情
      {
        path: 'purchase-order/purchase-order-detail/:id',
        name: 'purchase-order-detail',
        component: () => lazyLoadView(import('@pages/purchase-order-detail/purchase-order-detail')),
        meta: {
          titles: ['供应链', '采购', '采购单', '采购单详情'],
          beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('supply/getPurchaseDetail', routeTo.params.id)
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                routeTo.params.detail = res
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
            next()
          }
        }
      },
      // 商品素材库
      {
        path: 'goods-store',
        name: 'goods-store',
        component: () => lazyLoadView(import('@pages/goods-store/goods-store')),
        meta: {
          titles: ['供应链', '采购', '商品素材库'],
          beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('scmGoods/getScmStoreData', {
                keyword: '',
                materialId: '',
                page: 1,
                limit: 21,
                loading: false
              })
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 商品管理
      {
        path: 'goods-manage',
        name: 'goods-manage',
        component: () => lazyLoadView(import('@pages/goods-manage/goods-manage')),
        meta: {
          titles: ['供应链', '采购', '商品管理'],
          resetHooks: ['scmGoods/resetData'],
          beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('scmGoods/getProductList', {loading: true})
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        },
        children: [
          // 新建商品
          {
            path: 'goods-manage/edit-supply-goods',
            name: 'edit-supply-goods',
            component: () => lazyLoadView(import('@pages/edit-supply-goods/edit-supply-goods')),
            meta: {
              titles: ['供应链', '采购', '商品管理', '商品'],
              variableIndex: 3,
              marginBottom: 80,
              beforeResolve(routeTo, routeFrom, next) {
                if (!routeTo.query.id) {
                  return next()
                }
                store
                  .dispatch('scmGoods/getGoodsDetailData', {id: routeTo.query.id, showType: 'base'})
                  .then((response) => {
                    if (!response) {
                      return next({name: '404'})
                    }
                    console.log(response)
                    routeTo.params.detail = response
                    next()
                  })
                  .catch(() => {
                    next({name: '404'})
                  })
              }
            },
            props: (route) => ({detail: route.params.detail})
          },
        ]
      },
      // 导入商品
      {
        path: 'goods-manage/lead-supply-goods',
        name: 'lead-supply-goods',
        component: () => lazyLoadView(import('@pages/lead-supply-goods/lead-supply-goods')),
        meta: {
          titles: ['供应链', '采购', '商品管理', '商品导入']
        }
      },
      // 新建商品
      {
        path: 'goods-manage/edit-supply-goods',
        name: 'edit-supply-goods',
        component: () => lazyLoadView(import('@pages/edit-supply-goods/edit-supply-goods')),
        meta: {
          titles: ['供应链', '采购', '商品管理', '商品'],
          variableIndex: 3,
          marginBottom: 80,
          beforeResolve(routeTo, routeFrom, next) {
            if (!routeTo.query.id) {
              return next()
            }
            store
              .dispatch('scmGoods/getGoodsDetailData', {id: routeTo.query.id, showType: 'base'})
              .then((response) => {
                if (!response) {
                  return next({name: '404'})
                }
                console.log(response)
                routeTo.params.detail = response
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
          }
        },
        props: (route) => ({detail: route.params.detail})
      },
      // 基础设置
      {
        path: 'basics-set',
        name: 'basics-set',
        component: () => lazyLoadView(import('@pages/basics-set/basics-set')),
        meta: {
          titles: ['供应链', '采购', '基础设置']
        }
      },
      // 供应商
      {
        path: 'basics-set/supplier',
        name: 'supplier',
        component: () => lazyLoadView(import('@pages/supplier/supplier')),
        meta: {
          titles: ['供应链', '采购', '基础设置', '供应商'],
          resetHooks: ['supplier/infoSetKeyWord'],
          beforeResolve(routeTo, routeFrom, next) {
            // store.dispatch('supplier/infoSetKeyWord')
            store
              .dispatch('supplier/getSupplier')
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
          }
        }
      },
      // 新建供应商
      {
        path: 'basics-set/supplier/edit-supplier',
        name: 'edit-supplier',
        component: () => lazyLoadView(import('@pages/edit-supplier/edit-supplier')),
        meta: {
          titles: ['供应链', '采购', '基础设置', '供应商'],
          variableIndex: 3,
          beforeResolve(routeTo, routeFrom, next) {
            if (!routeTo.query.id) {
              return next()
            }
            store
              .dispatch('supplier/getSupplierDetail', routeTo.query.id)
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                routeTo.params.detail = res
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
          }
        }
      },
      // 成品入库
      {
        path: 'product-enter',
        name: 'product-enter',
        component: () => lazyLoadView(import('@pages/product-enter/product-enter')),
        meta: {
          titles: ['供应链', '仓库', '成品入库'],
          async beforeResolve(routeTo, routeFrom, next) {
            let exceptionStatus = routeTo.query.exception_status
            exceptionStatus = typeof exceptionStatus === 'undefined' ? '' : exceptionStatus
            let status = exceptionStatus === 1 ? 1 : routeTo.query.status ? routeTo.query.status : 0
            let startTime = routeTo.query.start_time || ''
            let endTime = routeTo.query.end_time || ''
            store
              .dispatch('product/getEnterData', {startTime, endTime, status, page: 1, exceptionStatus})
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 成品入库明细
      {
        path: 'product-enter/enter-detail/:id',
        name: 'enter-detail',
        component: () => lazyLoadView(import('@pages/enter-detail/enter-detail')),
        meta: {
          titles: ['供应链', '仓库', '成品入库', '商品明细'],
          beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('product/getEnterDetailData', routeTo.params.id)
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 成品入库明细
      {
        path: 'product-out',
        name: 'product-out',
        component: () => lazyLoadView(import('@pages/product-out/product-out')),
        meta: {
          titles: ['供应链', '仓库', '成品出库'],
          async beforeResolve(routeTo, routeFrom, next) {
            let exceptionStatus = routeTo.query.exception_status
            exceptionStatus = typeof exceptionStatus === 'undefined' ? '' : exceptionStatus
            let status = exceptionStatus === 1 ? 1 : routeTo.query.status ? routeTo.query.status : 2
            let startTime = routeTo.query.start_time || ''
            let endTime = routeTo.query.end_time || ''
            store
              .dispatch('product/getOutData', {startTime, endTime, status, page: 1, exceptionStatus})
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 成品入库明细
      {
        path: 'product-out/out-detail/:id',
        name: 'out-detail',
        component: () => lazyLoadView(import('@pages/out-detail/out-detail')),
        meta: {
          titles: ['供应链', '仓库', '成品出库', '商品明细'],
          marginBottom: 80,
          beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('product/getOutDetailData', routeTo.params.id)
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 成品入库明细
      {
        path: 'product-out/edit-store',
        name: 'edit-store',
        component: () => lazyLoadView(import('@pages/edit-store/edit-store')),
        meta: {
          titles: ['供应链', '仓库', '成品出库', '新建出库单'],
          beforeResolve(routeTo, routeFrom, next) {
            next()
          }
        }
      },
      // 基础设置
      {
        path: 'foundation-setup',
        name: 'foundation-setup',
        component: () => lazyLoadView(import('@pages/foundation-setup/foundation-setup')),
        meta: {
          titles: ['供应链', '仓库', '基础设置']
        }
      },
      // 库位管理
      {
        path: 'foundation-setup/store-manage',
        name: 'store-manage',
        component: () => lazyLoadView(import('@pages/store-manage/store-manage')),
        meta: {
          titles: ['供应链', '仓库', '基础设置', '库位管理'],
          beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('product/getStore')
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 打印条码
      {
        path: 'foundation-setup/bar-code',
        name: 'bar-code',
        component: () => lazyLoadView(import('@pages/bar-code/bar-code')),
        meta: {
          titles: ['供应链', '仓库', '基础设置', '打印条码']
        }
      },
      // 仓库人员管理
      {
        path: 'foundation-setup/warehouse-personnel',
        name: 'warehouse-personnel',
        component: () => lazyLoadView(import('@pages/warehouse-personnel/warehouse-personnel')),
        meta: {
          titles: ['供应链', '仓库', '基础设置', '仓库人员管理'],
          beforeResolve(routeTo, routeFrom, next) {
            store.dispatch('warehouse/infoSetKeyWord')
            store
              .dispatch('warehouse/getPurchaseUser')
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
          }
        }
      },
      // 仓库人员
      {
        path: 'foundation-setup/edit-warehouse',
        name: 'edit-warehouse',
        component: () => lazyLoadView(import('@pages/edit-warehouse/edit-warehouse')),
        meta: {
          titles: ['供应链', '仓库', '基础设置', '仓库人员'],
          variableIndex: 3,
          marginBottom: 80,
          beforeResolve(routeTo, routeFrom, next) {
            if (!routeTo.query.id) {
              return next()
            }
            store
              .dispatch('warehouse/getPurchaseUserDetail', routeTo.query.id)
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                routeTo.params.detail = res
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
          }
        }
      },
      // 分拣任务
      {
        path: 'sorting-task',
        name: 'sorting-task',
        meta: {
          titles: ['供应链', '分拣', '分拣任务'],
          beforeResolve(routeTo, routeFrom, next) {
            let params = {
              goods_category_id: '',
              page: 1,
              limit: 10,
              start_time: '',
              end_time: '',
              keyword: '',
              status: 0, // 待分拣
              sorting_mode: 0,
              exception_status:'',
              ...routeTo.query
            }
            if(params.status!==''){
              params.status = Number(params.status)
            }
            params.sorting_mode = Number(params.sorting_mode)
            store.commit('sorting/SET_PARAMS', params)
            store
              .dispatch('sorting/getSortingTaskList')
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        },
        component: () => lazyLoadView(import('@pages/sorting-task/sorting-task'))
      },
      // 分拣任务
      {
        path: 'sorting-task/print-preview/:id',
        name: 'sorting-task-preview',
        meta: {
          titles: ['供应链', '分拣', '分拣任务', '打印预览'],
          beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('sorting/getBarCodePreviewInfo', routeTo.params)
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        },
        component: () => lazyLoadView(import('@pages/preview/preview'))
      },
      // 按订单  分拣任务明细
      {
        path: 'sorting-task/sorting-task-order-detail/:id/:order_id',
        name: 'sorting-task-order-detail',
        meta: {
          titles: ['供应链', '分拣', '分拣任务', '商品明细'],
          beforeResolve(routeTo, routeFrom, next) {
            store.commit('sorting/SET_PARAMS', {
              type: 'sortingTaskDetailByOrder',
              page: 1,
              limit: 10
            })
            store
              .dispatch('sorting/getSortingTaskDetailByOrder', routeTo.params)
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        },
        component: () => lazyLoadView(import('@pages/sorting-task-order-detail/sorting-task-order-detail'))
      },
      // 分拣任务明细
      {
        path: 'sorting-task/sorting-task-detail/:id/:goods_sku_code',
        name: 'sorting-task-detail-by-goods',
        meta: {
          titles: ['供应链', '分拣', '分拣任务', '配货明细'],
          beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('sorting/getSortingTaskDetail', routeTo.params)
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        },
        component: () => lazyLoadView(import('@pages/sorting-task-detail/sorting-task-detail'))
      },
      // 分拣配置
      {
        path: 'sorting-config',
        name: 'sorting-config',
        meta: {
          titles: ['供应链', '分拣', '分拣配置'],
          beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('sorting/getSortingConfigList', {
                page: 1
              })
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        },
        component: () => lazyLoadView(import('@pages/sorting-config/sorting-config'))
      },
      // 配货设置
      {
        path: 'matching-setting',
        name: 'matching-setting',
        component: () => lazyLoadView(import('@pages/matching-setting/matching-setting')),
        meta: {
          titles: ['供应链', '设置', '配货设置'],
          beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('allocation/getAllocationList', true)
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 运营时间配置
      {
        path: 'operation-allocation',
        name: 'operation-allocation',
        component: () => lazyLoadView(import('@pages/operation-allocation/operation-allocation')),
        meta: {
          titles: ['供应链', '设置', '运营时间配置'],
          beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('allocation/getOperation', true)
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 库存管理
      {
        path: 'storehouse-management',
        name: 'storehouse-management',
        component: () => lazyLoadView(import('@pages/storehouse-management/storehouse-management')),
        meta: {
          titles: ['供应链', '仓库', '库存管理'],
          beforeResolve(routeTo, routeForm, next) {
            store
              .dispatch('store/getWarehouseList', {page: 1, goodsCategoryId: '', keyword: '', warehousePositionId: '', isPresale: ''})
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 库存管理详情
      {
        path: 'storehouse-management/storehouse-detail',
        name: 'storehouse-detail',
        component: () => lazyLoadView(import('@pages/storehouse-detail/storehouse-detail')),
        meta: {
          titles: ['供应链', '仓库', '库存管理', '库存详情'],
          beforeResolve(routeTo, routeForm, next) {
            store
              .dispatch('store/getWarehouseDetailList', {code: routeTo.query.code, page: 1, order_sn: '', type: ''})
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                routeTo.params.goodsMsg = res.goods
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        },
        props: (route) => ({goodsMsg: route.params.goodsMsg})
      },
      // 批次
      {
        path: 'storehouse-management/batch',
        name: 'batch',
        component: () => lazyLoadView(import('@pages/batch/batch')),
        meta: {
          marginBottom: 80,
          titles: ['供应链', '仓库', '库存管理', '批次'],
          beforeResolve(routeTo, routeForm, next) {
            store
              .dispatch('store/getStockList', {code: routeTo.query.code, page: 1})
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                routeTo.params.goodsMsg = res.goods
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        },
        props: (route) => ({goodsMsg: route.params.goodsMsg})
      },
      // 库存盘点
      {
        path: 'stock-taking',
        name: 'stock-taking',
        component: () => lazyLoadView(import('@pages/stock-taking/stock-taking')),
        meta: {
          titles: ['供应链', '仓库', '库存盘点'],
          beforeResolve(routeTo, routeForm, next) {
            store
              .dispatch('store/getAdjustOrder', {page: 1, startTime: '', endTime: '', keyword: ''})
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 新建盘点
      {
        path: 'stock-taking/edit-stock',
        name: 'edit-stock',
        component: () => lazyLoadView(import('@pages/edit-stock/edit-stock')),
        meta: {
          titles: ['供应链', '仓库', '库存盘点', '新建盘点'],
          marginBottom: 80
        }
      },
      // 盘点详情
      {
        path: 'stock-taking/stock-detail/:id',
        name: 'stock-detail',
        component: () => lazyLoadView(import('@pages/stock-detail/stock-detail')),
        meta: {
          titles: ['供应链', '仓库', '库存盘点', '盘点详情'],
          beforeResolve(routeTo, routeForm, next) {
            store
              .dispatch('store/getAdjustOrderDetail', {id: routeTo.params.id, page: 1})
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 配送任务
      {
        path: 'distribution-task',
        name: 'distribution-task',
        component: () => lazyLoadView(import('@pages/distribution-task/distribution-task')),
        meta: {
          titles: ['供应链', '配送', '配送任务'],
          async beforeResolve(routeTo, routeFrom, next) {
            // 获取服务器时间且初始化
            let tabIndex = store.state.distribution.tabIndex
            store.dispatch('distribution/infoOrderTime', {
              startTime: routeTo.query.start_time || '',
              endTime: routeTo.query.end_time || '',
              status: routeTo.query.status || 1
            })
            store.dispatch('distribution/infoDriverTime', {
              startTime: '',
              endTime: ''
            })
            if (typeof (routeTo.query.status) !== 'undefined') {
              store.dispatch('distribution/setTabIndex', 0)
            }
            // store.mutations.SET_TAB_INDEX(0)
            if (tabIndex === 0) {
              store
                .dispatch('distribution/getOrderList')
                .then((res) => {
                  if (!res) {
                    return next({name: '404'})
                  }
                  return next()
                })
                .catch(() => {
                  return next({name: '404'})
                })
            } else {
              store
                .dispatch('distribution/getDriverList')
                .then((res) => {
                  if (!res) {
                    return next({name: '404'})
                  }
                  return next()
                })
                .catch(() => {
                  return next({name: '404'})
                })
            }
          }
        }
      },
      // 调度管理
      {
        path: 'dispatching-management',
        name: 'dispatching-management',
        component: () => lazyLoadView(import('@pages/dispatching-management/dispatching-management')),
        meta: {
          titles: ['供应链', '配送', '调度管理'],
          beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('delivery/getDriverList')
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 调度管理
      {
        path: 'supply-list',
        name: 'supply-list',
        component: () => lazyLoadView(import('@pages/supply-list/supply-list')),
        meta: {
          titles: ['供应链', '订单', '订单列表'],
          async beforeResolve(routeTo, routeFrom, next) {
            // 获取服务器时间且初始化
            let time = await getCurrentTime()
            let startTime = ''
            let endTime = ''
            if (time.is_over_23_hour) {
              startTime = new Date(time.timestamp - 86400 * 1000 * 1)
              startTime = startTime.toLocaleDateString().replace(/\//g, '-')
              endTime = new Date(time.timestamp)
              endTime = endTime.toLocaleDateString().replace(/\//g, '-')
            } else {
              startTime = new Date(time.timestamp - 86400 * 1000 * 2)
              startTime = startTime.toLocaleDateString().replace(/\//g, '-')
              endTime = new Date(time.timestamp - 86400 * 1000 * 1)
              endTime = endTime.toLocaleDateString().replace(/\//g, '-')
            }
            let start = time.start
            let end = time.end
            store.dispatch('oms/infoOrderTime', {startTime, endTime, start, end})
            store
              .dispatch('oms/getOmsOrders')
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      /**
       *
       *
       * ------------------------------------------------------------------------------------------
       *
       * 统计
       */
      // 社群数据
      {
        path: 'community-data',
        name: 'community-data',
        component: () => lazyLoadView(import('@pages/community-data/community-data')),
        meta: {
          titles: ['统计', '社群数据'],
          beforeResolve(routeTo, routeFrom, next) {
            //  社群列表
            store
              .dispatch('community/getCommunityList', {page: 1})
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 商品数据
      {
        path: 'goods-data',
        name: 'goods-data',
        component: () => lazyLoadView(import('@pages/goods-data/goods-data')),
        meta: {
          titles: ['统计', '商品数据'],
          beforeResolve(routeTo, routeFrom, next) {
            //  社群列表
            store
              .dispatch('goodsData/getCategoryList', {parent_id: 0, get_goods_count: 1})
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 运营数据
      {
        path: 'operation-data',
        name: 'operation-data',
        component: () => lazyLoadView(import('@pages/operation-data/operation-data')),
        meta: {
          titles: ['统计', '运营数据']
        }
      },
      // 调度管理
      {
        path: 'supply-list/supply-detail/:id',
        name: 'supply-detail',
        component: () => lazyLoadView(import('@pages/supply-detail/supply-detail')),
        meta: {
          titles: ['供应链', '订单', '订单列表', '订单详情'],
          beforeResolve(routeTo, routeFrom, next) {
            if (!routeTo.params.id) {
              return next()
            }
            store
              .dispatch('oms/getOmsOrderDetail', routeTo.params.id)
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
          }
        }
      },
      // 新手指南
      {
        path: 'beginner-guide',
        name: 'beginner-guide',
        meta: {
          titles: ['新手指引']
        },
        component: () => lazyLoadView(import('@pages/beginner-guide/beginner-guide'))
      },
      // 调度管理
      {
        path: 'new-data',
        name: 'new-data',
        component: () => lazyLoadView(import('@pages/new-data/new-data')),
        meta: {
          titles: ['概况', '数据概况'],
          async beforeResolve(routeTo, routeFrom, next) {
            let time = await getCurrentTime()
            routeTo.params.time = time
            next()
          }
        }
      },
      // 物流监控
      {
        path: 'logistics-monitoring',
        name: 'logistics-monitoring',
        component: () => lazyLoadView(import('@pages/logistics-monitoring/logistics-monitoring')),
        meta: {
          titles: ['概况', '物流监控'],
          async beforeResolve(routeTo, routeFrom, next) {
            let time = await getCurrentTime()
            routeTo.params.time = time
            next()
          }
        }
      },
      // 账号管理
      {
        path: 'account-manage',
        name: 'account-manage',
        component: () => lazyLoadView(import('@pages/account-manage/account-manage')),
        meta: {
          titles: ['设置', '账号', '账号权限'],
          beforeResolve(routeTo, routeFrom, next) {
            let tabIndex = store.state.account.tabIndex
            if (tabIndex === 0) {
              store
                .dispatch('account/getAccountList')
                .then((res) => {
                  if (!res) {
                    return next({name: '404'})
                  }
                  next()
                })
                .catch(() => {
                  next({name: '404'})
                })
            } else {
              store
                .dispatch('account/getPermissionsList')
                .then((res) => {
                  if (!res) {
                    return next({name: '404'})
                  }
                  next()
                })
                .catch(() => {
                  next({name: '404'})
                })
            }
          }
        }
      },
      // 操作日记
      {
        path: 'account-diary',
        name: 'account-diary',
        component: () => lazyLoadView(import('@pages/account-diary/account-diary')),
        meta: {
          titles: ['设置', '账号', '操作日记']
        }
      }
    ]
  },
  {
    path: '/404',
    name: '404',
    component: () => lazyLoadView(import('@pages/_404/_404')),
    props: true
  },
  // 系统升级
  {
    path: '/upgrade',
    name: 'upgrade',
    component: () => lazyLoadView(import('@pages/_upgrade/_upgrade')),
    props: true
  },
  // 修改密码
  {
    path: '/modify-password',
    name: 'modify-password',
    component: () => lazyLoadView(import('@pages/modify-password/modify-password'))
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '*',
    redirect: '404'
  }
]
// loading: require('@pages/_loading/_loading').default,
// delay: 400,
// error: require('@pages/_timeout/_timeout').default,
// timeout: 10000
function lazyLoadView(AsyncView) {
  const AsyncHandler = () => ({
    component: AsyncView
  })

  return Promise.resolve({
    functional: true,
    render(h, {data, children}) {
      // 将属性和方法传递给所有展示组件
      return h(AsyncHandler, data, children)
    }
  })
}
