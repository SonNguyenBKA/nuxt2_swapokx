<template>
  <div class="vuex-page">
    <p>counter: {{counter}}</p>
    <p>getCounter: {{getCounter}}</p>
    <v-btn @click="() => $store.dispatch('counterStore/increase')">Add Counter</v-btn>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
export default {
  name: 'VueXPage',
  computed: {
    ...mapState('counterStore', ['counter']),
    getCounter() {
      return this.$store.getters['counterStore/getCounter'];
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
