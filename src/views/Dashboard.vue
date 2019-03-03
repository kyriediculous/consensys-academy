<template>
  <div class="container">
    <div v-if="loggedIn === true">
      <div class="row">
        <Purchases />
      </div>
      <div class="row">
      <Staking />
    </div>
    <div class="row" >
      <Storefront />
    </div>
    </div>
     <b-modal
        title="Connect to your dashboard"
        v-model="modal"
        centered
        hide-footer
        class="text-center"
        no-close-on-backdrop
        no-close-on-esc
        @hidden="hideModal()"
        >
        <div class="d-block">

              <UportLoginButton @click.native="connectModal = false" v-if="loggedIn === false" />

             <MetamaskConnect v-if="loggedIn === false" />

        </div>
      </b-modal>
  </div>
</template>

<script>
import Staking from '@/components/dashboard/staking/Staking'
import Storefront from '@/components/dashboard/storefront/Storefront'
import Purchases from '@/components/dashboard/storefront/Purchases'
import UportLoginButton from '@/components/uport/LoginButton.vue'
import MetamaskConnect from '@/components/metamask/MetamaskConnect.vue'
export default {
  name: 'dashboard',
  components: {
    Staking,
    Storefront,
    Purchases,
    UportLoginButton,
    MetamaskConnect
  },
  computed: {
    loggedIn () {
      return this.$store.getters['auth/LOGGED_IN']
    },
    modal: {
      get () { return !this.loggedIn },
      set (val) { return val }
    }
  },
  data () {
    return {
      connectModal: true
    }
  },
  created () {
    if (!this.loggedIn) {
      this.connectModal = true
    }
  },
  methods: {
    hideModal () {
      if (!this.loggedIn) this.$router.push('/')
    }
  }
}
</script>

<style scoped></style>
