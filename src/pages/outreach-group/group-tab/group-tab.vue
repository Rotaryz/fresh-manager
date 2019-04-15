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
    <section class="group-wrapper">
      <nav
        v-for="(company, cIdx) in groupList"
        :key="cIdx"
        class="item-wrapper"
      >
        <section
          class="common-item"
          @click.stop="handleChangeStatus({
          current: company,
          parentObj: groupList,
          grade: 'company'
          })"
        >
          <article class="active-box"></article>
          <figure
            class="icon-hover"
            @mouseleave="handleMouseLeave"
            @click.stop="handleChecked({
               position: company.list,
               current: company,
               parent: groupList,
               index: cIdx,
               parentObj: groupList,
               e: $event,
               })"
          >
            <div class="icon" id="icon1"></div>
          </figure>
          <div
            class="icon-drop"
            :class="{'active' : checkItemStatus(company)}"></div>
          <p
            class="text font-f-m"
            :class="{'active' : checkItemStatus(company)}">{{company.name}}</p>
        </section>
        <dl
          v-for="(department, dIdx) in company.list"
          :key="dIdx"
          class="child-wrapper-default"
          :class="{'bottom-line': checkItemStatus(company)}"
          :style="formatStyle(company)"
        >
          <dt
            class="common-item second"
            @click.stop="handleChangeStatus({
              current: department,
              parentObj: company,
              grade: 'department'
              })"
          >
            <article class="active-box"></article>
            <figure
              class="icon-hover"
              @mouseleave="handleMouseLeave"
              @click.stop="handleChecked({
                 position: department.list,
                 current: department,
                 parent: company.list,
                 index: dIdx,
                 parentObj: company,
                 e: $event,
                 grade: 'department'
                 })"
            >
              <div class="icon icon-image"></div>
            </figure>
            <div class="icon-drop"
                 :class="{'active' : checkItemStatus(department)}"
            ></div>
            <p class="text"
               :class="{'active' : checkItemStatus(department)}"
            >{{department.name}}</p>
          </dt>
          <dd
            v-for="(team, tIdx) in department.list"
            :key="tIdx"
            class="child-wrapper-default"
            :class="{'team' : checkItemStatus(department)}"
            :style="formatStyle(department)"
          >
            <section
              class="team-item-wrapper"
              @click.stop="handleChangeStatus({
                current: team,
                parentObj: department,
                grade: 'team',
                isLastDepartment: true
                })"
            >
              <article v-if="checkItemStatus(team)" class="active-box">
              </article>
              <figure
                class="icon-hover"
                @mouseleave="handleMouseLeave"
                @click.stop="handleChecked({
                   position: team.list,
                   current: team,
                   parent: department.list,
                   index: tIdx,
                   isLastDepartment: true,
                   parentObj: department,
                   e: $event,
                   grade: 'team'
                   })"
              >
                <div class="icon"></div>
              </figure>
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
        timer: null,
        statusArray: []
      }
    },
    computed: {
      ...outreachGroupComputed,
    },
    methods: {
      ...outreachGroupMethods,
      checkItemStatus(current) {
        return this.statusArray.some(item => {
          return +item.currentId === +current.id
        })
      },
      formatStyle(current) {
        let hasIn = this.statusArray.some(item => {
          return +item.currentId === +current.id
        })
        return hasIn ? 'height: auto' : 'overflow:hidden'
      },
      handleAddDepartment(position) {
        this.setAddPosition({position})
        this.handleModal({isShow: true, title: '添加子部门', useType: 'addDepartment', modalType: 'addDepartment'})
      },
      handleChangeStatus(args) {
        const {current, parentObj, grade, isLastDepartment} = args
        let parentId = grade === 'company' ? 0 : parentObj.id
        let hasIn = this.statusArray.some(item => {
          return +item.currentId === +current.id
        })
        switch (grade) {
        case 'company' :
          if (hasIn) {
            this.statusArray = this.statusArray.filter(item => {
              return +item.currentId !== +current.id
            })
          } else {
            this.statusArray = [{currentId: current.id, parentId}]
          }
          break
        case 'department':
          if (hasIn) {
            this.statusArray = this.statusArray.filter(item => {
              return !(+item.currentId === +current.id || +item.parentId === +current.id)
            })
          } else {
            this.statusArray = this.statusArray.filter(item => {
              return +item.parentId !== +parentId
            })
            this.statusArray.push({currentId: current.id, parentId})
          }
          break
        case 'team':
          if (hasIn) {
            this.statusArray = this.statusArray.filter(item => {
              return +item.currentId !== +current.id
            })
          } else {
            this.statusArray = this.statusArray.filter(item => {
              return +item.parentId !== +parentId
            })
            this.statusArray.push({currentId: current.id, parentId})
          }
          break
        default:
          break
        }
        this.changeTab({current, isLastDepartment, parentObj})
      },
      handleChecked(args) {
        const {current, position, parent, index, isLastDepartment, parentObj, e} = args
        this.setAddPosition({position, isLastDepartment, current})
        this.setDelPosition({parent, index, current})
        this.setEditPosition({current})
        this.setMovePosition({parent, index, current, parentObj})
        this.handleMouseEnter(e)
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
        }, 500)
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
    cursor: pointer
    &:hover
      .icon-hover
        .icon
          display :block
    &.second
      padding : 0 11px 0 28px
      border-bottom :0.5px solid transparent
    .icon-hover
      position :absolute
      top:0
      bottom :0
      left :120px
      right :0
      display :flex
      align-items :center
      .icon
        width :3px
        height :15px
        icon-image(icon-spot)
        position: relative
        left: 5px
        display :none
    .active-box
      fill-box(absolute)
      background: transparent
      border-left :2px solid transparent
      display :flex
      align-items :center
      padding-left :125px
    .icon-drop
      position :relative
      width :5px
      height :8px
      icon-image(icon-drop_close)
      transform :rotate(0deg)
      transition: all 0.3s
      &.active
        icon-image(icon-drop_green)
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
    &.team:last-child
      padding-bottom :11px


  .team-item-wrapper
    height :36px
    padding :0 11px 0 39px
    layout(row,block,nowrap)
    align-items :center
    position :relative
    cursor :pointer
    &:hover
      .icon-hover
        .icon
          display :block
    &:last-child
      border-bottom :11px
    .text
      position :relative
      font-family: $font-family-regular
      font-size: 14px;
      color: $color-text-main
      line-height: @font-size
      no-wrap()
    .icon-hover
      position :absolute
      top:0
      bottom :0
      left :120px
      right :0
      cursor :pointer
      display :flex
      align-items :center
      .icon
        width :3px
        height :15px
        icon-image(icon-spot)
        position: relative
        left: 5px
        display :none
      &:hover
        .icon
          display :block
    .active-box
      fill-box(absolute)
      background: #E7F7F4;
      border-left :2px solid $color-positive
      display :flex
      align-items :center
      padding-left :125px
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
