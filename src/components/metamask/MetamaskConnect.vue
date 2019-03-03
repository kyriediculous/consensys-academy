<template>
  <div>
    <b-button variant="metamask" dark :disabled="loading === true || !metamaskAvailable" @click="connectMetamask" size="lg" class="width-100 my-2 mx-1 text-left" type="submit">
    <img src="@/assets/metamask.svg" width="50" height="50" class="mx-1" /> &nbsp;|&nbsp;
    <span v-if="loading === false">Connect with Metamask</span>
    <b-spinner variant="primary" v-if="loading === true" small />
  </b-button>
  <b-alert :show="!metamaskAvailable" variant="warning">
    MetaMask not detected.
     <a href="https://metamask.io/" target="_blank">
      Download
     </a>
     The latest version if you wish to use Metamask.
  </b-alert>
  </div>
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
    },
    metamaskAvailable () {
      return typeof window.ethereum !== 'undefined'
    }
  },
  methods: {
    async connectMetamask () {
      try {
        this.loading = true
        await this.$store.dispatch('auth/METAMASK_CONNECT')
        this.$store.commit('auth/AUTH_TYPE', 'metamask')
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

<style scoped lang="scss">

</style>
