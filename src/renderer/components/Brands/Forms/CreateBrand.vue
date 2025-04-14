<template>
  <v-layout row justify-center>
     <v-dialog v-model="BrandDialog" persistent max-width="400px">
      <v-btn slot="activator" color="teal" dark>Create Brand</v-btn>
  <v-card flat>
    <v-snackbar
      v-model="snackbar"
      absolute
      top
      right
      color="success"
    >
      <span>Brand Creation successful!</span>
      <v-icon dark>check_circle</v-icon>
    </v-snackbar>
    <v-card-title>
          <span class="headline">Create Brand</span>
        </v-card-title>
    <form @submit.prevent="onSave">
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
      const blankBrand = Object.freeze({
        BrandName: '',
        Status: true
      })

      return {
        Brand: Object.assign({}, blankBrand),
        snackbar: false,
        blankBrand,
        BrandDialog: false
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
        return this.$store.getters['Brands/getDuplicateBrand'](this.Brand.BrandName.trim()) ? 'Brand already exist' : ''
      }
    },

    methods: {
      onSave () {
        this.snackbar = true
        this.$store.dispatch('Brands/onSavingBrand', this.Brand)
        setTimeout(() => {
          this.snackbar = false
          this.BrandDialog = false
          this.Brand = Object.assign({}, this.blankBrand)
        }, 1000)
      },
      Brands () {
        this.$router.push('/Brands')
        this.BrandDialog = false
      }
    }
  }
</script>