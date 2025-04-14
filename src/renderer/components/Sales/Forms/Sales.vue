<template>
<v-container>
	<v-layout row justify-center>
		<v-flex xs12>
		<v-card>
		<v-card-title>
		<v-btn slot="activator" color="teal" dark 
		 @click="initializeInvoice()">Create Invoice</v-btn>
		<v-spacer></v-spacer>
			<v-text-field
			v-model="search"
			append-icon="search"
			label="Search"
			single-line
			autofocus
			hide-details>
			</v-text-field>
		</v-card-title>
		<v-divider></v-divider>
			<v-data-table
			v-model="selected"
			:headers="Headers"
			:items="getSales"
			item-key="id"
			:search="search"
			:pagination.sync="pagination"
			class="elevation-1">
			<template slot="items" slot-scope="props">
			<td class="text-xs-left">{{props.item.id}}</td>
			<td class="text-xs-left">{{props.item.InvDate | date}}</td>
			<td class="text-xs-right">{{props.item.InvCartTotalqty}}</td>
			<td class="text-xs-right">{{(props.item.InvCartTotal + props.item.VatTk) - props.item.DiscountedTk | currency}}</td>
			<td class="text-xs-center" @click="PaidInvoice(props.item)">
			<span :class="[(props.item.InvCartTotal + props.item.VatTk) - props.item.DiscountedTk === props.item.CollectedTk ? 'teal--text' : 'red--text']">{{(props.item.InvCartTotal + props.item.VatTk) - props.item.DiscountedTk === props.item.CollectedTk ? 'Paid' : 'Unpaid'}}</span>
		    </td>
			<td class="text-sm-left layout px-0">
			<span>
			<v-btn icon flat
			@click="ViewInvoice(props.item)">
			<v-icon small color="teal">print</v-icon>
		  </v-btn>
			</span>
			<span>
			<v-btn icon flat
       @click="DeleteInvoice(props.item)">
			<v-icon small color="teal">delete</v-icon>
      </v-btn>
      </span>
      </td>
			</template>
			</v-data-table>
		</v-card>
		</v-flex>
	</v-layout>
</v-container>
</template>

<script>
import CreateInvoice from './CreateInvoice'
export default {
  data () {
    return {
      Headers: [
        {text: 'Invoice No', value: 'id', sortable: false},
        {text: 'Date', value: 'InvDate', align: 'left'},
        {text: 'Item Total(Qty)', value: 'ItemTotalqty', align: 'right'},
        {text: 'Item Total(Tk)', value: 'ItemTotal', align: 'right'},
        {text: 'Status', value: 'status', align: 'right'},
        {text: 'Actions', value: 'name', sortable: false}
      ],
      selected: [],
      search: '',
      pagination: {
        sortBy: 'InvDate',
        descending: true
      }
    }
  },
  computed: {
    getSales () {
      return this.$store.getters['Sales/getSalesWithPayment']
    },
    POsLength () {
      return this.$store.getters.getPOs.length
    }
  },
  methods: {
    DeleteInvoice (InvInfo) {
      this.$store.dispatch('Sales/DeletingInvoice', InvInfo)
    },
    initializeInvoice () {
      this.$store.dispatch('Sales/initializingInvoice')
      this.$store.dispatch('Buyers/loadBuyers')
      this.$router.push('/createinvoice')
    },
    ViewInvoice (Invoice) {
      this.$router.push({name: 'ViewInvoice', params: { Invoice }})
    },
    PaidInvoice (item) {
      if ((item.InvCartTotal + item.VatTk) - item.DiscountedTk === item.CollectedTk) {
        alert('Already Paid')
      } else {
        this.$router.push({name: 'Payment', params: { item }})
      }
    }
  },
  components: {CreateInvoice}
}
</script>