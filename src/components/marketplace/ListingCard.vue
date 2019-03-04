<template>
  <div class="col-12 col-lg-6 col-xl-4">
    <b-card
        :title="title"
        :img-src="image"
        img-alt="Product thumbnail"
        img-left
        border-variant="primary"
        header-bg-variant="primary"
        header-text-variant="white"
        align="left"
        class="my-2 mx-2"
        >
        <b-card-body>
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
            <div class="summary">
                {{summary.substring(0, 120) + '...'}}
            </div>
            <div>
            </div>
        </b-card-text>
                <b-button @click="$root.$emit('listingDetailModal', id)" variant="outline-primary" class="mx-1">
          Details
        </b-button>
        </b-card-body>

        <b-card-footer class="my-2 column" footer-bg-variant="white">
          <div class="row pricing my-2 mx-1">
            <strong>Price: </strong> &nbsp; {{ price }} {{ token.symbol }}
          </div>
          <div class="row">
            <b-button :disabled="buyLoading==='uport'" @click="buyListing('uport')" variant="uport" class="mx-1">
            <img src="@/assets/uport-logo.svg" width="25" height="25" class="mx-1" /> &nbsp;|&nbsp;
            <b-spinner variant="light" v-if="buyLoading === 'uport'" small />
            <span v-else >Buy</span>
        </b-button>
        <b-button :disabled="buyLoading==='metamask'" @click="buyListing('metamask')" variant="metamask" class="mx-1">
              <img src="@/assets/metamask.svg" width="25" height="25" class="mx-1" /> &nbsp;|&nbsp;
                        <b-spinner variant="light" v-if="buyLoading === 'metamask'" small />
            <span v-else>Buy</span>
        </b-button>
          </div>

        </b-card-footer>
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
  methods: {
    async buyListing (signer) {
      try {
        this.buyLoading = signer
        await buyListing(this.id, this.price, signer)
        this.$root.$emit('alert', {
          countdown: 5,
          color: 'success',
          message: `Bought ${this.title} for ${this.price} ${this.token.symbol}`
        })
        setTimeout(() => window.open(this.ebook), 2000)
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

.card-img-left {
  display: block;
  max-width:200px;
  max-height:320px;
  min-height:320px;
  width: auto;
  height: auto;
}

.pricing {
  font-size: 18px;
}

.summary {
  font-size: 14px;
}

.card {
  position: relative;
}
.card-body {
  margin: 0;
}

.card-title {
  margin: 0;
  line-height:21px;
}

.card-footer {
  position:absolute;
  bottom: 0;
}
</style>
