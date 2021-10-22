<template>
  <div class="container">
    <div class="search">
      <router-link
        to="/domains"
        class="icon"
      >
        <svg
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        ><path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" /></svg>
      </router-link>
      <input
        v-model="q"
        aria-label="Domain search"
        placeholder="Search..."
        @focus="$router.push('/domains')"
      >
    </div>
    <div class="content">
      <div v-if="domain">
        <div
          v-if="app.queries.isPropagating(domain)"
          class="block with-padding notice fadeIn"
        >
          <h3>
            It looks like you've recently made a change to your name servers!
          </h3>
          <p>
            While this change took effect immediately, it could take up to 24 hours to fully propagate across the internet.
            When all is said and done, your domain will be resolved by: <span class="yellow">{{ domain.nameServers.join(', ') }}</span>
          </p>
        </div>
        <div
          v-else-if="app.queries.isNotServedByProvider(domain)"
          class="block with-padding notice fadeIn"
        >
          <h3>
            Your domain is not resolved by {{ domain.provider }}.
          </h3>
          <p>
            When you're ready to use the values reflected below, visit your domain's registrar.
            There, you will want to set the name servers to those provided to you by the fine folks at {{ domain.provider }}.
          </p>
          <a
            v-if="app.queries.shouldBeServedByProvider(domain)"
            href="javascript:;"
            aria-label="Point to DNSimple"
            class="button button-yellow"
            @click="pointToProvider(app.queries.getProvider(domain))"
          >
            <span v-if="isLoadingPointToProvider">Loading...</span>
            <span v-else>Point to {{ domain.provider }}</span>
          </a>
        </div>
        <div class="block-row">
          <div class="block half-block with-padding text-center-desktop">
            <Loading v-if="!app.queries.commonLiveNameServers(domain).length" />
            <template v-else>
              <p>Currently resolved by </p>
              <h3
                v-for="nameServer in app.queries.commonLiveNameServers(domain)"
                :key="`${domain.id}-nameserver-${nameServer}`"
                class="no-bottom-margin"
              >
                {{ nameServer }}
              </h3>
            </template>
          </div>
          <div
            v-if="app.queries.isRegistered(domain)"
            class="block half-block with-padding text-center-desktop"
          >
            <p>Your domain {{ domain.auto_renew ? 'will renew before' : 'expires on' }}</p>
            <h3 :class="app.queries.isExpiring(domain) ? 'red no-bottom-margin' : 'no-bottom-margin'">
              {{ app.queries.prettyExpiresDate(domain) }}
            </h3>
          </div>
          <div
            v-else
            class="block half-block with-padding text-center-desktop"
          >
            <p>State</p>
            <h3 class="no-bottom-margin">
              Hosted
            </h3>
          </div>
        </div>
        <InstalledService
          v-for="service in installedServices"
          :key="service.id"
          :domain="domain"
          :service="service"
        />
        <div class="more-services block with-padding">
          <h2>Add-on to your domain</h2>
          <p>
            With <strong>over 40 pre-built add-ons</strong> provided by DNSimple, your domain will be connected in no time – just sit back and relax!
          </p>
          <a
            href="javascript:;"
            class="button"
          >
            Find more add-ons (coming soon!)
          </a>
        </div>
      </div>
      <div
        v-else
        class="block with-padding"
      >
        <Loading />
      </div>
    </div>
  </div>
</template>

<script>
import AuthenticatedRoute from '@/mixins/authenticated-route.js'
import Loading from '@/components/loading/component.vue'
import InstalledService from '@/components/installed-service/component.vue'

export default {
  components: {
    InstalledService,
    Loading
  },
  mixins: [AuthenticatedRoute],
  data () {
    return {
      isLoadingPointToProvider: false,
      q: this.$route.params.name
    }
  },
  computed: {
    domain () {
      return this.app.queries.getDomain(this.$route.params.name)
    },
    records () {
      return this.app.queries.recordsForZone(this.domain.name)
    },
    installedServices () {
      return this.app.queries.findInstalledServices(this.domain, this.records)
    }
  },
  mounted () {
    this.app.commands.fetchDomain(this.app.queries.getAccount(), this.$route.params.name)
    this.app.commands.fetchRecords(this.app.queries.getAccount(), this.domain)
    this.app.commands.fetchNameServers(this.app.queries.getAccount(), this.domain)
    this.app.commands.fetchLiveNameServers(this.domain)
  },
  methods: {
    pointToProvider (provider) {
      return new Promise((resolve, reject) => {
        this.isLoadingPointToProvider = true

        this.app.commands.updateNameServers(
          this.app.queries.getAccount(),
          this.domain,
          provider.nameServers
        ).then(() => {
          this.isLoadingPointToProvider = false
          resolve()
        }).catch(reject)
      })
    }
  }
}
</script>
