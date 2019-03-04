<template>
    <b-modal
        v-if="listing"
        size="xl"
        hide-footer
        v-model="showModal"
    >
          <b-row>
            <div class="col-12 col-lg-8">
                <h2>{{ listing.title }} </h2>
                <h5> {{ listing.author }} </h5>
                <div class="my-5">
                    {{ listing.summary }}
                </div>
                <div>
                    <strong>Sold by: </strong>
                    <a :href="`https://rinkeby.etherscan.io/address/${listing.seller}`" target="_blank"> {{ listing.seller }} </a>
                </div>
                <div>
                    <strong>Explore on Swarm: </strong>
                    <a :href="listing.manifest" target="_blank">
                        {{listing.id.substring(0, 35)+ '...' }}
                    </a>
                </div>
                <div class="column my-5 mx-5">
                              <div class="row pricing my-2 mx-1">
            <strong>Price: </strong> &nbsp; {{ listing.price }} {{ listing.token.symbol }}
          </div>
          <div class="row">
                              <b-button @click="buyListing('uport')" variant="uport" class="mx-1">
            <img src="@/assets/uport-logo.svg" width="40" height="40" class="mx-1" /> &nbsp;|&nbsp;
            Buy
        </b-button>
        <b-button @click="buyListing('metamask')" variant="metamask" class="mx-1">
              <img src="@/assets/metamask.svg" width="40" height="40" class="mx-1" /> &nbsp;|&nbsp;
            Buy
        </b-button>
          </div>
                </div>
            </div>
            <div class="col-12 col-lg-4">
                <img class="cover-large" :src="listing.image" />
            </div>
          </b-row>
    </b-modal>
</template>

<script>
export default {
  name: 'editListing',
  data () {
    return {
      showModal: false,
      loading: false,
      listing: undefined
    }
  },
  created () {
    this.$root.$on('editListingModal', $event => {
      this.showModal = true
      this.listing = this.$store.getters['marketplace/LISTING_DETAILS']($event)
    })
  }
}

</script>

<style scoped lang="scss">

.modal-dialog {
    min-width:1200px !important;
    max-width: 1400px !important;
}

.cover-large {
      display: block;
  max-width:350px;
  max-height:560x;
  min-height:560x;
  min-width: 350px;
  width: auto;
  height: auto;
}
</style>
