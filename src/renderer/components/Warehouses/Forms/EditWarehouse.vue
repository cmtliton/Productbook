<template>
  <v-layout row justify-center>
     <v-dialog v-model="EditWarehouseDialog" persistent max-width="600px">
      <v-btn slot="activator" color="teal" flat icon
      @click="editWarehouse(itemsent)"><v-icon color="teal" small>edit</v-icon></v-btn>
  <v-card flat>
    <v-snackbar
      v-model="snackbar"
      absolute
      top
      right
      color="success"
    >
      <span>Warehouse Update successful!</span>
      <v-icon dark>check_circle</v-icon>
    </v-snackbar>
    <v-card-title>
          <span class="headline">Edit Warehouse</span>
        </v-card-title>
    <form @submit.prevent="onSaveChange">
      <v-container grid-list-xl fluid>
        <v-layout wrap>
          <v-flex xs12 sm6>
            <v-text-field
              v-model="Warehouse.WarehouseName"
              color="purple darken-2"
              label="Warehouse Name"
              type="text"
              autofocus
              required
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field
              v-model="Warehouse.KeyPerson"
              color="purple darken-2"
              label="Key Person"
              type="text"
              autofocus
              required
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field
              v-model="Warehouse.PhoneNumber"
              color="blue darken-2"
              label="Phone Number"
              type="text"
              required
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              v-model="Warehouse.Address"
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
        <v-btn color="teal" flat @click="Warehouses"><v-icon dark left>arrow_back</v-icon></v-btn>
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
      itemsent: Object
    },
    data () {
      const blankWarehouse = Object.freeze({
        WarehouseName: '',
        KeyPerson: '',
        PhoneNumber: '',
        Address: '',
        Status: true
      })

      return {
        Warehouse: Object.assign({}, blankWarehouse),
        snackbar: false,
        blankWarehouse,
        EditWarehouseDialog: false
      }
    },

    computed: {
      formIsValid () {
        return (
          this.Warehouse.WarehouseName &&
          this.Warehouse.KeyPerson &&
          this.Warehouse.PhoneNumber &&
          this.Warehouse.Address
        )
      }
      // mobileIsDuplicate () {
      //   if (this.itemsent.PhoneNumber.trim()) {
      //     var mobileHasDuplicate = this.$store.getters['Warehouses/getDuplicateWMobile'](this.itemsent.PhoneNumber.trim())
      //     return mobileHasDuplicate && mobileHasDuplicate.id !== this.itemsent.id ? 'Warehouse already exist' : ''
      //   }
      //   return true
      // }
    },

    methods: {
      onSaveChange () {
        this.snackbar = true
        this.$store.dispatch('Warehouses/onSavingChangeWarehouse', this.Warehouse)
        setTimeout(() => {
          this.snackbar = false
          this.EditWarehouseDialog = false
          this.Warehouse = Object.assign({}, this.blankWarehouse)
        }, 1000)
      },
      Warehouses () {
        this.$router.push('/Warehouses')
        this.EditWarehouseDialog = false
      },
      editWarehouse (Warehouse) {
        this.Warehouse = Object.assign({}, Warehouse)
        this.EditWarehouseDialog = true
      }
    }
  }
</script>