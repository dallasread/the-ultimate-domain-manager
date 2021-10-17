<template>
  <div id="app" v-if="isReady" :class="app.queries.getAccount() ? 'logged-in' : ''">
    <div class="header">
      <a v-if="app.queries.getAccount()" href="javascript:;" aria-label="Log out" @click="logout" class="logout">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
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
import DNSimpleAdapter from '@/lib/dnsimple-adapter.js'
import ZoneVisionAdapter from '@/lib/zone-vision-adapter.js'
import State from '@/lib/state.js'
import Commands from '@/lib/commands.js'
import LocalCache from '@/lib/local-cache.js'
import Presenters from '@/lib/presenters.js'
import Queries from '@/lib/queries.js'

export default {
  props: ['_state', '_dnsimpleAdapter', '_zoneVisionAdapter', '_localCache'],
  data () {
    window.theUltimateDomainManager = this

    const localCache = this._localCache || new LocalCache()
    const dnsimpleAdapter = this._dnsimpleAdapter || new DNSimpleAdapter(window.fetch)
    const zoneVisionAdapter = this._zoneVisionAdapter || new ZoneVisionAdapter(window.fetch)
    const presenters = new Presenters()
    const state = this._state || new State({ accounts: [], domains: [] })
    const queries = new Queries(state, dnsimpleAdapter)
    const commands = new Commands(state, queries, dnsimpleAdapter, zoneVisionAdapter, localCache, presenters)

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
