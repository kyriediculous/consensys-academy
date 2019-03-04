<template>
    <b-container>
        <b-row>
            <b-col md="6" class="my-1">
                <b-form-group label-cols-sm="3" label="Search Title" class="mb-0">
                    <b-input-group>
                        <b-form-input v-model="search" placeholder="Type title to search" />
                        <b-input-group-append>
                            <b-button :disabled="!search" @click="search = null">
                                Clear
                            </b-button>
                        </b-input-group-append>
                    </b-input-group>
                </b-form-group>
            </b-col>
            <b-col md="6" class="my-1">
                <div class="text-center">
                    <b-button @click="$root.$emit('createListing', true)" variant="outline-primary">Create New Listing </b-button>
                </div>
            </b-col>
        </b-row>
        <b-table
            hover
            show-empty
            :items="listings"
            :busy="loading"
            :fields="fields"
            :filter="search"
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
                    <strong v-if="error === false">No listings found...</strong>
                </div>
             </template>
             <template slot="image" slot-scope="row">
               <img :src="row.item.image" height="32" width="20" />
             </template>
             <template slot="id" slot-scope="row" >
               <div v-b-tooltip.hover :title="row.value">
                 <a :href="row.item.manifest" target="_blank">{{ row.value.substring(0, 8) + '...' }} </a>
               </div>
             </template>
             <template slot="active" slot-scope="row">
               {{ row.value === true ? 'Active' : 'Inactive' }}
             </template>
             <template slot="price" slot-scope="row">
               {{ parseInt(row.value).toFixed(3) }}<strong>{{row.item.token.symbol}}</strong>
             </template>
             <template slot="actions" slot-scope="row">
                 <b-button variant="primary" size="sm" @click="$root.$emit('editListingModal', row.item.id)" >
                     Edit
                 </b-button>
             </template>
        </b-table>
        <EditListing />
    </b-container>
</template>

<script>
import EditListing from './EditListing.vue'
export default {
  data () {
    return {
      error: false,
      search: null,
      loading: true,
      fields: [
        { key: 'image', label: 'Cover' },
        { key: 'title', label: 'Title' },
        { key: 'id', label: 'Id' },
        { key: 'active', label: 'Status' },
        { key: 'price', label: 'Price' },
        { key: 'actions', label: '' }
      ]
    }
  },
  computed: {
    listings () {
      return this.$store.getters['marketplace/USER_LISTINGS']
    }
  },
  async created () {
    try {
      if (this.$store.state.marketplace.myListings.length === 0) {
        await this.$store.dispatch('marketplace/USER_LISTINGS')
      } else {
        this.$store.dispatch('marketplace/USER_LISTINGS')
      }
      this.loading = false
    } catch (e) {
      this.loading = false
      this.error = e.message
      switch (e.message) {
        case 'contract not deployed':
          this.error = `Staking contract not deployed on the selected network. Please make sure you have the <b> Rinkeby </b> network selected in Metamask`
          break
        default:
          this.error = e.message
          break
      }
    }
  },
  components: {
    EditListing
  }
}
</script>

<style scoped>

</style>
