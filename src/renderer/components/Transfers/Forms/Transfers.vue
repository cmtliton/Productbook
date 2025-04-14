<template>
<v-container>
	<v-layout row justify-center>
		<v-flex xs12>
		<v-card>
		<v-card-title>
		<v-btn slot="activator" color="teal" dark 
		 @click="initializeTransfer()">Stock Transfer</v-btn>
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
			:items="getTransfers"
			item-key="id"
			:search="search"
			:pagination.sync="pagination"
			class="elevation-1">
			<template slot="items" slot-scope="props">
			<td class="text-xs-left">{{props.item.id}}</td>
			<td class="text-xs-left">{{props.item.TrnDate | date}}</td>
			<td class="text-xs-right">{{props.item.TrnCartTotalqty}}</td>
			<td class="text-xs-right">{{props.item.TrnCartTotal | currency}}</td>
			<td class="text-sm-left layout px-0">
			<span>
			<v-btn icon flat
			@click="ViewTransfer(props.item)">
			<v-icon small color="teal">print</v-icon>
		  </v-btn>
			</span>
			<span>
			<v-btn icon flat
       @click="DeleteTransfer(props.item)">
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
import CreateTransfer from './CreateTransfer'
export default {
  data () {
    return {
      Headers: [
        {text: 'Transfer No', value: 'id', sortable: false},
        {text: 'Date', value: 'TrnDate', align: 'left'},
        {text: 'Item Total(Qty)', value: 'ItemTotalqty', align: 'right'},
        {text: 'Item Total(Tk)', value: 'ItemTotal', align: 'right'},
        {text: 'Actions', value: 'name', sortable: false}
      ],
      selected: [],
      search: '',
      pagination: {
        sortBy: 'TrnDate',
        descending: true
      }
    }
  },
  computed: {
    getTransfers () {
      return this.$store.getters['Transfers/getTransfers']
    },
    POsLength () {
      return this.$store.getters.getPOs.length
    }
  },
  methods: {
    DeleteTransfer (TrnInfo) {
      this.$store.dispatch('Transfers/DeletingTransfer', TrnInfo)
    },
    initializeTransfer () {
      this.$store.dispatch('Transfers/initializingTransfer')
      this.$store.dispatch('Warehouses/loadWarehouses')
      this.$router.push('/createtransfer')
    },
    ViewTransfer (Transfer) {
      this.$router.push({name: 'ViewTransfer', params: { Transfer }})
    },
    PaidTransfer (item) {
      if (item.TrnCartTotal === item.CollectedTk) {
        alert('Already Paid')
      } else {
        this.$router.push({name: 'Payment', params: { item }})
      }
    }
  },
  components: {CreateTransfer}
}
</script>