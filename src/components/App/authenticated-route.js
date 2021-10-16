export default {
  props: ['app'],
  mounted () {
    return this.app.commands.authenticate()
      .catch(() => this.$router.push('/'))
  }
}
