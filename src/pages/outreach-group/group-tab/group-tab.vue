<template>
  <div class="group-tab">
    <section v-if="!groupList.length" class="add-wrapper" @click="showModalHandle('addChildren')">
      <div class="icon"></div>
      <p class="text">添加</p>
    </section>
    <section class="group-wrapper">
      <template v-for="(child, index) in groupList">
        <nav :key="index" class="item-wrapper">
          <div class="common-item" @click="changeTabHandle(child, index, 'first')">
            <article
              v-if="index ===child.index"
              class="active-box"
            >
              <div class="icon"></div>
              <figure class="icon-hover">
                <ul class="tool-wrapper">
                  <div class="tool-bridge"></div>
                  <li class="tool-item-wrapper" v-for="(tool, i) in toolList" :key="i" @click.stop="toolHandle(tool,null,child, index)">
                    <div class="tool-wrapper-icon" :class="tool.iconStyle"></div>
                    <p class="tool-wrapper-text">{{tool.text}}</p>
                  </li>
                </ul>
              </figure>
            </article>
            <div
              class="icon-drop"
              :class="[{active: index === child.index}, {'rotate': child.rotate}]"></div>
            <p
              class="text font-f-m"
              :class="{active: index === child.index}">{{child.name}}</p>
          </div>
          <dl
            v-for="(child1, idx1) in child.list"
            :key="idx1"
            class="child-wrapper-default"
            :class="{'bottom-line': child.rotate}"
            :style="child.rotate?'height: auto;': 'overflow:hidden'"

          >
            <dt
              class="common-item second"
              @click.stop="changeTabHandle(child1, idx1)"
            >
              <article
                v-if="idx1 ===child1.index"
                class="active-box"
              >
                <div class="icon"></div>
                <figure class="icon-hover">
                  <ul class="tool-wrapper">
                    <div class="tool-bridge"></div>
                    <li class="tool-item-wrapper" v-for="(tool, i) in toolList" :key="i" @click.stop="toolHandle(tool,child,child1, idx1)">
                      <div class="tool-wrapper-icon" :class="tool.iconStyle"></div>
                      <p class="tool-wrapper-text">{{tool.text}}</p>
                    </li>
                  </ul>
                </figure>
              </article>
              <div class="icon-drop"
                   :class="[{active: idx1 === child1.index}, {'rotate': child1.rotate}]"
              ></div>
              <p class="text"
                 :class="{active: idx1 === child1.index}"
              >{{child1.name}}</p>
            </dt>
            <dd
              class="child-wrapper-default"
              :style="child1.rotate?'height: auto': 'overflow:hidden'"
              v-for="(child2, idx2) in child1.list"
              :key="child2.id"
              @click.stop="changeTabHandle(child2, idx2, 'last')"
            >
              <div class="team-item-wrapper"
                   :class="{active: idx2 === child2.index}"
              >
                <article
                  v-if="idx2 ===child2.index"
                  class="active-box"
                >
                  <div class="icon"></div>
                  <figure class="icon-hover">
                    <ul class="tool-wrapper">
                      <div class="tool-bridge"></div>
                      <li class="tool-item-wrapper" v-for="(tool, i) in toolList" :key="i" @click.stop="toolHandle(tool,child1,child1.list[idx2], idx2, true)">
                        <div class="tool-wrapper-icon" :class="tool.iconStyle"></div>
                        <p class="tool-wrapper-text">{{tool.text}}</p>
                      </li>
                    </ul>
                  </figure>
                </article>
                <p class="text">{{child2.name}}</p>
              </div>
            </dd>
            <div v-if="child1.list && child1.list.length && child1.rotate" style="height: 11px"></div>
          </dl>
        </nav>
      </template>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import {outreachGroupComputed, outreachGroupMethods} from '@state/helpers'

  const COMPONENT_NAME = 'GROUP_TAB'
  // const toolList = [
  //   {text: '添加子部门', text2: '添加成员', icon: ''}
  // ]

  export default {
    name: COMPONENT_NAME,
    data() {
      return {
        toolList: [
          {text: '添加子部门',iconStyle: 'add', fn: 'showModalHandle'},
          {text: '修改名称' ,iconStyle: 'edit'},
          {text: '上移' ,iconStyle: 'up'},
          {text: '下移' ,iconStyle: 'down'},
          {text: '删除' ,iconStyle: 'delete', fn: 'deleteDepartment'},
        ]
      }
    },
    computed: {
      ...outreachGroupComputed,
    },
    methods: {
      ...outreachGroupMethods,
      toolHandle(tool, parent, current, currentIndex, unableAdd){
        console.log(current)
        let key = tool.fn
        if (key === 'showModalHandle') {
          if (unableAdd) {
            this.$toast.show('不能再添加子部门')
            return
          }
          this.showModalHandle('addChildren', current)
          return
        }
        this[key]({current, parent, currentIndex})
      },
      showModalHandle(key, current) {
        this.showModal({
          ctx: this.$parent,
          key,
          current
        })
      },
      changeTabHandle(item, index, type) {
        this.changeTab({item, index, type})
        this.getStaffList({page: 1, id: item.id})
      },
      resetParams(type) {
        if (type - 1 < 0) return
        this['index' + type] = -1
        this['rotate' + type] = !this['rotate' + type]
        return this.resetParams(type - 1)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .font-f-m
    font-family: $font-family-medium !important

  .bottom-line
    border-bottom :0.5px solid $color-line

  .tool-wrapper
    position :absolute
    top:5px
    left :30px
    width :114px
    height :174px
    background: #Fff;
    border: 0 solid #E9ECEE;
    box-shadow: 0 0 8px 0 #E9ECEE;
    border-radius: 3px
    padding :7px 11px 0 12px
    display :none
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

  .common-item
    height 49px
    border-bottom :0.5px solid $color-line
    layout(row,block,nowrap)
    align-items :center
    padding : 0 11px 0 11px
    position :relative
    &.second
      padding : 0 11px 0 28px
      border-bottom :0.5px solid transparent
    .active-box
      fill-box(absolute)
      background: transparent
      border-left :2px solid transparent
      display :flex
      align-items :center
      padding-left :125px
      .icon
        width :3px
        height :15px
        icon-image(icon-spot)
        position: relative
      .icon-hover
        position :absolute
        top:0
        bottom :0
        width :20px
        right :0
        cursor :pointer
        &:hover
          .tool-wrapper
            display :block

    .icon-drop
      position :relative
      width :5px
      height :8px
      icon-image(icon-drop_close)
      transform :rotate(0deg)
      transition: all 0.3s
      &.active
        icon-image(icon-drop_green)
      &.rotate
        transform :rotate(90deg)
    .text
      position :relative
      padding-left :5px
      font-family: $font-family-regular
      font-size: 14px;
      color: $color-text-main
      line-height: @font-size
      flex: 1
      no-wrap()
      &.active
        color: $color-positive

  .child-wrapper-default
    height :0
    transition: height 0.3s


  .team-item-wrapper
    height :36px
    padding :0 11px 0 39px
    layout(row,block,nowrap)
    align-items :center
    cursor: pointer
    position :relative
    &:last-child
      border-bottom :11px
    .text
      position :relative
      font-family: $font-family-regular
      font-size: 14px;
      color: $color-text-main
      line-height: @font-size
      no-wrap()
    .active-box
      fill-box(absolute)
      background: #E7F7F4;
      border-left :2px solid $color-positive
      display :flex
      align-items :center
      padding-left :125px
      .icon
        cursor: pointer
        width :3px
        height :15px
        icon-image(icon-spot)
      .icon-hover
        position :absolute
        top:0
        bottom :0
        width :20px
        right :0
        cursor :pointer
        &:hover
          .tool-wrapper
            display :block
    &.active
      .text
        color: $color-positive

  .group-tab
    position :relative
    width: 140px
    height :861px
    border-right: 0.5px solid $color-line
    scroll-opacity()
    .group-wrapper
      position :relative
      z-index :500
    .add-wrapper
      display :flex
      align-items :center
      font-family: $font-family-regular
      font-size: 14px
      line-height :@font-size
      color: $color-positive
      padding :15px 17px
      &:hover
        cursor: pointer
      .icon
        width :14px
        height :@width
        icon-image(icon-add)
      .text
        padding-left :6px
</style>
