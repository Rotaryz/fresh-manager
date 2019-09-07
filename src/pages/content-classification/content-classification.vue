<template>
  <div class="content-classification table">
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-product_list@2x.png" class="identification-icon">
          <p class="identification-name">内容分类</p>
        </div>
        <div class="function-btn">
          <div class="btn-main hand" @click="newClassify">添加分类<span class="add-icon"></span></div>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in dispatTitle" :key="index" class="list-item">{{item}}</div>
        </div>
        <div v-if="contentClassList.length" class="list">
          <div v-for="(item, index) in contentClassList" :key="index" class="list-content list-box">
            <div class="list-item">{{item.name}}</div>
            <div class="list-item">{{item.updated_at}}</div>
            <div class="list-item">
              <div class="list-item-btn" @click="changeSwitch(index, item)">
                <base-switch confirmText="显示" cancelText="隐藏" switchColor="#4DBD65" :status="item.status"></base-switch>
              </div>
            </div>
            <div class="list-item">{{item.quote_count}}</div>
            <div class="list-item list-operation-box">
              <span class="list-operation" @click="editClassify(item)">
                编辑
              </span>
              <div class="list-operation select-type-box" @click="delContent(item.id)">删除</div>
            </div>
          </div>
        </div>
        <base-blank v-else></base-blank>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pages" :pageDetail="contentClassPage" @addPage="addPage"></base-pagination>
      </div>
    </div>
    <default-confirm ref="confirm" @confirm="freeze"></default-confirm>
    <default-input ref="modalBox" :classifyMaxLength="4" inputType="classification" @confirm="confirmInput"></default-input>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import DefaultInput from '@components/default-input/default-input'
  import API from '@api'
  import {contentComputed, contentMethods} from '@state/helpers'

  const PAGE_NAME = 'CONTENT_CLASSIFICATION'
  const TITLE = '内容中心'
  const DISPATCHING_LIST = ['内容分类名称', '修改时间', '显示', '关联文章数量', '操作']

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultConfirm,
      DefaultInput
    },
    data() {
      return {
        dispatTitle: DISPATCHING_LIST,
        delId: null,
        newUnits: '',
        methodsName: '',
        page: 1,
        editId: null
      }
    },
    computed: {
      ...contentComputed
    },
    // mounted() {
    //   this.$refs.modalBox.show('', '添加分类', '请输入分类名字，最多4个字')
    // },
    methods: {
      ...contentMethods,
      async changeSwitch(index, item) {
        let status = item.status === 1 ? 0 : 1
        let res = await API.Content.changeClassify(item.id, {status})
        this.$toast.show(res.message)
        res.error === this.$ERR_OK && this.contentAddPage({})
      // this.contentClassList[index].status = this.contentClassList[index].status === 0 ? 1 : 0
      },
      addPage(page) {
        this.contentAddPage({page})
      },
      delContent(id) {
        this.$refs.confirm.show('确定删除该分类吗？')
        this.delId = id
      },
      // 确定删除
      async freeze() {
        let res = await API.Content.delContentClass(this.delId)
        this.$toast.show(res.message)
        res.error === this.$ERR_OK && this.contentAddPage({})
      },
      async confirmInput(text) {
        if (text.length === 0) {
          this.$toast.show('分类名字不能为空')
          return
        } else if (text.length === 0 || text.length > 4) {
          this.$toast.show('分类名字的长度不能超过4个字')
          return
        }
        let res = await API.Content[this.methodsName]({name: text}, this.editId || true)
        this.$toast.show(res.message)
        this.$loading.hide()
        if (res.error !== this.$ERR_OK) {
          return
        }
        this.$refs.modalBox.hide()
        this.editId = null
        this.contentAddPage({})
      },
      editClassify(item) {
        this.methodsName = 'editClassify'
        this.editId = item.id
        this.$refs.modalBox.show(item.name, '添加分类', '请输入分类名字，最多4个字')
      },
      // 新增分类
      newClassify() {
        this.methodsName = 'newClassify'
        this.$refs.modalBox.show('', '添加分类', '请输入分类名字，最多4个字')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .content-classification
    width: 100%

  .list-box
    .list-item
      &:nth-child(1)
        flex: 1.4
      &:last-child
        flex: 0.6
        max-width: 76px
        padding: 0

  .list-item-btn
    display: inline-block
</style>
