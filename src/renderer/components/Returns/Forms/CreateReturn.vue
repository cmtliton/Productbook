<template>
<v-container grid-list-sm>
  <v-layout row wrap v-show="ProductsWithItemAndBrandAndStocks.length > 0">
  <v-flex xs12>
    <app-product-list :products="ProductsWithItemAndBrandAndStocks" @iAmFromProduct="addProductToCart"></app-product-list>
  </v-flex>
</v-layout>
  <v-layout justify-left align-left>
  <v-flex xs12 sm4>
    <v-autocomplete
            v-model="Returns.WarehouseId"
            :items="Warehouses"
            item-text="WarehouseName"
            item-value="id"
            dense
            label="Return From"
            @change="getItemFromWarehouses"
          ></v-autocomplete>
  </v-flex>
  <v-spacer></v-spacer>
  <v-flex xs12 sm4>
     <v-text-field
        v-model="SearchBySlNo"
        append-icon="search"
        label="Barcode Scanning"
        single-line
        hide-details
        required autofocus
        @keyup.enter ="SearchInStock"
      ></v-text-field>
  </v-flex>
</v-layout>
<v-divider></v-divider>
<!-- Returns Information -->
<v-layout justify-left align-left>
  <v-flex xs12 sm4>
    <p>Return No: <span v-if="getRtnInfo.id !== undefined">{{getRtnInfo.id}}</span><span v-else>{{getRtnInfo.Rtn}}</span></p>
  </v-flex>
  <v-flex xs12 sm4>
   <p>Date: {{getRtnInfo.RtnDate | date}}</p>
  </v-flex>
</v-layout>
<v-divider></v-divider>
<!-- PO Product Information -->
<v-layout row>
 <v-flex xs12>
  <div style="overflow-x:auto;">
  <table>
    <tr>
      <th :class="[header.text === 'Product Description' ? 'text-xs-left' : 'text-xs-right']"
      v-for="header in Headers">{{header.text}}</th>
    </tr>
    <tr v-for="product in CartProducts" :key="product.ProductId" @dblclick="decrementProductFromCart(product)">
      <td class="text-xs-left">{{product.title}}</td>
      <td class="text-xs-right">{{product.quantity}}</td>
      <td class="text-xs-right">{{product.PurchasePrice | currency}}</td>
      <td class="text-xs-right">{{product.quantity * product.PurchasePrice | currency}}</td>
    </tr>
    <tr>
      <th class="text-xs-left">Return Total </th><th class="text-xs-right">{{RtnCartTotalqty}}</th><th></th><th class="text-xs-right">{{RtnCartTotal | currency}}</th>
    </tr>
  </table>
</div>
</v-flex>
</v-layout>
<v-layout align-left>
<v-flex xs12 sm3>
 <v-btn depressed small color="teal" flat @click="SaveReturnsItem">Save</v-btn>
</v-flex>
<v-flex xs12 sm3>
 <v-btn depressed small color="teal" flat @click="CancelReturn">Cancel</v-btn>
</v-flex>
</v-layout>
</v-container>
</template>

<script>
import SlNos from '../.././Shared/SlNos'
import _ from 'lodash'
export default {
  data () {
    return {
      Returns: {
        Rtn: '',
        WarehouseId: ''
      },
      SearchBySlNo: '',
      snackbar: false,
      snackColor: '',
      snackText: '',
      Headers: [
        {text: 'Product Description'},
        {text: 'Quantity'},
        {text: 'Unit Price'},
        {text: 'Unit Total'}
      ],
      gottedFromWarehouses: []
    }
  },

  computed: {
    CartProducts () {
      if (this.$store.getters['Returns/getWarehouseIdFrmCart'] !== '') {
        this.Returns.WarehouseId = this.$store.getters['Returns/getWarehouseIdFrmCart']
      }
      return this.$store.getters['Returns/getSummationProductsFromCart']
    },
    Warehouses () {
      return this.$store.getters['Warehouses/getWarehouses']
    },
    getRtnInfo () {
      this.Returns.Rtn = this.$store.getters['Returns/getRtnInfo'].id
      return this.$store.getters['Returns/getRtnInfo']
    },
    ProductsWithItemAndBrandAndStocks () {
      return _.sortBy(this.$store.getters['Warehouses/getWarehousesItem'], ['title', 'PurchasePrice'])
    },
    RtnCartTotal () {
      return this.$store.getters['Returns/RtnCartTotal']
    },
    RtnCartTotalqty () {
      return this.$store.getters['Returns/RtnCartTotalqty']
    },
    NetTotal () {
      return Math.round(this.RtnCartTotal)
    }
  },

  methods: {
    SaveReturnsItem () {
      if (this.RtnCartTotal >= 1) {
        var RtnInfo = {}
        RtnInfo.WarehouseId = this.Returns.WarehouseId
        RtnInfo.id = this.getRtnInfo.id
        RtnInfo.RtnDate = this.getRtnInfo.RtnDate
        RtnInfo.RtnCartTotalqty = this.RtnCartTotalqty
        RtnInfo.RtnCartTotal = this.RtnCartTotal
        if (this.Returns.WarehouseId) {
          this.$store.dispatch('Returns/SavingReturnsItem', RtnInfo)
          this.$router.push({name: 'ViewReturn', params: { Return: RtnInfo }})
        } else {
          alert('Select Warehouse')
          return ''
        }
        // this.$router.push('/Returns')
      } else {
        alert('Cart Empty')
      }
    },
    CancelReturn () {
      this.$store.dispatch('Returns/DeletingReturn', this.getRtnInfo)
      this.$router.push('/stockReturn')
    },
    addProductToCart (product) {
      if (product.SlNos && product.SlNos.length > 0) {
        this.$router.push({name: 'SlNos', params: { product: product, WhereFrom: 2 }})
      } else {
        this.$store.dispatch('Returns/addingProductToCart', {
          ...product,
          WarehouseId: this.Returns.WarehouseId
        })
      }
    },
    decrementProductFromCart (product) {
      if (product.SlNos && product.SlNos.length > 0) {
        // redirect to slnos
        this.$router.push({name: 'RemoveSlNoFromCart', params: { product: product, WhereFrom: 2 }})
      } else {
        // decrementing from cart quantity
        this.$store.dispatch('Returns/decrementingProductFromCart', product)
      }
    },
    SearchInStock () {
      if (this.SearchBySlNo.length >= 8) {
        this.$store.dispatch('Returns/SearchingStockInWarehouses', this.SearchBySlNo)
        setTimeout(() => {
          this.SearchBySlNo = ''
        }, 500)
      } else {
        this.SearchBySlNo = ''
      }
    },
    getItemFromWarehouses () {
      this.$store.dispatch('Returns/ClearingItemsInCart')
      this.$store.dispatch('Warehouses/gettingItemFromWarehouses', this.Returns.WarehouseId)
    }
  },
  components: {
    SlNos
  }
}
</script>
<style scoped>
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