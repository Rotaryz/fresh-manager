<template>
  <ul
    v-if="showTools"
    class="group-tab-tools"
    :style="{left: x + 'px', top: y + 'px'}"
    @mouseenter="handleMouseEnter"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
<!--    <div class="tool-bridge"></div>-->
    <li
      class="tool-item-wrapper"
      v-for="(tool, index) in tools"
      :key="index"
      @click.stop="handleClick(tool)"
    >
      <div class="tool-wrapper-icon" :class="tool.iconStyle"></div>
      <p class="tool-wrapper-text">{{tool.text}}</p>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
  import {outreachGroupComputed, outreachGroupMethods} from '@state/helpers'

  const COMPONENT_NAME = 'GROUP_TAB_TOOLS'

  export default {
    name: COMPONENT_NAME,
    data() {
      return {
        tools: [
          {text: '添加子部门',iconStyle: 'add', fn: 'handleAddDepartment'},
          {text: '修改名称',iconStyle: 'edit', fn: 'handleEditDepartment'},
          {text: '上移',iconStyle: 'up', fn: 'handleMoveDepartment', moveType: 'up'},
          {text: '下移',iconStyle: 'down', fn: 'handleMoveDepartment', moveType: 'down'},
          {text: '删除',iconStyle: 'delete', fn: 'deleteDepartment'},
        ]
      }
    },
    computed: {
      ...outreachGroupComputed
    },
    methods: {
      ...outreachGroupMethods,
      handleMouseEnter(e) {
        this.updateIsEnter(true)
        this.handleTools(true)
      },
      handleMouseMove(e) {
        this.handleTools(true)
      },
      handleMouseLeave(e) {
        this.updateIsEnter(false)
        this.timer = setTimeout(() => {
          this.handleTools(false)
        }, 500)
      },
      handleClick(tool) {
        this.handleMouseLeave()
        const key = tool.fn
        this[key](tool)
      },
      handleAddDepartment() {
        if (this.isLastDepartment) {
          this.$toast.show('不能再添加子部门了！')
          return
        }
        this.handleModal({isShow: true, title: '添加子部门', useType: 'addDepartment'})
      },
      handleEditDepartment() {
        this.handleModal({isShow: true, title: '编辑子部门名称', useType: 'editDepartment'})
      },
      handleMoveDepartment(tool) {
        const {moveType} = tool
        this.moveDepartment({moveType})
      }
    }

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .group-tab-tools
    position :fixed
    width :114px
    height :174px
    background: #Fff;
    border: 0 solid #E9ECEE;
    box-shadow: 0 0 8px 0 #E9ECEE;
    border-radius: 3px
    padding :7px 11px 0 12px
    z-index :600
    .tool-bridge
      position: absolute;
      height: 40px;
      width: 25px;
      top: 0;
      left: -16px;
    .tool-item-wrapper
      height :31px
      border-bottom :0.5px solid $color-line
      layout(row,block,nowrap)
      align-items :center
      cursor :pointer
      box-sizing :border-box
      &:last-child
        border-bottom :none
      .tool-wrapper-icon
        width :9px
        height :@width
        &.add
          icon-image(icon-add_normal)
        &.edit
          icon-image(icon-edit_normal)
        &.up
          icon-image(icon-up_normal)
        &.down
          icon-image(icon-down_normal)
        &.delete
          icon-image(icon-delete_normal)
      .tool-wrapper-text
        padding-left :5px
        font-family: $font-family-regular
        font-size: 14px;
        color: $color-text-main
        line-height: @font-size
      &:hover
        .tool-wrapper-text
          color: $color-positive
        .tool-wrapper-icon
          &.add
            icon-image(icon-add_hover)
          &.edit
            icon-image(icon-edit_hover)
          &.up
            icon-image(icon-up_hover)
          &.down
            icon-image(icon-down_hover)
          &.delete
            icon-image(icon-delete_hover)

</style>
