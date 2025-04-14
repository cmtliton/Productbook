<template>
<v-container>
	<v-layout row justify-center>
		<v-flex xs12>
		<v-card>
		<v-card-title>
		<span><CreateBrand></CreateBrand></span>
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
			:headers="BrandHeader"
			:items="Brands"
			item-key="id"
			:search="search"
			class="elevation-1">
			<template slot="items" slot-scope="props">
			<td class="text-xs-left">{{props.item.BrandName}}</td>
			<td class="text-xs-left">
			<v-icon color="teal" small @click="toggle(props.item)">{{props.item.Status == true ? 'check_circle' : 'highlight_off'}}</v-icon>
		</td>
			<td class="text-sm-left layout px-0">
			<span><EditBrand :editedBrand="props.item"></EditBrand></span>
			<span>
			<v-btn icon flat
            @click="deleteBrand(props.item)">
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
import CreateBrand from './CreateBrand'
import EditBrand from './EditBrand'
export default {
  data () {
    return {
      BrandHeader: [
        {text: 'BrandName', value: 'BrandName'},
        {text: 'Status', value: 'Status'},
        {text: 'Actions', value: 'name', sortable: false}
      ],
      selected: [],
      search: ''
    }
  },
  computed: {
    Brands () {
      return this.$store.getters['Brands/getBrands']
    }
  },
  methods: {
    toggle (Brand) {
      this.$store.dispatch('Brands/BrandStatusChanges', {id: Brand.id, Status: Brand.Status})
    },
    deleteBrand (Brand) {
      this.$store.dispatch('Brands/BrandRemove', Brand)
    }
  },
  components: {CreateBrand, EditBrand}
}
</script>