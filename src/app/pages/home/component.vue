<template><div /></template>

<script>
export default {
  props: {
    app: {
      type: Object,
      default: () => {}
    }
  },
  mounted () {
    if (this.app.queries.getAccount()) {
      this.$router.push('/domains')
    } else {
      this.$router.push('/login')
    }
  }
}
</script>
