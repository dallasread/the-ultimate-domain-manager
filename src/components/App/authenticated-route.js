export default {
  props: ['dnsimple'],
  mounted () {
    return this.dnsimple.authenticate()
      .then(() => {})
      .catch(() => this.$router.push('/'))
  }
}
