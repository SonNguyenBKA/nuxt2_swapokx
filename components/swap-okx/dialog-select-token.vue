<template>
 <el-dialog
   class="dialog-select-token-okx"
   width="420px"
   :visible.sync="isShow"
 >
   <template #title>
     <div class="flex items-center justify-between">
       <p class="text-[16px] leading-[20px] text-black font-medium">Select pay token {{typeDialog}}</p>
       <button @click="() => $store.commit('swap-okx/setIsShowDialogSelect', false)"><i style="font-size: 24px; color: #929292" class="fa-solid fa-xmark"></i></button>
     </div>
   </template>
   <div class="dialog-content">
     <el-input
       class="input-search-token"
       placeholder="Search symbol, contract address"
       v-model="valueSearch">
       <template slot="prepend">
         <i style="color: black" class="fa-solid fa-magnifying-glass"></i>
       </template>
     </el-input>
     <p class="text-[12px] font-medium pt-[16px] pb-[12px] leading-[16px] text-[#3d3d3d]">Select network: {{chainActive?.chainName}}</p>
     <div class="flex items-center gap-2">
       <el-tooltip v-for="chain in listChainFilter"
                   class="btn-list-chain" placement="top"
                   :content="chain.chainName"
                   :class="[{'active': chainActive.chainId === chain.chainId}]"
                   >
         <div @click="() => {chainActive = chain; getListTokenFollowChain(chain.chainId)}">
           <img class="w-6 h-6" :src="chain.chainLogo" alt="icon chain">
         </div>
       </el-tooltip>
     </div>
     <p class="text-[12px] font-medium pt-[16px] pb-[12px] leading-[16px] text-[#3d3d3d]">Select Token</p>
<!--     {{listTokenFollowChain}}-->
     <ul class="list-token custom-scroll-bar">
       <li v-for="token in listTokenFollowChain" class="flex items-center justify-between p-2" @click="selectToken(token)" :class="[{'bg-[#dadada]': isActiveToken(token)}]">
        <div class="flex items-center gap-2">
          <img class="w-9 h-9" :src="token.tokenLogoUrl" alt="">
           <div class="flex flex-col gap-0.5">
             <span class="text-[16px] leading-[20px] text-black font-medium">{{token.tokenSymbol}}</span>
             <span class="text-[#929292] text-[12px] leading-[14px] font-[400]">{{token.tokenName}}</span>
           </div>
        </div>
         <div class="flex items-center gap-3">
           <div class="flex flex-col gap-0.5 items-end">
             <span class="text-[16px] leading-[20px] text-black font-medium">{{formatPrice(token.amountNumBigDecimal)}}</span>
             <span class="text-[#929292] text-[12px] leading-[14px] font-[400]">${{formatPrice(token.currencyAmount) || '0.00'}}</span>
           </div>
           <button @click="likeToken(token)">
             <i v-if="!token.isCollectToken" class="fa-regular fa-star text-[#bdbdbd] "></i>
             <i v-else class="fa-solid fa-star text-[#ffc327]"></i>
           </button>
         </div>
       </li>
     </ul>
   </div>
 </el-dialog>
</template>

