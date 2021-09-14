<template>
  <div>
    <p v-if="error" aria-label="Unauthorized">{{error}}</p>
    <router-link to="/" aria-label="Log in">Try again</router-link>
  </div>
</template>

<script>
export default {
  props: ['api'],
  mounted () {
    return this.api.authorize()
      .then(() => this.$router.push('/domains'))
      .catch((err) => {
        this.error = err
      })
  },
  data () {
    return {
      error: ''
    }
  }
}
</script>
