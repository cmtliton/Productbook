<template>
	<v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
            <v-form @submit.prevent="onSaveCompany">
            <v-card class="elevation-12">
              <v-toolbar flat dense color="teal">
                <v-toolbar-title>{{formTitle}}</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                  <v-text-field prepend-icon="business" name="ComName" label="Company Name" type="text" v-model="Company.ComName" :rules="[rules.required]" autofocus required></v-text-field>
                  <v-text-field prepend-icon="person" name="Addr" label="Address" type="text" v-model="Company.Addr" :rules="[rules.required]" required></v-text-field>
                  <v-text-field prepend-icon="phone" name="Tel" label="Phone No" type="text" v-model="Company.Tel"></v-text-field>
                  <v-text-field prepend-icon="phone" name="Mobile" label="Mobile No" type="text" v-model="Company.Mobile" :rules="[rules.required, () => Company.Mobile.length == 11 || 'Must be 11 digits']" required></v-text-field>
                  <v-text-field prepend-icon="email" name="Email" label="Email" type="text" v-model="Company.Email" :rules="[rules.required, rules.email]" required></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="teal" :disabled="!formIsValid" type="submit" @keyup.enter="onSaveCompany">{{buttonTitle}}</v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
          </v-flex>
        </v-layout>
      </v-container>
</template>

<script>
export default {
  data () {
    return {
      Company: {
        ComName: '',
        Addr: '',
        Tel: '',
        Mobile: '',
        Email: '',
        Date: new Date()
      },
      EditCompany: {
        ComName: '',
        Addr: '',
        Tel: '',
        Mobile: '',
        Email: '',
        Date: ''
      },
      editedIndex: -1,
      rules: {
        required: (value) => !!value || 'Required.',
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      }
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Company Information' : 'Edit Company Information'
    },
    buttonTitle () {
      return this.editedIndex === -1 ? 'Save' : 'Update'
    },
    formIsValid () {
      return (
        this.Company.ComName &&
        this.Company.Addr &&
        this.Company.Mobile &&
        this.Company.Email
      )
    }
  },
  methods: {
    editCompany () {
      if (this.$store.getters['Company/getCompany']) {
        this.Company = Object.assign({}, this.$store.getters['Company/getCompany'])
        this.editedIndex = 1
      }
    },
    onSaveCompany () {
      if (this.editedIndex > -1) {
        this.$store.dispatch('Company/onUpdatingCompany', this.Company)
        this.$router.push('/')
      } else {
        this.$store.dispatch('Company/onSavingCompany', this.Company)
        this.$router.push('/createuser')
      }
    }
  },
  created () {
    this.editCompany()
  }
}
</script>