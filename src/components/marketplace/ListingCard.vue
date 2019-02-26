<template>
    <b-card
        :header="author"
        :title="title"
        :img-src="img.src"
        img-alt="Product thumbnail"
        img-left
        border-variant="primary"
        header-bg-variant="primary"
        header-text-variant="white"
        align="left"
        >
        <b-card-text>
            <div>
                <b-badge
                     v-for="(tag, index) in tags"
                     :key="index"
                    pill
                    variant="primary"
                >
                    {{ tag }}
                </b-badge>
            </div>
            <div>
                {{description}}
            </div>
            <div>
                {{price}}
            </div>
        </b-card-text>
        <b-button variant="primary">
            Buy
        </b-button>
        <b-button variant="outline-primary">
            Details
        </b-button>
    </b-card>
</template>

<script>
export default {
  name: 'listingCard',
  props: ['title', 'author', 'img', 'description', 'token', 'price']
}
</script>

<style scoped>

</style>
