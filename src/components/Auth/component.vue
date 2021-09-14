<template>
  <div>
    <p aria-label="Unauthorized">You have not been authorized.</p>
    <router-link to="/">Try again</router-link>
  </div>
</template>

<script>
export default {
  mounted () {
    return this.$router.push('/domains')
  }
}
</script>
