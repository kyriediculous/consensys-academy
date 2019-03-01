<template>
  <div class="col-12 col-lg-4">
    <b-card
        :title="title"
        :img-src="image"
        img-alt="Product thumbnail"
        img-left
        border-variant="primary"
        header-bg-variant="primary"
        header-text-variant="white"
        align="left"
        class="my-3"
        >
        <b-card-text>
            <!--<div>
                <b-badge
                     v-for="(tag, index) in tags"
                     :key="index"
                    pill
                    variant="primary"
                >
                    {{ tag }}
                </b-badge>
            </div>-->
            <div>
                {{summary}}
            </div>
            <div>
            </div>
        </b-card-text>
        <b-button @click="buyListing" variant="primary" class="mx-1">
            Buy for {{price}} <strong>{{token.symbol}}</strong>

        </b-button>
        <b-button @click="$router.push(`/marketplace/${id}`)" variant="outline-primary" class="mx-1">
          Details
        </b-button>
    </b-card>
  </div>
</template>

<script>
import { buyListing } from '@/util/marketplace'
export default {
  name: 'listingCard',
  props: ['id', 'title', 'author', 'image', 'summary', 'token', 'price', 'ebook'],
  data () {
    return {
      buyLoading: false
    }
  },
  computed: {
    authType () {
      return this.$store.state.auth.type
    }
  },
  created () {
    console.log(this.id)
  },
  methods: {
    async buyListing () {
      console.log("buying", this.id, this.price )
      try {
        this.buyLoading = true
        await buyListing(this.id, this.price, this.authType)
        this.$root.$emit('alert', {
          countdown: 5,
          color: 'success',
          message: `Bought ${this.title} for ${this.price} ${this.token.symbol}`
        })
        setTimeout( () => window.open(this.ebook), 2000)
        this.buyLoading = false
      } catch (e) {
        this.buyLoading = false
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

<style scoped>

.card  img {
  display: block;
  max-width:120px;
  max-height:200px;
  width: auto;
  height: auto;
}
</style>
