<template>
	 <v-container grid-list-md text-md-center>
      <v-layout row wrap>
        <v-flex md3 @click="reDirectToItems">
        <v-card dark color="teal" height="120px" width="200px">
          <v-card-title primary-title>
            <div>
              <p class="headline"><font size="3">Items ({{Itemsqty}})</font></p>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex md3 @click="reDirectToBrands">
        <v-card dark color="teal" height="120px" width="200px">
          <v-card-title primary-title>
            <div>
              <p class="headline"><font size="3">Brands ({{Brandsqty}})</font></p>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex md3 @click="reDirectToProducts">
        <v-card dark color="teal" height="120px" width="200px">
          <v-card-title primary-title>
            <div>
              <p class="headline"><font size="3">Products ({{Productsqty}})</font></p>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex md3 @click="reDirectToUsers">
        <v-card dark color="teal" height="120px" width="200px">
          <v-card-title primary-title>
            <div>
              <p class="headline"><font size="3">Users ({{Usersqty}})</font></p>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex md3 @click="reDirectToReceives">
        <v-card dark color="teal" height="120px" width="200px">
          <v-card-title primary-title>
            <div>
              <p class="headline"><font size="3">Receives ({{ReceivesTotalqty}})</font></p>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex md3 @click="reDirectToSales">
        <v-card dark color="teal" height="120px" width="200px">
          <v-card-title primary-title>
            <div>
              <p class="headline"><font size="3">Sales ({{SalesTotalqty}})</font></p>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex md3 @click="reDirectToStock">
        <v-card dark color="teal" height="120px" width="200px">
          <v-card-title primary-title>
            <div>
              <p class="headline"><font size="3">Stocks ({{StockTotalqty}})</font></p>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex md3 @click="reDirectToBuyers">
        <v-card dark color="teal" height="120px" width="200px">
          <v-card-title primary-title>
            <div>
              <p class="headline"><font size="3">Buyers ({{Buyersqty}})</font></p>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex md3 @click="reDirectToReceives">
        <v-card dark color="teal" height="120px" width="200px">
          <v-card-title primary-title>
            <div>
              <p class="headline"><font size="3">Receives ({{ReceivesTotal | currency}})</font></p>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex md3 @click="reDirectToSales">
        <v-card dark color="teal" height="120px" width="200px">
          <v-card-title primary-title>
            <div>
              <p class="headline"><font size="3">Sales ({{SalesTotalAmt | currency}})</font></p>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex md3 @click="reDirectToStock">
        <v-card dark color="teal" height="120px" width="200px">
          <v-card-title primary-title>
            <div>
              <p class="headline"><font size="3">Stocks ({{StockPurchasePriceTotal | currency}})</font></p>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex md3 @click="reDirectToSuppliers">
        <v-card dark color="teal" height="120px" width="200px">
          <v-card-title primary-title>
            <div>
              <p class="headline"><font size="3">Suppliers ({{Suppliersqty}})</font></p>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
      <v-divider></v-divider>
		<v-layout row wrap>
			<v-flex xs12 class="text-md-left">
				<span class="headline pa-0 ma-0"><font face="Bahnschrift Condensed">Productbook</font></span>
        <p class="pa-0 ma-0"><font face="Bahnschrift Condensed">Version {{currentVersion}}</font></p></p>
				<v-divider></v-divider>
				<v-list>
					<v-list-tile-content v-for="(authority, index) in authorities" :key="index">
						 <v-list-tile-sub-title v-html="authority.name"></v-list-tile-sub-title>
					</v-list-tile-content>
				</v-list>
			</v-flex>
		</v-layout>
	</v-container>
</template>
<script>
import axios from 'axios'
import { version } from './../../../package.json'
export default {
  data () {
    return {
      authorities: [
        {name: 'Designed by Md. Liton Miah', description: '', Status: true},
        {name: 'Email: cmtliton@gmail.com', description: '', Status: true},
        {name: 'Mobile: 01728493546', description: '', Status: true}
      ],
      currentVersion: version
    }
  },
  computed: {
    ReceivesTotalqty () {
      return this.$store.getters['PurOrdRcvs/ReceivesTotalqty']
    },
    ReceivesTotal () {
      return this.$store.getters['PurOrdRcvs/ReceivesTotal']
    },
    SalesTotalqty () {
      return this.$store.getters['Sales/SalesTotalqty']
    },
    SalesTotalAmt () {
      return this.$store.getters['Sales/SalesTotalAmt']
    },
    StockPurchasePriceTotal () {
      return this.$store.getters['Products/StockPurchasePriceTotal']
    },
    StockTotalqty () {
      return this.$store.getters['Products/StockTotalqty']
    },
    Brandsqty () {
      return this.$store.getters['Brands/Brandsqty']
    },
    Itemsqty () {
      return this.$store.getters['Items/Itemsqty']
    },
    Productsqty () {
      return this.$store.getters['Products/Productsqty']
    },
    Buyersqty () {
      return this.$store.getters['Buyers/Buyersqty']
    },
    Suppliersqty () {
      return this.$store.getters['Suppliers/Suppliersqty']
    },
    Usersqty () {
      return this.$store.getters['Users/Usersqty']
    }
  },
  methods: {
    reDirectToReceives () {
      this.$router.push('/purordrcvs')
    },
    reDirectToSales () {
      this.$router.push('/sales')
    },
    reDirectToStock () {
      this.$router.push('/stock')
    },
    reDirectToItems () {
      this.$router.push('/items')
    },
    reDirectToBrands () {
      this.$router.push('/brands')
    },
    reDirectToProducts () {
      this.$router.push('/products')
    },
    reDirectToUsers () {
      this.$router.push('/users')
    },
    reDirectToBuyers () {
      this.$router.push('/buyers')
    },
    reDirectToSuppliers () {
      this.$router.push('/suppliers')
    },
    open (link) {
      this.$electron.shell.openExternal(link)
    },
    loadUpdate () {
      axios.get('https://api.github.com/repos/cmtliton/Productbook/releases/latest')
        .then(({data}) => {
          if (`v${version}` !== data.tag_name) {
            var isAvailable = alert('New Version available! Please download latest version.')
            if (isAvailable) {
              // logout
              this.open('https://github.com/cmtliton/Productbook/releases/latest')
              this.$store.dispatch('Users/LogginOut')
              this.$router.push('/signin')
            } else {
              // logout
              this.open('https://github.com/cmtliton/Productbook/releases/latest')
              this.$store.dispatch('Users/LogginOut')
              this.$router.push('/signin')
            }
          }
        })
        .catch((error) => {
          alert(error)
        })
    }
  },
  created () {
    this.loadUpdate()
  }
}
</script>