<template>
  <v-layout row justify-center>
     <v-dialog v-model="ItemDialog" persistent max-width="400px">
      <v-btn slot="activator" color="teal" dark>Create Item</v-btn>
  <v-card flat>
    <v-snackbar
      v-model="snackbar"
      absolute
      top
      right
      color="success"
    >
      <span>Item Creation successful!</span>
      <v-icon dark>check_circle</v-icon>
    </v-snackbar>
    <v-card-title>
          <span class="headline">Create Item</span>
        </v-card-title>
    <form @submit.prevent="onSave">
      <v-container grid-list-xl fluid>
        <v-layout wrap>
          <v-flex xs12>
            <v-text-field
              v-model="Item.ItemName"
              :rules="[ItemIsDuplicate]"
              color="purple darken-2"
              label="Item Name"
              type="text"
              autofocus
              required
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="teal" flat @click="Items"><v-icon dark left>arrow_back</v-icon></v-btn>
        <v-btn
          color="teal"
          :disabled="!formIsValid"
          type="submit"
        >Create</v-btn>
      </v-card-actions>
    </form>
  </v-card>
</v-dialog>
</v-layout>
</template>

<script>
  export default {
    data () {
      const blankItem = Object.freeze({
        ItemName: '',
        Status: true
      })

      return {
        Item: Object.assign({}, blankItem),
        snackbar: false,
        blankItem,
        ItemDialog: false
      }
    },

    computed: {
      formIsValid () {
        return (
          this.Item.ItemName &&
          this.ItemIsDuplicate === ''
        )
      },
      ItemIsDuplicate () {
        return this.$store.getters['Items/getDuplicateItem'](this.Item.ItemName.trim()) ? 'Item already exist' : ''
      }
    },

    methods: {
      onSave () {
        this.snackbar = true
        this.$store.dispatch('Items/onSavingItem', this.Item)
        setTimeout(() => {
          this.snackbar = false
          this.ItemDialog = false
          this.Item = Object.assign({}, this.blankItem)
        }, 1000)
      },
      Items () {
        this.$router.push('/items')
        this.ItemDialog = false
      }
    }
  }
</script>