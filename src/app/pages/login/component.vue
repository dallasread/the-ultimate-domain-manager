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
import UnauthenticatedRoute from '@/app/components/unauthenticated-route/component.js'

export default {
  mixins: [UnauthenticatedRoute]
}
</script>
