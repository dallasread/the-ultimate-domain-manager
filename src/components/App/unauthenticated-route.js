export default {
  props: ['app'],
  mounted () {
    return this.app.commands.authenticate()
      .then(() => this.$router.push('/'))
      .catch(() => {})
  }
}
