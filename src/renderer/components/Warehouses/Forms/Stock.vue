<template>
	<v-container>
    <v-app id="inspire">
    <v-layout row justify-center>
      <v-card width="550px" id="Printarea">
        <v-card-title class="justify-center pa-0 ma-0">
        <div>
          <app-company-header></app-company-header>
          <h4 class="headline"><font face="Bahnschrift Condensed">Stock List as on {{StockDate | date}}</font></h4>
        </div>
      </v-card-title>
      <v-divider></v-divider>
	<v-data-table
    :headers="StockHeader"
    :items="getProductsWithStocks"
    hide-actions
    class="elevation-1"
  >
    <template slot="items" slot-scope="props">
      <td>{{ props.item.title }}</td>
      <td class="text-xs-right">{{ props.item.quantity }}</td>
      <td class="text-xs-right">{{ props.item.PurchasePrice | currency }}</td>
      <td class="text-xs-right">{{ props.item.MRP | currency }}</td>
    </template>
    <template slot="footer">
      <td class="text-xs-left">Total</td>
      <td class="text-xs-right">{{StockTotalqty}}</td>
      <td class="text-xs-right">{{StockPurchasePriceTotal | currency}}</td>
      <td class="text-xs-right">{{StockMRPTotal | currency}}</td>
    </template>
  </v-data-table>
</v-card>
<p @click="printInvoice('Printarea')"><v-btn icon flat>
      <v-icon small color="teal">print</v-icon>
      </v-btn></p>
</v-layout>
</v-app>
	</v-container>
</template>
<script>
// import html2canvas from 'html2canvas'
import JsPDF from 'jspdf'
import _ from 'lodash'
export default {
  data () {
    return {
      StockHeader: [
        {text: 'Product Description', value: 'title', align: 'left'},
        {text: 'Stock', value: 'quantity', align: 'center'},
        {text: 'Purchase Price', value: 'PurchasePrice', align: 'center'},
        {text: 'MRP', value: 'MRP', align: 'center'}
      ]
    }
  },
  computed: {
    getProductsWithStocks () {
      return _.sortBy(this.$store.getters['Products/getProductsWithStocksAndPurchasePrice'], ['title', 'PurchasePrice'])
    },
    StockDate () {
      return new Date()
    },
    StockPurchasePriceTotal () {
      return this.$store.getters['Products/StockPurchasePriceTotal']
    },
    StockMRPTotal () {
      return this.$store.getters['Products/StockMRPTotal']
    },
    StockTotalqty () {
      return this.$store.getters['Products/StockTotalqty']
    },
    getCompany () {
      return this.$store.getters['Company/getCompany']
    },
    User () {
      return this.$store.getters['Users/getUser'].fullname
    }
  },
  methods: {
    printInvoice (Printarea) {
      // html2canvas(document.querySelector('#Printarea')).then(
      //   canvas => {
      //     var image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
      //     var imgWidth = 210
      //     var pageHeight = 295
      //     var imgHeight = canvas.height * imgWidth / canvas.width
      //     var heightleft = imgHeight
      //     var doc = new JsPDF()
      //     var position = 0
      //     doc.addImage(image, 'JPEG', 0, position, imgWidth, imgHeight)
      //     heightleft -= pageHeight
      //     while (heightleft >= 0) {
      //       position = heightleft - imgHeight
      //       doc.addPage()
      //       doc.addImage(image, 'JPEG', 0, position, imgWidth, imgHeight)
      //       heightleft -= pageHeight
      //     }
      //     doc.save('Stocks ' + new Date().toISOString() + '.pdf')
      //   })
      var vm = this
      var columns = [
        {title: 'Product Description', dataKey: 'title'},
        {title: 'Stock', dataKey: 'quantity'},
        {title: 'Purchase Price', dataKey: 'PurchasePrice'},
        {title: 'MRP', dataKey: 'MRP'}
      ]
      var doc = new JsPDF()
      var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight()
      var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth()
      var pageContent = function () {
        doc.setFont('Times')
        doc.setFontType('italic')
        doc.setFontSize(20)
        doc.text(vm.getCompany.ComName, pageWidth / 2, pageHeight - 287, 'center')
        doc.setFont('times')
        doc.setFontType('normal')
        doc.setFontSize(12)
        doc.text(vm.getCompany.Addr, pageWidth / 2, pageHeight - 282, 'center')
        doc.text('Tel: ' + vm.getCompany.Tel + ',' + ' Cell: ' + vm.getCompany.Mobile, pageWidth / 2, pageHeight - 277, 'center')
        doc.line(10, 23, pageWidth - 15, 23)
        doc.setFont('Times')
        doc.setFontType('normal')
        doc.setFontSize(16)
        doc.text('Stock List as on ' + new Date().toISOString(), pageWidth / 2, pageHeight - 268, 'center')
      }
      doc.autoTable(columns, vm.getProductsWithStocks, {
        didDrawPage: pageContent,
        margin: {left: 10, top: 40}
      })
      let finalY = doc.autoTable.previous.finalY
      doc.setFont('times')
      doc.setFontType('normal')
      doc.setFontSize(12)
      doc.text(pageWidth / 2 - 20, finalY + 5, 'Total' + '  ' + vm.StockTotalqty + '             ' + vm.StockPurchasePriceTotal + '                               ' + vm.StockMRPTotal)
      doc.line(pageWidth / 2 + 10, finalY + 25, pageWidth - 15, finalY + 25)
      doc.text('Printed By ' + vm.User, pageWidth / 2 + 50, finalY + 30, 'center')
      doc.save('Stocks ' + new Date().toISOString() + '.pdf')
    }
  }
}
</script>