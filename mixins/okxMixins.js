import {axiosOkx, postAxiosOkxV5} from "~/utils/api";
import {mapActions, mapMutations, mapState} from "vuex";
import _ from "lodash";
import homeMixins from "~/mixins/homeMixins";
import {DEBOUNCE_TIME} from "~/utils/const";
const { v4: uuidv4 } = require('uuid')
export const CHAIN_REQUIRED = [
  { chainName: 'ETH', chainId: 1, tokenApprove: '0x40aA958dd87FC8305b97f2BA922CDdCa374bcD7f' },
  { chainName: 'BNB', chainId: 56, tokenApprove: '0x2c34A2Fb1d0b4f55de51E1d0bDEfaDDce6b7cDD6' },
  { chainName: 'OP', chainId: 10, tokenApprove: '0x68D6B739D2020067D1e2F713b999dA97E4d54812' },
  { chainName: 'Arbitrum', chainId: 42161, tokenApprove: '0x70cBb871E8f30Fc8Ce23609E9E0Ea87B6b222F58' },
  { chainName: 'Polygon', chainId: 137, tokenApprove: '0x3B86917369B83a6892f553609F3c2F439C184e31' },
  { chainName: 'Base', chainId: 8453, tokenApprove: '0x57df6092665eb6058DE53939612413ff4B09114E' }
]

export default {
  mixins: [homeMixins],
  computed: {
    ...mapState('swap-okx', ['walletId', 'isShowDialogSelect', 'listChain', 'listTokenFollowChain', 'fromTokenStore', 'toTokenStore', 'quoteStore', 'isResetForm', 'isExchange'])
  },
  methods: {
    ...mapActions('swap-okx', ['createWalletOkxActions', 'getListTokenFollowChainActions', 'searchToken', 'getListAllChain', 'quote', 'addOrCancelCollectionToken']),
    ...mapMutations('swap-okx', ['setIsShowDialogSelect', 'setFromTokenStore', 'setToTokenStore', 'setIsRestForm', 'setIsExchange']),
    getTimeCurrentUnix() {
      return (new Date()).getTime()
    },
    async createWalletOkx(currentWallet) {
      const uniqueId = uuidv4()
      const addressesOkx = CHAIN_REQUIRED.map(item => {
        return {
          chainId: item.chainId,
          address: currentWallet
        }
      })
      const body_ = {
        addresses: addressesOkx,
        walletId: uniqueId
      }
      await this.createWalletOkxActions(body_)
    },
    async getListTokenFollowChain(chainId) {
      this.setIsLoading(true)
      const params = {
        userUniqueId: this.$cookies.get('unique_user'),
        walletId: 'D8A22AB5-614B-4B52-A38C-B4C7F8423AAF' || this.walletId,
        chainId
      }
      await this.getListTokenFollowChainActions(params)
      this.setIsLoading(false)
    },
    exchangeSwapOkx(valueInputFrom = null, valueInputTo = null){
      this.setIsLoading(true)
      const tokenFrom = _.cloneDeep(this.fromTokenStore)
      const tokenTo = _.cloneDeep(this.toTokenStore)
      tokenFrom.valueInput = valueInputFrom
      tokenTo.valueInput = valueInputTo
      this.setFromTokenStore(tokenTo)
      this.setToTokenStore(tokenFrom)
      this.setIsLoading(false)
    }
  }
}
