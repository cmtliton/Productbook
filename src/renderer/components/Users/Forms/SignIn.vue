<template>
	<v-container fluid>
    <v-layout align-center justify-center row v-if="getError">
    <v-flex xs12 sm8 md6>
      <app-signin-alert @dismissed="onDismissed" :text="getError"></app-signin-alert>
    </v-flex>
  </v-layout>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md6>
            <v-card class="elevation-12">
  <v-form @submit.prevent="SignInUser">
              <v-toolbar flat dense color="teal">
                <v-toolbar-title>Login</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                  <v-text-field prepend-icon="person" name="login" label="Login" type="text" v-model="SignIn.username" required autofocus></v-text-field>
                  <v-text-field prepend-icon="lock" name="password" label="Password" id="password" type="password" v-model="SignIn.password" required></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="teal" flat @click="userList"><v-icon dark left>arrow_back</v-icon></v-btn>
                <v-btn color="teal" @keyup.enter="SignInUser" type="submit" :disabled="!formIsValid">Login</v-btn>
              </v-card-actions>
            </v-form>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
</template>
<script>
export default {
  data () {
    return {
      SignIn: {
        username: '',
        password: ''
      }
    }
  },
  computed: {
    formIsValid () {
      return (
        this.SignIn.username && this.SignIn.password
      )
    },
    getError () {
      return this.$store.getters['Users/getError']
    }
  },
  methods: {
    SignInUser () {
      this.$store.dispatch('Users/SigningInUser', this.SignIn)
      this.$store.dispatch('Users/loadUsers')
      this.$store.dispatch('Items/loadItems')
      this.$store.dispatch('Brands/loadBrands')
      this.$store.dispatch('Products/loadProducts')
      this.$store.dispatch('PurOrdRcvs/loadStocks')
      this.$store.dispatch('PurOrds/loadPurOrds')
      this.$store.dispatch('Suppliers/loadSuppliers')
      this.$store.dispatch('PurOrdRcvs/loadPORcvs')
      this.$store.dispatch('PurOrdRcvs/loadSuppliersPaymentHistory')
      this.$store.dispatch('Buyers/loadBuyers')
      this.$store.dispatch('Sales/loadSales')
      this.$store.dispatch('Sales/loadBuyersPaymentHistory')
      this.$store.dispatch('Warehouses/loadWarehouses')
      this.$store.dispatch('Warehouses/loadWarehousesStocks')
      this.$store.dispatch('Transfers/loadTransfers')
      this.$store.dispatch('Returns/loadReturns')
      setTimeout(() => {
        this.$router.push('/')
      }, 900)
    },
    onDismissed () {
      this.$store.dispatch('Users/clearError')
    },
    userList () {
      this.$router.push('/createuser')
    }
  }
}
</script>