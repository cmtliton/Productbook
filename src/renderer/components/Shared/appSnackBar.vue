<template>
  <v-snackbar
      v-model="snackbar"
      absolute
      top
      right
      color="success"
    >
      <span>Registration successful!</span>
      <v-icon dark>check_circle</v-icon>
    </v-snackbar>
</template>

<script>
  export default {
    computed: {
      snackbar () {
        return this.$store.state.snackbar
      }
    }
  }
</script>