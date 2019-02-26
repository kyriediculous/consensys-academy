<template>
  <b-button
    @click="$store.dispatch('auth/UPORT_LOGOUT')"
    size="md"
    class="my-2 mx-1"
    type="submit"
    >Log Out</b-button
  >
</template>

<script>
export default {
  name: 'logoutButton'
}
</script>

<style scoped></style>
