import {getCorpId} from '@utils/tool'

export default {
  beforeRouteLeave(to, from, next) {
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
