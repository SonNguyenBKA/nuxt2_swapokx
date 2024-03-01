<template>
  <button class="btn-swap-okx"
          :class="type ? 'bg-black' : 'bg-[#0569ff]'"
          :disabled="isDisable">
    <slot />
  </button>
</template>

<script>
export default {
  name: 'BtnSwapOkx',
  props: {
    isDisable: {type: Boolean, default: false},
    type: {type: Boolean, default: false},
  }
}
</script>

<style lang="scss" scoped>
.btn-swap-okx {
  @apply px-6 py-3 rounded-[50px] w-full;
  @apply flex justify-center items-center;
  div, span, p {
    @apply text-white text-[20px] font-medium;
  }
  &:hover {
    @apply opacity-[0.8];
  }
  &:disabled, &:hover:disabled {
    @apply bg-gray-500 cursor-pointer opacity-[1];
  }
}
</style>
