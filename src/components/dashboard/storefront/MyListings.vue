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
                    <strong>No listings found...</strong>
                </div>
             </template>
             <template slot="status" slot-scope="row">

             </template>
             <template slot="price" slot-scope="row"></template>
             <template slot="actions" slot-scope="row">
                 <b-button variant="primary" size="sm" @click="openEdit" >
                     Edit
                 </b-button>
             </template>
        </b-table>
    </b-container>
</template>

<script>
    export default {
        data () {
            return {
                search: null,
                loading: true,
                fields: [
                    { key: 'title', label: "Title" },
                    { key: 'id', label: "Id" },
                    { key: 'active', label: "Status" },
                    { key: 'price', label: "Price" },
                    { key: 'actions', label: '' }
                ]
            }
        },
        computed: {
            listings () {
                return []
            }
        },
        created () {

        },
        methods: {
            openEdit () {

            }
        }
    }
</script>

<style scoped>

</style>