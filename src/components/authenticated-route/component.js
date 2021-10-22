export default {
  props: ['app'],
  mounted () {
    if (!this.app.commands.queries.getAccount()) {
      this.$router.push('/')
    }
  }
}
