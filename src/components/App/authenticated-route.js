export default {
  props: ['app'],
  mounted () {
    return new Promise((resolve, reject) => {
      this.app.commands.authenticate()
        .then(resolve)
        .catch(() => {
          this.$router.push('/')
          resolve()
        })
    })
  }
}
