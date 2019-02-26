<template>
    <div class="col-md-12 col-lg-6">
        <div>
            <strong>Current Stake: {{staked}} {{token.symbol}} </strong>
        </div>
        <div>
            <!-- amount + token info -->
        </div>
    </div>
</template>

<script>
export default {
  name: 'staking-staked',
  computed: {
     staked () {
      return this.$store.getters['staking/STAKED']
    },
    token () {
      return this.$store.getters['staking/TOKEN']
    }
  }
}
</script>

<style scoped>

</style>
