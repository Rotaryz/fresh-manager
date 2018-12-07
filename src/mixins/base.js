export default {
  beforeRouteLeave(to, from, next) {
    next()
  },
  beforeDestroy() {
    this.$loading.hide()
  }
}
