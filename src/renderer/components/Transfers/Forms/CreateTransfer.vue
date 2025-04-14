<template>
<v-container grid-list-sm>
  <v-layout row wrap>
  <v-flex xs12>
    <app-product-list :products="ProductsWithItemAndBrandAndStocks" @iAmFromProduct="addProductToCart"></app-product-list>
  </v-flex>
</v-layout>
  <v-layout justify-left align-left>
  <v-flex xs12 sm4>
    <v-autocomplete
            v-model="Transfers.WarehouseId"
            :items="Warehouses"
            item-text="WarehouseName"
            item-value="id"
            dense
            label="Transfer In"
          ></v-autocomplete>
  </v-flex>
  <v-flex xs12 sm4>
    <span><CreateWarehouse></CreateWarehouse></span>
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
<!-- Transfers Information -->
<v-layout justify-left align-left>
  <v-flex xs12 sm4>
    <p>Transfer No: <span v-if="getTrnInfo.id !== undefined">{{getTrnInfo.id}}</span><span v-else>{{getTrnInfo.Trn}}</span></p>
  </v-flex>
  <v-flex xs12 sm4>
   <p>Date: {{getTrnInfo.TrnDate | date}}</p>
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
      <th class="text-xs-left">Transfer Total </th><th class="text-xs-right">{{TrnCartTotalqty}}</th><th></th><th class="text-xs-right">{{TrnCartTotal | currency}}</th>
    </tr>
  </table>
</div>
</v-flex>
</v-layout>
<v-layout align-left>
<v-flex xs12 sm3>
 <v-btn depressed small color="teal" flat @click="SaveTransfersItem">Save</v-btn>
</v-flex>
<v-flex xs12 sm3>
 <v-btn depressed small color="teal" flat @click="CancelTransfer">Cancel</v-btn>
</v-flex>
</v-layout>
</v-container>
</template>

<script>
import CreateWarehouse from '../.././Warehouses/Forms/CreateWarehouse'
import SlNos from '../.././Shared/SlNos'
import _ from 'lodash'
export default {
  data () {
    return {
      Transfers: {
        Trn: '',
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
      ]
    }
  },

  computed: {
    CartProducts () {
      return this.$store.getters['Transfers/getSummationProductsFromCart']
    },
    Warehouses () {
      return this.$store.getters['Warehouses/getWarehouses']
    },
    getTrnInfo () {
      this.Transfers.Trn = this.$store.getters['Transfers/getTrnInfo'].id
      return this.$store.getters['Transfers/getTrnInfo']
    },
    ProductsWithItemAndBrandAndStocks () {
      return _.sortBy(this.$store.getters['Products/getProductsWithStocksAndPurchasePrice'], ['title', 'PurchasePrice'])
    },
    TrnCartTotal () {
      return this.$store.getters['Transfers/TrnCartTotal']
    },
    TrnCartTotalqty () {
      return this.$store.getters['Transfers/TrnCartTotalqty']
    },
    NetTotal () {
      return Math.round(this.TrnCartTotal)
    }
  },

  methods: {
    SaveTransfersItem () {
      if (this.TrnCartTotal >= 1) {
        var TrnInfo = {}
        TrnInfo.WarehouseId = this.Transfers.WarehouseId
        TrnInfo.id = this.getTrnInfo.id
        TrnInfo.TrnDate = this.getTrnInfo.TrnDate
        TrnInfo.TrnCartTotalqty = this.TrnCartTotalqty
        TrnInfo.TrnCartTotal = this.TrnCartTotal
        if (this.Transfers.WarehouseId) {
          this.$store.dispatch('Transfers/SavingTransfersItem', TrnInfo)
          this.$router.push({name: 'ViewTransfer', params: { Transfer: TrnInfo }})
        } else {
          alert('Select Warehouse')
          return ''
        }
        // this.$router.push('/Transfers')
      } else {
        alert('Cart Empty')
      }
    },
    CancelTransfer () {
      this.$store.dispatch('Transfers/DeletingTransfer', this.getTrnInfo)
      this.$router.push('/stocktransfer')
    },
    addProductToCart (product) {
      if (product.SlNos && product.SlNos.length > 0) {
        this.$router.push({name: 'SlNos', params: { product: product, WhereFrom: 1 }})
      } else {
        this.$store.dispatch('Transfers/addingProductToCart', product)
      }
    },
    decrementProductFromCart (product) {
      if (product.SlNos && product.SlNos.length > 0) {
        // redirect to slnos
        this.$router.push({name: 'RemoveSlNoFromCart', params: { product: product, WhereFrom: 1 }})
      } else {
        // decrementing from cart quantity
        this.$store.dispatch('Transfers/decrementingProductFromCart', product)
      }
    },
    SearchInStock () {
      if (this.SearchBySlNo.length >= 8) {
        this.$store.dispatch('Transfers/SearchingInStock', this.SearchBySlNo)
        setTimeout(() => {
          this.SearchBySlNo = ''
        }, 500)
      } else {
        this.SearchBySlNo = ''
      }
    }
  },
  components: {
    SlNos,
    CreateWarehouse
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