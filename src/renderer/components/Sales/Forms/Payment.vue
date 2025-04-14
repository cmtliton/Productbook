<template>
	<v-container>
		<v-app id="inspire">
      <v-layout row justify-center>
      <v-dialog v-model="dialog" width="560px">
        <v-card>
            <v-card-title>
          <span class="headline">Create Payment</span>
        </v-card-title>
            <v-card-text>
       <form @submit.prevent="onSave">
      <v-container grid-list-xl fluid>
        <v-layout wrap>
            <table style="width:100%" border="1" cellspacing="0" cellpadding="2px">
              <tr>
                <th align="left">Buyer Id:</th><td>{{item.BuyerId}}</td>
              </tr>
              <tr>
                <th align="left">Invoice No:</th><td>{{item.id}}</td>
              </tr>
              <tr>
                <th align="left">Invoice Date:</th><td>{{item.InvDate | date}}</td>
              </tr>
              <tr>
                <th align="left">Invoice Total:</th><td>{{ InvoiceTotal | currency}}</td>
              </tr>
              <tr>
                <th align="left">Collected Amount:</th><td>{{item.CollectedTk | currency}}</td>
              </tr>
              <tr>
                <th align="left">Dues:</th><td>{{InvoiceTotal - item.CollectedTk | currency}}</td>
              </tr>
              <tr>
                <th align="left">Collection Amount</th>
                <td>
                  <input type="text" value="250" v-model.number="CollectionAmt">
                </td>
              </tr>
              <tr>
                <th align="left">Payment Date:</th><td>{{ new Date() | date}}</td>
              </tr>
            </table>
        </v-layout>
      </v-container>
    </form>
           </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-flex xs12 sm3>
 <v-btn depressed small color="teal" flat @click="onSave">Payment</v-btn>
</v-flex>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-app>
	</v-container>
</template>
<script>
export default {
  props: ['item'],
  data () {
    return {
      dialog: true,
      CollectionAmt: ''
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  computed: {
    InvoiceTotal () {
      return (this.item.InvCartTotal + this.item.VatTk) - this.item.DiscountedTk
    }
  },
  methods: {
    onSave () {
      if ((this.item.InvCartTotal + this.item.VatTk) - this.item.DiscountedTk - this.item.CollectedTk >= this.CollectionAmt && this.CollectionAmt > 0) {
        var Payment = {
          BuyerId: this.item.BuyerId,
          INV: this.item.id,
          CollectedTk: this.CollectionAmt
        }
        this.$store.dispatch('Sales/onSavingPayment', Payment)
        this.$router.push('/sales')
      } else {
        alert('Collection Amount can not be gretter than Due amount and less than Zero or Blank!')
      }
    },
    close () {
      this.dialog = false
      this.$router.push('/sales')
    }
  }
}
</script>
