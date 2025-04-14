<template>
<v-container>
	<v-layout row justify-center>
		<v-flex xs12>
		<v-card>
		<v-card-title>
		<span>
		<v-btn slot="activator" color="teal" dark 
		@click="initializePO()">Create PurOrd</v-btn>
		</span>
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
			:headers="PurOrdHeader"
			:items="PurOrds"
			item-key="id"
			:search="search"
			:pagination.sync="pagination"
			class="elevation-1">
			<template slot="items" slot-scope="props">
			<td class="text-xs-left">{{props.item.id}}</td>
			<td class="text-xs-left">{{props.item.PODate | date}}</td>
			<td class="text-xs-right">{{props.item.POCartTotalqty}}</td>
			<td class="text-xs-right">{{props.item.POCartTotal | currency}}</td>
			<td class="text-xs-left">
				<span :class="[props.item.Status == true ? 'teal--text' : 'red--text']">{{props.item.Status == true ? 'Received' : 'Pending'}}</span>
		    </td>
			<td class="text-sm-left layout px-0">
			<span>
			<v-btn icon flat
			@click="ViewOrder(props.item.id)">
			<v-icon small color="teal">
				print
			</v-icon>
		    </v-btn>
			</span>
			<span v-show="props.item.Status == false">
			<v-btn icon flat
			@click="editPurOrd(props.item.id)">
			<v-icon small color="teal">
				edit
			</v-icon>
		    </v-btn>
			</span>
			<span v-show="props.item.Status == false">
			<v-btn icon flat
            @click="deletePurOrd(props.item)">
			<v-icon
            small
            color="teal"
          >
            delete
          </v-icon>
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
import CreatePurOrd from './CreatePurOrd'
import EditPurOrd from './EditPurOrd'
export default {
  data () {
    return {
      PurOrdHeader: [
        {text: 'PO No', value: 'id'},
        {text: 'PO Date', value: 'PODate'},
        {text: 'Item Total(qty)', value: 'POCartTotalqty', align: 'right'},
        {text: 'Item Total(Tk)', value: 'POCartTotal', align: 'right'},
        {text: 'Status', value: 'Status'},
        {text: 'Actions', value: 'name', sortable: false}
      ],
      selected: [],
      search: '',
      pagination: {
        sortBy: 'PODate',
        descending: true
      }
    }
  },
  computed: {
    PurOrds () {
      return this.$store.getters['PurOrds/getPurOrds']
    }
  },
  methods: {
    editPurOrd (PONo) {
      this.$router.push('/createpo')
      this.$store.dispatch('PurOrds/loadPOInfo', PONo)
    },
    deletePurOrd (PurOrd) {
      this.$store.dispatch('PurOrds/PurOrdRemove', PurOrd)
    },
    initializePO () {
      this.$store.dispatch('PurOrds/initializePO')
      this.$router.push('/createpo')
    },
    ViewOrder (PON) {
      this.$router.push({name: 'ViewOrder', params: { PON }})
    }
  },
  components: {CreatePurOrd, EditPurOrd}
}
</script>