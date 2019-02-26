<template>
 <div class="col-12">
        <div class="row my-5">
            <h1>
                Manage Your Listings
            </h1>
        </div>
        <div class="row">
           <MyListings />
           <CreateListing />
        </div>
    </div>
</template>

<script>
    import MyListings from '@/components/dashboard/storefront/MyListings'
    import CreateListing from '@/components/dashboard/storefront/CreateListing'
    export default {
        components: {
            MyListings,
            CreateListing
        }
    }
</script>

<style scoped>

</style>