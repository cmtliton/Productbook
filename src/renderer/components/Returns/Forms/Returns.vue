<template>
<v-container>
	<v-layout row justify-center>
		<v-flex xs12>
		<v-card>
		<v-card-title>
		<v-btn slot="activator" color="teal" dark 
		 @click="initializeReturn()">Stock Return</v-btn>
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
			:items="getReturns"
			item-key="id"
			:search="search"
			:pagination.sync="pagination"
			class="elevation-1">
			<template slot="items" slot-scope="props">
			<td class="text-xs-left">{{props.item.id}}</td>
			<td class="text-xs-left">{{props.item.RtnDate | date}}</td>
			<td class="text-xs-right">{{props.item.RtnCartTotalqty}}</td>
			<td class="text-xs-right">{{props.item.RtnCartTotal | currency}}</td>
			<td class="text-sm-left layout px-0">
			<span>
			<v-btn icon flat
			@click="ViewReturn(props.item)">
			<v-icon small color="teal">print</v-icon>
		  </v-btn>
			</span>
			<span>
			<v-btn icon flat
       @click="DeleteReturn(props.item)">
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
import CreateReturn from './CreateReturn'
export default {
  data () {
    return {
      Headers: [
        {text: 'Return No', value: 'id', sortable: false},
        {text: 'Date', value: 'RtnDate', align: 'left'},
        {text: 'Item Total(Qty)', value: 'ItemTotalqty', align: 'right'},
        {text: 'Item Total(Tk)', value: 'ItemTotal', align: 'right'},
        {text: 'Actions', value: 'name', sortable: false}
      ],
      selected: [],
      search: '',
      pagination: {
        sortBy: 'RtnDate',
        descending: true
      }
    }
  },
  computed: {
    getReturns () {
      return this.$store.getters['Returns/getReturns']
    },
    POsLength () {
      return this.$store.getters.getPOs.length
    }
  },
  methods: {
    DeleteReturn (RtnInfo) {
      this.$store.dispatch('Returns/DeletingReturn', RtnInfo)
    },
    initializeReturn () {
      this.$store.dispatch('Returns/initializingReturn')
      this.$store.dispatch('Warehouses/loadWarehouses')
      this.$router.push('/createReturn')
    },
    ViewReturn (Return) {
      this.$router.push({name: 'ViewReturn', params: { Return }})
    },
    PaidReturn (item) {
      if (item.RtnCartTotal === item.CollectedTk) {
        alert('Already Paid')
      } else {
        this.$router.push({name: 'Payment', params: { item }})
      }
    }
  },
  components: {CreateReturn}
}
</script>