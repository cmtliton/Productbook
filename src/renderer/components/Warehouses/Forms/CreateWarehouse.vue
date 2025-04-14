<template>
  <v-layout row justify-center>
     <v-dialog v-model="WarehouseDialog" persistent max-width="600px">
      <v-btn slot="activator" color="teal" dark flat>New Warehouse</v-btn>
  <v-card flat>
    <v-snackbar
      v-model="snackbar"
      absolute
      top
      right
      color="success"
    >
      <span>Warehouse Creation successful!</span>
      <v-icon dark>check_circle</v-icon>
    </v-snackbar>
    <v-card-title>
          <span class="headline">Create Warehouse</span>
        </v-card-title>
    <form @submit.prevent="onSave">
      <v-container grid-list-xl fluid>
        <v-layout wrap>
          <v-flex xs12 sm6>
            <v-text-field
              v-model="Warehouse.WarehouseName"
              color="purple darken-2"
              label="Warehouse Name"
              autofocus
              type="text"
              required
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field
              v-model="Warehouse.KeyPerson"
              color="purple darken-2"
              label="Key Person"
              autofocus
              type="text"
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
        WarehouseDialog: false
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
      //   return this.$store.getters.getDuplicateMobile(this.Warehouse.PhoneNumber.trim()) ? 'Warehouse already exist' : ''
      // }
    },
    watch: {
      WarehouseDialog (val) {
        val || this.close()
      }
    },
    methods: {
      onSave () {
        this.snackbar = true
        this.$store.dispatch('Warehouses/onSavingWarehouse', this.Warehouse)
        setTimeout(() => {
          this.snackbar = false
          this.WarehouseDialog = false
          this.Warehouse = Object.assign({}, this.blankWarehouse)
        }, 1000)
      },
      Warehouses () {
        this.$router.push('/Warehouses')
        this.WarehouseDialog = false
      },
      close () {
        this.Warehouse = Object.assign({}, this.blankWarehouse)
        this.WarehouseDialog = false
      }
    }
  }
</script>