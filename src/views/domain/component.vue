<template>
  <div class="container">
    <div class="search">
      <router-link to="/domains" class="icon">
        <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" /></svg>
      </router-link>
      <input v-model="q" aria-label="Domain search" placeholder="Search..." @focus="$router.push('/domains')">
    </div>
    <div class="content">
      <div v-if="domain">
        <div v-if="app.queries.isNotServedBy(domain, 'dnsimple.com')" class="block with-padding notice">
          <h3>
            Your domain is not served by DNSimple.
          </h3>
          <p>
            It's a great idea to set up your domain before pointing your domain to DNSimple. When you're ready, point your name servers at DNSimple to use the values below. If you've recently made a change, it could take some time to be reflected.
          </p>
          <!-- <a class="button button-yellow">
            Point to DNSimple
          </a> -->
        </div>
        <div class="block-row">
          <div class="block half-block with-padding text-center">
            {{app.queries.commonNameServers(domain)}}
            <Loading v-if="!app.queries.commonNameServers(domain).length"  />
            <template v-else>
              <p>Your resolution is served by </p>
              <h3 v-for="nameServer in app.queries.commonNameServers(domain)" :key="`${domain.id}-nameserver-${nameServer}`">
                {{nameServer}}
              </h3>
            </template>
          </div>
          <div v-if="app.queries.isRegistered(domain)" class="block half-block with-padding text-center">
            <p>Your domain {{domain.auto_renew ? 'will renew before' : 'expires on'}}</p>
            <h3 :class="app.queries.isExpiring(domain) ? 'red' : ''">{{app.presenters.prettyDate(domain.expires_on)}}</h3>
          </div>
          <div v-else class="block half-block with-padding text-center">
            <p>State</p>
            <h3>Hosted</h3>
          </div>
        </div>
      </div>
      <div v-else-if="error" class="block with-padding">
        <p>{{error}}</p>
      </div>
      <div v-else class="block with-padding">
        <Loading />
      </div>
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
    return Promise.all(
      this.app.commands.fetchDomain(this.app.queries.getAccessToken(), this.$route.params.name),
      this.app.commands.fetchNameServers(this.domain)
    ).catch((e) => {
      this.error = 'Domain not found'
    }).finally(() => {
      this.isLoading = false
    })
  }
}
</script>
