<template>
  <div class="container">
    <input v-model="q" aria-label="Domain search" placeholder="Search...">
    <ul class="content">
      <li v-if="isLoading"><Loading /></li>
      <template v-else>
        <li v-for="domain in filteredDomains" :key="domain.id" class="list-item">
          <router-link :to="'/domains/' + domain.name" :aria-label="'Manage ' + domain.name">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="arrow">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{domain.name}}
          </router-link>
        </li>
      </template>
    </ul>
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
    const domains = this.app.queries.listDomains()

    return {
      isLoading: !domains.length,
      domains,
      q: ''
    }
  },
  mounted () {
    return this.app.commands.fetchDomains()
      .catch((err) => {
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
