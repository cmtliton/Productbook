<template>
	<v-container>
		<v-app id="inspire">
    <v-layout row justify-center>
      <v-dialog
        v-model="dialog"
        max-width="290"
      >
        <v-card>
          <v-card-title class="headline">{{product.title}}</v-card-title>
  
          <v-card-text>
            <v-list>
              <v-list-tile v-for="SlNo in product.SlNos"
              :key="SlNo"
              @click="SearchInStock(SlNo)">
                <v-list-tile-content>
                  {{SlNo}}
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              flat="flat"
              @click="directToCart"
            >
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-app>
	</v-container>
</template>

<script>
export default {
  props: ['product', 'WhereFrom'],
  data () {
    return {
      dialog: true
    }
  },
  methods: {
    directToCart () {
      switch (this.WhereFrom) {
        case 0:
          this.$router.push('/createinvoice')
          break
        case 1:
          this.$router.push('/createtransfer')
          break
        case 2:
          this.$router.push('/createreturn')
          break
      }
    },
    SearchInStock (SlNo) {
      switch (this.WhereFrom) {
        case 0:
          this.$store.dispatch('Sales/SearchingInStock', SlNo)
          this.dialog = false
          this.$router.push('/createinvoice')
          break
        case 1:
          this.$store.dispatch('Transfers/SearchingInStock', SlNo)
          this.dialog = false
          this.$router.push('/createtransfer')
          break
        case 2:
          this.$store.dispatch('Returns/SearchingStockInWarehouses', SlNo)
          this.dialog = false
          this.$router.push('/createreturn')
          break
      }
    }
  }
}
</script>