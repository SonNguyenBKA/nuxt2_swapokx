<template>
  <div class="swap-page">
    <div class="swap-page__wrapper">
      <div class="swap-page__header">
        <button v-for="tab in switchTab" class="btn-switch-tab"
                :class="[{'active': tabActive === tab.tag}]"
                @click="tabActive = tab.tag"
        >{{tab.name}}</button>
      </div>
      <div class="swap-page__content">
        <InputSwapOkx @typeDialogSelect="(e) => typeDialog = e"  @valueInputEmmit="(emit) => valueInputFrom = emit"/>
        <button class="btn-exchange" @click="exchange">
          <i style="transform: rotate(90deg); color: #929292" class="fa-solid fa-right-left"></i>
        </button>
        <InputSwapOkxView @typeDialogSelect="(e) => typeDialog = e"  @valueInputEmmit="(emit) => valueInputTo = emit"/>
      </div>
      <div class="flex flex-col gap-4">
        <div class="swap-page__details">
          <div class="details_header">
            <div class="flex items-center gap-2">
              <span class="text-[14px] font-[500] text-[#3d3d3d]">1 USDC ≈ 0.000287 ETH</span>
              <i style="color: #3d3d3d; font-size: 16px;" class="fa-solid fa-arrows-rotate"></i>
            </div>
            <button>
              <i style="font-size: 14px; color: #3d3d3d;" class="fa-solid fa-chevron-down"></i>
            </button>
          </div>
          <div class="details_content">

          </div>
        </div>
        <div v-if="textWarning" class="warning-content p-[20px] border-[1px] border-[solid] border-[#F16514] rounded-[12px]">
          <span class="text-[#F16514] text-[16px] font-medium text-center">{{textWarning}}</span>
        </div>
        <BtnSwapOkx :isDisable="false" :type="true">
          <div class="flex items-center gap-2">
            <span>Connect Wallet</span>
          </div>
        </BtnSwapOkx>
      </div>

    </div>
    <DialogSelectToken v-if="isShowDialogSelect" :typeDialog="typeDialog"/>
  </div>
</template>

<script>
import _ from 'lodash'
import InputSwapOkx from "~/components/swap-okx/input-swap-okx.vue";
import InputSwapOkxView from "~/components/swap-okx/input-swap-okx-view.vue";
import DialogSelectToken from "~/components/swap-okx/dialog-select-token.vue";
import {mapActions, mapState} from "vuex";
import okxMixins from "@/mixins/okxMixins.js";
import {DEBOUNCE_TIME, LIST_CHAIN_DEFAULT, WALLET_ACC} from "~/utils/const";
import {checkTruthyAbs} from "~/utils/validate";
import BtnSwapOkx from "~/components/swap-okx/btn-swap-okx.vue";
export default {
  name: 'SwapOkxPage',
  mixins: [okxMixins],
  components: {BtnSwapOkx, DialogSelectToken, InputSwapOkxView, InputSwapOkx},
  data: () => ({
    switchTab: [
      {name: 'Swap & Bridge', tag: 'swap'},
      {name: 'Limit order', tag: 'limit_order'}
    ],
    tabActive: null,
    typeDialog: null,
    textWarning: null,
    valueInputFrom: null,
    valueInputTo: null
  }),
  async created() {
    this.setIsLoading(true)
    this.tabActive = this.switchTab[0].tag
    await Promise.all([
       this.getListAllChain(),
       this.createWalletOkx(WALLET_ACC),
       this.getListTokenFollowChain(LIST_CHAIN_DEFAULT[0].chainId)
    ])
    this.setFromTokenStore(this.listTokenFollowChain[0])
    this.setToTokenStore(this.listTokenFollowChain[1])
    this.setIsLoading(false)
  },
  computed: {
    ...mapState('swap-okx', [''])
  },
  methods: {
    ...mapActions('swap-okx', []),
    exchange: _.debounce(function(){
      console.log(123, this.valueInputFrom, this.valueInputTo)
      this.exchangeSwapOkx(this.valueInputFrom, this.valueInputTo);
    }, DEBOUNCE_TIME)
  },
  watch: {
    fromTokenStore(val) {
      // console.log('val', val)
    },
    valueInputFrom(valInputFrom) {
      console.log('valInputFrom', valInputFrom)
      this.setFromTokenStore({...this.fromTokenStore, valueInput: valInputFrom})
    },
    valueInputTo(valueInputTo) {
      console.log('valInputFrom', valueInputTo)
      this.setToTokenStore({...this.toTokenStore, valueInput: valueInputTo})
    },
    quoteStore(newQuoteStore) {
      const {commonDexInfo, pathSelectionRouterList, singleChainSwapInfo} = newQuoteStore
      // DK: Crosschain and crossMiniAmount = value other
      if(!checkTruthyAbs(pathSelectionRouterList)) {
        this.textWarning = `Số tiền tối thiểu cho hoán đổi cross-chain này là ${commonDexInfo.crossMiniAmount} ${this.fromTokenStore.tokenSymbol}`
      } else {
        this.textWarning = null
      }
    },
    deep: true
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/scss/swap-okx.scss';
</style>
