<template>
  <div>
    <div id="nav">
      <router-link to="/">Welcome</router-link>
    </div>
    <router-view :api="api" />
  </div>
</template>

<script>
import DNSimpleAPI from './dnsimple-api.js'

export default {
  data () {
    return {
      api: new DNSimpleAPI()
    }
  }
}
</script>
