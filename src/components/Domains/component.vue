<template>
  <div class="container">
    <p v-if="isLoading">Loading...</p>
    <div v-else>
      <input v-model="q" aria-label="Domain search" placeholder="Search...">
      <ul>
        <li v-for="domain in filteredDomains" :key="domain.id">
          {{domain.name}}
          <router-link :to="'/domains/' + domain.name" :aria-label="'Manage ' + domain.name">
            Go
          </router-link>
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
      domains: [],
      q: ''
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
  },
  computed: {
    filteredDomains () {
      const q = this.q.trim().toLowerCase()

      return this.domains.filter((domain) => {
        return domain.name.indexOf(q) !== -1
      })
    }
  }
}
</script>
