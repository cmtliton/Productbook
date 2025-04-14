<template>
	<v-container>
		<v-app id="inspire">
      <v-layout row justify-center>
      <v-dialog v-model="dialog" width="384px">
        <v-card id="Printarea">
          <v-card-text>
            <app-company-header></app-company-header>
            <hr/><hr/>
            <font size="1" face="Time new Roman" v-if="SupplierInfo !== undefined">
            <p class="text-xs-center pa-0 ma-0">{{SupplierInfo.SupplierName | charfilter}}</p>
            <p class="text-xs-center pa-0 ma-0">{{SupplierInfo.Address | charfilter}}</p>
            <p class="text-xs-center pa-0 ma-0">{{SupplierInfo.PhoneNumber}}</p>
            <p class="text-xs-center pa-0 ma-0">Receives Supplier Wise from {{datereport.d1 | date}} to {{datereport.d2 | date}}</p>
          </font>
          <font size="1" face="Time new Roman" v-else>
            <p class="text-xs-center pa-0 ma-0">Receives Summary from {{datereport.d1 | date}} to {{datereport.d2 | date}}</p>
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
                <td class="text-xs-right">{{index+1}}.</td>
                <td class="text-xs-left">{{product.title}}</td>
                <td class="text-xs-right">{{product.quantity}}</td>
                <td class="text-xs-right text-sm-right">{{product.PurchasePrice | currency}}</td>
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
import JsPDF from 'jspdf'
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
    ReceivesProductSummary () {
      return this.$store.getters['PurOrdRcvs/getReceivesProductForReporting']
    },
    PrintProductSummary () {
      var sl = 1
      return this.ReceivesProductSummary.map(ReceivesPrd => {
        var product = this.$store.getters['Products/getProductsWithItemAndBrand'].find(prd => prd.ProductId === ReceivesPrd.ProductId)
        return {
          Sl: sl++,
          ProductId: product.ProductId,
          title: product.title,
          quantity: ReceivesPrd.quantity,
          PurchasePrice: ReceivesPrd.PurchasePrice,
          TPrice: ReceivesPrd.quantity * ReceivesPrd.PurchasePrice
        }
      })
    },
    PrintProductSummaryTotalqty () {
      return _.sumBy(this.PrintProductSummary, product => { return product.quantity })
    },
    PrintProductSummaryTotal () {
      return _.sumBy(this.PrintProductSummary, product => { return product.PurchasePrice })
    },
    User () {
      return this.$store.getters['Users/getUser'].fullname
    },
    Suppliers () {
      return this.$store.getters['Suppliers/getSuppliers']
    },
    SupplierInfo () {
      return this.Suppliers.find(supplier => supplier.id === this.datereport.SupplierId)
    },
    getCompany () {
      return this.$store.getters['Company/getCompany']
    }
  },
  methods: {
    redirectToReceives () {
      this.$router.push('/receives')
    },
    printInvoice (Printarea) {
      var vm = this
      var columns = [
        {title: 'Sl', dataKey: 'Sl'},
        {title: 'Description', dataKey: 'title'},
        {title: 'Qty', dataKey: 'quantity'},
        {title: 'Rate', dataKey: 'PurchasePrice'},
        {title: 'Amount', dataKey: 'TPrice'}
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
        if (vm.SupplierInfo !== undefined) {
          doc.setFont('Times')
          doc.setFontType('normal')
          doc.setFontSize(16)
          doc.text(vm.SupplierInfo.SupplierName, pageWidth / 2, pageHeight - 268, 'center')
          doc.setFont('times')
          doc.setFontType('normal')
          doc.setFontSize(12)
          doc.text(vm.SupplierInfo.Address, pageWidth / 2, pageHeight - 262, 'center')
          doc.text(vm.SupplierInfo.PhoneNumber, pageWidth / 2, pageHeight - 257, 'center')
          doc.text('Receives Supplier Wise from ' + vm.datereport.d1.toISOString() + ' to ' + vm.datereport.d2.toISOString(), pageWidth / 2, pageHeight - 252, 'center')
        } else {
          doc.text('Receives Summary from ' + vm.datereport.d1.toISOString() + ' to ' + vm.datereport.d2.toISOString(), pageWidth / 2, pageHeight - 252, 'center')
        }
        doc.line(10, 53, pageWidth - 15, 53)
      }
      doc.autoTable(columns, vm.PrintProductSummary, {
        didDrawPage: pageContent,
        margin: {left: 10, top: 55}
      })
      let finalY = doc.autoTable.previous.finalY
      doc.setFont('times')
      doc.setFontType('normal')
      doc.setFontSize(12)
      doc.text(pageWidth / 2 - 15, finalY + 5, 'Summary Total' + '        ' + vm.PrintProductSummaryTotalqty + '                                    ' + vm.PrintProductSummaryTotal)
      doc.line(pageWidth / 2 + 10, finalY + 25, pageWidth - 15, finalY + 25)
      doc.text('Print By ' + vm.User, pageWidth / 2 + 50, finalY + 30, 'center')
      doc.save('Receive_Report.pdf')
    },
    close () {
      this.dialog = false
      this.$router.push('/receivesreporting')
    }
  }
}
</script>