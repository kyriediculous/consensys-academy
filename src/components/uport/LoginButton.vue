<template>
  <b-button variant="uport" :disabled="loading === true" @click="login" size="lg" class="my-2 mx-1 text-left" type="submit">
    <img src="@/assets/uport-logo.svg" width="50" height="50" class="mx-1" /> &nbsp;|&nbsp;
    <span v-if="loading === false">Connect with uport</span>
    <b-spinner variant="primary" v-if="loading === true" small />
  </b-button>
</template>

<script>
export default {
  name: 'loginButton',
  data () {
    return {
      loading: false
    }
  },
  computed: {
    network () {
      return this.$store.getters['network/SELECTED']
    }
  },
  methods: {
    async login () {
      try {
        this.loading = true
        await this.$store.dispatch('auth/UPORT_LOGIN', this.network)
        this.$store.commit('auth/AUTH_TYPE', 'uport')
        this.loading = false
      } catch (e) {
        this.$root.$emit('alert', {
          countdown: 5,
          color: 'danger',
          message: e.message
        })
        console.log(e)
      }
    }
  }
}
</script>

<style scoped></style>
