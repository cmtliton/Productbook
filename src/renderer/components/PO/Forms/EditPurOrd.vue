<template>
  <v-layout row justify-center>
     <v-dialog v-model="EditPurOrdDialog" persistent max-width="500px">
      <v-btn slot="activator" color="teal" flat icon
      @click="editPurOrd(editedPurOrd)"><v-icon color="teal" small>edit</v-icon></v-btn>
  <v-card flat>
    <v-snackbar
      v-model="snackbar"
      absolute
      top
      right
      color="success"
    >
      <span>PurOrd Update successful!</span>
      <v-icon dark>check_circle</v-icon>
    </v-snackbar>
    <v-card-title>
          <span class="headline">Edit PurOrd</span>
        </v-card-title>
    <form @submit.prevent="onSaveChange">
      <v-container grid-list-xl fluid>
        <v-layout wrap>
          <v-flex xs12 sm6>
            <v-select
                :items="Items"
                dense
                v-model="PurOrd.ItemId"
                item-text="ItemName"
                item-value="id"
                label="Select Item"
                required
              ></v-select>
          </v-flex>
          <v-flex xs12 sm6>
            <v-select
                :items="Brands"
                dense
                v-model="PurOrd.BrandId"
                item-text="BrandName"
                item-value="id"
                label="Select Brand"
                required
              ></v-select>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field
              v-model="PurOrd.PurOrdName"
              :rules="[PurOrdIsDuplicate]"
              color="purple darken-2"
              label="PurOrd Name"
              type="text"
              required
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
                <v-text-field
                v-model="PurOrd.PurOrdCode"
                color="teal"
                label="PurOrd Code"
                type="text"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                v-model="PurOrd.PurchasePrice"
                color="teal"
                label="Purchase Price"
                type="number"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                v-model="PurOrd.MRP"
                color="teal"
                label="MRP"
                type="number"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                v-model="PurOrd.Warranty"
                color="teal"
                label="Warranty"
                type="text"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                v-model="PurOrd.MeasuringUnit"
                color="teal"
                label="Measuring Unit"
                type="text"
                ></v-text-field>
              </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="teal" flat @click="PurOrds"><v-icon dark left>arrow_back</v-icon></v-btn>
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
      editedPurOrd: Object
    },
    data () {
      const blankPurOrd = Object.freeze({
        PurOrdName: '',
        PurOrdCode: '',
        PurchasePrice: 0,
        MRP: 0,
        Warranty: '',
        MeasuringUnit: 'Pcs',
        ItemId: '',
        BrandId: '',
        Status: true
      })

      return {
        PurOrd: Object.assign({}, blankPurOrd),
        snackbar: false,
        blankPurOrd,
        EditPurOrdDialog: false
      }
    },

    computed: {
      formIsValid () {
        return (
          this.PurOrd.PurOrdName &&
          this.PurOrd.ItemId &&
          this.PurOrd.BrandId &&
          this.PurOrdIsDuplicate === ''
        )
      },
      PurOrdIsDuplicate () {
        if (this.PurOrd.PurOrdName.trim()) {
          var PurOrdHasDuplicate = this.$store.getters.getDuplicatePurOrd(this.PurOrd.PurOrdName.trim())
          return PurOrdHasDuplicate && PurOrdHasDuplicate.id !== this.PurOrd.id ? 'PurOrd already exist' : ''
        }
        return true
      },
      Brands () {
        return this.$store.getters.getBrands
      },
      Items () {
        return this.$store.getters.getItems
      }
    },

    methods: {
      onSaveChange () {
        this.snackbar = true
        this.$store.dispatch('onSavingChangePurOrd', this.PurOrd)
        setTimeout(() => {
          this.snackbar = false
          this.EditPurOrdDialog = false
          this.PurOrd = Object.assign({}, this.blankPurOrd)
        }, 1000)
      },
      PurOrds () {
        this.$router.push('/purords')
        this.EditPurOrdDialog = false
      },
      editPurOrd (editedPurOrd) {
        this.PurOrd = Object.assign({}, editedPurOrd)
        this.EditPurOrdDialog = true
      }
    }
  }
</script>