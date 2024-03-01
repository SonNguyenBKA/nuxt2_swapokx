<template>
  <div class="layout-default">
    <LoadingComponent v-if="isLoading" />
    <client-only>
      <nuxt />
    </client-only>
  </div>
</template>

<script>
import LoadingComponent from "~/components/common/loading.vue";
import homeMixins from "~/mixins/homeMixins";

export default {
  name: 'LayoutDefault',
  mixins: [homeMixins],
  components: {LoadingComponent}
}
</script>

<style lang="scss" scoped>
.layout-default {
  position: relative;
  background: rgba(0, 0, 0, 0.9);
}
</style>
