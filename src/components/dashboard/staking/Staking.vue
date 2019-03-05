<template>
    <div class="col-12">
        <div class="row my-5">
            <h1>
                Manage Stake
            </h1>
        </div>
        <div v-if="pageLoad" class="text-center">
           <b-spinner variant="primary" small class="my-5" />
        </div>
        <div v-else>
                  <div v-if="error === null" class="row">
            <Staked />
            <Treshold />
            <AddStake />
            <RemoveStake  />
        </div>
        <div v-else class="row">
          <div class="col-12">
            <b-alert :show="typeof error === 'string'" variant="warning" v-html="error">

            </b-alert>
          </div>
        </div>
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
  data () {
    return {
      pageLoad: true,
      error: null
    }
  },
  async created () {
    try {
      if (!this.$store.state.marketplace.publisherTreshold || !this.$store.state.staking.staked || this.$store.state.staking.token.name === '') {
        await Promise.all([
          this.$store.dispatch('staking/TOKEN'),
          this.$store.dispatch('marketplace/PUBLISHER_TRESHOLD'),
          this.$store.dispatch('staking/STAKED')
        ])
      } else {
        this.$store.dispatch('staking/TOKEN')
        this.$store.dispatch('marketplace/PUBLISHER_TRESHOLD')
        this.$store.dispatch('staking/STAKED')
      }

      this.pageLoad = false
    } catch (e) {
      this.pageLoad = false
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
  }
}
</script>

<style scoped>

</style>
