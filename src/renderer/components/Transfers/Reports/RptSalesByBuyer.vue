<template>
	<v-container>
		<v-app id="inspire">
      <v-layout row justify-center>
      <v-dialog v-model="dialog" width="384px">
        <v-card id="Printarea">
          <v-card-text>
            <app-company-header></app-company-header>
            <hr/><hr/>
            <font size="1" face="Time new Roman" v-if="BuyerInfo !== undefined">
            <p class="text-xs-center pa-0 ma-0">{{BuyerInfo.BuyerName | charfilter}}</p>
            <p class="text-xs-center pa-0 ma-0">{{BuyerInfo.Address | charfilter}}</p>
            <p class="text-xs-center pa-0 ma-0">{{BuyerInfo.PhoneNumber}}</p>
            <p class="text-xs-center pa-0 ma-0">Sales Buyer Wise from {{datereport.d1 | date}} to {{datereport.d2 | date}}</p>
          </font>
          <font size="1" face="Time new Roman" v-else>
            <p class="text-xs-center pa-0 ma-0">Sales Summary from {{datereport.d1 | date}} to {{datereport.d2 | date}}</p>
          </font>
            <v-divider></v-divider>
            <div>
            <font size="1" face="Time new Roman">
            <table align="center" width="100%">
              <tr>
                <th 
                :class="[header.text === 'Description' ? 'text-xs-left' : 'text-xs-right']"
                v-for="header in Headers">{{header.text}}</th>
              </tr>
              <tr v-for="(product, index) in PrintProductSummary" :key="product.ProductId">
                <td class="text-xs-right">{{index+1}}</td>
                <td class="text-xs-left">{{product.title}}</td>
                <td class="text-xs-right">{{product.quantity}}</td>
                <td class="text-xs-right text-sm-right">{{product.MRP | currency}}</td>
              </tr>
              <tr>
                <td><hr></td><td><hr></td><td><hr></td><td><hr></td>
              </tr>
              <tr>
                <th></th>
                <th class="text-xs-left">Summary Total</th>
                <th class="text-xs-right">{{PrintProductSummaryTotalqty}}</th>
                <th class="text-xs-right text-sm-right">{{PrintProductSummaryTotal | currency}}</th>
              </tr>
              <tr>
                <td><hr></td><td><hr></td><td><hr></td><td><hr></td>
              </tr>
            </table>
          </font>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <p>
              <v-divider></v-divider>
              <font face="Time new Roman" size="1" @click="printInvoice('Printarea')">Print by {{User}}</font>
            </p>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-app>
	</v-container>
</template>

<script>
import _ from 'lodash'
export default {
  props: ['datereport'],
  data () {
    return {
      dialog: true,
      Headers: [
        {text: 'Sl', value: 'title', align: 'right'},
        {text: 'Description', value: 'title', align: 'left'},
        {text: 'Qty', value: 'quantity', align: 'right'},
        {text: 'Amount', value: 'MRP', align: 'right'}
      ]
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  computed: {
    SalesProductSummary () {
      return this.$store.getters['Sales/getSalesProductForReporting']
    },
    PrintProductSummary () {
      return this.SalesProductSummary.map(SalesPrd => {
        var product = this.$store.getters.getProductsWithItemAndBrand.find(prd => prd.ProductId === SalesPrd.ProductId)
        return {
          ProductId: product.ProductId,
          title: product.title,
          quantity: SalesPrd.quantity,
          MRP: SalesPrd.MRP
        }
      })
    },
    PrintProductSummaryTotalqty () {
      return _.sumBy(this.PrintProductSummary, product => { return product.quantity })
    },
    PrintProductSummaryTotal () {
      return _.sumBy(this.PrintProductSummary, product => { return product.MRP })
    },
    User () {
      return this.$store.getters.getUser.fullname
    },
    Buyers () {
      return this.$store.getters.getBuyers
    },
    BuyerInfo () {
      return this.Buyers.find(buyer => buyer.id === this.datereport.BuyerId)
    }
  },
  methods: {
    redirectToSales () {
      this.$router.push('/sales')
    },
    printInvoice (Printarea) {
      const prtHtml = document.getElementById('Printarea').innerHTML
      let stylesHtml = ''
      for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
        stylesHtml += node.outerHTML
      }
      const WinPrint = window.open('', '', 'top=0,width=384,toolbar=0,scrollbars=0,status=0')
      WinPrint.document.write(`<!DOCTYPE html>
      <html>
      <head>
      ${stylesHtml}
      </head>
      <body>
      ${prtHtml}
      </body>
      </html>`)
      WinPrint.document.close()
      WinPrint.focus()
      WinPrint.print()
      WinPrint.close()
    },
    close () {
      this.dialog = false
      this.$router.push('/salesreportingbybuyer')
    }
  }
}
</script>