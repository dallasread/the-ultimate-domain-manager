<template>
  <div
    v-if="isReady"
    id="app"
    :class="app.queries.getAccount() ? 'logged-in' : ''"
  >
    <div class="header">
      <a
        v-if="app.queries.getAccount()"
        href="javascript:;"
        aria-label="Log out"
        class="logout"
        @click="logout"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
          />
        </svg>
      </a>
      <h1>
        <router-link to="/">
          <img src="@/assets/logo.svg">
        </router-link>
      </h1>
    </div>
    <router-view :app="app" />
  </div>
</template>

<script>
import dnsimpleServices from '@/vendor/dnsimple-services.json'
import DNSimpleAdapter from '@/lib/adapters/dnsimple.js'
import ZoneVisionAdapter from '@/lib/adapters/zone-vision.js'
import ServiceIdentifier from '@/lib/service-identifier.js'
import State from '@/lib/state.js'
import Commands from '@/lib/commands.js'
import LocalCacheAdapter from '@/lib/adapters/local-cache.js'
import Presenters from '@/lib/presenters.js'
import Queries from '@/lib/queries.js'

export default {
  props: {
    state: {
      type: Object,
      default: () => new State({ accounts: [], domains: [], records: [] })
    },
    dnsimpleAdapter: {
      type: Object,
      default: () => new DNSimpleAdapter(window.fetch)
    },
    zoneVisionAdapter: {
      type: Object,
      default: () => new ZoneVisionAdapter(window.fetch)
    },
    localCacheAdapter: {
      type: Object,
      default: () => new LocalCacheAdapter()
    },
    serviceIdentifier: {
      type: Object,
      default: () => new ServiceIdentifier(dnsimpleServices)
    }
  },
  data () {
    window.theUltimateDomainManager = this

    const presenters = new Presenters()
    const queries = new Queries(
      this.state,
      this.dnsimpleAdapter,
      this.serviceIdentifier
    )
    const commands = new Commands(
      this.state,
      queries,
      this.dnsimpleAdapter,
      this.zoneVisionAdapter,
      this.localCacheAdapter,
      presenters
    )

    return {
      app: this,
      isReady: false,
      queries,
      commands,
      presenters
    }
  },
  mounted () {
    return this.commands.restoreLocal().then(() => {
      this.isReady = true
    })
  },
  methods: {
    logout () {
      return this.commands.logout()
        .then(() => this.$router.push('/login'))
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss">
@import "./style/reset.scss";
@import "./style/layout.scss";
@import "./style/app.scss";
@import "./style/form.scss";
@import "./style/spinner.scss";
</style>
