<template>
	<v-container>
		<v-app id="inspire">
      <v-layout row justify-center>
      <v-dialog v-model="dialog" width="384px">
        <v-card id="Printarea">
          <v-card-text>
            <app-company-header></app-company-header>
            <v-divider></v-divider>
            <font size="1" face="Time new Roman">
            <p class="text-xs-center pa-0 ma-0">{{SupplierInfo.SupplierName}}</p>
            <p class="text-xs-center pa-0 ma-0">{{SupplierInfo.Address}}</p>
            <p class="text-xs-center pa-0 ma-0">{{SupplierInfo.PhoneNumber}}</p>
            <p class="text-xs-center pa-0 ma-0">Date: {{Receive.PORDate | date}}</p>
            <v-divider></v-divider>
            <p class="text-xs-left pa-0 ma-0"><b>Receive No:</b> {{Receive.id}}</p>
          </font>
            <v-divider></v-divider>
            <div>
              <font size="1" face="Time new Roman">
            <table align="center" width="100%">
              <tr>
                <th :class="[header.text === 'Description' ? 'text-xs-left' : 'text-xs-right']"
                v-for="header in Headers">{{header.text}}</th>
              </tr>
              <tr v-for="(product, index) in PORitems" :key="product.ProductId">
                <td class="text-xs-right">{{index+1}}</td>
                <td class="text-xs-left">{{product.title}}</td>
                <td class="text-xs-right">{{product.quantity}}</td>
                <td class="text-xs-right text-sm-right">{{product.PurchasePrice | currency}}</td>
                <td class="text-xs-right">{{product.quantity * product.PurchasePrice | currency}}</td>
              </tr>
              <tr>
                <td><hr></td><td><hr></td><td><hr></td><td><hr></td><td><hr></td>
              </tr>
              <tr>
                <td></td>
                <th class="text-xs-right">Receive Total</th>
                <th class="text-xs-right">{{NetTotalqty}}</th>
                <td></td>
                <th class="text-xs-right">{{NetTotal | currency}}</th>
              </tr>
            </table>
          </font>
            </div>
          </v-card-text>
          <v-card-actions @click="print('Printarea')">
            <v-spacer></v-spacer>
            <p><font face="Time new Roman" size="1">Receive By {{User}}</font></p>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-app>
	</v-container>
</template>

<script>
import JsPDF from 'jspdf'
export default {
  props: ['PORInfo'],
  data () {
    return {
      dialog: true,
      Headers: [
        {text: 'Sl', value: 'sl', align: 'left'},
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
    Receive () {
      return this.$store.getters['PurOrdRcvs/getPORcvs'].find(por => por.id === this.PORInfo.id)
    },
    PORitems () {
      var sl = 1
      return this.Receive.PORitems.map(item => {
        var product = this.$store.getters['Products/getProductsWithItemAndBrand'].find(prd => prd.ProductId === item.ProductId)
        return {
          Sl: sl++,
          ProductId: product.ProductId,
          title: product.title,
          quantity: item.quantity,
          PurchasePrice: item.PurchasePrice,
          TPrice: item.PurchasePrice * item.quantity
        }
      })
    },
    NetTotal () {
      return this.Receive.PORCartTotal
    },
    NetTotalqty () {
      return this.Receive.PORCartTotalqty
    },
    User () {
      return this.$store.getters['Users/getUsers'].find(user => user.username.trim() === this.Receive.CreatorId.trim()).fullname
    },
    Suppliers () {
      return this.$store.getters['Suppliers/getSuppliers']
    },
    SupplierId () { // Joining Receive and PO For gettting SupplierID
      return this.$store.getters['PurOrds/getPurOrds'].find(pon => pon.id === this.Receive.PON).SupplierId
    },
    SupplierInfo () {
      return this.Suppliers.find(supplier => supplier.id === this.SupplierId)
    },
    Payment () {
      return this.$store.getters['PurOrdRcvs/getSupplilerPaymentHistory'].find(pmt => pmt.PRN === this.Receive.id)
    },
    getCompany () {
      return this.$store.getters['Company/getCompany']
    }
  },
  methods: {
    redirectToSales () {
      this.$router.push('/sales')
    },
    print (Printarea) {
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
        doc.setFont('Times')
        doc.setFontType('normal')
        doc.setFontSize(16)
        doc.text(vm.SupplierInfo.SupplierName, pageWidth / 2, pageHeight - 268, 'center')
        doc.setFont('times')
        doc.setFontType('normal')
        doc.setFontSize(12)
        doc.text(vm.SupplierInfo.Address, pageWidth / 2, pageHeight - 262, 'center')
        doc.text(vm.SupplierInfo.PhoneNumber, pageWidth / 2, pageHeight - 257, 'center')
        doc.text('Date: ' + vm.Receive.PORDate, pageWidth / 2, pageHeight - 252, 'center')
        doc.line(10, 47, pageWidth - 15, 47)
        doc.text(10, 51, 'Receive No: ' + vm.Receive.id)
        doc.line(10, 53, pageWidth - 15, 53)
      }
      doc.autoTable(columns, vm.PORitems, {
        didDrawPage: pageContent,
        margin: {left: 10, top: 55}
      })
      let finalY = doc.autoTable.previous.finalY
      doc.setFont('times')
      doc.setFontType('normal')
      doc.setFontSize(12)
      doc.text(pageWidth / 2 - 15, finalY + 5, 'Receive Total' + '        ' + vm.NetTotalqty + '                                    ' + vm.NetTotal)
      doc.line(pageWidth / 2 + 10, finalY + 25, pageWidth - 15, finalY + 25)
      doc.text('Receive By ' + vm.User, pageWidth / 2 + 50, finalY + 30, 'center')
      doc.save(this.Receive.id + '.pdf')
    },
    close () {
      this.dialog = false
      this.$router.push('/purordRcvs')
    }
  }
}
</script>