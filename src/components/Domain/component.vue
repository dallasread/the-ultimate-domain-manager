<template>
  <div v-if="domain">
    <h3>{{domain.name}}</h3>
    <p>
      name servers
    </p>
  </div>
  <p v-else-if="error">{{error}}</p>
  <p v-else>Loading...</p>
</template>

<script>
import AuthenticatedRoute from '@/components/App/authenticated-route.js'

export default {
  mixins: [AuthenticatedRoute],
  data () {
    return {
      isLoading: true,
      domain: null,
      error: ''
    }
  },
  mounted () {
    return this.dnsimple.getDomain().then((response) => {
      this.domain = response.domain
    }).catch((err) => {
      this.error = err
    })
  }
}
</script>
