<template>
  <div class="container-fluid page-height">

      <div class="row">
        <div class="col-12 text-center my-5">
          <h1>Marketplace</h1>
        </div>
      </div>

      <div v-if="pageLoad" class="row text-center special">
           <b-spinner variant="primary" class="my-5" />
         <div>
           <strong>
               Loading Marketplace...
           </strong>
         </div>
      </div>

      <div v-else-if="!pageLoad && listings.length === 0" class="container text-center special">
        <div> :-( </div>
         <div>
           <strong>
               No Listings found...
           </strong>
         </div>
      </div>

    <div v-else>
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
    </div>

    <ListingDetails />
  </div>
</template>

<script>
import ListingCard from '@/components/marketplace/ListingCard.vue'
import ListingDetails from '@/components/marketplace/ListingDetails.vue'
export default {
  computed: {
    listings () {
      return this.$store.getters['marketplace/ALL_LISTINGS']
    }
  },
  data () {
    return {
      pageLoad: true
    }
  },
  async created () {
    try {
      if (this.$store.state.marketplace.listings.length === 0) {
        await this.$store.dispatch('marketplace/ALL_LISTINGS')
      } else {
        this.$store.dispatch('marketplace/ALL_LISTINGS')
      }
      this.pageLoad = false
    } catch (e) {
      this.$root.$emit('alert', {
        countdown: 5,
        color: 'danger',
        message: e.message
      })
    }
  },
  components: {
    ListingCard,
    ListingDetails
  }
}
</script>

<style scoped lang="scss">
.page-height {
  height: calc(100vh - 60px);
}
.special {
  display: flex;
  flex-direction: column;
  align-items:center;
  justify-content: center;
}
</style>
