<template>
  <div>
    <h1>Domains</h1>
  </div>
</template>

<script>
import AuthenticatedRoute from '@/components/App/authenticated-route.js'

export default {
  mixins: [AuthenticatedRoute],
  computed: {
    oauthUrl () {
      const url = new URL('https://dnsimple.com/oauth/authorize')

      url.searchParams.append('response_type', 'code')
      url.searchParams.append('redirect_uri', 'http://localhost:8080/auth')
      url.searchParams.append('client_id', 'cbde777b80c127be')
      url.searchParams.append('state', 'RANDOM')

      return url.href
    }
  }
}
</script>
