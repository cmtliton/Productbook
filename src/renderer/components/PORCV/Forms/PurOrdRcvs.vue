<template>
<v-container>
	<v-layout row justify-center>
		<v-flex xs12>
		<v-card>
		<v-card-title>
		<span>
		<v-btn slot="activator" color="teal" dark 
		@click="initializePOR()"
		:disabled="POsLength.length == 0 ? true : false"
		v-if="POsLength.length !== 0">Order Receive</v-btn>
		<v-btn slot="activator" color="teal lighten-4" dark 
		v-else
		@click="Orders()">No Order Available</v-btn>
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
			:headers="PORHeader"
			:items="PurOrdRcvs"
			item-key="id"
			:search="search"
			:pagination.sync="pagination"
			class="elevation-1">
			<template slot="items" slot-scope="props">
			<td class="text-xs-left">{{props.item.id}}</td>
			<td class="text-xs-left">{{props.item.PORDate | date}}</td>
			<td class="text-xs-right">{{props.item.PORCartTotalqty}}</td>
			<td class="text-xs-right">{{props.item.PORCartTotal | currency}}</td>
			<td class="text-xs-left">
				<span :class="[props.item.Status == true ? 'teal--text' : 'red--text']">{{props.item.Status == true ? 'Available' : 'Unavailable'}}</span>
		    </td>
			<td class="text-sm-left layout px-0">
			<span>
			<v-btn icon flat
			@click="ViewReceive(props.item)">
			<v-icon small color="teal">
				print
			</v-icon>
		    </v-btn>
			</span>
			<span>
			<v-btn icon flat
			@click="editPurOrdRcv(props.item)">
			<v-icon small color="teal">
				edit
			</v-icon>
		    </v-btn>
			</span>
			<span>
			<v-btn icon flat
            @click="DeleteReceived(props.item)">
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
import CreatePurOrdRcv from './CreatePurOrdRcv'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      PORHeader: [
        {text: 'POR No', value: 'id'},
        {text: 'POR Date', value: 'PORDate'},
        {text: 'Item Total(qty)', value: 'PORCartTotalqty', align: 'right'},
        {text: 'Item Total(Tk)', value: 'PORCartTotal', align: 'right'},
        {text: 'Item SLNO', value: 'SlNo'},
        {text: 'Actions', value: 'name', sortable: false}
      ],
      selected: [],
      search: '',
      pagination: {
        sortBy: 'PORDate',
        descending: true
      }
    }
  },
  computed: {
    ...mapGetters({
      PurOrdRcvs: 'PurOrdRcvs/getPORcvs',
      POsLength: 'PurOrds/getPONs'
    }),
    isDeletableOrEditable () {
      return this.$store.getters['PurOrdRcvs/getStockByPRN']
    }
  },
  methods: {
    editPurOrdRcv (PORInfo) {
      this.$store.dispatch('PurOrdRcvs/loadPORInfo', PORInfo)
      this.$router.push('/createpor')
    },
    ViewReceive (PORInfo) {
      this.$router.push({name: 'ViewReceive', params: { PORInfo }})
    },
    DeleteReceived (PORInfo) {
      this.$store.dispatch('PurOrdRcvs/DeletingReceived', PORInfo)
    },
    initializePOR () {
      this.$store.dispatch('PurOrdRcvs/initializePOR')
      this.$router.push('/createpor')
    },
    Orders () {
      this.$router.push('/purords')
    }
  },
  components: {CreatePurOrdRcv}
}
</script>