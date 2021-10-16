<template>
  <div id="app" :class="app.queries.getAccessToken() ? 'logged-in' : ''">
    <div class="header">
      <a v-if="app.queries.getAccessToken()" href="javascript:;" aria-label="Log out" @click="logout" class="logout">
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
import State from '@/lib/state.js'
import Queries from '@/lib/queries.js'
import Commands from '@/lib/commands.js'
import localStore from '@/lib/local-store.js'

export default {
  props: ['_state', '_dnsimpleAdapter'],
  data () {
    window.theUltimateDomainManager = this

    const dnsimpleAdapter = this._dnsimpleAdapter || new DNSimpleAdapter(window.fetch)
    const state = new State(this._state || { accounts: [], domains: [] })
    const queries = new Queries(state, dnsimpleAdapter)
    const commands = new Commands(state, queries, dnsimpleAdapter, localStore)

    return {
      app: this,
      queries,
      commands
    }
  },
  mounted () {
    return this.commands.restoreLocal()
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
