<template>
  <div class="input-swap-okx">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2 mb-4">
        <span class="text-label">To</span>
        <button class="flex items-center gap-1" @click="() => {$store.commit('swap-okx/setIsShowDialogSelect', true); $emit('typeDialogSelect', 'to')}">
          <img class="w-4 h-4" :src="toTokenStore?.chainLogoUrl" alt="">
          <span class="text-label">{{toTokenStore?.chainName}}</span>
        </button>
      </div>
      <div class="wallet">
        <i style="font-size: 14px; color: #929292" class="fa-solid fa-wallet"></i>
        <span class="text-label">0</span>
      </div>
    </div>
    <div class="flex items-center justify-between gap-2">
      <button class="flex items-center gap-2" @click="() => {$store.commit('swap-okx/setIsShowDialogSelect', true); $emit('typeDialogSelect', 'to')}">
        <img class="w-8 h-8" :src="toTokenStore?.tokenLogoUrl" alt="">
        <span class="text-[20px] leading-[24px] text-black font-medium">{{toTokenStore?.tokenSymbol}}</span>
        <i class="fa-solid fa-caret-down" style="color: #959dad"></i>
      </button>
      <input type="text"
             class="input-swap-okx__main"
             placeholder="0"
             pattern="[0-9]*"
             inputmode="numeric"
             v-model="valueInput"
             @input="handleInput"
      >
    </div>
    <p class="flex items-center justify-end text-label">${{formatPrice(singleChainSwapInfo?.toTokenPrice)}}</p>
  </div>
</template>

<script>
import {formatMoneySwapOkx, formatPrice, unFormatMoneySwapOkx} from "~/utils/format";
import okxMixins from "~/mixins/okxMixins";
import _ from "lodash";

export default {
  name: 'InputSwapOkxView',
  mixins: [okxMixins],
  data: () => ({
    valueInput: '',
    commonDexInfo: null,
    pathSelectionRouterList: null,
    singleChainSwapInfo: null
  }),
  methods: {
    formatPrice,
    handleInput(value) {
      let input = value.target.value || ''
      input = input.toString().replace(/[^0-9\\.]/g, '')
      const arr = input.split('.')
      if (arr.length > 2) {
        input = arr[0] + '.' + arr[1]
      }
      this.valueInput = formatMoneySwapOkx(input)
    },
    async getQuote(val) {
      this.setIsLoading(true)
      if (!val) {
        [this.commonDexInfo, this.pathSelectionRouterList, this.singleChainSwapInfo] = [null, null, null]
        this.setIsLoading(false)
        return
      }
      const params = {
        amount: unFormatMoneySwapOkx(val),
        chainId: this.fromTokenStore.chainId,
        toChainId: this.toTokenStore.chainId,
        toTokenAddress: this.toTokenStore.tokenContractAddress,
        fromTokenAddress: this.fromTokenStore.tokenContractAddress,
        slippage: 0.03,
        slippageType: 3,
        pmm: 1,
        gasDropType: 0,
        forbiddenBridgeTypes: 0,
        t: this.getTimeCurrentUnix
      }
      await this.quote(params)
      this.commonDexInfo = _.cloneDeep(this.quoteStore.commonDexInfo)
      this.pathSelectionRouterList = _.cloneDeep(this.quoteStore.pathSelectionRouterList)
      this.singleChainSwapInfo = _.cloneDeep(this.quoteStore.singleChainSwapInfo)
      if (!this.singleChainSwapInfo) {
        this.singleChainSwapInfo = this.pathSelectionRouterList[0]
      }
      this.setIsLoading(false)
    }
  },
  updated() {
    this.$emit('valueInputEmmit', unFormatMoneySwapOkx(this.valueInput))
  },
  watch: {
    async toTokenStore(newToToken, oldToToken) {
      // DK: khi token address cua fromToken va toToken la khac so vs new tokenChoose
      if (!oldToToken) {
        return
      }
      const tokenToAddressNew = newToToken.tokenContractAddress
      const tokenToAddressOld = oldToToken.tokenContractAddress
      if (tokenToAddressNew === tokenToAddressOld) {
        return
      }
      if (tokenToAddressOld === this.fromTokenStore.tokenContractAddress) {
        return
      }
      await this.getQuote(this.fromTokenStore.valueInput)
      console.log(3)
    },
    quoteStore(val) {
      this.commonDexInfo = _.cloneDeep(val.commonDexInfo)
      this.pathSelectionRouterList = _.cloneDeep(val.pathSelectionRouterList)
      this.singleChainSwapInfo = _.cloneDeep(val.singleChainSwapInfo)
      if (!this.singleChainSwapInfo) {
        this.singleChainSwapInfo = this.pathSelectionRouterList[0]
      }
      this.valueInput = formatMoneySwapOkx(this.singleChainSwapInfo?.receiveAmount)
    },
    isResetForm(state) {
      if(state) {
        this.valueInput = ''
      }
    },
    deep: true
  }
}
</script>

<style lang="scss" scoped>
.input-swap-okx {
  @apply bg-[#f7f7f7] flex flex-col p-5 rounded-lg;
  box-sizing: initial;
  &__main {
    @apply text-[24px] leading-[32px] text-black font-medium w-[220px];
    @apply text-right outline-0;
    background: none;
  }
}
</style>
