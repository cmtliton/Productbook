<template>
	<v-container class="pa-0 ma-0">
    <h2 class="text-xs-center pa-0 ma-0"><font face="Monotype Corsiva">
    {{getCompany.ComName}}
  </font></h2>
    <p class="text-xs-center pa-0 ma-0"><font face="Time new Roman" size="2">{{getCompany.Addr}}</font></p>
    <p class="text-xs-center pa-0 ma-0"><font face="Time new Roman" size="1"><span v-show="getCompany.Tel">Tel: {{getCompany.Tel}},</span> Cell: {{getCompany.Mobile}}</font></p>
	</v-container>
</template>

<script>
export default {
  computed: {
    getCompany () {
      return this.$store.getters['Company/getCompany']
    }
  }
}
</script>