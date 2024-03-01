<template>
  <div class="loading-component">
    <i class="fa-solid fa-spinner"></i>
  </div>
</template>

<script>
export default {
 name: 'LoadingComponent'
}
</script>

<style lang="scss" scoped>
.loading-component {
  position: absolute;
  inset: 0;
  height: 100dvh;
  width: 100%;
  backdrop-filter: blur(5px);
  z-index: 3000;
  @apply flex justify-center items-center;
   i {
     font-size: 50px;
     @apply  animate-spin;
   }
}
</style>
