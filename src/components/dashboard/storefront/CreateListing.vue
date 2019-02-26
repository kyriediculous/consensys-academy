<template>
    <div>
        <b-modal
            v-model="modal"
            title="Create New Listing"
            ok-title="Create"
            ok-variant="success"
            @ok="createListing"
            @cancel="resetForm"
            >
            <b-form>
                <b-form-group
                    id="ebook"
                    description="Upload an eBook"
                    label="eBook file"
                    label-for="input-ebook"
                >
                    <b-form-file 
                        v-model="create.ebook"
                        drop-placeholder="Drop ebook here"
                        placeholder="Pick a .pdf or .epub file..."
                        accept=".pdf, .epub"
                        :state="Boolean(create.ebook)"
                        required
                    />
                </b-form-group>
                <b-form-group
                    id="title"
                    description="What is the book's title?"
                    label="Title"
                    label-for="input-title"
                >
                    <b-form-input 
                        id="input-title"
                        type="text"
                        v-model="create.title"
                        required
                    />
                </b-form-group>
                <b-form-group
                    id="summary"
                    description="Enter a short summary"
                    label="Short Summary"
                    label-for="input-summary"
                >
                    <b-form-textarea 
                        id="input-summary"
                        v-model="create.summary" 
                        placeholder="Enter a short summary"
                        rows="5"
                        max-rows="5"
                    />
                </b-form-group>
                <b-form-group
                    id="author"
                    description="Enter author name"
                    label="Author"
                    label-for="input-author"
                >
                    <b-form-input 
                        id="input-author"
                        v-model="create.author"
                        type="text"
                        required
                    />
                </b-form-group>
                <b-form-group
                    id="image"
                    description="Choose a book cover"
                    label="Cover image"
                    label-for="input-image"
                >
                    <b-form-file 
                        v-model="create.image" 
                        drop-placeholder="Drop file here"
                        placeholder="Pick an image"
                        accept="image/*"
                        :state="Boolean(create.image)"
                    />
                </b-form-group>
                <b-form-group
                    id="price"
                    :description="`Set a price and token. Selected token: ${tokenInfo.name}`"
                    label="Price"
                    label-for="input-price"
                >
                    <b-input-group>
                    <b-form-input label="price" placeholder="Enter a price..." type="number" required v-model="create.price" />
                    <b-input-group-append> 
                        <b-button variant="primary">
                            <span v-if="tokenInfo.loading === false">{{ tokenInfo.symbol }}</span>
                             <b-spinner v-else variant="light" small />
                            </b-button>
                    </b-input-group-append>
                    </b-input-group>
                    <b-form-input :state="!tokenInfo.error" @change="getTokenInfo" label="token" placeholder="Enter token address..." type="text" required v-model="create.token" />
                </b-form-group>
            </b-form>
        </b-modal>
    </div>
</template>

<script>
    import { info } from '@/util/token'
    export default {
        data () {
            return {
                modal: false,
                create: {
                    ebook: null,
                    title: '',
                    summary: '',
                    author: '',
                    image: null,
                    price: null,
                    token: '0x31830869C8ea2C267898b3E2323B5862DE61B9Cc'
                },
                tokenInfo: {
                    name: '',
                    symbol: '',
                    decimals: 0,
                    loading: false,
                    error: null
                }
            }
        },
        async created () {
            await this.getTokenInfo()
            this.$root.$on('createListing', $event => this.modal = true)
        },
        methods: {
            createListing () {
                console.log(this.create)
            },
            resetForm () {
                this.create.ebook = null 
                this.create.title = null 
                this.create.summary = null 
                this.create.author = null 
                this.create.image = null 
                this.create.price = null 
                this.create.token = '0x31830869C8ea2C267898b3E2323B5862DE61B9Cc'
                this.modal = false 
            },
            async getTokenInfo () {
                try {
                    this.tokenInfo.loading = true 
                    this.tokenInfo = {
                        ...(await info(this.create.token)),
                        loading: true,
                        error: null
                    }
                    this.tokenInfo.loading = false
                } catch (e) {
                    console.log(e)
                    this.tokenInfo = {
                        name: '',
                        symbol: '',
                        decimals: 0,
                        loading: false,
                        error: e.message
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>