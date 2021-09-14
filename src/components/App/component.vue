<template>
  <div>
    <h1>
      <router-link to="/">
        The Ultimate Domain Manager™
      </router-link>
    </h1>
    <a v-if="dnsimple.user" aria-label="Log out" @click="logout">Log out</a>
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
        .then(() => this.$router.push('/'))
        .catch(() => {})
    }
  }
}
</script>
