<template>
  <v-layout row justify-center>
     <v-dialog v-model="EditItemDialog" persistent max-width="400px">
      <v-btn slot="activator" color="teal" flat icon
      @click="editItem(editedItem)"><v-icon color="teal" small>edit</v-icon></v-btn>
  <v-card flat>
    <v-snackbar
      v-model="snackbar"
      absolute
      top
      right
      color="success"
    >
      <span>Item Update successful!</span>
      <v-icon dark>check_circle</v-icon>
    </v-snackbar>
    <v-card-title>
          <span class="headline">Edit Item</span>
        </v-card-title>
    <form @submit.prevent="onSaveChange">
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
        :disabled="!formIsValid"
          color="teal"
          type="submit"
        >Update</v-btn>
      </v-card-actions>
    </form>
  </v-card>
</v-dialog>
</v-layout>
</template>

<script>
  export default {
    props: {
      editedItem: Object
    },
    data () {
      const blankItem = Object.freeze({
        ItemName: '',
        Status: true
      })

      return {
        Item: Object.assign({}, blankItem),
        snackbar: false,
        blankItem,
        EditItemDialog: false
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
        if (this.Item.ItemName.trim()) {
          var ItemHasDuplicate = this.$store.getters['Items/getDuplicateItem'](this.Item.ItemName.trim())
          return ItemHasDuplicate && ItemHasDuplicate.id !== this.Item.id ? 'Item already exist' : ''
        }
        return true
      }
    },

    methods: {
      onSaveChange () {
        this.snackbar = true
        this.$store.dispatch('Items/onSavingChangeItem', this.Item)
        setTimeout(() => {
          this.snackbar = false
          this.EditItemDialog = false
          this.Item = Object.assign({}, this.blankItem)
        }, 1000)
      },
      Items () {
        this.$router.push('/Items')
        this.EditItemDialog = false
      },
      editItem (editedItem) {
        this.Item = Object.assign({}, editedItem)
        this.EditItemDialog = true
      }
    }
  }
</script>