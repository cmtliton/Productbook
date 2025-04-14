<template>
	<v-app id="inspire">
    <div class="text-xs-center">
      <v-dialog v-model="dialog" persistent max-width="400px">
        <v-btn slot="activator" dark color="teal" flat
        v-show="item.quantity !== SlNoLength">SlNo</v-btn>
        <v-card>
          <v-card-title class="headline" primary-title>
            {{item.title}}...
          </v-card-title>
  
          <v-card-text>
            <v-text-field
             v-model="SlNo"
             required
             autofocus
             @keyup.enter="SlNoSave(item)">
             </v-text-field>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              flat
              @click="dialog = false"
            >
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-app>
</template>

<script>
export default {
  props: ['item'],
  data () {
    return {
      dialog: false,
      SlNo: '',
      SlNos: []
    }
  },
  computed: {
    SlNoLength () {
      if (this.item.SlNos) {
        return this.item.SlNos.length
      } else {
        return ''
      }
    }
  },
  methods: {
    SlNoSave (item) {
      if (this.SlNo.trim().length >= 8) {
        if (this.SlNos.length !== item.quantity) {
          const isDuplicateSl = this.SlNos.find(sl => {
            return sl === this.SlNo
          })
          if (isDuplicateSl === undefined) {
            this.SlNos.push(this.SlNo)
            this.SlNo = ''
          } else {
            alert('Duplicate Sl No.')
            this.SlNo = ''
            this.dialog = true
          }
        } else {
          this.dialog = false
          this.$store.dispatch('PurOrdRcvs/takingSlNos', {
            ProductId: item.ProductId,
            SlNos: this.SlNos
          })
          this.SlNos = []
          this.SlNo = ''
        }
      } else {
        alert('Must be 8 digit!')
        this.SlNo = ''
        this.dialog = true
      }
    }
  }
}
</script>