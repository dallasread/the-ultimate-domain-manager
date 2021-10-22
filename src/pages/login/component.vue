<template>
  <div class="with-mobile-padding">
    <h4>Connect your domain to Heroku.</h4>
    <a
      aria-label="Connect via DNSimple"
      class="button"
      :href="app.queries.oauthUrl()"
    >Connect via DNSimple</a>
  </div>
</template>

<script>
import UnauthenticatedRoute from '@/mixins/unauthenticated-route.js'

export default {
  mixins: [UnauthenticatedRoute]
}
</script>
