<template>
  <div class="container">
    <div class="row">
      <Staking />
    </div>
    <div class="row" />
      <Storefront />
  </div>
</template>

<script>
import Staking from '@/components/dashboard/staking/Staking'
import Storefront from '@/components/dashboard/storefront/Storefront'
export default {
  name: 'dashboard',
  components: {
    Staking,
    Storefront
  }
}
</script>

<style scoped></style>
