<template><div></div></template>

<script>
export default {
  props: ['app'],
  mounted () {
    if (this.app.queries.getAccount()) {
      this.$router.push('/domains')
    } else {
      this.$router.push('/login')
    }
  }
}
</script>
