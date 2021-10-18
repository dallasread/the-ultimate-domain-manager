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
            When all is said and done, your name servers will be set to: <span class="yellow">{{ domain.nameServers.join(', ') }}</span>
          </p>
        </div>
        <div
          v-else-if="app.queries.isNotServedByProvider(domain)"
          class="block with-padding notice fadeIn"
        >
          <h3>
            Your domain is not served by {{ domain.provider }}.
          </h3>
          <p>
            It's a great idea to set up your domain before pointing your domain to {{ domain.provider }}.
            When you're ready to use the values in this app, point your name servers at your domain's registrar.
          </p>
          <a
            v-if="app.queries.shouldBeServedByProvider(domain)"
            href="javascript:;"
            aria-label="Point to DNSimple"
            class="button button-yellow"
            @click="pointToDNSimple"
          >
            <span v-if="isLoadingPointToDNSimple">Loading...</span>
            <span v-else>Point to {{ domain.provider }}</span>
          </a>
        </div>
        <div class="block-row">
          <div class="block half-block with-padding text-center-desktop">
            <Loading v-if="!app.queries.commonLiveNameServers(domain).length" />
            <template v-else>
              <p>Resolution provided by </p>
              <h3
                v-for="nameServer in app.queries.commonLiveNameServers(domain)"
                :key="`${domain.id}-nameserver-${nameServer}`"
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
            <h3 :class="app.queries.isExpiring(domain) ? 'red' : ''">
              {{ app.presenters.prettyDate(domain.expires_on) }}
            </h3>
          </div>
          <div
            v-else
            class="block half-block with-padding text-center-desktop"
          >
            <p>State</p>
            <h3>Hosted</h3>
          </div>
        </div>
        <div class="more-services block with-padding">
          <h2>Add more to your domain</h2>
          <p>
            With <strong>{{ dnsimpleServices.length }} pre-built add-ons</strong> provided by DNSimple, your domain will be up and going in no time – just sit back and relax!
          </p>
          <a
            href="javascript:;"
            class="button"
          >
            Find more add-ons (coming soon!)
          </a>
        </div>
        <!-- <div v-for="service in dnsimpleServices" :key="service.name" class="block-row">
          <div class="service block with-padding">
            <img :src="`data:image/png;base64,${service.logo}`">
            <div class="meta">
              <h3>{{service.label}}</h3>
              <p>{{service.description}}</p>
            </div>
          </div>
        </div> -->
      </div>
      <div
        v-else-if="error"
        class="block with-padding"
      >
        <p>{{ error }}</p>
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
import dnsimpleServices from '@/vendor/dnsimple-services.json'

export default {
  components: {
    Loading
  },
  mixins: [AuthenticatedRoute],
  data () {
    return {
      isLoadingPointToDNSimple: false,
      error: '',
      q: this.$route.params.name,
      dnsimpleServices
    }
  },
  computed: {
    domain () {
      return this.app.queries.getDomain(this.$route.params.name)
    },
    records () {
      return this.app.queries.recordsForZone(this.domain.name)
    }
  },
  mounted () {
    return this.app.commands.fetchDomain(this.app.queries.getAccount(), this.$route.params.name)
      .then(this.app.commands.fetchRecords(this.app.queries.getAccount(), this.domain))
      .then(this.app.commands.fetchNameServers(this.app.queries.getAccount(), this.domain))
      .then(this.app.commands.fetchLiveNameServers(this.domain))
  },
  methods: {
    pointToDNSimple () {
      return new Promise((resolve, reject) => {
        this.isLoadingPointToDNSimple = true

        this.app.commands.updateNameServers(
          this.app.queries.getAccount(),
          this.domain,
          ['ns1.dnsimple.com', 'ns2.dnsimple.com', 'ns3.dnsimple.com', 'ns4.dnsimple.com']
        ).then(() => {
          this.isLoadingPointToDNSimple = false
          resolve()
        }).catch(reject)
      })
    }
  }
}
</script>
