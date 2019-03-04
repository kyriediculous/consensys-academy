<template>
    <b-modal
        centered
        v-if="listing"
        :title="`Update Listing - ${listing.title} by ${listing.author}`"
        size="xl"
        hide-footer
        v-model="showModal"
    >
            <div class="my-3">
                <h4>
                    Change Status 
                </h4>
              <div class="my-3">
                    <b-button variant="warning" @click="changeStatus" v-if="this.listing.active === true">
                    <span v-if="this.updateStatus.loading === false">Make Inactive</span>
                     <b-spinner variant="light" v-else small />
                </b-button>
                <b-button variant="success" @click="changeStatus" v-else>
                    <span v-if="this.updateStatus.loading === false">Make Active</span>
                     <b-spinner variant="light" v-else small />
                </b-button>
              </div>
                <b-alert v-if="typeof updateStatus.error === 'string'" variant="danger">
                    {{ updateStatus.error}}
                </b-alert>
            </div>
            <div class="my-3">
                <h4>Change pricing</h4>
                <p>Here you can update the price and/or token for your listing</p>
                <b-form class="col-lg-8">
                    <b-form-group
                    id="price"
                    :description="`Set a price and token. Selected token: ${tokenInfo.name}`"
                    label="Price"
                    label-for="input-price"
                >
                    <b-input-group>
                    <b-form-input label="price" placeholder="Enter a new price..." type="number" required v-model="updatePricing.price" />
                    <b-input-group-append>
                        <b-button variant="primary">
                            <span v-if="tokenInfo.loading === false">{{ tokenInfo.symbol }}</span>
                             <b-spinner v-else variant="light" small />
                            </b-button>
                    </b-input-group-append>
                    </b-input-group>
                    <b-form-input  class="my-2" :state="!tokenInfo.error" @change="getTokenInfo" label="token" placeholder="Enter token address..." type="text" required v-model="updatePricing.token" />
                </b-form-group>
                <b-button variant="primary" @click="changePricing">
                    <span v-if="updatePricing.loading === false">Update Pricing</span>
                    <b-spinner variant="light" v-else small />
                    <b-alert v-if="typeof updatePricing.error === 'string'" variant="danger">
                        {{ updatePricing.error }}
                    </b-alert>
                </b-button>
                </b-form>
            </div>
            <div>

            </div>
    </b-modal>
</template>

<script>
import { changePricing, changeStatus } from '@/util/marketplace'
export default {
  name: 'editListing',
  data () {
    return {
      showModal: false,
      listingId: '',
      loading: false,
      tokenInfo: {
        name: '',
        symbol: '',
        decimals: 0,
        loading: false,
        error: null
      },
      updatePricing: {
          price: null,
          token: null,
          loading: false,
          error: null
      },
      updateStatus: {
          loading: false,
          error: null
      }
    }
  },
  computed: {
      listing () {
          return this.$store.getters['marketplace/LISTING_DETAILS'](this.listingId)
      }
  },
  created () {
    this.$root.$on('editListingModal', $event => {
      this.listingId = $event
        this.showModal = true
      this.updatePricing.price = this.listing.price 
      this.updatePricing.token = this.listing.token.address
      this.tokenInfo = {...this.listing.token, loading: false, error: null}
    })
  },
  methods: {
    async getTokenInfo () {
      try {
        this.tokenInfo.loading = true
        this.tokenInfo = {
          ...(await info(this.updatePricing.token)),
          loading: true,
          error: null
        }
        this.tokenInfo.loading = false
      } catch (e) {
        this.tokenInfo = {
          name: '',
          symbol: '',
          decimals: 0,
          loading: false,
          error: e.message
        }
      }
    },
    async changePricing() {
        try {
            this.updatePricing.error = null
            this.updatePricing.loading = true 
            await changePricing(this.listing.id, updatePricing.price, updatePricing.token, this.$store.state.auth.type)
            await this.$store.dispatch('marketplace/UPDATE_LISTING', this.listingId)
            this.updatePricing.loading = false
                    this.$root.$emit('alert', {
          countdown: 5,
          color: 'success',
          message: `Price updated to ${this.updatePricing.price} ${this.tokenInfo.symbol}`
        })
        } catch (e) {
            this.updatePricing.loading = false 
            this.updatePricing.error = e.message 
        this.$root.$emit('alert', {
          countdown: 5,
          color: 'danger',
          message: e.message
        })
        }
    },
    async changeStatus() {
        try {
            this.updateStatus.error = null 
            this.updateStatus.loading = true 
            await changeStatus(this.listing.id, this.$store.state.auth.type)
            await this.$store.dispatch('marketplace/UPDATE_LISTING', this.listingId)
            this.updateStatus.loading = false 
            this.$root.$emit('alert', {
                countdown: 5,
                color: 'success',
                message: `Listing made ${!this.listing.active ? 'inactive' : 'active'}`
            })
        } catch (e) {
             this.updateStatus.loading = false 
            this.$root.$emit('alert', {
          countdown: 5,
          color: 'danger',
          message: e.message
        })
        }
    }
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
