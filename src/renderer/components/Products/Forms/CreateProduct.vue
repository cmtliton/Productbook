<template>
  <v-layout row justify-center>
     <v-dialog v-model="ProductDialog" persistent max-width="500px">
      <v-btn slot="activator" color="teal" dark>Create Product</v-btn>
  <v-card flat>
    <v-snackbar
      v-model="snackbar"
      absolute
      top
      right
      color="success"
    >
      <span>Product Creation successful!</span>
      <v-icon dark>check_circle</v-icon>
    </v-snackbar>
    <v-card-title>
          <span class="headline">Create Product</span>
        </v-card-title>
    <form @submit.prevent="onSave">
      <v-container grid-list-xl fluid>
        <v-layout wrap>
          <v-flex xs12 sm6>
            <v-autocomplete
                :items="Items"
                dense
                v-model="Product.ItemId"
                item-text="ItemName"
                item-value="id"
                label="Select Item"
                required
              ></v-autocomplete>
          </v-flex>
          <v-flex xs12 sm6>
            <v-autocomplete
                :items="Brands"
                dense
                v-model="Product.BrandId"
                item-text="BrandName"
                item-value="id"
                label="Select Brand"
                required
              ></v-autocomplete>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field
              v-model="Product.ProductName"
              :rules="[ProductIsDuplicate]"
              color="teal"
              label="Product Name"
              type="text"
              required
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
                <v-text-field
                v-model="Product.ProductCode"
                color="teal"
                label="Product Code"
                type="text"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                v-model="Product.PurchasePrice"
                color="teal"
                label="Purchase Price"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                v-model="Product.MRP"
                color="teal"
                label="MRP"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                v-model="Product.Warranty"
                color="teal"
                label="Warranty"
                type="text"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                v-model="Product.MeasuringUnit"
                color="teal"
                label="Measuring Unit"
                type="text"
                ></v-text-field>
              </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="teal" flat @click="Products"><v-icon dark left>arrow_back</v-icon></v-btn>
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
      const blankProduct = Object.freeze({
        ItemId: '',
        BrandId: '',
        ProductName: '',
        ProductCode: '',
        PurchasePrice: 0,
        MRP: 0,
        Warranty: '',
        MeasuringUnit: 'Pcs',
        Status: true
      })

      return {
        Product: Object.assign({}, blankProduct),
        snackbar: false,
        blankProduct,
        ProductDialog: false
      }
    },

    computed: {
      formIsValid () {
        return (
          this.Product.ProductName &&
          this.Product.ItemId &&
          this.Product.BrandId &&
          this.ProductIsDuplicate === ''
        )
      },
      ProductIsDuplicate () {
        return this.$store.getters['Products/getDuplicateProduct'](this.Product.ProductName.trim()) ? 'Product already exist' : ''
      },
      Brands () {
        return this.$store.getters['Brands/getBrands']
      },
      Items () {
        return this.$store.getters['Items/getItems']
      }
    },

    methods: {
      onSave () {
        this.snackbar = true
        this.$store.dispatch('Products/onSavingProduct', this.Product)
        setTimeout(() => {
          this.snackbar = false
          this.ProductDialog = false
          this.Product = Object.assign({}, this.blankProduct)
        }, 1000)
      },
      Products () {
        this.$router.push('/Products')
        this.ProductDialog = false
      }
    }
  }
</script>