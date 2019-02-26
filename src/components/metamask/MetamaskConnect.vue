<template>
  <b-button variant="metamask" dark :disabled="loading === true" @click="connectMetamask" size="lg" class="my-2 mx-1 text-left" type="submit">
    <img src="@/assets/metamask.svg" width="50" height="50" class="mx-1" /> &nbsp;|&nbsp;
    <span v-if="loading === false">Connect with Metamask</span>
    <b-spinner variant="primary" v-if="loading === true" small />
  </b-button>
</template>

<script>
export default {
  name: 'metamaskConnect',
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
    async connectMetamask () {
      try {
        this.loading = true
        await this.$store.dispatch('auth/METAMASK_CONNECT')
        this.loading = false
        this.$router.push('/dashboard')
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
