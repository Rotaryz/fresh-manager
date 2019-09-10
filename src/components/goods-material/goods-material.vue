<template>
  <default-modal ref="modal">
    <div slot="content" class="goods-material">
      <div class="title-box">
        <div class="title">选择商品素材</div>
        <span class="close hand" @click="hide"></span>
      </div>
      <div class="shade-tab">
        <div class="tab-item">
          <base-drop-down :width="218" :select="oneList" @setValue="selectOneList"></base-drop-down>
        </div>
        <div class="tab-item">
          <base-drop-down :width="218" :select="twoList" @setValue="selectTwoList"></base-drop-down>
        </div>
        <div class="tab-item">
          <base-search placeHolder="商品名称" :infoText="keyWord" @search="changeKeyword"></base-search>
        </div>
      </div>

      <div class="material-content">
        <div class="goods-list">
          <div v-for="(item, index) in materialList" :key="index" class="goods-item">
            <div class="goods-item-top">
              <video v-if="item.goods_videos.length" class="top-pic-box video-box" :src="item.goods_videos[0].full_url"></video>
              <img v-else class="top-pic-box" :src="item.goods_cover_image" alt="">
            </div>
            <div class="goods-item-bottom">
              <div class="goods-title">{{item.name}}</div>
              <div class="goods-price-box hand" @click="submitAdd(item)">
                添加
              </div>
            </div>
          </div>
          <div v-if="materialList.length === 0" class="base-blank-box">
            <base-blank></base-blank>
          </div>
        </div>
        <div class="page-box">
          <base-pagination ref="pagination" :pageDetail="pageTotal" @addPage="addPage"></base-pagination>
        </div>
      </div>
    </div>
  </default-modal>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  import API from '@api'

  const COMPONENT_NAME = 'GOODS_MATERIAL'

  export default {
    name: COMPONENT_NAME,
    components: {DefaultModal},
    data() {
      return {
        oneList: {check: false, show: false, content: '一级类目', type: 'default', data: []},
        oneIndex: 0,
        twoList: {check: false, show: false, content: '二级类目', type: 'default', data: []},
        twoIndex: 0,
        keyWord: '',
        page: 1,
        materialId: '',
        isShowAdd: false,
        isSubmit: false,
        pageTotal: {
          total: 1,
          per_page: 8,
          total_page: 1
        },
        materialList: []
      }
    },
    methods: {
      show(text, title) {
        this.getReqList()
        this.getCategoriesData()
        this.$refs.modal && this.$refs.modal.showModal()
      },
      hide() {
        this.$refs.modal && this.$refs.modal.hideModal()
      },
      // 获取类目列表
      getCategoriesData() {
        API.Product.getScmCategoryList({parent_id: -1}, false).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.oneList.data = res.data
            this.oneList.data.unshift({name: '全部', id: '', list: []})
            this.$nextTick(() => {
              let number = 0
              let oneItem = document.querySelectorAll('.select-one-item')
              oneItem.forEach((item) => {
                number += item.clientWidth + 8
              })
              this.isShowOne = number
            })
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      // 选择一级类目
      selectOneList(item, index) {
        let obj = JSON.parse(JSON.stringify(item))
        this.materialId = obj.id
        this.twoList.data = this.oneList.data[index].list
        this.twoList.data.unshift({name: '全部', id: obj.id, list: []})
        this.twoList.content = '二级类目'
        this.page = 1
        this.$refs.pagination.beginPage()
        this.getReqList()
      },
      // 选择二级类目
      selectTwoList(item, index) {
        this.materialId = item.id
        this.page = 1
        this.$refs.pagination.beginPage()
        this.getReqList()
      },
      // 分页
      addPage(page) {
        this.page = page
        this.getReqList()
      },
      // 搜索
      changeKeyword(text) {
        this.keyWord = text
        this.page = 1
        this.$refs.pagination.beginPage()
        this.getReqList()
      },
      // 添加商品
      submitAdd(item) {
        if (this.isSubmit) return
        this.isSubmit = true
        this.$emit('selectMaterial', item)
        this.hide()
        setTimeout(() => {
          this.isSubmit = false
        }, 400)
      },
      // 获取商品素材列表
      getReqList() {
        API.Product.getScmStoreList(
          {
            keyword: this.keyWord,
            goods_material_category_id: this.materialId,
            page: this.page,
            limit: 8
          },
          false
        ).then((res) => {
          if (res.error !== this.$ERR_OK) {
            return false
          }
          this.pageTotal = {
            total: res.meta.total,
            per_page: res.meta.per_page,
            total_page: res.meta.last_page
          }
          this.materialList = res.data
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .goods-material
    width: 966px
    height: 812px
    background: #fff
    border-radius: 3px
    box-shadow: 0 8px 14px 0 rgba(12, 6, 14, 0.08)
    padding: 0 20px
    box-sizing: border-box
    position: relative
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
    .shade-tab
      margin-bottom: 20px
      align-items: center
      box-sizing: border-box
      display: flex
      .tab-item
        margin-right: 10px

    .material-content
      border-radius: 4px
      height: 625px
      .goods-list
        layout(row)
        height: 100%
        .goods-item
          width: 216px
          height: 297px
          border-1px(#D9DEE1, 8px)
          margin-right: 20px
          margin-bottom: 30px
          border-radius: 4px
          &:nth-child(4n)
            margin-right: 0
          &:nth-child(n+5)
            margin-bottom: 0
          .goods-item-top
            width: 216px
            height: @width
            padding-top: 38px
            box-sizing: border-box
            position: relative
            .top-pic-box
              width: 140px
              height: @width
              display: block
              margin: 0 auto
              border-radius: 2px
              object-fit: cover
              background-repeat: no-repeat
              background-size: cover
              background-position: center
              background-color $color-np-content
            .video-box
              background-color $color-np-content
            .goods-item-model
              cursor: pointer
              position: absolute
              width: 100%
              height: 100%
              background: rgba(0,0,0,.05)
              left: 0
              top: 0
              z-index: 2
              layout(row)
              align-items: center
              justify-content: center
              border-radius: 2px
              opacity: 0
              .look-goods
                width: 64px
                height: 28px
                line-height: 28px
                border-radius: 14px
                background: rgba(0,0,0,.5)
                text-align: center
                font-size: $font-size-14
                font-family: $font-family-regular
                color: rgba(255,255,255,.7)
            &:hover
              .goods-item-model
                opacity: 1
          .goods-item-bottom
            box-sizing: border-box
            .goods-title
              padding: 10px 14px 16px
              font-family: $font-family-regular
              color: $color-text-main
              font-size: $font-size-14
              no-wrap()
            .goods-price-box
              color: #3E77C3
              background: #F5F7FA
              height: 34px
              line-height: 34px
              text-align: center
              font-family: $font-family-regular
              font-size: $font-size-14
              border-top-1px(#D9DEE1)
            .goods-price-add
              color: #ACACAC
              cursor: auto

          &:nth-child(7n)
            /*margin-right: 0*/
            opacity: 1

      .page-box
        padding: 0 20px
        box-sizing: border-box
        height: 77px
        align-items: center
        display: flex
      .base-blank-box
        width: 100%
        position: relative
        height: 630px

</style>
