<template><div></div></template>

<script>
export default {
  props: ['dnsimple'],
  mounted () {
    if (this.dnsimple.user) {
      this.$router.push('/domains')
    } else {
      this.$router.push('/login')
    }
  }
}
</script>
