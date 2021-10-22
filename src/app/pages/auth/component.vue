<template>
  <div class="with-mobile-padding">
    <template v-if="error">
      <h4 aria-label="Unauthorized">
        {{ error }}
      </h4>
      <router-link
        to="/"
        class="button"
        aria-label="Log in"
      >
        Click here to try again.
      </router-link>
    </template>
    <Loading v-else />
  </div>
</template>

<script>
import Loading from '@/app/components/loading/component.vue'

export default {
  components: {
    Loading
  },
  props: {
    app: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      error: '',
      isLoading: true
    }
  },
  mounted () {
    return this.app.commands.authorize(this.$route.query.code)
      .then(() => this.$router.push('/domains'))
      .catch((err) => {
        this.error = err.message
      })
      .finally(() => {
        this.isLoading = false
      })
  }
}
</script>
