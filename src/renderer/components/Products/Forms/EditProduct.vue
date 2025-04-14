<template>
  <v-layout row justify-center>
     <v-dialog v-model="EditProductDialog" persistent max-width="500px">
      <v-btn slot="activator" color="teal" flat icon
      @click="editProduct(editedProduct)"><v-icon color="teal" small>edit</v-icon></v-btn>
  <v-card flat>
    <v-snackbar
      v-model="snackbar"
      absolute
      top
      right
      color="success"
    >
      <span>Product Update successful!</span>
      <v-icon dark>check_circle</v-icon>
    </v-snackbar>
    <v-card-title>
          <span class="headline">Edit Product</span>
        </v-card-title>
    <form @submit.prevent="onSaveChange">
      <v-container grid-list-xl fluid>
        <v-layout wrap>
          <v-flex xs12 sm6>
            <v-select
                :items="Items"
                dense
                v-model="Product.ItemId"
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
                v-model="Product.BrandId"
                item-text="BrandName"
                item-value="id"
                label="Select Brand"
                required
              ></v-select>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field
              v-model="Product.ProductName"
              :rules="[ProductIsDuplicate]"
              color="purple darken-2"
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
      editedProduct: Object
    },
    data () {
      const blankProduct = Object.freeze({
        ProductName: '',
        ProductCode: '',
        PurchasePrice: 0,
        MRP: 0,
        Warranty: '',
        MeasuringUnit: 'Pcs',
        ItemId: '',
        BrandId: '',
        Status: true
      })

      return {
        Product: Object.assign({}, blankProduct),
        snackbar: false,
        blankProduct,
        EditProductDialog: false
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
        if (this.Product.ProductName.trim()) {
          var ProductHasDuplicate = this.$store.getters['Products/getDuplicateProduct'](this.Product.ProductName.trim())
          return ProductHasDuplicate && ProductHasDuplicate.id !== this.Product.id ? 'Product already exist' : ''
        }
        return true
      },
      Brands () {
        return this.$store.getters['Brands/getBrands']
      },
      Items () {
        return this.$store.getters['Items/getItems']
      }
    },

    methods: {
      onSaveChange () {
        this.snackbar = true
        this.$store.dispatch('Products/onSavingChangeProduct', this.Product)
        setTimeout(() => {
          this.snackbar = false
          this.EditProductDialog = false
          this.Product = Object.assign({}, this.blankProduct)
        }, 1000)
      },
      Products () {
        this.$router.push('/Products')
        this.EditProductDialog = false
      },
      editProduct (editedProduct) {
        this.Product = Object.assign({}, editedProduct)
        this.EditProductDialog = true
      }
    }
  }
</script>