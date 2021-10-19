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
            When all is said and done, your domain's resolution will be provided by: <span class="yellow">{{ domain.nameServers.join(', ') }}</span>
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
              {{ app.presenters.prettyDate(domain.expires_on) }}
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
        <template
          v-for="service in installedServices"
          :key="service.id"
        >
          <router-link
            :to="'/domains/' + domain.name"
            :aria-label="'Manage Service ' + service.id"
            class="service block with-padding"
          >
            <div class="img-wrapper">
              <img :src="`data:image/png;base64,${service.logo}`">
            </div>
            <div class="meta">
              <span aria-label="Summary">{{ service.summary }}</span>
              {{ service.recordsForService }}
              <!-- <svg
                class="arrow"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              ><path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" /></svg> -->
            </div>
          </router-link>
        </template>
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

export default {
  components: {
    Loading
  },
  mixins: [AuthenticatedRoute],
  data () {
    return {
      isLoadingPointToDNSimple: false,
      error: '',
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
