export default {
  beforeRouteLeave(to, from, next) {
    next(true)
  },
  beforeDestroy() {
    this.$loading.hide()
  }
}
