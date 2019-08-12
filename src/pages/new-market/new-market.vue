<template>
  <div class="new-market detail-content">
    <div class="identification">
      <div class="identification-page">
        <img src="./icon-new_commodity@2x.png" class="identification-icon">
        <p class="identification-name">{{!disable ? '新建' : type ? '查看' : '编辑'}}营销</p>
      </div>
      <div class="function-btn">
      </div>
    </div>
    <div class="msg-detail">
      <!--轮播图-->
      <div class="left-view">
        <div class="top-content">
          <div class="wrapper">
            <swiper ref="swiper" :type="marketIndex" @bannerChange="bannerChange"></swiper>
          </div>
        </div>
        <div class="bottom">
          <ul class="pointer">
            <li v-for="(item, index) in arrowArr" :key="index" class="pointer-item" :class="{'active': arrowIndex === index}" @click="changeBanner(index)"></li>
            <li class="num">{{arrowIndex + 1}}/{{arrowArr.length}}</li>
          </ul>
          <p class="text">{{arrowText[marketIndex][arrowIndex]}}</p>
        </div>
      </div>

      <div class="right-form">
        <h3 class="title">
          {{formConfig[marketIndex].type}}
          <!--<span v-if="marketIndex === 2" class="tip">{{'(6天内没有支付订单的客户)'}}</span>-->
        </h3>

        <!--营销名称-->
        <div class="edit-item">
          <div class="edit-title">
            <span class="start">*</span>
            <span>营销名称</span>
          </div>
          <div class="edit-content">
            <input v-model="msg.title"
                   type="text"
                   placeholder="请输入营销计划名称，最多10个字"
                   class="edit-input"
                   maxlength="10"
                   :class="{'disable-input': type}"
            >
            <span class="count">{{(msg.title && msg.title.length) || 0}}/10</span>
            <div :class="{'text-no-change':type}"></div>
          </div>
        </div>

        <!--用户类型说明-->
        <div v-if="!formConfig[marketIndex].group" class="edit-item">
          <div class="edit-title">
            <span class="start">*</span>
            <span>{{formConfig[marketIndex].name}}</span>
          </div>
          <div class="edit-content no-wrap">
            <input v-model="formConfig[marketIndex].text"
                   type="text"
                   readonly
                   :placeholder="formConfig[marketIndex].text"
                   class="edit-input disable-input"
                   maxlength="10"
            >
            <span v-if="+marketIndex === 0" class="end-text">拓展订单除外</span>
            <div class="input-no-change"></div>
          </div>
        </div>

        <!--选择用户或社区 满赠业务新增-->
        <div v-if="marketIndex === 3" class="edit-item  edit-list-item">
          <div class="edit-title">
            <span class="start">*</span>
            <span>定向类型</span>
          </div>
          <div class="edit-content no-wrap" style="flex:1">
            <section class="gift-choose-target-wrapper">
              <article class="g-top">
                <span
                  :class="{'radio-disable': disable}"
                  @click="flagTargetHandle('chooseTarget', 'user')"
                ><i
                  class="circle"
                  :class="{active: chooseTarget === 'user'}"
                ></i>全部用户</span>
                <span
                  :class="{'radio-disable': disable}"
                  @click="flagTargetHandle('chooseTarget', 'community')"
                ><i
                  class="circle"
                  :class="{active: chooseTarget === 'community'}"
                ></i>社区</span>
              </article>
              <div v-if="chooseTarget === 'community'" class="add-btn btn-main" style="margin-top: 24px" :class="{'btn-disable': disable}" @click="_showGroupModal">添加社区<span class="add-icon"></span></div>
              <article v-if="chooseTarget === 'community' && selectGroupList.length" class="edit-list-box">
                <div class="list-title" :class="{'no-line': selectGroupList.length === 0}">
                  <div v-for="(item, index) in groupTitleGift" :key="index" class="list-title-item gift" :style="{flex: item.flex}">{{item.name}}</div>
                </div>
                <div>
                  <div v-for="(item, index) in selectGroupList" :key="index" class="list">
                    <div v-for="(val, ind) in groupTitleGift" :key="ind" class="list-item gift" :style="{flex: val.flex}">
                      <p v-if="val.value === 'delete'" class="handle" :class="{'list-operation-disable': disable}" @click="showConfirm('certificateGroup', index, item)">删除</p>
                      <p v-else class="main">{{item[val.value]}}</p>
                    </div>
                  </div>
                </div>
              </article>
            </section>
          </div>
        </div>

        <!--计划时间-->
        <div class="edit-item">
          <div class="edit-title">
            <span class="start">*</span>
            <span>计划时间</span>
          </div>
          <div class="edit-content no-wrap">
            <date-picker
              v-model="msg.start_at"
              :editable="false"
              class="edit-input-box"
              type="datetime"
              placeholder="选择开始时间"
              style="width: 240px;height: 40px;border-radius: 1px"
              valueFormat="yyyy-MM-dd HH:mm:ss"
              @change="_getStartTime"
            ></date-picker>
            <div class="tip">至</div>
            <date-picker
              v-model="msg.end_at"
              :editable="false"
              class="edit-input-box"
              type="datetime"
              placeholder="选择结束时间"
              style="width: 240px;height: 40px;border-radius: 1px"
              valueFormat="yyyy-MM-dd HH:mm:ss"
              @change="_getEndTime"
            ></date-picker>
            <div v-if="disable" :class="{'time-no-change':disable}"></div>
          </div>
        </div>


        <!--选择优惠券或兑换券 满赠业务 -->
        <div v-if="marketIndex === 3" class="edit-item  edit-list-item">
          <div class="edit-title">
            <span class="start">*</span>
            <span>卡券类型</span>
          </div>
          <div class="edit-content no-wrap" style="flex:1">
            <section class="gift-choose-target-wrapper">
              <article class="g-top">
                <span
                  :class="{'radio-disable': disable}"
                  @click="flagTargetHandle('chooseAward', 'coupon')"
                ><i
                  :class="{active: chooseAward === 'coupon'}"
                  class="circle"
                ></i>优惠券</span>
                <span
                  :class="{'radio-disable': disable}"
                  @click="flagTargetHandle('chooseAward', 'certificate')"
                ><i
                  class="circle"
                  :class="{active: chooseAward === 'certificate'}"
                ></i>兑换券</span>
              </article>
              <div v-show="chooseAward === 'coupon'" class="add-btn btn-main" style="margin-top: 24px" :class="{'btn-disable': disable}" @click="_showCouponModal">添加<span class="add-icon"></span></div>
              <div v-show="chooseAward === 'certificate'" class="add-btn btn-main" style="margin-top: 24px" :class="{'btn-disable': disable}" @click="showMultipleChoice">添加<span class="add-icon"></span></div>
              <article v-if="selectCouponList.length && chooseAward === 'coupon'" class="edit-list-box">
                <div class="list-title" :class="{'no-line': selectCouponList.length === 0}">
                  <div v-for="(item, index) in selectCouponTitle" :key="index" class="list-title-item" :style="{flex: item.flex}">{{item.name}}</div>
                </div>
                <section>
                  <div v-for="(item, index) in selectCouponList" :key="index" class="list">
                    <div v-for="(val, ind) in selectCouponTitle" :key="ind" class="list-item" :style="{flex: val.flex}">
                      <div v-if="val.value === 'time'" class="main">
                        <p v-if="+item.is_day_limited !== 1" style="text-overflow: ellipsis; overflow: hidden;">{{item.start_at}}</p>
                        <p v-if="+item.is_day_limited !== 1" style="text-overflow: ellipsis; overflow: hidden;">{{item.end_at}}</p>
                        <span v-if="+item.is_day_limited === 1">领取后{{item.limit_days}}天内有效</span>
                      </div>
                      <p v-else-if="val.value === ''" class="handle" :class="{'list-operation-disable': disable}" @click="showConfirm('coupon', index, item)">删除</p>
                      <p v-else-if="val.value === 'denomination'">{{item[val.value]}}{{+item.preferential_type === 1 ? '折' : '元'}}</p>
                      <p v-else-if="val.value === 'condition'">{{item[val.value] > 0 ? '满'+Number(item[val.value])+'可用' : '无门槛'}}</p>
                      <p v-else class="main">{{item[val.value]}}</p>
                    </div>
                  </div>
                </section>
              </article>
              <article v-if="selectCertificateList.length && chooseAward === 'certificate'" class="edit-list-box">
                <div class="list-title" :class="{'no-line': selectCouponList.length === 0}">
                  <div v-for="(item, index) in selectCertificateTitle" :key="index" class="list-title-item" :style="{flex: item.flex}">{{item.name}}</div>
                </div>
                <section v-if="chooseAward === 'certificate'">
                  <div v-for="(item, index) in selectCertificateList" :key="index" class="list">
                    <div v-for="(val, ind) in selectCertificateTitle" :key="ind" class="list-item" :style="{flex: val.flex}">
                      <div v-if="val.value === 'time'" class="main">
                        <p v-if="+item.is_day_limited !== 1" style="text-overflow: ellipsis; overflow: hidden;">{{item.start_at}}</p>
                        <p v-if="+item.is_day_limited !== 1" style="text-overflow: ellipsis; overflow: hidden;">{{item.end_at}}</p>
                        <span v-if="+item.is_day_limited === 1">领取后{{item.limit_days}}天内有效</span>
                      </div>
                      <p v-else-if="val.value === ''" class="handle" :class="{'list-operation-disable': disable}" @click="showConfirm('certificate', index, item)">删除</p>
                      <p v-else-if="val.value === 'denomination'">{{item[val.value]}}{{+item.preferential_type === 1 ? '折' : '元'}}</p>
                      <p v-else-if="val.value === 'condition'">{{item[val.value] > 0 ? '满'+Number(item[val.value])+'可用' : '无门槛'}}</p>
                      <p v-else class="main">{{item[val.value]}}</p>
                    </div>
                  </div>
                </section>
              </article>
            </section>
          </div>
        </div>


        <!--选择优惠券-->
        <div v-if="showAdd" class="edit-item  edit-list-item">
          <div class="edit-title">
            <span class="start">*</span>
            <span>选择优惠券</span>
          </div>
          <div class="edit-content flex">
            <div class="add-btn btn-main" :class="{'btn-disable': disable}" @click="_showCouponModal">选择<span class="add-icon"></span></div>

            <div v-if="selectCouponList.length" class="edit-list-box">
              <div class="list-title" :class="{'no-line': selectCouponList.length === 0}">
                <div v-for="(item, index) in selectCouponTitle" :key="index" class="list-title-item" :style="{flex: item.flex}">{{item.name}}</div>

              </div>
              <div>
                <div v-for="(item, index) in selectCouponList" :key="index" class="list">
                  <div v-for="(val, ind) in selectCouponTitle" :key="ind" class="list-item" :style="{flex: val.flex}">
                    <div v-if="val.value === 'time'" class="main">
                      <p v-if="+item.is_day_limited !== 1" style="text-overflow: ellipsis; overflow: hidden;">{{item.start_at}}</p>
                      <p v-if="+item.is_day_limited !== 1" style="text-overflow: ellipsis; overflow: hidden;">{{item.end_at}}</p>
                      <span v-if="+item.is_day_limited === 1">领取后{{item.limit_days}}天内有效</span>
                    </div>
                    <p v-else-if="val.value === ''" class="handle" :class="{'list-operation-disable': disable}" @click="showConfirm('coupon', index, item)">删除</p>
                    <p v-else-if="val.value === 'denomination'">{{item[val.value]}}{{+item.preferential_type === 1 ? '折' : '元'}}</p>
                    <p v-else-if="val.value === 'condition'">{{item[val.value] > 0 ? '满'+Number(item[val.value])+'可用' : '无门槛'}}</p>
                    <p v-else class="main">{{item[val.value]}}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--添加团长-->
        <div v-if="marketIndex === 5" class="edit-item edit-list-item">
          <div class="edit-title">
            <span class="start">*</span>
            <span>添加团长</span>
          </div>
          <div class="edit-content flex">
            <div class="add-btn btn-main" :class="{'btn-disable': type}" @click="_showGroupModal">添加<span class="add-icon"></span></div>

            <div v-if="selectGroupList.length" class="edit-list-box">
              <div class="list-title" :class="{'no-line': selectGroupList.length === 0}">
                <div v-for="(item, index) in selectGroupTitle" :key="index" class="list-title-item" :style="{flex: item.flex}">{{item.name}}</div>

              </div>
              <div>
                <div v-for="(item, index) in selectGroupList" :key="index" class="list">
                  <div v-for="(val, ind) in selectGroupTitle" :key="ind" class="list-item" :style="{flex: val.flex}">
                    <p v-if="val.value === 'number'">
                      <input v-if="!type" v-model="item[val.value]" type="number" class="input-count">
                      <span v-else>{{item.total_stock}}</span>
                    </p>
                    <p v-else-if="val.value === ''" class="handle" :class="{'list-operation-disable': (type || item.id === (marketDetail.shop_coupon && marketDetail.shop_coupon[index] && marketDetail.shop_coupon[index].shop_id))}" @click="showConfirm('group', index, item, item.id === (marketDetail.shop_coupon && marketDetail.shop_coupon[index] && marketDetail.shop_coupon[index].shop_id))">删除</p>
                    <!--<p v-else-if="val.value === ''" class="handle" :class="{'list-operation-disable': (type || item.total_stock)}" @click="showConfirm('group', index, item, total_stock)">删除</p>-->
                    <p v-else class="main">{{item[val.value]}}</p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        <!--邀请有礼-->
        <div v-if="marketIndex === 4">
          <div class="edit-item edit-list-item inviter">
            <div class="edit-title">
              <span class="start">*</span>
              <span>邀请者</span>
            </div>
            <div class="big-list">
              <div class="list-header list-box">
                <div v-for="(item, idx) in inviteTitle" :key="idx" class="list-item">{{item}}</div>
              </div>
              <div class="list">
                <div v-for="(item, index) in inviterArr" :key="index" class="list-content list-box">
                  <div class="list-item">{{item.people}}</div>
                  <div v-if="item.id" class="list-item">{{item.coupon_name}}</div>
                  <div v-if="item.id" class="list-item">{{item.preferential_str}}</div>
                  <div v-if="item.id" class="list-item">{{item.denomination}}</div>
                  <div v-if="item.id" class="list-item">{{item.usable_stock}}</div>
                  <div v-if="item.id" class="list-item list-item-double">
                    <p class="item-dark">{{item.start_at}}</p>
                    <div class="item-sub-time">{{item.end_at}}</div>
                  </div>
                  <div v-if="item.id" class="list-item">
                    <div class="list-operation" :class="{'list-operation-disable': disable}" @click="delInvite(index)">删除</div>
                  </div>
                  <div v-show="!item.id" class="btn-main btn-main-big" :class="{'btn-disable': disable}" @click="_showGoodsCouponModal(index)">添加兑换券<span class="add-icon"></span></div>
                </div>
              </div>
            </div>

          </div>
          <div class="edit-item edit-list-item inviter">
            <div class="edit-title">
              <span class="start">*</span>
              <span>被邀请者</span>
            </div>
            <div class="big-list">
              <div class="list-header list-box">
                <div v-for="(item, idx) in invitedTitle" :key="idx" class="list-item">{{item}}</div>
              </div>
              <div class="list">
                <div v-for="(item, index) in invitedArr" :key="index" class="list-content list-box">
                  <div class="list-item">{{item.cond_type === 1 ? '新人红包' : item.cond_type === 6 ? '下单返红包' : ''}}</div>
                  <div v-if="item.id" class="list-item">{{item.coupon_name}}</div>
                  <div v-if="item.id" class="list-item">{{item.preferential_str}}</div>
                  <div v-if="item.id" class="list-item">{{item.denomination_str}}</div>
                  <div v-if="item.id" class="list-item">{{item.usable_stock}}</div>
                  <div v-if="item.id" class="list-item list-item-double">
                    <p v-if="+item.is_day_limited !== 1" class="item-dark">{{item.start_at}}</p>
                    <p v-if="+item.is_day_limited !== 1" class="item-sub-time">{{item.end_at}}</p>
                    <p v-if="+item.is_day_limited === 1">领取后{{item.limit_days}}天内有效</p>
                  </div>
                  <div v-if="item.id" class="list-item">
                    <div class="list-operation" :class="{'list-operation-disable': disable}" @click="showDel(index)">删除</div>
                  </div>
                  <div v-show="!item.id" class="btn-main btn-main-big" :class="{'btn-disable': disable}" @click="_showCouponModal(index)">添加优惠券<span class="add-icon"></span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <default-confirm ref="confirm" @confirm="_delItem"></default-confirm>
    <!-- 选择兑换券弹窗-->
    <default-modal ref="goodsModal">
      <div slot="content" class="shade-box">
        <div class="title-box">
          <div class="title">
            选择兑换券
          </div>
          <span class="close hand" @click="_cancelGoodsModal"></span>
        </div>
        <!--搜索-->
        <div class="shade-tab">
          <div class="tab-item">
            <base-search ref="couponSearch" placeHolder="请输入兑换券名称" @search="_searchMoreCoupontGoods"></base-search>
          </div>
        </div>
        <!--列表-->
        <div class="group-content">
          <div class="title">
            <span v-for="(item, index) in invitationTitle" :key="index" class="title-item" :style="{flex: item.flex}">{{item.name}}</span>
          </div>
          <div class="outreach-group-list">
            <div v-for="(item, index) in goodsList" :key="index" class="group-item" @click="_selectCoupon(item, index)">
              <div v-for="(val, ind) in invitationTitle" :key="ind" class="title-item" :style="{flex: val.flex}">
                <span v-if="ind === 0" class="radio" :class="{'checked': (couponCheckItem.id ? (item.id === couponCheckItem.id) : (item.id === couponSelectItem.id))}"></span>
                <div v-else-if="val.value === 'time'" class="main">
                  <p v-if="+item.is_day_limited !== 1">{{item.start_at}}</p>
                  <p v-if="+item.is_day_limited !== 1">{{item.end_at}}</p>
                  <p v-if="+item.is_day_limited === 1">领取后{{item.limit_days}}天内有效</p>
                </div>
                <p v-else-if="val.value === 'denomination'">{{item[val.value]}}</p>
                <span v-else class="title-item">{{item[val.value]}}</span>
              </div>
            </div>
          </div>
        </div>
        <!--翻页器-->
        <div class="page-box">
          <base-pagination ref="paginationGoods" :pageDetail="goodsPageTotal" @addPage="_getMoreCoupontGoods"></base-pagination>
        </div>
        <div class="back">
          <div class="back-cancel back-btn hand" @click="_cancelGoodModal">取消</div>
          <div class="back-btn back-submit hand" @click="_additionGoodsCoupon">确定</div>
        </div>
      </div>
    </default-modal>

    <!-- 选择优惠券弹窗-->
    <default-modal v-if="+marketIndex === 4 || +marketIndex === 5" ref="couponModal">
      <div slot="content" class="shade-box">
        <div class="title-box">
          <div class="title">
            选择优惠券
          </div>
          <span class="close hand" @click="_cancelModal"></span>
        </div>
        <!--搜索-->
        <div class="shade-tab">
          <div class="tab-item">
            <base-search ref="couponSearch" placeHolder="请输入优惠券名称" @search="_searchData"></base-search>
          </div>
        </div>
        <!--列表-->
        <div class="group-content">
          <div class="title">
            <span v-for="(item, index) in couponTitle" :key="index" class="title-item" :style="{flex: item.flex}">{{item.name}}</span>
          </div>
          <div class="outreach-group-list">
            <div v-for="(item, index) in couponList" :key="index" class="group-item" @click="_selectCoupon(item, index)">
              <div v-for="(val, ind) in couponTitle" :key="ind" class="title-item" :style="{flex: val.flex}">
                <span v-if="ind === 0" class="radio" :class="{'checked': (couponCheckItem.id ? (item.id === couponCheckItem.id) : (item.id === couponSelectItem.id))}"></span>
                <div v-else-if="val.value === 'time'" class="main">
                  <p v-if="+item.is_day_limited !== 1">{{item.start_at}}</p>
                  <p v-if="+item.is_day_limited !== 1">{{item.end_at}}</p>
                  <p v-if="+item.is_day_limited === 1">领取后{{item.limit_days}}天内有效</p>
                </div>
                <p v-else-if="val.value === 'denomination'">{{item[val.value]}}{{+item.preferential_type === 1 ? '折' : '元'}}</p>
                <span v-else class="title-item">{{item[val.value]}}</span>
              </div>
            </div>
          </div>
        </div>
        <!--翻页器-->
        <div class="page-box">
          <base-pagination ref="paginationCoupon" :pageDetail="couponPage" @addPage="_getMoreCoupon"></base-pagination>
        </div>
        <div class="back">
          <div class="back-cancel back-btn hand" @click="_cancelModal">取消</div>
          <div class="back-btn back-submit hand" @click="_additionCoupon">确定</div>
        </div>
      </div>
    </default-modal>

    <!--多选优惠券弹窗-->
    <default-modal v-else ref="couponModal">
      <div slot="content" class="shade-box">
        <div class="title-box">
          <div class="title">
            选择优惠券
          </div>
          <span class="close hand" @click="_cancelModal"></span>
        </div>
        <!--搜索-->
        <div class="shade-tab">
          <div class="tab-item">
            <base-search ref="groupSearch" placeHolder="请输入优惠券名称" @search="_searchData"></base-search>
          </div>
        </div>
        <!--列表-->
        <div class="group-content">
          <div class="title">
            <span v-for="(item, index) in couponTitle" :key="index" class="title-item" :style="{flex: item.flex}">{{item.name}}</span>
          </div>
          <div class="outreach-group-list">
            <div v-for="(item, index) in couponList" :key="item.id" class="group-item hand" @click="_selectCoupon2(item, index)">
              <div v-for="(val, ind) in couponTitle" :key="val.name" class="title-item" :style="{flex: val.flex}">
                <span v-if="ind === 0" :class="['check', {'checked': item.checked}, {'right': item.right}]"></span>
                <div v-else-if="val.value === 'time'" class="main">
                  <p v-if="+item.is_day_limited !== 1">{{item.start_at}}</p>
                  <p v-if="+item.is_day_limited !== 1">{{item.end_at}}</p>
                  <p v-if="+item.is_day_limited === 1">领取后{{item.limit_days}}天内有效</p>
                </div>
                <p v-else-if="val.value === 'denomination'">{{item[val.value]}}{{+item.preferential_type === 1 ? '折' : '元'}}</p>
                <span v-else class="title-item">{{item[val.value]}}</span>
              </div>
            </div>
          </div>
        </div>
        <!--翻页器-->
        <div class="page-box">
          <base-pagination ref="paginationCoupon" :pageDetail="couponPage" @addPage="_getMoreCoupon"></base-pagination>
        </div>
        <div class="back">
          <div class="back-cancel back-btn hand" @click="_cancelModal">取消</div>
          <div class="back-btn back-submit hand" @click="_additionCoupon2">确定</div>
        </div>
      </div>
    </default-modal>

    <!-- 选择团长弹窗-->
    <default-modal ref="groupModal">
      <div slot="content" class="shade-box">
        <div class="title-box">
          <div class="title">
            选择团长
          </div>
          <span class="close hand" @click="_cancelModal"></span>
        </div>
        <!--搜索-->
        <div class="shade-tab">
          <div class="tab-item">
            <base-search ref="groupSearch" placeHolder="请输入团长名称或账号" @search="_searchData"></base-search>
          </div>
        </div>
        <!--列表-->
        <div class="group-content">
          <div class="title">
            <span v-for="(item, index) in groupTitle" :key="index" class="title-item" :style="{flex: item.flex}">{{item.name}}</span>
          </div>
          <div class="outreach-group-list">
            <div v-for="(item, index) in groupList" :key="item.id" class="group-item" @click="_selectGroup(item, index)">
              <span v-for="(val, ind) in groupTitle" :key="val.name" class="title-item" :style="{flex: val.flex}">
                <span v-if="ind === 0" :class="['check',{'checked': item.checked}, {'right': item.right}]"></span>
                <span v-else class="title-item">{{item[val.value]}}</span>
              </span>
            </div>
          </div>
        </div>
        <!--翻页器-->
        <div class="page-box">
          <base-pagination ref="paginationGroup" :pageDetail="groupPage" @addPage="_getMoreGroup"></base-pagination>
        </div>
        <div class="back">
          <div class="back-cancel back-btn hand" @click="_cancelModal">取消</div>
          <div class="back-btn back-submit hand" @click="_additionGroup">确定</div>
        </div>
      </div>
    </default-modal>
    <div class="back">
      <div class="back-cancel back-btn hand" @click="_back">取消</div>
      <div :class="{'btn-disable': type}" class="back-btn back-submit hand" @click="_saveActivity">保存</div>
    </div>
    <multiple-choice ref="multipleChoice"
                     @addPage="addPageHandle"
                     @search="searchHandle"
                     @hide="hideHandle"
                     @confirm="confirmHandle"
    ></multiple-choice>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import Swiper from './swiper/swiper'
  import {marketComputed, marketMethods} from '@state/helpers'
  import {DatePicker} from 'element-ui'
  import API from '@api'
  import _ from 'lodash'
  import MultipleChoice from './multiple-choice/multiple-choice'

  const PAGE_NAME = 'NEW_MARKET'
  const TITLE = '新建查看营销'
  const COUNTREG = /^[1-9]\d*$/
  const SELECT_COUPON_TITLE = [
    {name: '优惠券名称', flex: 1.7, value: 'coupon_name'},
    {name: '类型', flex: 0.7, value: 'preferential_str'},
    {name: '使用门槛', flex: 1.2, value: 'condition'},
    {name: '面值', flex: 0.7, value: 'denomination'},
    {name: '库存', flex: 0.7, value: 'usable_stock'},
    {name: '有效期', flex: 2, value: 'time'},
    {name: '操作', flex: 0.7, value: ''}
  ]
  const SELECT_GROUP_TITLE = [
    {name: '团长帐号', flex: 1, value: 'mobile'},
    {name: '团长名称', flex: 1, value: 'name'},
    {name: '社区', flex: 1.4, value: 'social_name'},
    {name: '券数量', flex: 1, value: 'number'},
    {name: '操作', flex: 0.5, value: ''}
  ]
  const GROUP_TITLE = [
    {name: '选择', flex: 0.4, value: ''},
    {name: '团长帐号', flex: 1, value: 'mobile'},
    {name: '团长名称', flex: 1, value: 'name'},
    {name: '社区名称', flex: 1.2, value: 'social_name'},
    {name: '社区地址', flex: 2, value: 'address'}
  ]
  const COUPON_TITLE = [
    {name: '选择', flex: 0.4, value: ''},
    {name: '优惠券名称', flex: 1.6, value: 'coupon_name'},
    {name: '类型', flex: 0.9, value: 'preferential_str'},
    {name: '面值', flex: 0.9, value: 'denomination'},
    {name: '剩余数量', flex: 0.9, value: 'usable_stock'},
    {name: '有效期', flex: 1.4, value: 'time'}
  ]
  const INVITATION_TITLE = [
    {name: '选择', flex: 0.4, value: ''},
    {name: '兑换券名称', flex: 1.8, value: 'coupon_name'},
    {name: '类型', flex: 1, value: 'preferential_str'},
    {name: '面值', flex: 1, value: 'denomination'},
    {name: '剩余数量', flex: 1, value: 'usable_stock'},
    {name: '有效期', flex: 1, value: 'time'}
  ]

  const FORM_CONFIG = [
    {
      type: '新客有礼',
      placeHolder: '如: 新用户送25元优惠券，最多10个字',
      name: '新用户',
      text: '已授权成功且没有支付订单的用户',
      code: 'new_customer'
    },{
      type: '复购有礼',
      placeHolder: '如：老用户送25元优惠券，最多10个字',
      name: '复购用户',
      text: '7天内2次支付订单的用户',
      code: 'active_customer'
    },{
      type: '召回有礼',
      placeHolder: '如：流失用户送25元优惠券，最多10个字',
      name: '沉睡用户',
      text: '连续6天没支付订单的用户',
      code: 'sleeping_customer'
    },{
      type: '定向营销',
      placeHolder: '如：流失用户送25元优惠券，最多10个字',
      name: '全部用户',
      text: '登录小程序且授权成功的用户',
      code: 'share_coupon',
      group: true
    },{
      type: '邀请有礼',
      placeHolder: '如：流失用户送25元优惠券，最多10个字',
      name: '全部用户',
      group: true,
      text: '登录小程序且授权成功的用户',
      code: 'invite_customer'
    },{
      type: '社群营销',
      placeHolder: '如：社群发福利10元优惠券，最多10个字',
      group: true,
      code: 'share_coupon'
    }
  ]

  const ARROW_TEXT = [
    ['新客户打开小程序弹出优惠券', '客户商城选购商品', '提交订单立减金额'],
    ['老客户打开小程序弹出优惠券', '客户商城选购商品', '提交订单立减金额'],
    ['沉睡客户打开小程序弹出优惠券', '客户商城选购商品', '提交订单立减金额'],
    ['用户打开小程序弹出优惠券', '客户商城选购商品', '提交订单立减金额'],
    ['邀请者', '被邀请者'],
    [
      '团长打开小区管理营销计划转发优惠券',
      '选择微信聊天列表发送',
      '点击链接进入领券页领取优惠券',
      '领取成功点击去使用跳转商城',
      '客户商城选购商品',
      '提交订单立减金额'
    ]
  ]
  const INVITE_TITLE = ['成功邀请人数', '兑换券名称', '类型', '面值', '剩余', '有效期', '操作']
  const INVITED_TITLE = ['触发条件', '优惠券名称', '类型', '面值', '剩余', '有效期', '操作']


  // 满赠
  const TARGET_TYPE = {
    0: 'user',
    1: 'community'
  }
  const COUPON_TARGET = {
    0: 'coupon',
    2: 'certificate',
    10: 'coupon'
  }
  const SELECT_LIST = {
    'coupon': 'selectCouponList',
    'certificate': 'selectCertificateList'
  }

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultModal,
      DefaultConfirm,
      DatePicker,
      Swiper,
      MultipleChoice
    },
    data() {
      return {
        couponTitle: COUPON_TITLE, // 优惠券弹窗title
        invitationTitle: INVITATION_TITLE, // 兑换券弹窗title
        groupTitle: GROUP_TITLE, // 团长弹窗title
        selectCouponTitle: SELECT_COUPON_TITLE, // 已选优惠券弹窗title
        selectGroupTitle: SELECT_GROUP_TITLE, // 已选团长title
        groupTitleGift: [ // 满赠团长列表
          {name: '社区名称', flex: 1.4, value: 'social_name'},
          {name: '团长名称', flex: 1, value: 'name'},
          {name: '操作', flex: 0.7, value: 'delete'}
        ],
        formConfig: FORM_CONFIG,
        selectGroupList: [], // 已选团长列表
        selectCouponList: [], // 已选优惠券列表
        groupList: [], // 弹窗团长列表
        couponList: [], // 弹窗优惠券列表
        page: 1,
        marketIndex: 0,
        groupPage: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        couponPage: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        msg: {
          type: 1, // 1新客户2活跃客户3沉睡4发放优惠券
          config_json: {},
          shop_coupons: [],
          title: '',
          start_at: '',
          end_at: ''
        },
        arrowArr: [],
        arrowIndex: 0,
        arrowText: ARROW_TEXT,
        groupSelectItem: [],
        couponSelectList: [],
        couponSelectItem: {},
        couponCheckItem: {},
        title: '',
        count: '',
        willDelItem: {},
        confirmType: '',
        modalType: '',
        type: '',
        disable: false,
        currentItem: '',
        // 邀请者
        inviterArr: [{people: '1人', cond_num: 1, cond_type: 5, tag_type: 1}, {people: '3人', cond_num: 3, cond_type: 5, tag_type: 1}, {people: '6人', cond_num: 6, cond_type: 5, tag_type: 1}, {people: '大于6人', cond_num: 7, cond_type: 5, tag_type: 1}],
        invitedArr: [{condition: '新人红包', cond_type: 1, tag_type: 1}, {condition: '下单返红包', cond_type: 6, tag_type: 1}],
        inviteTitle: INVITE_TITLE,
        invitedTitle: INVITED_TITLE,
        invitedIndex: null,
        inviteIndex: null,
        goodsPage: 1,
        goodsKeyword: '',
        goodsList: [],
        goodsPageTotal: {total: 1, per_page: 10, total_page: 1},
        editId: '',
        // 满赠
        chooseTarget: 'user', // 选定向类型
        chooseAward: 'coupon', // 选择卡券类型
        selectCertificateList: [], // 选择兑换券列表
        selectCertificateTitle: [ // 选择兑换券title
          {name: '兑换券名称', flex: 1.7, value: 'coupon_name'},
          {name: '类型', flex: 0.7, value: 'preferential_str'},
          {name: '使用门槛', flex: 1.2, value: 'condition'},
          {name: '面值', flex: 0.7, value: 'denomination'},
          {name: '库存', flex: 0.7, value: 'usable_stock'},
          {name: '有效期', flex: 2, value: 'time'},
          {name: '操作', flex: 0.7, value: ''}
        ]
      }
    },
    computed: {
      ...marketComputed,
      showAdd() {
        let arr = [0, 1, 2, 5]
        return arr.includes(this.marketIndex)
      },
      testName() {
        // 活动名称
        return this.msg.title
      },
      testNewStartTime() {
        return this.msg.start_at
      },
      testNewEndTime() {
        return this.msg.end_at
      },
      testNewEndTimeReg() {
        // 结束时间规则判断
        if (this.msg.start_at && this.msg.end_at) {
          let startAt = this.msg.start_at
          let endAt = this.msg.end_at
          return (
            Date.parse(endAt.replace(/-/g, '/')) > Date.parse(startAt.replace(/-/g, '/'))
          )
        }
        return true
      },
      testCouponList() {
        if (this.marketIndex === 4 || this.marketIndex === 3) {
          return true
        }
        let length = this.selectCouponList.length
        return length > 0
      },
      testGroupList() {
        return +this.marketIndex === 5 ? this.selectGroupList.length : true
      },
      testGroupCount() {
        if (this.marketIndex === 3) return true
        let result = this.selectGroupList.every((item) => {
          return (item.number) > 0 && COUNTREG.test(item.number)
        })
        return result
      },
      testNewGoupCount() {
        if (this.editId) {
          let arr = this.selectGroupList.filter(val => {
            let index = this.marketDetail.shop_coupon.findIndex(item => {
              return val.id === item.shop_id
            })
            return index > -1
          })
          let result = arr.every((item, index) => {
            return item.number > 0 && item.number >= this.marketDetail.shop_coupon[index].total_stock  && COUNTREG.test(item.number)
          })
          return result
        }
        return true
      },
      testInvite() {
        if (this.marketIndex !== 4) {
          return true
        }
        let index = this.inviterArr.findIndex((item) => !item.id)
        return index === -1
      },
      testInvited() {
        if (this.marketIndex !== 4) {
          return true
        }
        let index = this.invitedArr.findIndex((item) => !item.id)
        return index === -1
      },
      testTargetType() {
        if (this.marketIndex === 3) {
          return this.chooseTarget === 'user' || this.selectGroupList.length
        } else {
          return true
        }
      },
      testCardType() {
        if (this.marketIndex === 3) {
          return  (this.chooseAward === 'coupon' && this.selectCouponList.length)
            || (this.chooseAward === 'certificate' && this.selectCertificateList.length)
        } else {
          return true
        }
      }
    },
    watch: {},
    beforeCreate() {
      (this.$route.query.id && this.$route.query.editId) || this.$store.commit('global/SET_CURRENT_TITLES', ['商城', '营销', '营销计划', '新建营销'])
      this.$route.query.id && this.$store.commit('global/SET_CURRENT_TITLES', ['商城', '营销', '营销计划', '查看营销'])
      this.$route.query.editId && this.$store.commit('global/SET_CURRENT_TITLES', ['商城', '营销', '营销计划', '编辑营销'])
    },
    created() {
      // this.id = this.$route.query.id || this.$route.query.editId || null
      this.editId = this.$route.query.editId || null
      this.disable = this.$route.query.id || this.$route.query.editId
      this.marketIndex = +this.$route.query.index || 0
      this.type = this.$route.query.id || ''
      switch (this.marketIndex) {
      case 0:
        this.msg.type = 1
        this.arrowArr = new Array(this.arrowText[this.marketIndex].length).fill(1)
        this.disable || this._getCouponList()
        break
      case 1:
        this.msg.type = 2
        this.arrowArr = new Array(this.arrowText[this.marketIndex].length).fill(1)
        this.disable || this._getCouponList()
        break
      case 2:
        this.msg.type = 3
        this.arrowArr = new Array(this.arrowText[this.marketIndex].length).fill(1)
        this.disable || this._getCouponList()
        break
      case 3:
        this.msg.type = 9
        this.arrowArr = new Array(this.arrowText[this.marketIndex].length).fill(1)
        // this.disable || this._getCouponList()
        // this.disable || this._getGroupList()
        break
      case 4:
        this.msg.type = 7
        this.arrowArr = new Array(this.arrowText[this.marketIndex].length).fill(1)
        this.disable || this._getGoodsCouponList()
        break
      case 5:
        this.msg.type = 4
        this.arrowArr = new Array(this.arrowText[this.marketIndex].length).fill(1)
        this.disable || this._getGoodsCouponList()
        break
      default:
        break
      }
      this._initMsg(this.marketDetail)
    },
    methods: {
      ...marketMethods,
      // todo 满赠待优化 --- start
      flagTargetHandle(key, value) {
        if (this.disable) return
        this[key] = value
      },
      confirmHandle(data = []) {
        this.selectCertificateList = this.selectCertificateList.concat(data)
      },
      hideHandle() {
        this.keyword = ''
        this.page = 1
      },
      async searchHandle(keyword) {
        this.keyword = keyword
        this.page = 1
        try {
          let res = await this._getList()
          this.$refs.multipleChoice && this.$refs.multipleChoice.updateData({
            dataArray: res.data,
            pageDetail: {
              total: res.meta.total,
              per_page: res.meta.per_page,
              total_page: res.meta.last_page
            }
          })
        } catch (e) {}
      },
      async addPageHandle(page) {
        this.page = page
        try {
          let res = await this._getList()
          this.$refs.multipleChoice && this.$refs.multipleChoice.updateData({
            dataArray: res.data,
            pageDetail: {
              total: res.meta.total,
              per_page: res.meta.per_page,
              total_page: res.meta.last_page
            }
          })
        } catch (e) {}
      },
      async _getList() {
        let data = {
          coupon_name: this.keyword,
          page: this.page,
          limit: 6,
          status: 1,
          has_stock: 1,
          tag_type: 0
        }
        let res = {}
        try {
          res = await API.Coupon.getCouponList(data, false)
        } catch (e) {
        }
        return res
      },
      async showMultipleChoice() {
        let res
        try {
          res = await this._getList()
        } catch (e) {}
        const config = {
          choiceTitle: '选择兑换券',
          searchPlaceHolder: '请输入兑换券名称',
          tabTitle: [
            {name: '选择', flex: 0.4, value: ''},
            {name: '兑换券名称', flex: 1.8, value: 'coupon_name'},
            {name: '类型', flex: 1, value: 'preferential_str'},
            {name: '面值', flex: 1, value: 'denomination'},
            {name: '剩余数量', flex: 1, value: 'usable_stock'},
            {name: '有效期', flex: 1, value: 'time'}
          ],
          dataArray: res.data,
          originArray: this.selectCertificateList,
          pageDetail: {
            total: res.meta.total,
            per_page: res.meta.per_page,
            total_page: res.meta.last_page
          }
        }
        this.$refs.multipleChoice && this.$refs.multipleChoice.show(config)
      },
      // todo 满赠待优化 --- end
      _cancelGoodsModal() {
        this.$refs.goodsModal.hideModal()
      },
      // 删除被邀请者
      showDel(index) {
        if (this.disable) {
          return
        }
        let item = this.invitedArr[index]
        this.invitedArr[index] = {condition: item.condition, cond_type: item.cond_type}
        this.invitedArr = JSON.parse(JSON.stringify(this.invitedArr))
      },
      // 删除邀请者
      delInvite(index) {
        if (this.disable) {
          return
        }
        let item = this.inviterArr[index]
        this.inviterArr[index] = {people: item.people, cond_type: item.cond_type, cond_num: item.cond_num}
        this.inviterArr = JSON.parse(JSON.stringify(this.inviterArr))
      },
      bannerChange(index) {
        this.arrowIndex = index
      },
      changeBanner(index) {
        this.arrowIndex = index
        this.$refs.swiper._changeBanner(index)
      },
      // 开始结束时间
      _getStartTime(time) {
        this.msg.start_at = time
        this.msg = JSON.parse(JSON.stringify(this.msg))
      },
      _getEndTime(time) {
        this.msg.end_at = time
        this.msg = JSON.parse(JSON.stringify(this.msg))
      },
      // 删除列表时弹窗
      showConfirm(type, index, item, not = true) {
        if (this.disable && not) {
          return
        }
        let text = '团长'
        switch (type) {
        case 'coupon':
          text = '优惠券'
          break
        case 'certificate':
          text = '兑换券'
          break
        // case 'certificateGroup':
        //   text = '团长'
        //   break
        default:
          break
        }
        this.$refs.confirm.show(`确定删除此${text}吗？`)
        this.confirmType = type
        this.willDelItem = index
        this.currentItem = item
      },
      // 确定删除
      _delItem() {
        if (this.confirmType === 'certificate') {
          this.selectCertificateList.splice(this.willDelItem, 1)
          return
        }
        if (this.confirmType === 'coupon') {
          this.selectCouponList.splice(this.willDelItem, 1)
          this.groupSelectItem.splice(this.willDelItem, 1)
          this.couponCheckItem = {}
          this.couponList.map((item) => {
            if (item.id === this.currentItem.id) {
              item.right = false
              item.checked = false
            }
          })
        } else {
          this.selectGroupList.splice(this.willDelItem, 1)
          this.groupSelectItem.splice(this.willDelItem, 1)
          this.groupList.map((item) => {
            if (item.id === this.currentItem.id) {
              item.right = false
              item.checked = false
            }
          })
        }
      },
      _back() {
        this.$router.back()
      },
      // 获取优惠券列表、团长列表
      async _getGroupList() {
        let res = await API.Outreach.getGroupList({
          keyword: this.keyword,
          status: 0,
          limit: 6,
          page: this.page
        })
        if (res.error !== this.$ERR_OK) {
          this.$toast.show(res.message)
          return
        }
        this.$loading.hide()
        this.groupPage = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        let data = res.data
        this.groupList = data.map((item) => {
          item.right = this.selectGroupList.some((val) => {
            return val.id === item.id
          })
          item.checked = this.groupSelectItem.some((val) => {
            return val.id === item.id
          })
          return item
        })
      },
      _getCouponList() {
        let data = {
          coupon_name: this.keyword,
          page: this.page,
          limit: 6,
          status: 1,
          has_stock: 1,
          tag_type: 0
        }
        API.Coupon.getCouponList(data, false).then((res) => {
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
            return
          }
          this.couponPage = {
            total: res.meta.total,
            per_page: res.meta.per_page,
            total_page: res.meta.last_page
          }
          let data = res.data
          this.couponList = data.map((item) => {
            item.right = this.selectCouponList.some((val) => {
              return val.id === item.id
            })
            item.checked = this.couponSelectList.some((val) => {
              return val.id === item.id
            })
            return item
          })
          // this.couponList = res.data
        })
      },
      // 弹窗优惠券
      _showCouponModal(index) {
        // // 满赠业务
        // if (this.chooseAward === 'certificate') {
        //   // 兑换券
        //   this._getGoodsCouponList()
        //   this.$refs.goodsModal.showModal()
        //   return
        // }
        this.invitedIndex = typeof (index) === 'number' ? index : null
        if (this.disable) return
        this.couponCheckItem = {}
        if (this.modalType !== 'coupon') {
          this._initData()
          this.modalType = 'coupon'
          this.couponList = []
        }
        this.couponSelectList = []
        this._getCouponList()
        this.$refs.couponModal.showModal()
      },
      // 获取兑换券列表
      _getGoodsCouponList() {
        let data = {
          coupon_name: this.goodsKeyword,
          page: this.goodsPage,
          limit: 6,
          status: 1,
          has_stock: 1,
          tag_type: 1
        }
        API.Coupon.getCouponList(data, false).then((res) => {
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
            return
          }
          this.goodsPageTotal = {
            total: res.meta.total,
            per_page: res.meta.per_page,
            total_page: res.meta.last_page
          }
          this.goodsList = res.data
        })
      },
      _getMoreCoupontGoods(page) {
        this.goodsPage = page
        this._getGoodsCouponList()
      },
      _searchMoreCoupontGoods(word) {
        this.goodsKeyword = word
        this.goodsPage = 1
        this._getGoodsCouponList()
        this.$refs.paginationGoods.beginPage()
      },
      // 弹窗兑换券
      _showGoodsCouponModal(index) {
        this.inviteIndex = index
        if (this.disable) return
        this.couponCheckItem = {}
        this._getGoodsCouponList()
        this.$refs.goodsModal.showModal()
      },
      _cancelGoodModal() {
        this.$refs.goodsModal.hideModal()
      },
      _additionGoodsCoupon() {
        this.inviterArr[this.inviteIndex] = Object.assign({}, this.inviterArr[this.inviteIndex], this.couponCheckItem)
        this.inviterArr = JSON.parse(JSON.stringify(this.inviterArr))
        this._cancelGoodModal()
      },
      _showGroupModal() {
        if (this.type) return
        this.groupSelectItem = []
        if (this.modalType === 'coupon') {
          this._initData()
          this.modalType = ''
          this.groupList = []
        }
        this._getGroupList()
        this.$refs.groupModal.showModal()
      },
      // 搜索
      async _searchData(text) {
        this.keyword = text
        this.page = 1
        if (this.modalType === 'coupon') {
          this.$refs.paginationCoupon.beginPage()
          await this._getCouponList()
        } else {
          this.$refs.paginationGroup.beginPage()
          await this._getGroupList()
        }
      },
      // 初始化数据
      _initData() {
        this.page = 1
        this.keyword = ''
        this.modalType = ''
        this.$refs.paginationGroup && this.$refs.paginationGroup.beginPage()
        this.$refs.paginationCoupon && this.$refs.paginationCoupon.beginPage()
      },
      // 统一用一个关闭弹窗方法
      _cancelModal() {
        this.$refs.couponModal && this.$refs.couponModal.hideModal()
        this.$refs.groupModal && this.$refs.groupModal.hideModal()
      },
      // 选中列表某一项
      _selectGroup(item, index) {
        if (item.right) return
        if (item.checked) {
          this.groupList = this.groupList.map((item, ind) => {
            index === ind && (item.checked = false)
            return item
          })
          let idx = this.groupSelectItem.findIndex((items) => items.id === item.id)
          idx > -1 && this.groupSelectItem.splice(idx, 1)
        } else {
          this.groupList = this.groupList.map((item, ind) => {
            index === ind && (item.checked = true)
            return item
          })
          this.groupSelectItem.push(item)
        }
      },
      _selectCoupon(item, index) {
        this.couponCheckItem = item
      },
      // 选中列表某一项
      _selectCoupon2(item, index) {
        if (item.right) return
        if (item.checked) {
          this.couponList = this.couponList.map((item, ind) => {
            index === ind && (item.checked = false)
            return item
          })
          let idx = this.couponSelectList.findIndex((items) => items.id === item.id)
          idx > -1 && this.couponSelectList.splice(idx, 1)
        } else {
          this.couponList = this.couponList.map((item, ind) => {
            index === ind && (item.checked = true)
            return item
          })
          this.couponSelectList.push(item)
        }
      },
      // 弹窗保存
      _additionGroup() {
        console.log(this.selectGroupList, this.groupSelectItem, this.groupList)
        this.selectGroupList = [...this.selectGroupList, ...this.groupSelectItem]
        this.groupList = this.groupList.map((item) => {
          item.checked && (item.right = true)
          return item
        })
        console.log(1)
        this._cancelModal()
      },
      _additionCoupon() {
        if (this.marketIndex === 4) {
          this.invitedArr[this.invitedIndex] = Object.assign({}, this.invitedArr[this.invitedIndex], this.couponCheckItem)
          this.invitedArr = JSON.parse(JSON.stringify(this.invitedArr))
          this._cancelModal()
          return
        }
        this.couponCheckItem.id && (this.couponSelectItem = this.couponCheckItem)
        if (this.couponCheckItem.id) {
          let arr = []
          arr.push(this.couponSelectItem)
          this.selectCouponList = arr
        }
        this._cancelModal()
      },
      // 弹窗保存
      _additionCoupon2() {
        this.selectCouponList = [...this.selectCouponList, ...this.couponSelectList]
        this.couponList = this.couponList.map((item) => {
          item.checked && (item.right = true)
          return item
        })
        this._cancelModal()
      },
      // 翻页
      async _getMoreGroup(page) {
        this.page = page
        await this._getGroupList()
      },
      async _getMoreCoupon(page) {
        this.page = page
        await this._getCouponList()
      },
      // 满赠保存 todo
      _submitGift() {
        this.msg.coupon_type = this._setMsgTarget(COUPON_TARGET, 'chooseAward')
        this.msg.target_type = this._setMsgTarget(TARGET_TYPE, 'chooseTarget')
        this.msg.config_json.target_shops = this.selectGroupList
        const key = SELECT_LIST[this.chooseAward]
        this.msg.common_coupons = this[key].map(item => {
          return {
            coupon_id: item.id
          }
        })
        console.log(this.msg)
      },
      _setMsgTarget(obj, choose) {
        for (let [key,val] of Object.entries(obj)) {
          if (this[choose] === val) {
            return key
          }
        }
      },
      // 保存优惠券数据
      async _saveActivity() {
        this._submitGift()
        if (this.type || this.isSubmit) return
        let checkForm = this.checkForm()
        if (!checkForm) return
        this.isSubmit = true
        // this.msg.coupon_id = this.couponSelectItem.id
        // 优惠券列表
        this.msg.common_coupons = this.selectCouponList.map(item => {
          return {coupon_id: item.id}
        })
        switch (+this.marketIndex) {
        case 3:
          this._submitGift()
          break
        case 4:
          // 邀请有礼单独处理
          delete this.msg.shop_coupons
          this.msg.config_json.inviter_coupons = this.inviterArr.map((item) => {
            item.coupon_id = item.id
            return item
          })
          this.msg.config_json.invitee_coupons = this.invitedArr.map((item) => {
            item.coupon_id = item.id
            return item
          })
          let arr1 = this.inviterArr.map((item) => {
            return {
              coupon_id: item.id
            }
          })
          let arr2 = this.invitedArr.map((item) => {
            return {
              coupon_id: item.id
            }
          })
          this.msg.common_coupons = [...arr1, ...arr2]
          break
        case 5:
          // 社群营销加团长列表
          this.msg.common_coupons = [{coupon_id: this.couponSelectItem.id}]
          this.msg.shop_coupons = this.selectGroupList.map((item) => {
            return {
              shop_id: item.id,
              number: item.number
            }
          })
          break
        default:
          break
        }
        let res = null
        // 编辑商品时可修改标题
        if (this.editId) {
          let data = {
            title: this.msg.title,
            id: this.editId
          }
          // 编辑社群营销可增加团长
          if (+this.marketIndex === 5) {
            // let arr = this.msg.shop_coupons.filter(val => {
            //   let index = this.marketDetail.shop_coupon.findIndex(item => {
            //     return val.shop_id === item.shop_id
            //   })
            //   return index < 0
            // })
            data.shop_coupons = this.msg.shop_coupons
          }
          res = await API.Market.editMarket(data) // 编辑营销
        } else {
          res = await API.Market.storeMarket(this.msg, false) // 新建营销
        }
        this.setDefaultTab(+this.$route.query.index)
        // this.$loading.hide()
        if (res.error !== this.$ERR_OK) {
          this.$toast.show(res.message)
          this.isSubmit = false
          return
        }
        this.$toast.show('保存成功')
        setTimeout(() => {
          this._back()
        }, 1000)
      },
      // 验证表单
      checkForm() {
        let arr = [
          {value: this.testName, txt: '请输入营销名称'},
          {value: this.testTargetType, txt: '请选择定向类型'},
          {value: this.testNewStartTime, txt: '请选择开始时间'},
          {value: this.testNewEndTime, txt: '请选择结束时间'},
          {value: this.testNewEndTimeReg, txt: '结束时间必须大于开始时间'},
          {value: this.testCardType, txt: '请选择卡券'},
          {value: this.testCouponList, txt: '请选择优惠券'},
          {value: this.testGroupList, txt: '请选择团长'},
          {value: this.testGroupCount, txt: '请输入团长优惠券发放数量'},
          {value: this.testNewGoupCount, txt: '团长优惠券发放数量只能增加'},
          {value: this.testInvite, txt: '请选择邀请者兑换券'},
          {value: this.testInvited, txt: '请选择被邀请者优惠券'}
        ]
        for (let i = 0, j = arr.length; i < j; i++) {
          if (!arr[i].value) {
            this.$toast.show(arr[i].txt, 2000)
            return false
          }
          if (i === j - 1 && arr[i].value) {
            return true
          }
        }
      },
      // 详情信息
      _initMsg(news) {
        let id = this.$route.query.id || this.$route.query.editId || null
        if (id) {
          let obj = _.cloneDeep(news)
          this.selectCouponList = obj.common_coupons.map(item => {
            // item.start_at = item.start_at.split(' ')[0]
            // item.end_at = item.end_at.split(' ')[0]
            return item
          })
          // this.selectCouponList = this.selectCouponList[0].start_at.split(' ')[0]
          // this.selectCouponList = this.selectCouponList[0].end_at.split(' ')[0]
          this.selectGroupList = obj.shop_coupon.map((item) => {
            return {
              id: item.shop_id,
              number: item.total_stock,
              total_stock: item.total_stock,
              mobile: item.shop && item.shop.mobile,
              name: item.shop && item.shop.name,
              social_name: item.shop && item.shop.social_name
            }
          })
          this.msg = obj
          this.msg.config_json = JSON.parse(obj.config_json)
          if (this.marketIndex === 4) {
            this.inviterArr = this.msg.config_json.inviter_coupons
            this.invitedArr = this.msg.config_json.invitee_coupons
          }
          // 满赠
          if (this.marketIndex === 3) {
            this.chooseTarget = TARGET_TYPE[obj.target_type]
            this.chooseAward= COUPON_TARGET[obj.coupon_type]
            let key = SELECT_LIST[this.chooseAward]
            this[key] = obj.common_coupons
            this.selectGroupList = this.msg.config_json.target_shops
          }
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/detail"


  // 满赠-选择社区模板
  .gift-choose-target-wrapper
    position: relative
    width :100%
    .g-top
      display:flex
      & > span
        display :flex
        align-items :center
        margin-right :58px
        cursor :pointer
        &.radio-disable
          cursor: default
      & >>> .circle
        width: 18px
        height: @width
        border: 1px solid #E1E1E1;
        border-radius: 50%
        margin-right:6px
        transition: all 0.3s
        display: inline-block
        &.active
          border: 5px solid #4DBD65;

  ::-webkit-input-placeholder {
    font-size: 14px
    font-family: $font-family-regular
    color: #ACACAC
  }
  .new-market
    padding-bottom: 20px
    position: relative
    flex: 1
    font-size: $font-size-14
    color: #333
    font-family: $font-family-regular
  .msg-detail
    display: flex
  /*左边轮播图*/
  .left-view
    margin: 20px 60px 14px
    width: 340px
    height: 640px
    .top-content
      height: 550px
      background: url(./pic-model@2x.png) no-repeat
      background-size: 100% 100%
      overflow: hidden

    .wrapper
      width: 300px
      height: 472.2px
      overflow: hidden
      margin: 80px auto 0
    .wrapper-box
      width: 100%
      height: 100%
      .step
        background-size: 100% 100%
        width: 100%
        height: 100%
    .bottom
      height: 90px
      border-radius: 0 0 8px 8px
      padding: 22px 20px 18px
      box-sizing: border-box
      border: 2px solid #F3F3F3
      .pointer
        width: 100%
        height: 16px
        .pointer-item
          width: 16px
          height: 16px
          background: #E3E3E3
          float: left
          margin-right: 10px
          border-radius: 50%
          cursor: pointer
          transition: all 0.3s
        .num
          color: #666
          float: right
          height: 16px
          line-height: 16px
        .active
          background: $color-main
      .text
        color: #333
        margin-top: 16px
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap
  /*右边表单*/
  .right-form
    box-sizing: border-box
    flex: 1
    padding: 36px 20px 20px
    .title
      font-size: $font-size-16
      position: relative
      padding-bottom: 10px
      padding-left: 12px
      margin-bottom: 24px
      border-bottom: 1px solid $color-line
      &:before
        content: ""
        width: 3px
        height: 16px
        background: $color-main
        position: absolute
        left: 0
        top: 4px
      .tip
        color: $color-text-assist
        font-size: $font-size-14

    .edit-item
      display: flex
      align-items: center
      margin-bottom: 38px
      .edit-title
        text-align: right
        width: 94px
        .start
          display: inline-block
          color: #F52424
        .tip
          display: block
          font-size: $font-size-12
          color: $color-text-assist
      .long-title
        text-align: left
        width: 180px
        .tip
          margin-left: 5px
      .edit-content
        margin-left: 40px
        position: relative
        .edit-input
          font-size: $font-size-14
          padding: 0 14px
          border-radius: 1px
          width: 400px
          height: 40px
          line-height: 40px
          display: flex
          align-items: center
          justify-content: space-between
          border: 1px solid $color-line
          transition: all 0.3s
          &:hover
            border-color: #ACACAC
          &:focus
            border-color: $color-main
        .disable-input
          background: #F5F5F5
          color: #ACACAC
        .count
          color: $color-text-assist
          position: absolute
          right: 10px
          col-center()
        .time-no-change, .text-no-change, .day-no-change
          position: absolute
          left: 0
          top: 0
          width: 400px
          height: 40px
          z-index: 100
        .text-no-change
          cursor: not-allowed
        .time-no-change
          height: 40px
          width: 500px
        .day-no-change
          top: 40px
          height: 110px
          width: 518px
        .add-btn
          box-sizing: border-box
          height: 32px
          width: 108px
        .edit-list-box
          margin-top: 20px
          border: 1px solid $color-line
          .list-title
            background: #F5F7FA
            height: 45px
            line-height: 45px
            padding: 0 20px
            display: flex
            border-bottom: 1px solid $color-line
            .list-title-item
              padding-right: 20px
              &:last-child
                padding-right: 0
                max-width: 54px
          .no-line
            border-bottom: 0
          .list
            height: 60px
            padding: 0 20px
            display: flex
            line-height: 16px
            &:nth-child(2n)
              background: #F5F7FA
            .list-item
              display: flex
              align-items: center
              overflow: hidden
              padding-right: 20px
              &:last-child
                padding-right: 0
                max-width: 54px
              .main
                line-height: 20px
                overflow: hidden
                white-space: nowrap
                text-overflow: ellipsis
              .input-count
                width: 90px
                height: 34px
                padding-left: 15px
                box-sizing: border-box
                border: 1px solid $color-line
                line-height: 20px
              .handle
                color: #4d77bd
                cursor: pointer
                &:hover
                  color: #06397e
              .list-operation-disable
                cursor: not-allowed
                color: #acacac
                &:hover
                  color: #acacac
        .text
          color: $color-text-assist
          margin-bottom: 20px
        .check-item
          display: flex
          margin-bottom: 20px
          align-items: center
          cursor: pointer
          .check-icon
            width: 16px
            height: 16px
            border: 1px solid #E1E1E1
            border-radius: 50%
            margin-right: 10px
            transition: all 0.3s
            display: flex
            justify-content: center
            align-items: center
            &:before
              content: ""
              display: block
              width: 8px
              height: 8px
              border-radius: 50%
              background: #4DBD65
              opacity: 0
              transition: all 0.3s
          .checked
            border-color: #4DBD65
            &:before
              opacity: 1
          .count-input
            width: 120px
            height: 43px
            line-height: 20px
            padding: 0 10px
            border: 1px solid $color-line
            box-sizing: border-box
        .check-item:last-child
          margin-bottom: 0
      .edit-input-box
        margin-right: 14px
        &:nth-child(4)
          margin: 0 14px
        .edit-input
          font-size: $font-size-12
          border-radius: 2px
          padding: 0 14px
          width: 400px
          height: 40px
          display: flex
          align-items: center
          justify-content: space-between
          font-family: $font-family-regular
          color: $color-text-main
          border: 1px solid $color-line
          transition: all 0.3s
          &:hover
            border-color: #ACACAC
          &:focus
            border-color: $color-main
          .edit-time
            color: $color-text-assist
            font-family: $font-family-regular
            font-size: $font-size-12
        .disable-input
          background: #F5F5F5
          color: #ACACAC
      .tip
        margin-right: 14px
      .flex
        flex: 1
      .no-wrap
        display: flex
        align-items: center
        .end-text
          margin-left: 10px
          color: $color-text-assist
    .edit-list-item
      align-items: flex-start
      .edit-title
        margin-top: 4px
    .edit-item-activity
      align-items: flex-start
    .edit-item-new
      align-items: flex-start
      .edit-title
        margin-top: 11px
    .bottom
      background: #fff
  //  弹窗
  .shade-box
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.60)
    border-radius: 2px
    background: $color-white
    height: 675px
    max-width: 1000px
    width: 1000px
    position: relative
    overflow-x: hidden
    overflow-y: auto
    flex-wrap: wrap
    padding: 0 20px
    box-sizing: border-box
    .title-box
      display: flex
      box-sizing: border-box
      padding: 23px 0
      align-items: center
      justify-content: space-between
      .title
        font-size: $font-size-16
        font-family: $font-family-medium
        line-height: 1
        color: $color-text-main
      .close
        width: 12px
        height: @width
        icon-image('icon-close')
    .back
      border-top-1px($color-line)
      position: absolute
      left: 0
      right: 0
      bottom: 0
      background: $color-white
      justify-content: flex-end
    /*小弹窗盒子*/
    .default-modal-small
      position: absolute
      width: 100%
      height: 100%
      background: rgba(0, 0, 0, 0.50)
      top: 0
      bottom: 0
      right: 0
      z-index: 10
      layout()
      justify-content: center
      align-items: center
      .model-active
        animation: layerFadeIn .3s
      .model-un-active
        animation: hideFadeIn .4s

    /*分类弹窗*/
    .default-input
      box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.60)
      background: #fff
      border-radius: 2px
      .title-input
        height: 60px
        layout(row)
        align-items: center
        justify-content: space-between
        border-bottom: 0.5px solid $color-line
        padding-left: 20px
        .title
          color: $color-text-main
          font-size: $font-size-16
          font-family: $font-family-medium
        .close-box
          padding: 17px
          .close
            width: 16px
            height: 16px
            border-radius: 50%
            background-size: 22px
            icon-image('icon-close')
            transition: all 0.3s
            &:hover
              transform: scale(1.3)

      .main-input
        padding: 42px 20px 30px 20px
        .main-input-box
          width: 310px
          height: 40px
          border-radius: 2px
          font-family: $font-family-regular
          color: $color-text-main
          font-size: $font-size-14
          padding-left: 14px
          border: 1px solid $color-line
          transition: all 0.3s
          &::-webkit-inner-spin-button
            appearance: none
          &:hover
            border: 1px solid #ACACAC
          &::placeholder
            font-family: $font-family-regular
            color: $color-text-assist
          &:focus
            border-color: $color-main !important

    .btn-group
      text-align: center
      display: flex
      justify-content: flex-end
      user-select: none
      .btn
        width: 96px
        height: 40px
        line-height: 40px
        border-radius: 2px
        cursor: pointer
        transition: all 0.3s
      .cancel
        border: 1px solid $color-line
        &:hover
          color: $color-text-sub
          border-color: $color-text-sub
      .confirm
        border: 1px solid $color-main
        background: $color-main
        color: $color-white
        margin-left: 20px
        &:hover
          background: #44AB67
        &:active
          opacity: 0.8
      .one-btn
        margin-left: 0

    .main-model-box
      layout(row)
      align-items: center
      margin-bottom: 24px
      .text
        color: #666
        font-size: $font-size-14
        font-family: $font-family-regular
        width: 60px
        margin-right: 36px

  /*新建编辑内部的确定弹窗*/
  .default-confirm
    width: 329.6px
    height: 200px
    background: #fff
    border-radius: 2px
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.6)
    text-align: center
    .btn-group-confirm
      text-align: center
      display: flex
      justify-content: center
      user-select: none
      .btn
        width: 96px
        height: 40px
        line-height: 40px
        border-radius: 2px
        border: 1px solid $color-text-D9
        cursor: pointer
        transition: all 0.3s
      .cancel
        border: 1px solid $color-line
        &:hover
          color: $color-text-sub
          border-color: $color-text-sub
      .confirm
        border: 1px solid $color-main
        background: $color-main
        color: $color-white
        margin-left: 20px
        &:hover
          background: #44AB67
        &:active
          opacity: 0.8
      .one-btn
        margin-left: 0
    .title
      font-size: $font-size-16
      font-family: $font-family-medium
      height: 40px
      line-height: 40px
      padding: 0 15px
    .text
      font-size: $font-size-16
      color: $color-text-main
      height: 120px
      display: flex
      align-items: center
      justify-content: center
      margin: 10px 15px
      overflow-y: auto
      text-align: justify
      word-break: break-all
      line-height: 1.4

  /*选择商品样式*/
  .shade-tab
    height: 48px
    box-sizing: border-box
    display: flex
    .tab-item
      margin-right: 10px

  .page-box
    box-sizing: border-box
    height: 76px
    align-items: center
    display: flex

  .goods-content
    border-radius: 2px
    border: 1px solid $color-line
    height: 400px
    .outreach-goods-list
      flex-wrap: wrap
      display: flex
      .goods-item
        box-sizing: border-box
        padding: 0 20px
        width: 50%
        height: 79.5px
        display: flex
        align-items: center
        border-bottom: 0.5px solid $color-line
        &:nth-child(2n+1)
          border-right: 1px solid $color-line
        &:nth-child(9), &:nth-child(10)
          border-bottom: none
        .select-icon
          margin-right: 20px
          border-radius: 2px
          border: 1px solid $color-line
          height: 16px
          width: 16px
          transition: all 0.3s
        .select-icon-disable
          border: 1px solid transparent
          cursor: not-allowed
          icon-image('icon-check_ash')
        .select-icon-active
          border: 1px solid transparent
          icon-image('icon-check')
        .goods-img
          margin-right: 10px
          width: 40px
          height: @width
          overflow: hidden
          background-repeat: no-repeat
          background-size: cover
          background-position: center
          background-color: $color-background
        .goods-msg
          display: flex
          flex-direction: column
          color: $color-text-main
          font-family: $font-family-regular
          justify-content: space-between
          flex: 1
          overflow: hidden
          height: 40px
          .goods-name
            width: 210px
            no-wrap()
          .goods-name, .goods-money
            line-height: 1.2
            font-size: $font-size-14

        .add-btn
          border-radius: 2px
          margin-left: 88px
          padding: 5px 0
          width: 56px
          text-align: center
        .add-btn-disable
          border-radius: 2px
          margin-left: 88px
          padding: 5px 0
          width: 56px
          box-sizing: border-box
          text-align: center
          font-size: $font-size-14
          line-height: 1
          cursor: not-allowed
          background: $color-line
          color: $color-text-assist
          border: none

  .group-content
    border-radius: 2px
    height: 407px
    .title
      display: flex
      height: 45px
      line-height: 45px
      font-family: $font-family-regular
      background: #F5F7FA
      border: 0.5px solid #E9ECEE
      align-items: center
      padding: 0 20px
      .title-item
        display: -webkit-box
        overflow: hidden
        -webkit-line-clamp: 2
        -webkit-box-orient: vertical
        padding-right: 20px
    .outreach-group-list
      font-size: $font-size-14
      color: #333
      font-family: $font-family-regular
      .group-item
        height: 60px
        line-height: 18px
        display: flex
        align-items: center
        border-bottom: 0.5px solid #E9ECEE
        border-right: 0.5px solid #E9ECEE
        border-left: 0.5px solid #E9ECEE
        padding: 0 20px
        &:first-child
          border-top: none
        &:nth-child(2n)
          background: #F5F7FA
        .radio
          width: 16px
          height: 16px
          border: 1px solid #E1E1E1
          border-radius: 50%
          transition: all 0.3s
          display: flex
          justify-content: center
          align-items: center
        .checked
          border: 5px solid $color-main
        .check
          width: 16px
          height: 16px
          border: 1px solid #E1E1E1
          transition: all 0.3s
          display: flex
          justify-content: center
          align-items: center
          &:before
            content: ""
            width: 14px
            height: 14px
            icon-image(icon-check)
            display: block
            opacity: 0
            transition: all 0.3s
        .checked
          border-color: #4DBD65
          &:before
            opacity: 1
        .right
          border-color: #E1E1E1
          &:before
            opacity: 1
            icon-image(icon-check_ash)
        .title-item
          padding-right: 20px
          display: block
          overflow: hidden
          span
            display: -webkit-box
            overflow: hidden
            -webkit-line-clamp: 2
            -webkit-box-orient: vertical
  .inviter
    .list-box
      margin-left: 40.9px
      .list-item
        white-space: nowrap
        &:first-child
          min-width: 80px
          max-width: 104px
        &:nth-child(7)
          padding: 0
          max-width: 50px
        &:nth-child(2)
          flex: 2
        &:nth-child(6)
          flex: 2
          min-width: 150px
      .btn-main-big
        line-height: 34px
        height: 34px
    .list .list-content:nth-child(2n)
      background: $color-white
</style>
