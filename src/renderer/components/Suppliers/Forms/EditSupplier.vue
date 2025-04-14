<template>
  <v-layout row justify-center>
     <v-dialog v-model="EditSupplierDialog" persistent max-width="600px">
      <v-btn slot="activator" color="teal" flat icon
      @click="editSupplier(supplier)"><v-icon color="teal" small>edit</v-icon></v-btn>
  <v-card flat>
    <v-snackbar
      v-model="snackbar"
      absolute
      top
      right
      color="success"
    >
      <span>Supplier Update successful!</span>
      <v-icon dark>check_circle</v-icon>
    </v-snackbar>
    <v-card-title>
          <span class="headline">Edit Supplier</span>
        </v-card-title>
    <form @submit.prevent="onSaveChange">
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
      supplier: Object
    },
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
        EditSupplierDialog: false
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
        if (this.Supplier.PhoneNumber.trim()) {
          var mobileHasDuplicate = this.$store.getters['Suppliers/getDuplicateSupplierMobile'](this.Supplier.PhoneNumber.trim())
          return mobileHasDuplicate && mobileHasDuplicate.id !== this.Supplier.id ? 'Supplier already exist' : ''
        }
        return true
      }
    },

    methods: {
      onSaveChange () {
        this.snackbar = true
        this.$store.dispatch('Suppliers/onSavingChangeSupplier', this.Supplier)
        setTimeout(() => {
          this.snackbar = false
          this.EditSupplierDialog = false
          this.Supplier = Object.assign({}, this.blankSupplier)
        }, 1000)
      },
      Suppliers () {
        this.$router.push('/Suppliers')
        this.EditSupplierDialog = false
      },
      editSupplier (supplier) {
        this.Supplier = Object.assign({}, supplier)
        this.EditSupplierDialog = true
      }
    }
  }
</script>