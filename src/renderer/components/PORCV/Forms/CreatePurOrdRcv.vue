<template>
<v-container>
<!-- PO Information -->
<v-layout justify-left align-left>
  <v-flex xs12 sm4>
    <p>Order Receive No: <span v-if="getPORInfo.id !== undefined">{{getPORInfo.id}}</span><span v-else>{{getPORInfo.PRN}}</span></p>
  </v-flex>
  <v-flex xs12 sm4>
   <p>Receive Date: {{getPORInfo.PORDate | date}}</p>
  </v-flex>
</v-layout>
<v-divider></v-divider>
<v-layout row>
  <v-flex xs12 sm4>
      <v-select
               :items="getPONs"
                dense
                v-model="PurOrdRcv.PON"
                item-text="id"
                item-value="id"
                label="Select PON"
                @change="getPOitems"
                required></v-select>
  </v-flex>
</v-layout>
<v-divider></v-divider>
<!-- PO Product Information -->
<v-layout row>
 <v-flex xs12>
<div style="overflow-x:auto;">
  <v-data-table
  :headers="POHeaders"
  :items="PORCartProducts"
  hide-actions
  class="elevation-1">
  <template slot="items" slot-scope="props">
    <tr>
    <td>{{props.item.title}}</td>
    <td class="text-xs-right">{{props.item.PurchasePrice | currency}}</td>
    <td class="text-xs-right">{{props.item.quantity}}</td>
    <td class="text-xs-right">{{props.item.quantity * props.item.PurchasePrice | currency}}</td>
    <td class="text-sm-left layout px-0">
    <takingSlNo :item="props.item"></takingSlNo>
  </td>
  </tr>
  </template>
  <template slot="footer">
    <tr>
      <th class="text-xs-right">Receive Total </th>
      <th></th>
      <th class="text-xs-right">{{PORCartTotalqty}}</th>
      <th class="text-xs-right">{{PORCartTotal | currency}}</th>
      <th></th>
    </tr>
    <tr>
      <th class="text-xs-right">Paid Amount(
        <input type="text" style="text-align:center;" v-model.number="PurOrdRcv.PaidAmt" maxlength="9" size="5" value="0" required>)
      </th>
      <td></td>
      <td></td>
      <th class="text-xs-right">
        {{PurOrdRcv.PaidAmt | currency}}
      </th>
      <td></td>
    </tr>
  </template>
  </v-data-table>
</div>
</v-flex>
</v-layout>
<v-layout align-left>
<v-flex xs12 sm3>
 <v-btn depressed small color="teal" flat @click="onSavePOR">Save</v-btn>
</v-flex>
<v-flex xs12 sm3>
 <v-btn depressed small color="teal" flat @click="CancelPurOrdRcv">Cancel</v-btn>
</v-flex>
</v-layout>
</v-container>
</template>

<script>
import takingSlNo from '../.././Shared/takingSlNoDialog'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      PurOrdRcv: {
        PON: '',
        Status: '',
        PaidAmt: 0
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
        {text: 'Product Description', align: 'left', value: 'title'},
        {text: 'Unit Price', align: 'right', value: 'PurchasePrice'},
        {text: 'Quantity', align: 'right', value: 'quantity'},
        {text: 'Unit Total', align: 'right', value: 'title'},
        {text: 'Actions', align: 'center', value: 'title'}
      ]
    }
  },

  computed: {
    ...mapGetters('PurOrdRcvs', {
      PORCartProducts: 'getPORCartProducts',
      PORCartTotal: 'PORCartTotal',
      PORCartTotalqty: 'PORCartTotalqty'
    }),
    getPONs () {
      this.PurOrdRcv.PaidAmt = this.PORCartTotal
      return this.$store.getters['PurOrds/getPONs']
    },
    getPORInfo () {
      this.PurOrdRcv.PON = this.$store.getters['PurOrdRcvs/getPORInfo'].PON
      return this.$store.getters['PurOrdRcvs/getPORInfo']
    },
    products () {
      return this.$store.getters['Products/getProducts']
    },
    ProductsWithItemAndBrand () {
      return this.$store.getters['Products/getProductsWithItemAndBrand']
    }
    // SupplierId () {
    //   return this.$store.getters['PurOrds/getPurOrds'].find(por => por.id === this.PurOrdRcv.PON).SupplierId
    // }
  },

  methods: {
    getPOitems (PON) {
      this.$store.dispatch('PurOrdRcvs/gettingPOitems', this.PurOrdRcv.PON)
    },
    onSavePOR () {
      if (this.getPORInfo.StockQty === undefined || this.getPORInfo.StockQty === this.PORCartTotalqty) {
        var PORInfo = {}
        if (this.getPORInfo.id !== undefined) {
          PORInfo.PRN = this.getPORInfo.id
        } else {
          PORInfo.PRN = this.getPORInfo.PRN
        }
        PORInfo.PORDate = this.getPORInfo.PORDate
        PORInfo.PON = this.PurOrdRcv.PON
        PORInfo.PORCartTotalqty = this.PORCartTotalqty
        PORInfo.PORCartTotal = this.PORCartTotal
        PORInfo.PaidAmt = this.PurOrdRcv.PaidAmt
        // PORInfo.SupplierId = this.SupplierId
        if (this.PurOrdRcv.PON) {
          this.$store.dispatch('PurOrdRcvs/onSavingPurOrdRcv', PORInfo)
          this.$store.dispatch('PurOrdRcvs/StoreInStock', PORInfo.PRN)
          this.$router.push({name: 'ViewReceive', params: { PORInfo: this.getPORInfo }})
          setTimeout(() => {
            this.$store.dispatch('PurOrdRcvs/setPORInfo', null)
            this.$store.dispatch('PurOrdRcvs/setPORCartProducts', [])
          }, 500)
        } else {
          alert('Select PON')
          return ''
        }
        // this.$router.push('/PurOrdRcvs')
      } else {
        alert('Not Editable! Few product already sale out.')
        this.$router.push('/PurOrdRcvs')
        this.$store.dispatch('PurOrdRcvs/setPORInfo', null)
        this.$store.dispatch('PurOrdRcvs/setPORCartProducts', [])
      }
    },
    CancelPurOrdRcv () {
      this.$store.dispatch('PurOrdRcvs/DeletingReceived', this.getPORInfo)
      setTimeout(() => {
        this.$store.dispatch('PurOrdRcvs/setPORInfo', null)
        this.$store.dispatch('PurOrdRcvs/setPORCartProducts', [])
      }, 500)
      this.$router.push('/purordRcvs')
    },
    decrementProductFromPOCart (product) {
      this.$store.dispatch('PurOrdRcvs/removeProductFromPOCart', product)
    },
    editPOCartProduct (product) {
      this.editedProductId = product.ProductId
      this.editProductToPOCart.ProductId = product.ProductId
      this.editProductToPOCart.editedProductPrice = product.PurchasePrice
      this.editProductToPOCart.editedProductqty = product.quantity
    },
    onSubmittingEditedProductToPOCart () {
      this.$store.dispatch('PurOrdRcvs/onSubmittedEditedProductToPOCart', this.editProductToPOCart)
      this.editedProductId = ''
    }
  },
  components: {takingSlNo}
}
</script>
