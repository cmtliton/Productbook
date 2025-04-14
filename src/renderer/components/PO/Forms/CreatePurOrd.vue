<template>
<v-container grid-list-sm>
  <!-- Product list -->
<v-layout row wrap>
  <v-flex xs12>
    <app-product-list :products="ProductsWithItemAndBrand" @iAmFromProduct="addProductToPOCart"></app-product-list>
  </v-flex>
</v-layout>
<!-- PO Information -->
<v-layout justify-left align-left>
  <v-flex xs12 sm4>
    <p>PO No: {{getPOInfo.id}}</p>
  </v-flex>
  <v-flex xs12 sm4>
   <p>PO Date: {{getPOInfo.PODate | date}}</p>
  </v-flex>
</v-layout>
<v-divider></v-divider>
<v-layout row>
  <v-flex xs12 sm4>
      <v-select
                :items="Suppliers"
                dense
                v-model="PurOrd.SupplierId"
                item-text="SupplierName"
                item-value="id"
                label="Select Supplier"
                required></v-select>
  </v-flex>
  <v-flex xs12 sm4>
    <CreateSupplier></CreateSupplier>
  </v-flex>
</v-layout>
<v-divider></v-divider>
<!-- PO Product Information -->
<v-layout row v-show="PurOrd.SupplierId">
 <v-flex xs12>
  <div style="overflow-x:auto;">
  <table>
    <tr>
      <th 
      :class="[header.text === 'Product Description' ? 'text-xs-left' : 'text-xs-right']"
      v-for="header in POHeaders">{{header.text}}</th>
    </tr>
    <tr v-for="product in POCartProducts" :key="product.ProductId" @click="editPOCartProduct(product)">
      <td class="text-xs-left">{{product.title}}</td>
      <td class="text-xs-right" v-if="editedProductId == product.ProductId">
      <input class="text-xs-right" 
      @blur="onSubmittingEditedProductToPOCart"
      @keyup.enter="onSubmittingEditedProductToPOCart" 
      v-model.number="editProductToPOCart.editedProductPrice" type="number">
      </td>
      <td class="text-xs-right text-sm-right" v-else>{{product.PurchasePrice | currency}}</td>
      <td class="text-xs-right" v-if="editedProductId == product.ProductId"
      @dblclick="decrementProductFromPOCart(product)">
      <input class="text-xs-right" 
      @blur="onSubmittingEditedProductToPOCart"
      @keyup.enter="onSubmittingEditedProductToPOCart" 
      v-model.number="editProductToPOCart.editedProductqty" type="number">
      </td>
      <td class="text-xs-right" v-else>{{product.quantity}}</td>
      <td class="text-xs-right">{{product.quantity * product.PurchasePrice | currency}}</td>
    </tr>
    <tr>
      <th class="text-xs-right">Purchase Total</th><th></th><th class="text-xs-right">{{POCartTotalqty}}</th><th class="text-xs-right">{{POCartTotal | currency}}</th>
    </tr>
  </table>
</div>
</v-flex>
</v-layout>
<v-layout align-left>
<v-flex xs12 sm3>
 <v-btn depressed small color="teal" flat @click="onSavePO">Save</v-btn>
</v-flex>
<v-flex xs12 sm3>
 <v-btn depressed small color="teal" flat @click="CancelPurOrd">Cancel</v-btn>
</v-flex>
</v-layout>
</v-container>
</template>

<script>
import CreateSupplier from '../.././Suppliers/Forms/CreateSupplier'
export default {
  data () {
    return {
      PurOrd: {
        SupplierId: ''
      },
      editProductToPOCart: {
        ProductId: '',
        editedProductPrice: '',
        editedProductqty: ''
      },
      editedProductId: '',
      snackbar: false,
      snackColor: '',
      snackText: '',
      POHeaders: [
        {text: 'Product Description', value: 'title', align: 'left'},
        {text: 'Unit Price', value: 'PurchasePrice', align: 'right'},
        {text: 'Quantity', value: 'quantity', align: 'right'},
        {text: 'Unit Total', value: 'Tprice', align: 'right'}
      ]
    }
  },

  computed: {
    POCartProducts () {
      return this.$store.getters['PurOrds/getPOCartProducts']
    },
    Suppliers () {
      return this.$store.getters['Suppliers/getSuppliers']
    },
    getPOInfo () {
      return this.$store.getters['PurOrds/getPOInfo']
    },
    products () {
      return this.$store.getters['Products/getProducts']
    },
    ProductsWithItemAndBrand () {
      return this.$store.getters['Products/getProductsWithItemAndBrand']
    },
    POCartTotal () {
      return this.$store.getters['PurOrds/POCartTotal']
    },
    POCartTotalqty () {
      return this.$store.getters['PurOrds/POCartTotalqty']
    }
  },
  components: { CreateSupplier },

  methods: {
    onSavePO () {
      this.snackbar = true
      var POInfo = {}
      POInfo.PON = this.getPOInfo.id
      POInfo.PODate = this.getPOInfo.PODate
      POInfo.SupplierId = this.PurOrd.SupplierId
      POInfo.POCartTotal = this.POCartTotal
      if (this.PurOrd.SupplierId) {
        this.$store.dispatch('PurOrds/onSavingPurOrd', POInfo)
        this.$router.push({name: 'ViewOrder', params: { PON: POInfo.PON }})
      } else {
        alert('Select Supplier')
        return ''
      }
      // this.$router.push('/PurOrds')
    },
    CancelPurOrd () {
      this.$store.dispatch('PurOrds/PurOrdRemove', this.getPOInfo)
      this.$router.push('/purords')
    },
    addProductToPOCart (product) {
      this.$store.dispatch('PurOrds/addProductToPOCart', product)
    },
    deleteProductFromPOCart (item) {
      alert('Iam ' + item)
    },
    decrementProductFromPOCart (product) {
      this.$store.dispatch('PurOrds/removeProductFromPOCart', product)
    },
    editPOCartProduct (product) {
      this.editedProductId = product.ProductId
      this.editProductToPOCart.ProductId = product.ProductId
      this.editProductToPOCart.editedProductPrice = product.PurchasePrice
      this.editProductToPOCart.editedProductqty = product.quantity
    },
    onSubmittingEditedProductToPOCart () {
      this.$store.dispatch('PurOrds/onSubmittedEditedProductToPOCart', this.editProductToPOCart)
      this.editedProductId = ''
    }
  },
  created () {
    this.PurOrd.SupplierId = this.getPOInfo.SupplierId
    if (this.getPOInfo.Disc) {
      this.PurOrd.Disc = this.getPOInfo.Disc
    }
  }
}
</script>
<style scope>
table {
    border-collapse: collapse;
    width: 100%;
}

th, td {
    text-align: left;
    padding: 0px;
}

tr:nth-child(even){background-color: #ffffff}
</style>