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
          <img src="@/app/assets/logo.svg">
        </router-link>
      </h1>
    </div>
    <router-view :app="app" />
  </div>
</template>

<script>
import dnsimpleServices from '@/vendor/dnsimple-services.json'
import DNSimpleAdapter from '@/adapters/dnsimple.js'
import LocalCacheAdapter from '@/adapters/local-cache.js'
import ZoneVisionAdapter from '@/adapters/zone-vision.js'
import ServiceIdentifier from '@/adapters/service-identifier.js'
import State from '@/state/index.js'
import Commands from '@/commands/index.js'
import Queries from '@/queries/index.js'

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

    const queries = new Queries({
      state: this.state,
      dnsimpleAdapter: this.dnsimpleAdapter,
      serviceIdentifier: this.serviceIdentifier
    })
    const commands = new Commands({
      state: this.state,
      queries: queries,
      dnsimpleAdapter: this.dnsimpleAdapter,
      zoneVisionAdapter: this.zoneVisionAdapter,
      localCacheAdapter: this.localCacheAdapter
    })

    return {
      app: this,
      isReady: false,
      queries,
      commands
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
