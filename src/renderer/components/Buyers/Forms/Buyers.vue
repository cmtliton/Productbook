<template>
<v-container>
	<v-layout row justify-center>
		<v-flex xs12>
		<v-card>
		<v-card-title>
		<span><CreateBuyer></CreateBuyer></span>
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
			:headers="BuyerHeader"
			:items="Buyers"
			item-key="id"
			:search="search"
			class="elevation-1">
			<template slot="items" slot-scope="props">
			<td class="text-xs-left">{{props.item.BuyerName}}</td>
			<td class="text-xs-left">{{props.item.PhoneNumber}}</td>
			<td class="text-xs-left">{{props.item.Address}}</td>
			<td class="text-xs-left">
			<v-icon color="teal" small @click="toggle(props.item)">{{props.item.Status == true ? 'check_circle' : 'highlight_off'}}</v-icon>
		</td>
			<td class="text-xs-left layout px-0">
			<span><EditBuyer :buyer="props.item"></EditBuyer></span>
			<span>
			<v-btn icon flat
            @click="deleteItem(props.item)">
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
import CreateBuyer from './CreateBuyer'
import EditBuyer from './EditBuyer'
export default {
  data () {
    return {
      BuyerHeader: [
        {text: 'BuyerName', value: 'BuyerName'},
        {text: 'PhoneNumber', value: 'PhoneNumber'},
        {text: 'Address', value: 'Address'},
        {text: 'Status', value: 'Status'},
        {text: 'Actions', value: 'name', sortable: false}
      ],
      selected: [],
      search: ''
    }
  },
  computed: {
    Buyers () {
      return this.$store.getters['Buyers/getBuyers']
    }
  },
  methods: {
    toggle (item) {
      this.$store.dispatch('Buyers/BuyerStatusChanges', {id: item.id, Status: item.Status})
    },
    deleteItem (item) {
      this.$store.dispatch('Buyers/BuyerRemove', item)
    }
  },
  components: {CreateBuyer, EditBuyer}
}
</script>