export default {
  props: ['app'],
  mounted () {
    if (this.app.commands.queries.getAccessToken()) {
      this.$router.push('/')
    }
  }
}
