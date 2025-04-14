<template>
	<v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md6>
          	<form @submit.prevent="onSignup">
            <v-card class="elevation-12">
              <v-toolbar flat dense color="teal">
                <v-toolbar-title>Create User</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
              	<v-text-field prepend-icon="person" name="fullname"
                   label="Full Name"
                   id="fullname"
                   v-model="User.fullname"
                   autofocus
                   type="text" required></v-text-field>
                  <v-text-field prepend-icon="email" name="email"
                   label="Mail"
                   id="email"
                   v-model="User.email"
                   type="email"
                   :rules="[emailIsDuplicate]"
                   required></v-text-field>
                  <v-text-field prepend-icon="person" name="username"
                   label="Username"
                   id="username"
                   v-model="User.username"
                   type="text"
                   :rules="[userIsDuplicate]" required></v-text-field>
                  <v-text-field prepend-icon="lock" name="password" label="Password" id="password" type="password" v-model="User.password"></v-text-field>
                  <v-text-field prepend-icon="lock" 
                  name="confirmpassword" 
                  label="Confirm Password" 
                  id="confirmpassword" 
                  type="password"
                  v-model="User.confirmpassword" :rules="[comparePasswords]"></v-text-field>
                <v-select
                prepend-icon="map"
		            :items="Roles"
		            v-model="User.role"
		            label="User Role"
		          ></v-select>
              </v-card-text>
              <v-card-actions> 
                <v-spacer></v-spacer>
                <v-btn color="teal" flat @click="userList"><v-icon dark left>arrow_back</v-icon></v-btn>
                <v-btn type="submit" color="teal" :disabled="!formIsValid">Save</v-btn>
              </v-card-actions>
            </v-card>
        </form>
          </v-flex>
        </v-layout>
      </v-container>
</template>
<script>
export default {
  props: ['id'],
  data () {
    return {
      User: {
        fullname: '',
        email: '',
        username: '',
        password: '',
        confirmpassword: '',
        role: ''
      },
      Roles: ['Admin', 'Manager', 'Operator'],
      errorMessages: ''
    }
  },
  computed: {
    comparePasswords () {
      return this.User.password !== this.User.confirmpassword ? 'Passwords do not match' : null
    },
    userIsDuplicate () {
      return this.$store.getters['Users/getDuplicateUser'](this.User.username.trim()) ? 'Username is in used' : null
    },
    emailIsDuplicate () {
      return this.$store.getters['Users/getDuplicateEmail'](this.User.email.trim()) ? 'Email is in used' : null
    },
    formIsValid () {
      return (
        this.User.fullname &&
        this.User.email &&
        this.User.username &&
        this.User.password &&
        this.User.confirmpassword &&
        this.User.role &&
        this.userIsDuplicate == null &&
        this.emailIsDuplicate == null &&
        this.comparePasswords == null
      )
    }
  },
  methods: {
    onSignup () {
      this.$store.dispatch('Users/onSigningUp', this.User)
      this.$router.push('/users')
    },
    userList () {
      this.$router.push('/users')
    }
  },
  created () {
    if (this.$store.getters['Company/getCompany'] === null || this.$store.getters['Company/getCompany'] === undefined) {
      this.$store.dispatch('Company/loadCompany')
    }
    this.$store.dispatch('Users/loadUsers')
  }
}
</script>