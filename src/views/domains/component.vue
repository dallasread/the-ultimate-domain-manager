<template>
  <div class="container">
    <div class="search">
      <router-link to="/domains" class="icon">
        <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
      </router-link>
      <input v-model="q" ref="search" aria-label="Domain search" placeholder="Search...">
    </div>
    <div class="content">
      <ul class="block">
        <li v-if="isLoading"><Loading /></li>
        <template v-else>
          <li v-for="domain in filteredDomains" :key="domain.id" class="list-item">
            <router-link :to="'/domains/' + domain.name" :aria-label="'Manage ' + domain.name">
              <svg class="arrow" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" /></svg>
              {{domain.name}}
            </router-link>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
import AuthenticatedRoute from '@/mixins/authenticated-route.js'
import Loading from '@/components/loading/component.vue'

export default {
  mixins: [AuthenticatedRoute],
  components: {
    Loading
  },
  data () {
    const domains = this.app.queries.listDomains()

    return {
      isLoading: !domains.length,
      domains,
      q: ''
    }
  },
  mounted () {
    const accessToken = this.app.queries.getAccessToken()

    this.$refs.search.focus()

    return this.app.commands.fetchDomains(accessToken)
      .catch((err) => {
        this.error = err.message
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
