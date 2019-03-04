<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="primary">
      <b-navbar-brand @click="$router.push('/')" href="#"
        >Ethbooks</b-navbar-brand
      >

      <b-navbar-toggle target="nav_collapse" />

      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item
            href="#"
            @click="$router.push('/')"
            >Marketplace</b-nav-item
          >
          <b-nav-item
            href="#"
            @click="$router.push('/dashboard')"
            >Dashboard</b-nav-item
          >
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-text class="mx-2"><strong>Network: </strong> {{ network }} </b-nav-text>
         <b-nav-text class="mx-2"><strong>Selected account: </strong> {{ address }}</b-nav-text>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <router-view />
    <Alert />
  </div>
</template>

<script>
import Alert from '@/components/ui/Alert.vue'
export default {
  name: 'layout',
  data () {
    return { network: process.env.VUE_APP_NETWORK }
  },
  computed: {
    loggedIn () {
      return this.$store.getters['auth/LOGGED_IN']
    },
    credentials () {
      return this.$store.getters['auth/CREDENTIALS']
    },
    address () {
      return this.$store.getters['auth/ADDRESS']
    }
  },
  components: {
    Alert
  }
}
</script>

<style scoped>
</style>
