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
            v-model="Sales.BuyerId"
            :items="Buyers"
            item-text="BuyerName"
            item-value="id"
            dense
            label="Select Buyer"
          ></v-autocomplete>
  </v-flex>
  <v-flex xs12 sm4>
    <span><CreateBuyer></CreateBuyer></span>
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
<!-- Sales Information -->
<v-layout justify-left align-left>
  <v-flex xs12 sm4>
    <p>Invoice No: <span v-if="getInvInfo.id !== undefined">{{getInvInfo.id}}</span><span v-else>{{getInvInfo.INV}}</span></p>
  </v-flex>
  <v-flex xs12 sm4>
   <p>Date: {{getInvInfo.InvDate | date}}</p>
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
      <td class="text-xs-center">{{product.quantity}}</td>
      <td class="text-xs-right">{{product.MRP | currency}}</td>
      <td class="text-xs-right">{{product.quantity * product.MRP | currency}}</td>
    </tr>
    <tr>
      <th></th><th></th><th class="text-xs-right">Invoice Total </th><th class="text-xs-right">{{InvCartTotal | currency}}</th>
    </tr>
    <tr>
      <th></th><th></th>
      <th class="text-xs-right">Disc.(
        <input type="text" v-model="Sales.Disc" maxlength="2" size="1" value="0" style="text-align:center;">
      )% </th>
      <th class="text-xs-right">{{DiscountedTk | currency}}</th>
    </tr>
    <tr>
      <th></th><th></th>
      <th class="text-xs-right">VAT(
        <input type="text" v-model="Sales.Vat" maxlength="2" size="1" value="0" style="text-align:center;">
      )% </th>
      <th class="text-xs-right">{{VatTk | currency}}</th>
    </tr>
    <tr>
      <th></th><th></th><th class="text-xs-right">Net Total </th><th class="text-xs-right">{{NetTotal | currency}}</th>
    </tr>
    <tr>
      <th></th><th></th><th class="text-xs-right">Received(<input type="text" style="text-align:center;" v-model.number="Sales.CollectedTk" maxlength="9" size="5" value="NetTotal" required>)</th>
      <th class="text-xs-right">
        {{Sales.CollectedTk | currency}}
      </th>
    </tr>
  </table>
</div>
</v-flex>
</v-layout>
<v-layout align-left>
<v-flex xs12 sm3>
 <v-btn depressed small color="teal" flat @click="SaveSalesItem">Save</v-btn>
</v-flex>
<v-flex xs12 sm3>
 <v-btn depressed small color="teal" flat @click="CancelInvoice">Cancel</v-btn>
</v-flex>
</v-layout>
</v-container>
</template>

<script>
import CreateBuyer from '../.././Buyers/Forms/CreateBuyer'
import SlNos from '../.././Shared/SlNos'
import _ from 'lodash'
export default {
  data () {
    return {
      Sales: {
        INV: '',
        BuyerId: '',
        Disc: 0,
        Vat: 0,
        CollectedTk: 0
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
      return this.$store.getters['Sales/getSummationProductsFromCart']
    },
    Buyers () {
      return this.$store.getters['Buyers/getBuyers']
    },
    getInvInfo () {
      this.Sales.INV = this.$store.getters['Sales/getInvInfo'].id
      return this.$store.getters['Sales/getInvInfo']
    },
    ProductsWithItemAndBrandAndStocks () {
      return _.sortBy(this.$store.getters['Products/getProductsWithStocksAndPurchasePrice'], ['title', 'PurchasePrice'])
    },
    InvCartTotal () {
      return this.$store.getters['Sales/InvCartTotal']
    },
    InvCartTotalqty () {
      return this.$store.getters['Sales/InvCartTotalqty']
    },
    DiscountedTk () {
      return Math.round(this.InvCartTotal * this.Sales.Disc / 100)
    },
    VatTk () {
      return Math.round(this.InvCartTotal * this.Sales.Vat / 100)
    },
    NetTotal () {
      this.Sales.CollectedTk = (this.InvCartTotal + this.VatTk) - this.DiscountedTk
      return (this.InvCartTotal + this.VatTk) - this.DiscountedTk
    }
  },

  methods: {
    SaveSalesItem () {
      if (this.InvCartTotal >= 1) {
        var InvInfo = {}
        InvInfo.BuyerId = this.Sales.BuyerId
        InvInfo.id = this.getInvInfo.id
        InvInfo.InvDate = this.getInvInfo.InvDate
        InvInfo.DiscountedTk = this.DiscountedTk
        InvInfo.VatTk = this.VatTk
        InvInfo.InvCartTotalqty = this.InvCartTotalqty
        InvInfo.InvCartTotal = this.InvCartTotal
        InvInfo.CollectedTk = this.Sales.CollectedTk
        if (this.Sales.BuyerId) {
          this.$store.dispatch('Sales/SavingSalesItem', InvInfo)
          this.$router.push({name: 'ViewInvoice', params: { Invoice: InvInfo }})
        } else {
          alert('Select Buyer')
          return ''
        }
        // this.$router.push('/sales')
      } else {
        alert('Cart Empty')
      }
    },
    CancelInvoice () {
      this.$store.dispatch('Sales/DeletingInvoice', this.getInvInfo)
      this.$router.push('/sales')
    },
    addProductToCart (product) {
      if (product.SlNos && product.SlNos.length > 0) {
        this.$router.push({name: 'SlNos', params: { product: product, WhereFrom: 0 }})
      } else {
        this.$store.dispatch('Sales/addingProductToCart', product)
      }
    },
    decrementProductFromCart (product) {
      if (product.SlNos && product.SlNos.length > 0) {
        // redirect to slnos
        this.$router.push({name: 'RemoveSlNoFromCart', params: { product: product, WhereFrom: 0 }})
      } else {
        // decrementing from cart quantity
        this.$store.dispatch('Sales/decrementingProductFromCart', product)
      }
    },
    SearchInStock () {
      if (this.SearchBySlNo.length >= 8) {
        this.$store.dispatch('Sales/SearchingInStock', this.SearchBySlNo)
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
    CreateBuyer
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