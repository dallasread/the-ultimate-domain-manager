export default {
  props: ['dnsimple'],
  mounted () {
    return this.dnsimple.authenticate().catch(() => {
      this.$router.push('/')
    })
  }
}
