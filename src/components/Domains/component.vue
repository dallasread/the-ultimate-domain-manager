<template>
  <div>
    <h1>Domains</h1>
    <p v-if="isLoading">Loading...</p>
    <div v-else>
      <ul>
        <li v-for="domain in domains">
          <a>
            {{domain.name}}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import AuthenticatedRoute from '@/components/App/authenticated-route.js'

export default {
  mixins: [AuthenticatedRoute],
  data () {
    return {
      isLoading: true,
      domains: []
    }
  },
  mounted () {
    return this.dnsimple.listDomains().then((response) => {
      this.domains = response.domains
    }).catch((err) => {
      this.error = err
    }).finally(() => {
      this.isLoading = false
    })
  }
}
</script>
