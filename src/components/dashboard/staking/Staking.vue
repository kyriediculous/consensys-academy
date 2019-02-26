<template>
    <div class="col-12">
        <div class="row my-5">
            <h1>
                Manage Stake
            </h1>
        </div>
        <div class="row">
            <Staked />
            <Treshold />
            <AddStake />
            <RemoveStake  />
        </div>
    </div>
</template>

<script>
import Staked from './Staked'
import Treshold from './Treshold'
import AddStake from './AddStake'
import RemoveStake from './RemoveStake'
export default {
  name: 'staking',
  components: {
    AddStake,
    RemoveStake,
    Staked,
    Treshold
  },
  async beforeCreate () {
    await Promise.all([
      this.$store.dispatch('staking/TOKEN'),
      this.$store.dispatch('marketplace/PUBLISHER_TRESHOLD'),
      this.$store.dispatch('staking/STAKED')
    ])
  }
}
</script>

<style scoped>

</style>
