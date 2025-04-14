<template>
<v-container>
	<v-layout row justify-center>
		<v-flex xs12>
		<v-card>
		<v-card-title>
		<span><CreateItem></CreateItem></span>
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
			:headers="ItemHeader"
			:items="Items"
			item-key="id"
			:search="search"
			class="elevation-1">
			<template slot="items" slot-scope="props">
			<td class="text-xs-left">{{props.item.ItemName}}</td>
			<td class="text-xs-left">
			<v-icon color="teal" small @click="toggle(props.item)">{{props.item.Status == true ? 'check_circle' : 'highlight_off'}}</v-icon>
		</td>
			<td class="text-sm-left layout px-0">
			<span><EditItem :editedItem="props.item"></EditItem></span>
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
import CreateItem from './CreateItem'
import EditItem from './EditItem'
export default {
  data () {
    return {
      ItemHeader: [
        {text: 'ItemName', value: 'ItemName'},
        {text: 'Status', value: 'Status'},
        {text: 'Actions', value: 'name', sortable: false}
      ],
      selected: [],
      search: ''
    }
  },
  computed: {
    Items () {
      return this.$store.getters['Items/getItems']
    }
  },
  methods: {
    toggle (item) {
      this.$store.dispatch('Items/ItemStatusChanges', {id: item.id, Status: item.Status})
    },
    deleteItem (item) {
      this.$store.dispatch('Items/ItemRemove', item)
    }
  },
  components: {CreateItem, EditItem}
}
</script>