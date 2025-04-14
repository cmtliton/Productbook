<template>
    <v-app id="inspire">
     <!--  Toolbar show only Medium and up devices -->
      <v-toolbar dark 
      :color="color"
      app
      height="40%"
      v-show="getUser"
      fixed>
        <v-toolbar-title @click="Home">Dashboard</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-menu open-on-hover offset-y 
          open-delay="300"
          v-for="(menu, index) in menuItems" :key="index">
          <v-btn :to="menu.link" slot="activator" flat small>
            <v-icon left>{{menu.menuIcon}}</v-icon>
          <span>{{menu.menuTitle}}</span>
        </v-btn>
        <v-list dense>
        <v-list-tile v-for="(subMenu, index1) in menu.subMenuItems" :key="index1" :to="subMenu.subMenuLink">
          <v-list-tile-title>{{subMenu.subMenuTitle}}</v-list-tile-title>
        </v-list-tile>
      </v-list>
      </v-menu>
      <v-menu v-if="getUser" open-on-hover offset-y bottom open-delay="300">
        <v-btn slot="activator" flat small>
          <v-icon left>person</v-icon>
          <span>{{getUser.fullname}}</span>
        </v-btn>
        <v-list dense>
          <v-list-tile @click="Logout">
            <v-list-tile-title>Logout</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
        </v-toolbar-items>
      </v-toolbar>
<!-- Display Content -->
      <v-content>
        <v-container fluid fill-height>
          <v-slide-y-transition mode="out-in">
            <router-view></router-view>
          </v-slide-y-transition>
        </v-container>
      </v-content>
      <!-- Bottom Navigation -->
      <v-bottom-nav
      :value="true"
      :active.sync="bottomNav"
      :color="color"
      fixed
      v-show="getUser"
      shift
      class="hidden-md-and-up">
      <v-menu open-on-hover offset-y top open-delay="300"
      v-for="(menu, index) in menuItems" :key="index">
        <v-btn dark
        :to="menu.link"
        slot="activator">
        <span>{{menu.menuTitle}}</span>
        <v-icon>{{menu.menuIcon}}</v-icon>
      </v-btn>
      <v-list dense>
        <v-list-tile v-for="(subMenu, index1) in menu.subMenuItems" :key="index1" :to="subMenu.subMenuLink">
          <v-list-tile-title>{{subMenu.subMenuTitle}}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
    <v-menu v-if="getUser" open-on-hover offset-y top open-delay="300">
        <v-btn slot="activator" dark>
          <span>{{getUser.fullname}}</span>
          <v-icon left>person</v-icon>
        </v-btn>
        <v-list dense>
          <v-list-tile @click="Logout">
            <v-list-tile-title>Logout</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      </v-bottom-nav>
    </v-app>
</template>

<script>
  export default {
    name: 'Productbook',
    data () {
      return {
        sideNav: false,
        bottomNav: 1
      }
    },
    computed: {
      menuItems () {
        return this.$store.getters.getMenus
      },
      getUser () {
        return this.$store.getters['Users/getUser']
      },
      color () {
        switch (this.bottomNav) {
          case 0: return 'blue-grey'
          case 1: return 'teal'
          case 2: return 'brown'
          case 3: return 'indigo'
          case 4: return 'blue-grey lighten-2'
          case 5: return 'purple lighten-1'
        }
      }
    },
    methods: {
      Logout () {
        this.$store.dispatch('Users/LogginOut')
        this.$router.push('/signin')
      },
      Home () {
        this.$router.push('/')
      }
    }
  }
</script>

<style>
 @import "~material-design-icons-iconfont/dist/material-design-icons.css";
 @import url('https://cdn.materialdesignicons.com/2.1.19/css/materialdesignicons.min.css');
</style>
