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
          <v-list-tile-title>My Items</v-list-tile-title>
          <v-list-tile-sub-title @click="newItem"></v-list-tile-sub-title>
        </v-list-tile>
        <v-list-group
          prepend-icon="account_circle"
          v-for="(item, index) in items"
          :key="index"
        >
          <v-list-tile slot="activator">
            <v-list-tile-title>{{item.name}}</v-list-tile-title>
          </v-list-tile>
          <v-list-group
            sub-group
            no-action
            v-for="(brand,bkey) in item.brands"
            :key="bkey"
          >
            <v-list-tile slot="activator">
              <v-list-tile-title>{{brand.name}}</v-list-tile-title>
            </v-list-tile>
            <v-list-tile
              v-for="(product,ky) in brand.products"
              :key="ky"
              @click="addToPurOrdCart(product)"
            >
              <v-list-tile-title v-text="product.name"></v-list-tile-title>
            </v-list-tile>
          </v-list-group>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
</template>

<script>
export default {
  data () {
    return {
      products: [],
      items: [
        {
          name: 'Notebook',
          brands: [
            {
              name: 'HP',
              products: [
                {
                  name: 'Liton'
                },
                {
                  name: 'B'
                }
              ]
            },
            {
              name: 'Nokia',
              products: [
                { name: 'ABC' },
                { name: 'XYZ' }
              ]
            }
          ]
        },
        {
          name: 'Mobile',
          brands: [
            {
              name: 'Nokia',
              products: [
                {
                  name: '1202'
                },
                {
                  name: '1800'
                },
                {
                  name: '1202'
                },
                {
                  name: '1800'
                },
                {
                  name: '1202'
                },
                {
                  name: '1800'
                },
                {
                  name: '1800'
                },
                {
                  name: '1202'
                },
                {
                  name: '1800'
                },
                {
                  name: '1800'
                },
                {
                  name: '1202'
                },
                {
                  name: '1800'
                },
                {
                  name: '1800'
                },
                {
                  name: '1202'
                },
                {
                  name: '1800'
                },
                {
                  name: '1202'
                },
                {
                  name: '1800'
                },
                {
                  name: '1800'
                },
                {
                  name: '1202'
                },
                {
                  name: '1800'
                },
                {
                  name: '1800'
                },
                {
                  name: '1202'
                },
                {
                  name: '1800'
                }
              ]
            }
          ]
        }
      ]
    }
  },
  methods: {
    addToPurOrdCart (product) {
      this.products.push(product)
    },
    newItem () {
      this.dialog = true
    }
  }
}
</script>
