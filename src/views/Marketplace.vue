<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <h1>
                Marketplace
                </h1>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <!-- SEARCH & FILTERS -->
            </div>
        </div>
                <b-card-group deck class="row">
                    <ListingCard
                        v-for="(listing, index) in listings"
                        :key="index"
                        :id="listing.id"
                        :title="listing.title"
                        :author="listing.author"
                        :image="listing.image"
                        :summary="listing.summary"
                        :token="listing.token"
                        :price="listing.price"
                        :ebook="listing.ebook"
                    />
                </b-card-group>
      <b-modal
        title="Connect to dApp"
        v-model="connectModal"
        centered
        hide-footer
        class="text-center"
        >
        <div class="d-block">
          <div>
              <UportLoginButton @click.native="connectModal = false" class="home-login" v-if="loggedIn === false" />
          </div>
          <div>
             <MetamaskConnect class="home-login" v-if="loggedIn === false" />
          </div>
        </div>
      </b-modal>
    </div>
</template>

<script>
import UportLoginButton from '@/components/uport/LoginButton.vue'
import MetamaskConnect from '@/components/metamask/MetamaskConnect.vue'
import ListingCard from '@/components/marketplace/ListingCard.vue'
export default {
  computed: {
    listings () {
      return this.$store.getters['marketplace/ALL_LISTINGS']
    },
    loggedIn () {
      return this.$store.getters['auth/LOGGED_IN']
    },
  },
  data () {
    return {
      pageLoad: true,
      connectModal: false
    }
  },
  async created () {
    try {
      if ( !this.loggedIn ) {
        this.connectModal = true
      }
      if (this.$store.state.marketplace.listings.length === 0 ) {
        await this.$store.dispatch('marketplace/ALL_LISTINGS')
      } else {
        this.$store.dispatch('marketplace/ALL_LISTINGS')
      }
      this.pageLoad = false
    } catch (e) {
      console.log(e)
      this.$root.$emit('alert', {
        countdown: 5,
        color: 'danger',
        message: e.message
      })
    }
  },
  components: {
    ListingCard,
    UportLoginButton,
    MetamaskConnect
  }
}
</script>

<style scoped lang="scss">
.home-login {
  width: 350px;
}
</style>
