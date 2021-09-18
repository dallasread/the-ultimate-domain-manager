<template>
  <div class="with-mobile-padding">
    <h4>Connect your domain to Heroku.</h4>
    <a aria-label="Connect via DNSimple" class="button" :href="oauthUrl">Connect via DNSimple</a>
  </div>
</template>

<script>
import UnauthenticatedRoute from '@/components/App/unauthenticated-route.js'

export default {
  mixins: [UnauthenticatedRoute],
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
