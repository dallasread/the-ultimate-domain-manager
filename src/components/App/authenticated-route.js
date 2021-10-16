export default {
  props: ['app'],
  mounted () {
    return new Promise((resolve, reject) => {
      this.app.commands.authenticate()
        .then(() => {
          this.app.commands.fetchDomains().then(() => {
            resolve()
          }).catch(console.error)
        })
        .catch(() => {
          this.$router.push('/')
          resolve()
        })
    })
  }
}
