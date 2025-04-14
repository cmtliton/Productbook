import Vue from 'vue'
import axios from 'axios'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import 'babel-polyfill'
import * as firebase from 'firebase'

import App from './App'
import router from './router'
import store from './store'

import CharFilter from './components/Filters/CharFilter'
import { currency } from './components/Filters/currency'
import appDateFilter from './components/Filters/date'
import appSignInAlert from './components/Shared/alert'
import CompanyHeader from './components/Shared/CompanyHeader'
import ProductList from './components/Products/Forms/ProductList'
const remote = require('electron').remote

Vue.component('app-signin-alert', appSignInAlert)
Vue.component('app-product-list', ProductList)
Vue.component('app-company-header', CompanyHeader)

Vue.filter('date', appDateFilter)
Vue.filter('currency', currency)
Vue.filter('charfilter', CharFilter)

Vue.use(Vuetify)
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
  created () {
    this.$store.dispatch('Company/loadCompany')
    if (this.$store.getters['Company/getCompany'] === null || this.$store.getters['Company/getCompany'] === undefined) {
      var yes = confirm('You have existing database(company.json)? If yes press OK otherwise press Cancel')
      if (yes) {
        alert('Please right click on Productbook shortcut from your desktop and select open file location and drop your database here! Now start your application click on desktop Productbook shortcut.')
        remote.getCurrentWindow().close()
      } else {
        this.$router.push('/company')
      }
    } else {
      this.$router.push('/signin')
    }
    firebase.initializeApp({
      apiKey: 'AIzaSyA7QTVLmYgsGzoske0uGc9lhOfy3flHY4E',
      authDomain: 'productbook-c5089.firebaseapp.com',
      databaseURL: 'https://productbook-c5089.firebaseio.com',
      projectId: 'productbook-c5089',
      storageBucket: 'productbook-c5089.appspot.com',
      messagingSenderId: '727302994044'
    })
  }
}).$mount('#app')
