import {getCorpId} from '@utils/tool'

export default {
  beforeRouteLeave(to, from, next) {
    let flag = (to.name === 'activity-manage' && from.name === 'new-sale' || from.name === 'new-collage') || (from.name === 'activity-manage' && (to.name === 'new-sale' || to.name === 'new-collage'))
    if (!flag) {
      window.$$tabIndex = undefined
    }
    next()
  },
  beforeDestroy() {
    this.$loading.hide()
  },
  methods: {
    getCurrentId() {
      return getCorpId()
    }
  }
}
