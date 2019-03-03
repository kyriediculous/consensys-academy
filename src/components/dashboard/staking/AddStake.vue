<template>
    <div class="col-12 col-lg-4 offset-lg-2 my-5">
        <b-button
            :disabled="loading === true "
            variant="primary"
            @click="confirm = !confirm"
            >
            <span v-if="loading === false">Add Stake</span>
            <b-spinner variant="light" v-if="loading === true" small />
        </b-button>
        <b-modal
            v-model="confirm"
            ok-title="Stake"
            ok-variant="success"
            @ok="addStake"
            >
            <p>
                Are you sure you want to stake {{ treshold }} tokens ?
            </p>

        </b-modal>
    </div>
</template>

<script>
import { stake } from '@/util/staking'
export default {
  name: 'staking-add-stake',
  computed: {
    treshold () {
      return this.$store.getters['marketplace/PUBLISHER_TRESHOLD']
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
    async addStake () {
      try {
        this.loading = true
        await stake(10, this.$store.state.auth.type)
        await this.$store.dispatch('staking/STAKED')
        this.loading = false
        this.$root.$emit('alert', {
          countdown: 5,
          color: 'success',
          message: 'Succesfully staked 10 tokens'
        })
      } catch (e) {
        console.log(e)
        this.loading = false
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
