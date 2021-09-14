<template>
  <div>
    <p v-if="error" aria-label="Unauthorized">{{error}}</p>
    <router-link to="/" aria-label="Log in">Try again</router-link>
  </div>
</template>

<script>
import AuthenticatedRoute from '@/components/App/authenticated-route.js'

export default {
  mixins: [AuthenticatedRoute],
  mounted () {
    return this.dnsimple.authorize()
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
