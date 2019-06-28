<template>
  <div class="admin-select">
    <div v-for="(item,index) in city" :key="index" class="select-item"
         @click.stop="selectType(item.type, index)"
    >
      <!--<span class="title" :style="index? '' : 'margin:0'">{{titleArr[index]}}</span>-->
      <div v-for="(items,idx) in item.children" :key="idx" class="admin-big-box" :class="{'input-height':item.select}">
        <div class="admin-select-box input-height-item animate-hover" :class="{'admin-select-box-active': item.show}" :style="{'min-width': width + 'px',height: height + 'px', lineHeight: height + 'px'}">
          {{items.content}}
          <img src="./icon-drop_down@2x.png" class="city-tap-top" :class="{'city-tap-top-active': item.select}">
          <transition name="fade">
            <ul v-show="item.select" class="select-child" @mouseleave="leaveHide(index)" @mouseenter="endShow">
              <li v-for="(child, chIdx) in items.data" :key="chIdx" class="select-child-item" @click.stop="setValue(child,index,idx, chIdx)">
                {{child.name}}
              </li>
            </ul>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import cc from './city'
  import regionArr from './city-data'

  export default {
    props: {
      select: {
        type: Array,
        default: () => [
          {
            select: false,
            show: false,
            children: [{content: '全部', data: []}]
          }
        ]
      },
      isUse: {
        type: Boolean,
        default: true
      },
      width: {
        type: Number,
        default: 126.5
      },
      height: {
        type: Number,
        default: 40
      }
    },
    data() {
      return {
        setTime: '',
        content: {
          province: '',
          city: '',
          area: ''
        },
        city: [
          {
            select: false,
            show: false,
            children: [{content: '请选择省份', data: []}]
          },
          {
            select: false,
            show: false,
            children: [{content: '请选择城市', data: []}]
          },
          {
            select: false,
            show: false,
            children: [{content: '请选择区/县', data: []}]
          }
        ],
        titleArr: ['省', '市', '区/县']
      }
    },
    created() {
      this._infoPro()
      window.onclick = () => {
        this.city.forEach((item) => {
          item.select = false
        })
      }
    },
    methods: {
      infoCity(arr) {
        this.city.map((item, idx) => {
          item.children[0].content = arr[idx]
        })
        let index = this.city[0].children[0].data.findIndex((item) => item.name.includes(arr[0]))
        this.city[1].children[0].data = regionArr[index].sub
        let idx = this.city[1].children[0].data.findIndex((item) => item.name.includes(arr[1]))
        this.city[2].children[0].data = regionArr[index].sub[idx].sub
      },
      clearLocationInfo() {
        this.city.map((item) => {
          item.children[0].content = '请选择'
        })
      },
      clickHide(index) {
        this.city[index].select = false
        this.city[index].show = false
      },
      endShow() {
        clearTimeout(this.setTime)
      },
      leaveHide(index) {
        this.setTime = setTimeout(() => {
          this.clickHide(index)
        }, 1500)
      },
      selectType(type, index) {
        if (!this.isUse) {
          return
        }
        this.city[index].select = !this.city[index].select
        this.city[index].show = !this.city[index].show
        this.city.forEach((item, idx) => {
          if (idx !== index) {
            item.select = false
            item.show = false
          }
        })
        this.$emit('selectType', type, this.city)
      },
      setValue(value, bigIndex, idx, currentIdx) {
        this.city[bigIndex].select = false
        this.city[bigIndex].children[idx].content = value.name
        switch (bigIndex) {
        case 0:
          let index = regionArr.findIndex((child) => child.name === value.name)
          if (index !== this.cityIndex || index === 0) {
            this.content.city = ''
            this.city[1].children = [{content: '请选择城市', data: []}]
          }
          this.cityIndex = index
          this._infoCity(index)
          this.content.province = value.name
          this.city[2].children = [{content: '请选择区/县', data: []}]
          this.content.area = ''
          break
        case 1:
          if (!this.cityIndex) {
            this.cityIndex = bigIndex + 1
          }
          if (value.name !== this.content.city || idx === 0) {
            this.content.area = ''
            this.city[2].children = [{content: '请选择区/县', data: []}]
          }
          this._infoArea(currentIdx)
          this.content.city = value.name
          break
        case 2:
          this.content.area = value.name
          break
        }
        this.city.forEach((item, itemIndex) => {
          item.children.map((items) => {
            if (items.content.includes('请选择')) {
              this.content[itemIndex] = ''
            } else {
              this.content[itemIndex] = items.content
            }
          })
        })
        this.city[bigIndex].show = false
        this.$emit('setValue', this.content)
      },
      _infoPro() {
        let arr = []
        for (let value in regionArr) {
          arr.push({name: regionArr[value].name, type: 'pro'})
        }
        this.city[0].children[0].data = arr
      },
      _infoCity(index) {
        let cityArr = regionArr[index].sub
        let arr = []
        cityArr.forEach(item => {
          arr.push({name: item.name, type: 'city'})
        })
        this.city[1].children[0].data = arr
      },
      _infoArea(index) {
        let idx = regionArr.findIndex(child => child.name === this.city[0].children[0].content)
        if (idx === -1) return
        let areaArr = regionArr[idx].sub[index]
        let arr = []
        areaArr.sub.map(item => {
          arr.push({name: item.name, type: 'area'})
        })
        this.city[2].children[0].data = arr
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .admin-select
    box-sizing: border-box
    display: flex

  .select-item
    display: flex
    align-items: center
    position: relative
    &:first-child
      margin-left: 0px

  .select-title
    font-size: $font-size-medium
    line-height: 17px
    no-wrap()

  .admin-big-box
    cursor: pointer
    box-sizing: border-box
    border-radius: 2px
    font-size: $font-size-medium
    color: $color-text-main
    position: relative
    .admin-select-box
      border-radius: 2px
      border 1px solid $color-line
      padding: 0 31px 0 15px
      line-height: 27px
      white-space: nowrap
      font-size: $font-size-12
      position: relative
      color: $color-text-sub
      box-sizing: border-box
      transition: all 0.2s
      margin-right: 10px
      &:hover
        border-color: #ACACAC
      .city-tap-top
        width: 12px
        height: @width
        col-center()
        right: 14px
        transform-origin: 50% 0%
        transform: rotate(0deg) translateY(-50%)
        transition: transform 0.3s
      .city-tap-top-active
        transform-origin: 50% 0%
        transform: rotate(180deg) translateY(-50%)
        transition: transform 0.3s
      .select-child
        left: 0
        background: $color-white
        z-index: 300
        position: absolute
        width: 100%
        border-radius: 3px
        box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.20)
        margin-top: 10px
        overflow-y: auto
        max-height: 300px
        &.fade-enter, &.fade-leave-to
          opacity: 0
        &.fade-enter-to, &.fade-leave-to
          transition: opacity .3s ease-in-out
        .select-child-item
          white-space: nowrap
          color: $color-text-main
          padding: 0 11px
          text-align: left
          height: 40px
          line-height: 40px
          font-size: 14px
          font-family: $font-family-regular
          border-bottom: 0.5px solid $color-line
          box-sizing: border-box
          &:hover
            color: $color-main
    .admin-select-box-active
      border-color: $color-main !important
    .admin-big-box-hover
      border-color: #ACACAC
</style>
