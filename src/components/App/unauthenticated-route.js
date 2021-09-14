export default {
  props: ['dnsimple'],
  mounted () {
    return this.dnsimple.authenticate()
      .then(() => this.$router.push('/domains'))
      .catch(() => {})
  }
}
