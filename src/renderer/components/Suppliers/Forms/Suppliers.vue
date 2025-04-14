<template>
<v-container>
	<v-layout row justify-center>
		<v-flex xs12>
		<v-card>
		<v-card-title>
		<span><CreateSupplier></CreateSupplier></span>
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
			:headers="SupplierHeader"
			:items="Suppliers"
			item-key="id"
			:search="search"
			class="elevation-1">
			<template slot="items" slot-scope="props">
			<td class="text-xs-left">{{props.item.SupplierName}}</td>
			<td class="text-xs-left">{{props.item.PhoneNumber}}</td>
			<td class="text-xs-left">{{props.item.Address}}</td>
			<td class="text-xs-left">
			<v-icon color="teal" small @click="toggle(props.item)">{{props.item.Status == true ? 'check_circle' : 'highlight_off'}}</v-icon>
		</td>
			<td class="text-xs-left layout px-0">
			<span><EditSupplier :supplier="props.item"></EditSupplier></span>
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
import CreateSupplier from './CreateSupplier'
import EditSupplier from './EditSupplier'
export default {
  data () {
    return {
      SupplierHeader: [
        {text: 'SupplierName', value: 'SupplierName'},
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
    Suppliers () {
      return this.$store.getters['Suppliers/getSuppliers']
    }
  },
  methods: {
    toggle (item) {
      this.$store.dispatch('Suppliers/SupplierStatusChanges', {id: item.id, Status: item.Status})
    },
    deleteItem (item) {
      this.$store.dispatch('Suppliers/SupplierRemove', item)
    }
  },
  components: {CreateSupplier, EditSupplier}
}
</script>