<template>
  <v-layout row justify-center>
     <v-dialog v-model="EditBrandDialog" persistent max-width="400px">
      <v-btn slot="activator" color="teal" flat icon
      @click="editBrand(editedBrand)"><v-icon color="teal" small>edit</v-icon></v-btn>
  <v-card flat>
    <v-snackbar
      v-model="snackbar"
      absolute
      top
      right
      color="success"
    >
      <span>Brand Update successful!</span>
      <v-icon dark>check_circle</v-icon>
    </v-snackbar>
    <v-card-title>
          <span class="headline">Edit Brand</span>
        </v-card-title>
    <form @submit.prevent="onSaveChange">
      <v-container grid-list-xl fluid>
        <v-layout wrap>
          <v-flex xs12>
            <v-text-field
              v-model="Brand.BrandName"
              :rules="[BrandIsDuplicate]"
              color="purple darken-2"
              label="Brand Name"
              type="text"
              autofocus
              required
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="teal" flat @click="Brands"><v-icon dark left>arrow_back</v-icon></v-btn>
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
      editedBrand: Object
    },
    data () {
      const blankBrand = Object.freeze({
        BrandName: '',
        Status: true
      })

      return {
        Brand: Object.assign({}, blankBrand),
        snackbar: false,
        blankBrand,
        EditBrandDialog: false
      }
    },

    computed: {
      formIsValid () {
        return (
          this.Brand.BrandName &&
          this.BrandIsDuplicate === ''
        )
      },
      BrandIsDuplicate () {
        if (this.Brand.BrandName.trim()) {
          var BrandHasDuplicate = this.$store.getters['Brands/getDuplicateBrand'](this.Brand.BrandName.trim())
          return BrandHasDuplicate && BrandHasDuplicate.id !== this.Brand.id ? 'Brand already exist' : ''
        }
        return true
      }
    },

    methods: {
      onSaveChange () {
        this.snackbar = true
        this.$store.dispatch('Brands/onSavingChangeBrand', this.Brand)
        setTimeout(() => {
          this.snackbar = false
          this.EditBrandDialog = false
          this.Brand = Object.assign({}, this.blankBrand)
        }, 1000)
      },
      Brands () {
        this.$router.push('/Brands')
        this.EditBrandDialog = false
      },
      editBrand (editedBrand) {
        this.Brand = Object.assign({}, editedBrand)
        this.EditBrandDialog = true
      }
    }
  }
</script>