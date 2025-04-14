<template>
<v-container>
	<v-layout row justify-center>
		<v-flex xs12>
		<v-card>
		<v-card-title>
		<span><CreateWarehouse></CreateWarehouse></span>
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
			:headers="WarehouseHeader"
			:items="Warehouses"
			item-key="id"
			:search="search"
			class="elevation-1">
			<template slot="items" slot-scope="props">
			<td class="text-xs-left">{{props.item.WarehouseName}}</td>
			<td class="text-xs-left">{{props.item.KeyPerson}}</td>
			<td class="text-xs-left">{{props.item.PhoneNumber}}</td>
			<td class="text-xs-left">{{props.item.Address}}</td>
			<td class="text-xs-left">
			<v-icon color="teal" small @click="toggle(props.item)">{{props.item.Status == true ? 'check_circle' : 'highlight_off'}}</v-icon>
		</td>
			<td class="text-xs-left layout px-0">
			<span><EditWarehouse :itemsent="props.item"></EditWarehouse></span>
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
import CreateWarehouse from './CreateWarehouse'
import EditWarehouse from './EditWarehouse'
export default {
  data () {
    return {
      WarehouseHeader: [
        {text: 'WarehouseName', value: 'WarehouseName'},
        {text: 'KeyPerson', value: 'KeyPerson'},
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
    Warehouses () {
      return this.$store.getters['Warehouses/getWarehouses']
    }
  },
  methods: {
    toggle (item) {
      this.$store.dispatch('Warehouses/WarehouseStatusChanges', {id: item.id, Status: item.Status})
    },
    deleteItem (item) {
      this.$store.dispatch('Warehouses/WarehouseRemove', item)
    }
  },
  components: {CreateWarehouse, EditWarehouse}
}
</script>