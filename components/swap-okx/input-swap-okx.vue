<template>
  <div class="input-swap-okx">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2 mb-4">
        <span class="text-label">From</span>
        <button class="flex items-center gap-1"
                @click="() => {$store.commit('swap-okx/setIsShowDialogSelect', true); $emit('typeDialogSelect', 'from')}">
          <img class="w-4 h-4" :src="fromTokenStore?.chainLogoUrl" alt="">
          <span class="text-label">{{ fromTokenStore?.chainName }}</span>
        </button>
      </div>
      <div class="wallet">
        <i style="font-size: 14px; color: #929292" class="fa-solid fa-wallet"></i>
        <span class="text-label">{{ formatPrice(fromTokenStore?.amountNumBigDecimal, 6) }}</span>
        <button class="text-label !text-[#004cff]" @click="valueInput = fromTokenStore?.amountNumBigDecimal">Max
        </button>
      </div>
    </div>
    <div class="flex items-center justify-between gap-2">
      <button class="flex items-center gap-2"
              @click="() => {$store.commit('swap-okx/setIsShowDialogSelect', true);  $emit('typeDialogSelect', 'from')}">
        <img class="w-8 h-8" :src="fromTokenStore?.tokenLogoUrl" alt="">
        <span class="text-[20px] leading-[24px] text-black font-medium">{{ fromTokenStore?.tokenSymbol }}</span>
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
    <p v-if="commonDexInfo" class="flex items-center justify-end text-label">
      ${{ formatPrice(commonDexInfo.fromTokenPrice) }}</p>
  </div>
</template>

<script>
import {formatMoneySwapOkx, formatPrice, unFormatMoneySwapOkx} from "~/utils/format";
import okxMixins from "~/mixins/okxMixins";
import _ from "lodash";
import {checkTruthyAbs} from "~/utils/validate";
import {DEBOUNCE_TIME} from "~/utils/const";

export default {
  name: 'InputSwapOkx',
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
      this.setIsLoading(true);
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
      this.setIsLoading(false);
    }
  },updated() {
    // console.log('fromTokenStore 123', this.fromTokenStore)
  },
  watch: {
    valueInput: _.debounce(async function (newVal, oldVal) {
      if (newVal === '0' || !newVal) {
        this.$store.commit('swap-okx/setIsRestForm', true);
        return
      }
      this.$store.commit('swap-okx/setIsRestForm', false);
      if (newVal === this.fromTokenStore.valueInput) {
        return
      }
      if (Number(unFormatMoneySwapOkx(newVal))) {
        await this.getQuote(newVal)
      }
      this.$emit('valueInputEmmit', unFormatMoneySwapOkx(newVal))
      console.log(1)
    }, DEBOUNCE_TIME),
    async fromTokenStore(newFromToken, oldFromToken) {
      // DK: khi token address cua fromToken va toToken la khac so vs new tokenChoose
      if (!oldFromToken) {
        return
      }
      const tokenFromAddressNew = newFromToken.tokenContractAddress
      const tokenFromAddressOld = oldFromToken.tokenContractAddress
      if (tokenFromAddressNew === tokenFromAddressOld) {
        return
      }
      this.valueInput = this.fromTokenStore.valueInput
      await this.getQuote(this.valueInput)
      console.log(2)
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
