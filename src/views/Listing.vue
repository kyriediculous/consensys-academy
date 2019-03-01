<template lang="html">
  <div>
    {{ listing }}
  </div>
</template>

<script>
export default {
  name: 'listing',
  computed: {
    listing () {
      return this.$store.getters['marketplace/LISTING_DETAILS'](this.$route.params.id)
    }
  }
}
</script>

<style>
</style>
