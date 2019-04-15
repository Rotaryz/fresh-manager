<template>
  <div class="group-tab">
    <section
      v-if="!groupList.length"
      class="add-wrapper"
      @click="handleAddDepartment(groupList)"
    >
      <div class="icon"></div>
      <p class="text">添加</p>
    </section>
    <section
      class="group-wrapper">
      <nav
        v-for="(company, cIdx) in groupList"
        :key="cIdx"
        class="item-wrapper"
      >
        <section
          class="common-item"
          @click.stop="handleChecked({
               position: company.list,
               current: company,
               parent: groupList,
               index: cIdx,
               parentObj: groupList
               })"
        >
          <article
            v-if="company.isChecked"
            class="active-box"
          >
            <div class="icon"></div>
            <figure
              class="icon-hover"
              @mouseenter="handleMouseEnter"
              @mousemove="handleMouseMove"
              @mouseleave="handleMouseLeave"
            >
            </figure>
          </article>
          <div
            class="icon-drop"
            :class="[{active: company.isChecked}, {'rotate': ''}]"></div>
          <p
            class="text font-f-m"
            :class="{active: company.isChecked}">{{company.name}}</p>
        </section>
        <dl
          v-for="(department, dIdx) in company.list"
          :key="dIdx"
          class="child-wrapper-default"
          :class="{'bottom-line': ''}"
          :style="true?'height: auto;': 'overflow:hidden'"
        >
          <dt
            class="common-item second"
            @click.stop="handleChecked({
                 position: department.list,
                 current: department,
                 parent: company.list,
                 index: dIdx,
                 parentObj: company
                 })"
          >
            <article
              v-if="department.isChecked"
              class="active-box"
            >
              <div class="icon"></div>
              <figure
                class="icon-hover"
                @mouseenter="handleMouseEnter"
                @mousemove="handleMouseMove"
                @mouseleave="handleMouseLeave"
              >
              </figure>
            </article>
            <div class="icon-drop"
                 :class="[{active: department.isChecked}, {'rotate': ''}]"
            ></div>
            <p class="text"
               :class="{active: department.isChecked}"
            >{{department.name}}</p>
          </dt>
          <dd
            v-for="(team, tIdx) in department.list"
            :key="tIdx"
            class="child-wrapper-default"
            :style="true?'height: auto': 'overflow:hidden'"
          >
            <section
              class="team-item-wrapper"
              @click.stop="handleChecked({
                   position: team.list,
                   current: team,
                   parent: department.list,
                   index: tIdx,
                   isLastDepartment: true,
                   parentObj: department
                   })"
            >
              <article
                v-if="team.isChecked"
                class="active-box"
              >
                <div class="icon"></div>
                <figure
                  class="icon-hover"
                  @mouseenter="handleMouseEnter"
                  @mousemove="handleMouseMove"
                  @mouseleave="handleMouseLeave"
                ></figure>
              </article>
              <p class="text">{{team.name}}</p>
            </section>
          </dd>
<!--          <div v-if="child1.list && child1.list.length && child1.rotate" style="height: 11px"></div>-->
        </dl>
      </nav>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import {outreachGroupMethods, outreachGroupComputed} from '@state/helpers'

  const COMPONENT_NAME = 'GROUP_TAB'

  export default {
    name: COMPONENT_NAME,
    data() {
      return {
        timer: null
      }
    },
    computed: {
      ...outreachGroupComputed,
    },
    methods: {
      ...outreachGroupMethods,
      handleAddDepartment(position) {
        this.setAddPosition({position})
        this.handleModal({isShow: true, title: '添加子部门', useType: 'addDepartment', modalType: 'addDepartment'})
      },
      handleChecked(args) {
        const {current, position, parent, index, isLastDepartment, parentObj} = args
        this.setAddPosition({position, isLastDepartment, current})
        this.setDelPosition({parent, index, current})
        this.setEditPosition({current})
        this.setMovePosition({parent, index, current, parentObj})
        this.changeTab({current})
      },
      handleMouseEnter(e) {
        let position = {
          x: e.pageX + 10,
          y: e.pageY - 30
        }
        this.setPosition(position)
        this.handleTools(true)
      },
      handleMouseMove(e) {
        let position = {
          y: e.pageY - 30
        }
        this.setPosition(position)
      },
      handleMouseLeave(e) {
        this.timer && clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.handleTools(false)
        }, 300)
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
    &.active
      .text
        color: $color-positive

  .group-tab
    position :relative
    width: 140px
    height :861px
    border-right: 0.5px solid $color-line
    overflow-y :scroll
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
      .icon
        width :14px
        height :@width
        icon-image(icon-add)
      .text
        padding-left :6px
</style>
