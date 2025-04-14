<template>
  <v-layout row justify-center>
     <v-dialog v-model="SupplierDialog" persistent max-width="600px">
      <v-btn slot="activator" color="teal" dark flat small>New Supplier</v-btn>
  <v-card flat>
    <v-snackbar
      v-model="snackbar"
      absolute
      top
      right
      color="success"
    >
      <span>Supplier Creation successful!</span>
      <v-icon dark>check_circle</v-icon>
    </v-snackbar>
    <v-card-title>
          <span class="headline">Create Supplier</span>
        </v-card-title>
    <form @submit.prevent="onSave">
      <v-container grid-list-xl fluid>
        <v-layout wrap>
          <v-flex xs12 sm6>
            <v-text-field
              v-model="Supplier.SupplierName"
              color="purple darken-2"
              label="Supplier Name"
              type="text"
              autofocus
              required
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field
              v-model="Supplier.PhoneNumber"
              :rules="[mobileIsDuplicate]"
              color="blue darken-2"
              label="Phone Number"
              type="text"
              required
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              v-model="Supplier.Address"
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
        <v-btn color="teal" flat @click="Suppliers"><v-icon dark left>arrow_back</v-icon></v-btn>
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
      const blankSupplier = Object.freeze({
        SupplierName: '',
        PhoneNumber: '',
        Address: '',
        Status: true
      })

      return {
        Supplier: Object.assign({}, blankSupplier),
        snackbar: false,
        blankSupplier,
        SupplierDialog: false
      }
    },

    computed: {
      formIsValid () {
        return (
          this.Supplier.SupplierName &&
          this.Supplier.PhoneNumber &&
          this.Supplier.Address &&
          this.mobileIsDuplicate === ''
        )
      },
      mobileIsDuplicate () {
        return this.$store.getters['Suppliers/getDuplicateSupplierMobile'](this.Supplier.PhoneNumber.trim()) ? 'Supplier already exist' : ''
      }
    },

    methods: {
      onSave () {
        this.snackbar = true
        this.$store.dispatch('Suppliers/onSavingSupplier', this.Supplier)
        this.close()
      },
      close () {
        this.SupplierDialog = false
        setTimeout(() => {
          this.snackbar = false
          this.Supplier = Object.assign({}, this.blankSupplier)
        }, 300)
      },
      Suppliers () {
        this.$router.push('/suppliers')
        this.SupplierDialog = false
      }
    },
    watch: {
      SupplierDialog (val) {
        val || this.close()
      }
    }
  }
</script>