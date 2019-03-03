<template>
    <b-container class="my-5">
        <b-row>
            <h1>Purchase History</h1>
        </b-row>
      <b-row>
            <b-table
            hover
            show-empty
            :items="purchases"
            :busy="pageLoad"
            :fields="fields"
        >
            <div slot="table-busy" class="text-center text-muted my-2">
                <strong>Loading...</strong>
                <br />
                <b-spinner variant="primary" small />
            </div>
             <template slot="empty" slot-scope="scope">
                <div class="text-center text-muted my-2">
                    <b-alert :show="typeof error === 'string'" variant="warning" v-html="error">
                    </b-alert>
                    <strong v-if="!error">You haven't made any purchases...</strong>
                </div>
             </template>
                <template slot="image" slot-scope="row">
               <img :src="row.value" height="32" width="20" />
             </template>
             <template slot="timestamp" slot-scope="row">
                 {{ $moment(Number(row.value)*1000).format("DD/MM/YYYY HH:mm")}}
             </template>
            <template slot="price" slot-scope="row">
                               {{ parseInt(row.value).toFixed(3) }}<strong>{{row.item.token.symbol}}</strong>
            </template>
        </b-table>
      </b-row>
    </b-container>
</template>

<script>
export default {
  name: 'purchases',
  data () {
    return {
      pageLoad: true,
      error: null,
      fields: [
        { key: 'image', label: 'Cover' },
        { key: 'title', label: 'Title' },
        { key: 'timestamp', label: 'Date' },
        { key: 'price', label: 'Price' }
      ]
    }
  },
  computed: {
    purchases () {
      return this.$store.getters['marketplace/USER_PURCHASES']
    }
  },
  async created () {
    try {
      if (this.$store.state.marketplace.myPurchases.length === 0) {
        await this.$store.dispatch('marketplace/USER_PURCHASES')
      } else {
        this.$store.dispatch('marketplace/USER_PURCHASES')
      }
      this.pageLoad = false
    } catch (e) {
      this.pageLoad = false
      this.error = e.message
    }
  }
}
</script>

<style scoped>

</style>
