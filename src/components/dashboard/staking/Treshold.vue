<template>
    <div class="col-md-12 col-lg-6">
        <div>
            <strong>Stake required: {{ treshold }} {{ token.symbol }}</strong>
        </div>
        <div>
            <!-- amount + token info -->
        </div>
    </div>
</template>

<script>
export default {
  name: 'staking-treshold',
  computed: {
    treshold () {
      return this.$store.getters['marketplace/PUBLISHER_TRESHOLD']
    },
    token () {
      return this.$store.getters['staking/TOKEN']
    }
  }
}
</script>

<style scoped>

</style>
