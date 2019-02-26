<template>
    <div class="col-12 col-lg-4 my-5">
        <b-button
            :disabled="loading === true "
            variant="primary"
            @click="confirm = !confirm"
            >
            <span v-if="loading === false">UnStake</span>
            <b-spinner variant="light" v-if="loading === true" small />
        </b-button>
        <b-modal
            v-model="confirm"
            ok-title="Unstake"
            ok-variant="warning"
            @ok="unstake"
        >
            <p>
                Are you sure you want to UNstake {{ staked }} tokens ? 
                You will not be able to create listings anymore.
                Your listings will no longer be visible and purchasable. 
            </p>
        </b-modal>
    </div>
</template>

<script>
  import { unstake } from '@/util/staking'
export default {
  name: 'staking-unstake',
    computed: {
     staked () {
      return this.$store.getters['staking/STAKED']
    },
    token () {
      return this.$store.getters['staking/TOKEN']
    }
  },
  data () {
    return {
      loading: false,
      confirm: false
    }
  },
  methods: {
   async unstake () {
      try {
        this.loading = true
        await unstake(10)
        await this.$store.dispatch('staking/STAKED')
        this.loading = false
        this.$root.$emit('alert', {
          countdown: 5,
          color: 'success',
          message: 'Succesfully UNstaked 10 tokens'
        })
      } catch (e) {
        this.$root.$emit('alert', {
          countdown: 5,
          color: 'danger',
          message: e.message
        })
      }
    },
    cancel () {
      this.loading = false
      this.confirm = false
    }
  }
}
</script>

<style scoped>

</style>
