<template>
	<v-container>
		<v-app id="inspire">
      <v-layout row justify-center>
      <v-dialog v-model="dialog" width="384px">
        <v-card id="Printarea">
          <v-card-text>
            <app-company-header></app-company-header>
            <hr/><hr/>
            <font size="1" face="Time new Roman">
            <p class="text-xs-center pa-0 ma-0">{{BuyerInfo.BuyerName | charfilter}}</p>
            <p class="text-xs-center pa-0 ma-0">{{BuyerInfo.Address | charfilter}}</p>
            <p class="text-xs-center pa-0 ma-0">{{BuyerInfo.PhoneNumber}}</p>
            <p class="text-xs-center pa-0 ma-0">Date: {{Invoice.InvDate | date}}</p>
            <v-divider></v-divider>
            <p class="text-xs-left pa-0 ma-0"><b>Invoice No:</b> {{Invoice.id}}</p>
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
              <tr v-for="(product, index) in ConsolidatedItems" :key="product.ProductId">
                <td class="text-xs-right">{{index+1}}.</td>
                <td class="text-xs-left">{{product.title}}</td>
                <td class="text-xs-right">{{product.quantity}}</td>
                <td class="text-xs-right text-sm-right">{{product.MRP | currency}}</td>
                <td class="text-xs-right">{{product.quantity * product.MRP | currency}}</td>
              </tr>
              <tr>
                <td><hr></td><td><hr></td><td><hr></td><td><hr></td><td><hr></td>
              </tr>
              <tr>
            <td></td><td></td><td></td>
            <td class="text-xs-right">Invoice Total</td>
            <td class="text-xs-right">{{InvInfo.InvCartTotal | currency}}</td>
            </tr>
              <tr v-show="InvInfo.DiscountedTk || InvInfo.VatTk">
                <td><hr></td><td><hr></td><td><hr></td><td><hr></td><td><hr></td>
              </tr>
              <tr v-show="InvInfo.VatTk">
            <td></td><td></td><td></td>
            <td class="text-xs-right">VAT</td>
            <td class="text-xs-right">{{InvInfo.VatTk | currency}}</td>
            </tr>
            <tr v-show="InvInfo.DiscountedTk">
            <td></td><td></td><td></td>
            <td class="text-xs-right">Disc.</td>
            <td class="text-xs-right">{{InvInfo.DiscountedTk | currency}}</td>
            </tr>
            <tr v-show="InvInfo.DiscountedTk || InvInfo.VatTk">
                <td><hr></td><td><hr></td><td><hr></td><td><hr></td><td><hr></td>
            </tr>
            <tr v-show="InvInfo.InvCartTotal !== NetTotal || InvInfo.DiscountedTk || InvInfo.VatTk">
            <td></td><td></td><td></td>
            <td class="text-xs-right">Net Total</td>
            <td class="text-xs-right">{{NetTotal | currency}}</td>
            </tr>
            <tr v-show="Invoice.CollectedTk !== NetTotal">
                <td><hr></td><td><hr></td><td><hr></td><td><hr></td><td><hr></td>
              </tr>
              <tr v-show="Invoice.CollectedTk !== NetTotal">
            <td></td><td></td><td></td>
            <td class="text-xs-right">Paid</td>
            <td class="text-xs-right">{{Invoice.CollectedTk | currency}}</td>
            </tr>
            <tr v-show="NetTotal - Invoice.CollectedTk">
            <td></td><td></td><td></td>
            <td class="text-xs-right">Due</td>
            <td class="text-xs-right">{{NetTotal - Invoice.CollectedTk | currency}}</td>
            </tr>
            <tr v-show="Payment.InvTotal - Payment.CollectedTk">
            <td></td><td></td><td></td>
            <td class="text-xs-right">Total Dues</td>
            <td class="text-xs-right">{{Payment.InvTotal - Payment.CollectedTk | currency}}</td>
            </tr>
            <tr v-show="Invoice.CollectedTk || NetTotal - Invoice.CollectedTk">
                <td><hr></td><td><hr></td><td><hr></td><td><hr></td><td><hr></td>
              </tr>
            </table>
          </font>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <p>
              <v-divider></v-divider>
              <font face="Time new Roman" size="1" @click="printInvoice('Printarea')">Sales By {{User}}</font>
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
  props: ['Invoice'],
  data () {
    return {
      dialog: true,
      Headers: [
        {text: 'Sl', value: 'title', align: 'right'},
        {text: 'Description', value: 'title', align: 'left'},
        {text: 'Qty', value: 'quantity', align: 'right'},
        {text: 'Rate', value: 'MRP', align: 'right'},
        {text: 'Amount', value: 'Tprice', align: 'right'}
      ]
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  computed: {
    InvInfo () {
      return this.$store.getters['Sales/getSales'].find(sale => sale.id === this.Invoice.id)
    },
    Invitems () {
      var sl = 1
      return this.InvInfo.Invitems.map(item => {
        var product = this.$store.getters['Products/getProductsWithItemAndBrand'].find(prd => prd.ProductId === item.ProductId)
        return {
          Sl: sl++,
          ProductId: product.ProductId,
          title: product.title,
          quantity: item.quantity,
          MRP: item.MRP,
          TPrice: item.quantity * item.MRP
        }
      })
    },
    ConsolidatedItems () {
      return _(this.Invitems)
        .groupBy('title')
        .map((g, title) => {
          return {
            title: title,
            quantity: _.sumBy(g, 'quantity'),
            MRP: _.find(g, 'MRP').MRP
          }
        })
        .values()
        .value()
    },
    NetTotal () {
      return (this.InvInfo.InvCartTotal + this.InvInfo.VatTk) - this.InvInfo.DiscountedTk
    },
    User () {
      return this.$store.getters['Users/getUsers'].find(user => user.username.trim() === this.InvInfo.CreatorId.trim()).fullname
    },
    Buyers () {
      return this.$store.getters['Buyers/getBuyers']
    },
    BuyerInfo () {
      return this.Buyers.find(buyer => buyer.id === this.InvInfo.BuyerId)
    },
    Payment () {
      return this.$store.getters['Sales/getSalesWithPaymentByBuyer'].find(Buyer => Buyer.Buyer === this.InvInfo.BuyerId)
    },
    getCompany () {
      return this.$store.getters['Company/getCompany']
    }
  },
  methods: {
    redirectToSales () {
      this.$router.push('/sales')
    },
    printInvoice (Printarea) {
      var vm = this
      var columns = [
        {title: 'Sl', dataKey: 'Sl'},
        {title: 'Description', dataKey: 'title'},
        {title: 'Qty', dataKey: 'quantity'},
        {title: 'Rate', dataKey: 'MRP'},
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
        doc.line(10, 22, pageWidth - 15, 22)
        doc.line(10, 23, pageWidth - 15, 23)
        doc.setFont('Times')
        doc.setFontType('normal')
        doc.setFontSize(16)
        doc.text(vm.BuyerInfo.BuyerName, pageWidth / 2, pageHeight - 268, 'center')
        doc.setFont('times')
        doc.setFontType('normal')
        doc.setFontSize(12)
        doc.text(vm.BuyerInfo.Address, pageWidth / 2, pageHeight - 262, 'center')
        doc.text(vm.BuyerInfo.PhoneNumber, pageWidth / 2, pageHeight - 257, 'center')
        doc.text('Date: ' + vm.Invoice.InvDate, pageWidth / 2, pageHeight - 252, 'center')
        doc.line(10, 47, pageWidth - 15, 47)
        doc.text(10, 51, 'Invoice No: ' + vm.Invoice.id)
        doc.line(10, 53, pageWidth - 15, 53)
      }
      doc.autoTable(columns, vm.Invitems, {
        didDrawPage: pageContent,
        margin: {left: 10, top: 55}
      })
      let finalY = doc.autoTable.previous.finalY
      doc.setFont('times')
      doc.setFontType('normal')
      doc.setFontSize(12)
      doc.line(10, finalY + 1, pageWidth - 15, finalY + 1)
      doc.text(pageWidth / 2 - 10, finalY + 5, 'Invoice Total' + '        ' + '                              ' + vm.InvInfo.InvCartTotal)
      doc.line(10, finalY + 7, pageWidth - 15, finalY + 7)
      doc.text(pageWidth / 2, finalY + 11, '  VAT' + '        ' + '                                 ' + vm.InvInfo.VatTk)
      doc.text(pageWidth / 2, finalY + 15, '  Disc.' + '        ' + '                                 ' + vm.InvInfo.DiscountedTk)
      doc.line(10, finalY + 17, pageWidth - 15, finalY + 17)
      doc.text(pageWidth / 2 - 10, finalY + 21, '    Net Total' + '        ' + '                                 ' + vm.NetTotal)
      doc.line(10, finalY + 23, pageWidth - 15, finalY + 23)
      doc.text(pageWidth / 2, finalY + 27, '  Paid' + '        ' + '                                 ' + vm.Invoice.CollectedTk)
      doc.text(pageWidth / 2, finalY + 31, '  Due' + '        ' + '                                 ' + (vm.NetTotal - vm.Invoice.CollectedTk))
      doc.text(pageWidth / 2, finalY + 35, 'Total Dues' + '       ' + '                         ' + (vm.Payment.InvTotal - vm.Payment.CollectedTk))
      doc.line(10, finalY + 37, pageWidth - 15, finalY + 37)
      doc.line(pageWidth / 2 + 10, finalY + 60, pageWidth - 15, finalY + 60)
      doc.text('Sales By ' + vm.User, pageWidth / 2 + 65, finalY + 65, 'center')
      doc.save(this.InvInfo.id + '.pdf')
    },
    close () {
      this.dialog = false
      this.$router.push('/sales')
    }
  }
}
</script>