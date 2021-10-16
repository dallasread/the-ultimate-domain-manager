<template>
  <div v-if="domain" class="container">
    <input v-model="q" aria-label="Domain search" placeholder="Search..." @focus="$router.push('/domains')">
    <div class="content">
      <div class="notice with-padding">
        <h3>
          Your domain is not served by DNSimple.
        </h3>
        <p>
          It's a great idea to set up your domain before pointing your domain to DNSimple. When you're ready, point your name servers at DNSimple to use the values below.
        </p>
        <a class="button button-yellow">
          Point to DNSimple
        </a>
      </div>
    </div>
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
    return this.app.commands.getDomain(this.$route.params.name).then((response) => {
      this.domain = response.domain
      this.q = this.domain.name
    }).catch(() => {
      this.error = 'Domain not found'
    })
  }
}
</script>
