<template>
    <v-navigation-drawer
      :clipped="$vuetify.breakpoint.mdAndUp"
      value="true"
      permanent
      fixed
      app
    >
      <v-list dense>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>
            <v-text-field
            v-model="filterKey"
            append-icon="search"
            label="My Items"
            single-line
            autofocus
            hide-details
            @keyup.enter="AddToCart()">
            </v-text-field>
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-for="(product,index) in filterProducts"
        :key="index"
        @click="transToProduct(product)">
          <v-list-tile-title>
            {{product.title}}
            <span v-show="product.quantity > 0">-{{product.quantity}}-৳{{product.PurchasePrice}}</span>
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    products: Array
  },
  data () {
    return {
      filterKey: ''
    }
  },
  computed: {
    filterProducts () {
      var filterKey = this.filterKey && this.filterKey.toLowerCase()
      var data = this.products
      if (filterKey) {
        data = data.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      return data
    }
  },
  methods: {
    transToProduct (product) {
      this.$emit('iAmFromProduct', product)
    },
    newItem () {
      this.dialog = true
    },
    AddToCart () {
      var isFilterKey = this.filterKey && this.filterKey.trim()
      if (isFilterKey) {
        for (let key in this.filterProducts) {
          var products = this.filterProducts[key]
          this.$emit('iAmFromProduct', products)
        }
      }
    }
  }
}
</script>
