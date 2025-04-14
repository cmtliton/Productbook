<template>
  <v-layout row justify-center>
     <v-dialog v-model="BuyerDialog" persistent max-width="600px">
      <v-btn slot="activator" color="teal" dark flat>New Buyer</v-btn>
  <v-card flat>
    <v-snackbar
      v-model="snackbar"
      absolute
      top
      right
      color="success"
    >
      <span>Buyer Creation successful!</span>
      <v-icon dark>check_circle</v-icon>
    </v-snackbar>
    <v-card-title>
          <span class="headline">Create Buyer</span>
        </v-card-title>
    <form @submit.prevent="onSave">
      <v-container grid-list-xl fluid>
        <v-layout wrap>
          <v-flex xs12 sm6>
            <v-text-field
              v-model="Buyer.BuyerName"
              color="purple darken-2"
              label="Buyer Name"
              autofocus
              type="text"
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
        <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
        <v-btn
          color="teal"
          :disabled="!formIsValid"
          type="submit"
        >Create</v-btn>
      </v-card-actions>
    </form>
  </v-card>
</v-dialog>
</v-layout>
</template>

<script>
  export default {
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
        BuyerDialog: false
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
        return this.$store.getters['Buyers/getDuplicateMobile'](this.Buyer.PhoneNumber.trim()) ? 'Buyer already exist' : ''
      }
    },
    watch: {
      BuyerDialog (val) {
        val || this.close()
      }
    },
    methods: {
      onSave () {
        this.snackbar = true
        this.$store.dispatch('Buyers/onSavingBuyer', this.Buyer)
        setTimeout(() => {
          this.snackbar = false
          this.BuyerDialog = false
          this.Buyer = Object.assign({}, this.blankBuyer)
        }, 1000)
      },
      Buyers () {
        this.$router.push('/buyers')
        this.BuyerDialog = false
      },
      close () {
        this.Buyer = Object.assign({}, this.blankBuyer)
        this.BuyerDialog = false
      }
    }
  }
</script>