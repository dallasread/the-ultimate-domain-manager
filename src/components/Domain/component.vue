<template>
  <div class="container">
    <input v-model="q" aria-label="Domain search" placeholder="Search..." @focus="$router.push('/domains')">
    <div class="content">
      <div v-if="domain">
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

        {{domain}}
      </div>
      <p v-else-if="error">{{error}}</p>
      <p v-else><Loading /></p>
    </div>
  </div>
</template>

<script>
import AuthenticatedRoute from '@/components/App/authenticated-route.js'
import Loading from '@/components/loading/component.vue'

export default {
  mixins: [AuthenticatedRoute],
  components: {
    Loading
  },
  data () {
    return {
      isLoading: true,
      error: '',
      q: this.$route.params.name
    }
  },
  computed: {
    domain () {
      return this.app.queries.getDomain(this.$route.params.name)
    }
  },
  mounted () {
    return this.app.commands.fetchDomain(this.app.queries.getAccessToken(), this.$route.params.name)
      .catch((e) => {
        this.error = 'Domain not found'
      }).finally(() => {
        this.isLoading = false
      })
  }
}
</script>
