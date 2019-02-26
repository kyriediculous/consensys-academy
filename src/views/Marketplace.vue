<template>
    <div class="container">
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
        <div class="row">
            <div class="col-12">
                <b-card-group deck>
                    <ListingCard
                        v-for="(listing, index) in listings"
                        :key="index" :title="listing.title"
                        :author="listing.author"
                        :img="listing.img"
                        :description="listing.description"
                        :tags="listing.tags"
                        :token="listing.token"
                        :price="listing.price"
                    />
                </b-card-group>
            </div>
        </div>
    </div>
</template>

<script>
import ListingCard from '@/components/marketplace/ListingCard.vue'
export default {
  computed: {
    listings () {
      return this.$store.getters['marketplace/ALL_LISTINGS']
    }
  },
  components: {
    ListingCard
  }
}
</script>

<style scoped>

</style>
