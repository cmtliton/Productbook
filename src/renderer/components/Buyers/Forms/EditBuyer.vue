<template>
  <v-layout row justify-center>
     <v-dialog v-model="EditBuyerDialog" persistent max-width="600px">
      <v-btn slot="activator" color="teal" flat icon
      @click="editBuyer(buyer)"><v-icon color="teal" small>edit</v-icon></v-btn>
  <v-card flat>
    <v-snackbar
      v-model="snackbar"
      absolute
      top
      right
      color="success"
    >
      <span>Buyer Update successful!</span>
      <v-icon dark>check_circle</v-icon>
    </v-snackbar>
    <v-card-title>
          <span class="headline">Edit Buyer</span>
        </v-card-title>
    <form @submit.prevent="onSaveChange">
      <v-container grid-list-xl fluid>
        <v-layout wrap>
          <v-flex xs12 sm6>
            <v-text-field
              v-model="Buyer.BuyerName"
              color="purple darken-2"
              label="Buyer Name"
              type="text"
              autofocus
              required
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field
              v-model="Buyer.PhoneNumber"
              :rules="[mobileIsDuplicate]"
              color="blue darken-2"
              label="Phone Number"
              type="text"
              required
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              v-model="Buyer.Address"
              color="blue darken-2"
              label="Address"
              type="text"
              required
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="teal" flat @click="Buyers"><v-icon dark left>arrow_back</v-icon></v-btn>
        <v-btn
        :disabled="!formIsValid"
          color="teal"
          type="submit"
        >Update</v-btn>
      </v-card-actions>
    </form>
  </v-card>
</v-dialog>
</v-layout>
</template>

<script>
  export default {
    props: {
      buyer: Object
    },
    data () {
      const blankBuyer = Object.freeze({
        BuyerName: '',
        PhoneNumber: '',
        Address: '',
        Status: true
      })

      return {
        Buyer: Object.assign({}, blankBuyer),
        snackbar: false,
        blankBuyer,
        EditBuyerDialog: false
      }
    },

    computed: {
      formIsValid () {
        return (
          this.Buyer.BuyerName &&
          this.Buyer.PhoneNumber &&
          this.Buyer.Address &&
          this.mobileIsDuplicate === ''
        )
      },
      mobileIsDuplicate () {
        if (this.Buyer.PhoneNumber.trim()) {
          var mobileHasDuplicate = this.$store.getters['Buyers/getDuplicateMobile'](this.Buyer.PhoneNumber.trim())
          return mobileHasDuplicate && mobileHasDuplicate.id !== this.Buyer.id ? 'Buyer already exist' : ''
        }
        return true
      }
    },

    methods: {
      onSaveChange () {
        this.snackbar = true
        this.$store.dispatch('Buyers/onSavingChangeBuyer', this.Buyer)
        setTimeout(() => {
          this.snackbar = false
          this.EditBuyerDialog = false
          this.Buyer = Object.assign({}, this.blankBuyer)
        }, 1000)
      },
      Buyers () {
        this.$router.push('/buyers')
        this.EditBuyerDialog = false
      },
      editBuyer (buyer) {
        this.Buyer = Object.assign({}, buyer)
        this.EditBuyerDialog = true
      }
    }
  }
</script>