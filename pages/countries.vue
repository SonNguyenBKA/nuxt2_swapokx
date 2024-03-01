<template>
  <div class="countries-page">
    countries-page
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: 'CountriesPage',
  async created() {
   const countriesList = await this.getAllCountries()
    console.log('countriesList', countriesList)
  },
  methods: {
    ...mapActions('countries', ['getAllCountries']),
  }
}
</script>

<style lang="scss" scoped>

</style>
