<template>
  <div id="app" :class="dnsimple.user ? 'logged-in' : ''">
    <div class="header">
      <a href="javascript:;" aria-label="Log out" @click="logout" class="logout">
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
    <router-view :dnsimple="dnsimple" />
  </div>
</template>

<script>
import { reactive } from 'vue'
import DNSimpleAdapter from './dnsimple-adapter.js'

export default {
  data () {
    return {
      dnsimple: reactive(new DNSimpleAdapter())
    }
  },
  methods: {
    logout () {
      return this.dnsimple.logout()
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
</style>
