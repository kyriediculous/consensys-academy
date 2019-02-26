<template>
  <b-container>
    <b-row align-v="center" align-h="center">
      <div class="col-12 text-center">
        <h1> Welcome </h1>
        <!-- USE A MODAL FOR THIS ON LOAD --> 
        <div class="d-block">
          <div>
              <UportLoginButton class="home-login" v-if="loggedIn === false" />
          </div>
          <div>
             <MetamaskConnect class="home-login" v-if="loggedIn === false" />
          </div>
        </div>
      </div>
    </b-row>
  </b-container>
</template>

<script>
import UportLoginButton from '@/components/uport/LoginButton.vue'
import MetamaskConnect from '@/components/metamask/MetamaskConnect.vue'

export default {
  name: 'home',
    computed: {
    loggedIn () {
      return this.$store.getters['auth/LOGGED_IN']
    }
  },
  components: {
    UportLoginButton,
    MetamaskConnect
  }
}
</script>

<style>
.home-login {
  width: 350px;
}

</style>
