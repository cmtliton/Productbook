<template>
	<v-container>
        <v-layout row justify-center>
          <v-flex xs12>
          	<v-card>
    <v-card-title>
      <v-btn slot="activator" color="teal" dark @click="newUser">New User</v-btn>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        autofocus
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-divider></v-divider>
  <v-data-table
      :headers="UsersHeader"
      :items="Users"
      item-key="id"
      :search="search"
      class="elevation-1"
    >
  <!-- Table Data -->
  <template slot="items" slot-scope="props">
      <td class="text-xs-left">{{ props.item.fullname }}</td>
      <td class="text-xs-left">{{ props.item.email }}</td>
      <td class="text-xs-left">{{ props.item.username }}</td>
      <td class="text-xs-left">
      	<v-icon color="teal" small @click="toggle(props.item)">{{props.item.status == true ? 'check_circle' : 'highlight_off'}}</v-icon>
      </td>
      <td class="text-xs-left layout px-0">
        <span>
      	<v-btn flat icon :to="'/edituser/' +props.item.id">
      	<v-icon
            small
            class="mr-2"
            color="teal"
          >
            edit
          </v-icon>
      </v-btn>
    </span>
    <span>
      <v-btn icon flat
            @click="deleteUser(props.item)">
      <v-icon
            small
            color="teal">
            delete
          </v-icon>
      </v-btn>
    </span>
      </td>
     </template>
     <!-- Nothing to display -->
     <v-alert slot="no-results" :value="true" color="error" icon="warning">
        Your search for "{{ search }}" found no results.
     </v-alert>
</v-data-table>
</v-card>
</v-flex>
</v-layout>
</v-container>
</template>
<script>
export default {
  data () {
    return {
      UsersHeader: [
        {text: 'Name', value: 'fullname'},
        {text: 'Email', value: 'email'},
        {text: 'Username', value: 'username'},
        {text: 'Status', value: 'status'},
        {text: 'Actions', value: 'actions'}
      ],
      search: ''
    }
  },
  computed: {
    Users () {
      return this.$store.getters['Users/getUsers']
    }
  },
  created () {
    this.$store.dispatch('Users/loadUsers')
  },
  methods: {
    newUser () {
      this.$router.push('/createuser')
    },
    toggle (item) {
      this.$store.dispatch('Users/UserStatusChanges', {id: item.id, status: item.status})
    },
    deleteUser (item) {
      this.$store.dispatch('Users/UserRemove', item)
    }
  }
}
</script>