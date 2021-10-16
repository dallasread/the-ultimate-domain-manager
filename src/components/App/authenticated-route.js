export default {
  props: ['app'],
  mounted () {
    return this.app.commands.authenticate()
      .then(this.app.commands.fetchDomains())
      .catch(() => this.$router.push('/'))
  }
}
