<template>
<v-container>
	<v-layout row justify-center>
		<v-flex xs12>
		<v-card>
		<v-card-title>
		<span><CreateProduct></CreateProduct></span>
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
			:headers="ProductHeader"
			:items="Products"
			item-key="id"
			:search="search"
			class="elevation-1">
			<template slot="items" slot-scope="props">
			<td class="text-xs-left">{{props.item.ProductName}}</td>
			<td class="text-xs-left">{{props.item.ProductCode}}</td>
			<td class="text-xs-right">{{props.item.PurchasePrice | currency}}</td>
			<td class="text-xs-right">{{props.item.MRP | currency}}</td>
			<td class="text-xs-left">{{props.item.Warranty}}</td>
			<td class="text-xs-left">{{props.item.MeasuringUnit}}</td>
			<td class="text-xs-left">
			<v-icon color="teal" small @click="toggle(props.item)">{{props.item.Status == true ? 'check_circle' : 'highlight_off'}}</v-icon>
		</td>
			<td class="text-sm-left layout px-0">
			<span><EditProduct :editedProduct="props.item"></EditProduct></span>
			<span>
			<v-btn icon flat
            @click="deleteProduct(props.item)">
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
import CreateProduct from './CreateProduct'
import EditProduct from './EditProduct'
export default {
  data () {
    return {
      ProductHeader: [
        {text: 'Product Name', value: 'ProductName'},
        {text: 'Product Code', value: 'ProductCode'},
        {text: 'Purchase Price', value: 'PurchasePrice', align: 'right'},
        {text: 'MRP', value: 'MRP', align: 'right'},
        {text: 'Warranty', value: 'Warranty'},
        {text: 'Measuring Unit', value: 'MeasuringUnit'},
        {text: 'Status', value: 'Status'},
        {text: 'Actions', value: 'name', sortable: false}
      ],
      selected: [],
      search: ''
    }
  },
  computed: {
    Products () {
      return this.$store.getters['Products/getProducts']
    }
  },
  methods: {
    toggle (Product) {
      this.$store.dispatch('Products/ProductStatusChanges', {id: Product.id, Status: Product.Status})
    },
    deleteProduct (Product) {
      this.$store.dispatch('Products/ProductRemove', Product)
    }
  },
  components: {CreateProduct, EditProduct}
}
</script>