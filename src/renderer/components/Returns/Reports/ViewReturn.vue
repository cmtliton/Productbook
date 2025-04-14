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
            <p class="text-xs-center pa-0 ma-0">{{WarehouseInfo.WarehouseName | charfilter}}</p>
            <p class="text-xs-center pa-0 ma-0">{{WarehouseInfo.Address | charfilter}}</p>
            <p class="text-xs-center pa-0 ma-0">{{WarehouseInfo.PhoneNumber}}</p>
            <p class="text-xs-center pa-0 ma-0">Date: {{Return.RtnDate | date}}</p>
            <v-divider></v-divider>
            <p class="text-xs-left pa-0 ma-0"><b>Return No:</b> {{Return.id}}</p>
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
                <th></th><th>Return Total</th><th class="text-xs-right">{{RtnCartTotalqty}}</th><th></th><th class="text-xs-right">{{NetTotal | currency}}</th>
              </tr>
            </table>
          </font>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <p>
              <v-divider></v-divider>
              <font face="Time new Roman" size="1" @click="printReturn('Printarea')">Returns By {{User}}</font>
            </p>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-app>
	</v-container>
</template>

<script>
import html2canvas from 'html2canvas'
import JsPDF from 'jsPDF'
import _ from 'lodash'
export default {
  props: ['Return'],
  data () {
    return {
      dialog: true,
      Headers: [
        {text: 'Sl', value: 'title', align: 'right'},
        {text: 'Description', value: 'title', align: 'left'},
        {text: 'Qty', value: 'quantity', align: 'right'},
        {text: 'Rate', value: 'PurchasePrice', align: 'right'},
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
    RtnInfo () {
      return this.$store.getters['Returns/getReturns'].find(Return => Return.id === this.Return.id)
    },
    Rtnitems () {
      return this.RtnInfo.Rtnitems.map(item => {
        var product = this.$store.getters['Products/getProductsWithItemAndBrand'].find(prd => prd.ProductId === item.ProductId)
        return {
          ProductId: product.ProductId,
          title: product.title,
          quantity: item.quantity,
          PurchasePrice: item.PurchasePrice
        }
      })
    },
    ConsolidatedItems () {
      return _(this.Rtnitems)
        .groupBy('title')
        .map((g, title) => {
          return {
            title: title,
            quantity: _.sumBy(g, 'quantity'),
            PurchasePrice: _.find(g, 'PurchasePrice').PurchasePrice
          }
        })
        .values()
        .value()
    },
    NetTotal () {
      return this.RtnInfo.RtnCartTotal
    },
    RtnCartTotalqty () {
      return this.RtnInfo.RtnCartTotalqty
    },
    User () {
      return this.$store.getters['Users/getUsers'].find(user => user.username.trim() === this.RtnInfo.CreatorId.trim()).fullname
    },
    Warehouses () {
      return this.$store.getters['Warehouses/getWarehouses']
    },
    WarehouseInfo () {
      return this.Warehouses.find(Warehouse => Warehouse.id === this.RtnInfo.WarehouseId)
    }
  },
  methods: {
    redirectToReturns () {
      this.$router.push('/stockReturn')
    },
    printReturn (Printarea) {
      html2canvas(document.querySelector('#Printarea')).then(
        canvas => {
          var image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
          var imgWidth = 210
          var pageHeight = 295
          var imgHeight = canvas.height * imgWidth / canvas.width
          var heightleft = imgHeight
          var doc = new JsPDF()
          var position = 0
          doc.addImage(image, 'JPEG', 0, position, imgWidth, imgHeight)
          heightleft -= pageHeight
          while (heightleft >= 0) {
            position = heightleft - imgHeight
            doc.addPage()
            doc.addImage(image, 'JPEG', 0, position, imgWidth, imgHeight)
            heightleft -= pageHeight
          }
          doc.save(this.RtnInfo.id + '.pdf')
        })
    },
    close () {
      this.dialog = false
      this.$router.push('/stockReturn')
    }
  }
}
</script>