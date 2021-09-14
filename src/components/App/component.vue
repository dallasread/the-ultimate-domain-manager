<template>
  <div>
    <a v-if="dnsimple.user" aria-label="Log out" @click="logout">Log out</a>
    <router-view :dnsimple="dnsimple" />
  </div>
</template>

<script>
import DNSimpleAdapter from './dnsimple-adapter.js'

export default {
  data () {
    return {
      dnsimple: new DNSimpleAdapter()
    }
  },
  methods: {
    logout () {
      return this.dnsimple.logout()
        .then(() => {
          this.$router.push('/')
        })
        .catch(() => {})
    }
  }
}
</script>