<script>
import _ from "lodash";
import {mapState} from "vuex";
import okxMixins from "~/mixins/okxMixins";
import {formatPrice} from "~/utils/format";
import {DEBOUNCE_TIME, LIST_CHAIN_DEFAULT, USER_UNIQUE_ID, WALLET_ACC} from "~/utils/const";
export default {
  name: 'DialogSelectToken',
  mixins: [okxMixins],
  props: {
    typeDialog: {type: String, default: ''}
  },
  data() {
    return {
      isShow: true,
      valueSearch: '',
      chainActive: null,
      tokenActive: null
    }
  },
  async created() {
    this.setIsLoading(true)
    if (this.typeDialog === 'from') {
      this.chainActive = this.fromTokenStore ? { chainId: this.fromTokenStore.chainId } : LIST_CHAIN_DEFAULT[0]
      this.tokenActive = this.fromTokenStore
    } else {
      this.chainActive = this.toTokenStore ? { chainId: this.toTokenStore.chainId } : LIST_CHAIN_DEFAULT[0]
      this.tokenActive = this.toTokenStore
    }
    await this.getListTokenFollowChain(this.chainActive.chainId)
    this.setIsLoading(false)
  },
  computed:{
    listChainFilter() {
      const IDs = LIST_CHAIN_DEFAULT.map(item => item.chainId)
      return this.listChain.filter(item => IDs.includes(item.chainId))
    }
  },
  methods: {
    formatPrice,
    isActiveToken(token) {
      return this.tokenActive.tokenContractAddress === token.tokenContractAddress
    },
    selectToken(token) {
      if(this.typeDialog === 'to' && token.tokenContractAddress === this.fromTokenStore.tokenContractAddress) {
        this.exchangeSwapOkx()
        this.$store.commit('swap-okx/setIsShowDialogSelect', false)
        return
      }
      if(this.typeDialog === 'from' && token.tokenContractAddress === this.toTokenStore.tokenContractAddress) {
        this.exchangeSwapOkx()
        this.$store.commit('swap-okx/setIsShowDialogSelect', false)
        return
      }
      if (this.typeDialog === 'from') {
        this.setFromTokenStore(token)
      } else {
        this.setToTokenStore(token)
      }
      this.$store.commit('swap-okx/setIsShowDialogSelect', false)
    },
    likeToken(token) {
     const params = {
       "tokenContractAddress": token.tokenContractAddress,
       "chainId": token.chainId,
       "symbol": token.tokenSymbol,
       "decimal": token.decimals,
       "isCustomToken": token.isCustomToken,
       "walletAddress": WALLET_ACC,
       "userUniqueId": this.$cookies.get('unique_user') || USER_UNIQUE_ID,
       "walletId": this.walletId
     }
     const res = this.addOrCancelCollectionToken(params)
      console.log(res)
    }
  },
  watch: {
    isShow(val) {
      if (!val) {
        this.$store.commit('swap-okx/setIsShowDialogSelect', false)
        this.isShow = true
      }
    },
    valueSearch: _.debounce(async function(newValSearch) {
      this.setIsLoading(true)
      if (!newValSearch.toString().trim()) {
        await this.getListTokenFollowChain(this.chainActive.chainId)
        return
      }
      const params = {
        walletId: this.walletId,
        userUniqueId: this.userUniqueId,
        chainType: 0,
        inputContent: newValSearch,
        fromChainId: this.chainActive.chainId,
        toChainId: this.chainActive.chainId,
        t: this.getTimeCurrentUnix
      }
      await this.searchToken(params)
      this.setIsLoading(false)
    }, DEBOUNCE_TIME)
  }
}
</script>

<style lang="scss">
.el-dialog__wrapper.dialog-select-token-okx {
  .el-dialog {
    border-radius: 8px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: 0 !important;
    .el-dialog__header {
      padding: 12px;
      border-bottom: 1px solid #ebebeb;
      .el-dialog__headerbtn {
        display: none !important;
      }
    }
    .el-dialog__body {
      padding: 20px 12px;
      .input-search-token {
        border: 1px solid transparent;
        .el-input-group__prepend {
          @apply py-2 pl-2 pr-0;
          background-color: #f5f5f5;
          border: none;
        }
        .el-input__inner {
          background-color: #f5f5f5;
          padding: 8px;
          border: none;
        }
        &:hover {
          border: 1px solid black;
          border-radius: 4px;
        }
      }
      .btn-list-chain {
        @apply h-[50px] w-[50px] rounded-[12px] flex justify-center items-center cursor-pointer;
        border: 1px solid #ebebeb;
        &.active {
          border: 1px solid black;
        }
      }
      .dialog-content {
        .list-token {
          @apply max-h-[600px] overflow-auto;
          margin-right: -4px;
          padding-right: 4px;
          li {
            border-radius: 8px;
            &:hover {
              background: #dadada;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
.custom-scroll-bar {
  /* width */
  &::-webkit-scrollbar {
    width: 5px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px rgba(128, 128, 128, 0.3);
    border-radius: 10px;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: black;
    border-radius: 10px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: black;
  }
}
</style>
