<template>
<v-container>
  <v-card class="mx-auto" max-width="500">
    <v-card-title primary-title>
      Receives Summary Supplier/Product Wise
    </v-card-title>
    <v-card-text>
      <v-layout row justify-center>
        <v-flex xs12 sm12>
    <v-autocomplete
            v-model="SupplierId"
            :items="Suppliers"
            item-text="SupplierName"
            item-value="id"
            dense
            label="Select Supplier"
          ></v-autocomplete>
  </v-flex>
      </v-layout>
	<v-layout row justify-center>
		<v-flex xs12 sm4>
          <v-menu
            ref="dtmenu1"
            :close-on-content-click="false"
            v-model="dtmenu1"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            max-width="290px"
            min-width="290px"
          >
            <v-text-field
              slot="activator"
              v-model="DateFrm"
              label="Date From"
              persistent-hint
              prepend-icon="event"
            ></v-text-field>
            <v-date-picker v-model="DateFrm" no-title @input="dtmenu1 = false"></v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs12 sm4>
          <v-menu
            ref="tmenu1"
            :close-on-content-click="false"
            v-model="tmenu1"
            :nudge-right="40"
            :return-value.sync="tmenu1"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            max-width="290px"
            min-width="290px"
          >
            <v-text-field
              slot="activator"
              v-model="TimeFrm"
              label="Time From"
              persistent-hint
              prepend-icon="access_time"
            ></v-text-field>
            <v-time-picker v-model="TimeFrm" color="teal" @change="$refs.tmenu1.save(TimeFrm)"></v-time-picker>
          </v-menu>
        </v-flex>
	</v-layout>
  <v-layout row justify-center>
    <v-flex xs12 sm4>
          <v-menu
            ref="dtmenu2"
            :close-on-content-click="false"
            v-model="dtmenu2"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            max-width="290px"
            min-width="290px"
          >
            <v-text-field
              slot="activator"
              v-model="DateTo"
              label="Date To"
              persistent-hint
              prepend-icon="event"
            ></v-text-field>
            <v-date-picker v-model="DateTo" no-title @input="dtmenu2 = false"></v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs12 sm4>
          <v-menu
            ref="tmenu2"
            :close-on-content-click="false"
            v-model="tmenu2"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            max-width="290px"
            min-width="290px"
          >
            <v-text-field
              slot="activator"
              v-model="TimeTo"
              label="Time To"
              persistent-hint
              prepend-icon="access_time"
            ></v-text-field>
            <v-time-picker v-model="TimeTo" color="teal" @change="$refs.tmenu2.save(TimeTo)"></v-time-picker>
          </v-menu>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn flat @click="datefromReport">View</v-btn>
      <v-btn flat @click="redirectToReceives">Cancel</v-btn>
    </v-card-actions>
    </v-card>
</v-container>
</template>
<script>
export default {
  data () {
    return {
      DateFrm: new Date().toISOString().substr(0, 10),
      TimeFrm: '0:00',
      DateTo: new Date().toISOString().substr(0, 10),
      TimeTo: '23:59',
      dtmenu1: false,
      tmenu1: false,
      dtmenu2: false,
      tmenu2: false,
      SupplierId: null
    }
  },
  computed: {
    submittableDateTimeFrm () {
      const DateFrm = new Date(this.DateFrm)
      if (typeof this.TimeFrm === 'string') {
        let hours = this.TimeFrm.match(/^(\d+)/)[1]
        const minutes = this.TimeFrm.match(/:(\d+)/)[1]
        DateFrm.setHours(hours)
        DateFrm.setMinutes(minutes)
      } else {
        DateFrm.setHours(this.TimeFrm.getHours())
        DateFrm.setMinutes(this.TimeFrm.getMinutes())
      }
      return DateFrm
    },
    Suppliers () {
      return this.$store.getters['Suppliers/getSuppliers']
    },
    submittableDateTimeTo () {
      const DateTo = new Date(this.DateTo)
      if (typeof this.TimeTo === 'string') {
        let hours = this.TimeTo.match(/^(\d+)/)[1]
        const minutes = this.TimeTo.match(/:(\d+)/)[1]
        DateTo.setHours(hours)
        DateTo.setMinutes(minutes)
      } else {
        DateTo.setHours(this.TimeTo.getHours())
        DateTo.setMinutes(this.TimeTo.getMinutes())
      }
      return DateTo
    }
  },
  methods: {
    datefromReport () {
      var datereport = {
        d1: this.submittableDateTimeFrm,
        d2: this.submittableDateTimeTo,
        SupplierId: this.SupplierId
      }
      this.$store.dispatch('PurOrdRcvs/findReceivesProduct', datereport)
      this.$router.push({name: 'RptReceives', params: { datereport }})
    },
    redirectToReceives () {
      this.$router.push('/purordrcvs')
    }
  }
}
</script>