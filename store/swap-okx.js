import {axiosOkx, getAxiosOkxV5, handlesApi, postAxiosOkxV5} from "~/utils/api";
const swapOkx = {
  namespaced: true,
  state: () => ({
    listChain: [],
    walletId: null,
    listTokenFollowChain: [],
    isShowDialogSelect: false,
    fromTokenStore: null,
    toTokenStore: null,
    quoteStore: null,
    isResetForm: false,
    isExchange: false
  }),
  getters: {

  },
  actions: {
    createWalletOkxActions({commit}, body) {
      // console.log(body)
      return new Promise((resolve, reject) => {
        handlesApi(resolve, reject, postAxiosOkxV5('/api/v5/waas/wallet/create-wallet', body))
      }).then(resp => {
        commit('setWalletId', resp.data[0].walletId)
      })
    },
    getListAllChain({commit}) {
      return new Promise((resolve, reject) => {
        handlesApi(resolve, reject, axiosOkx().get('dx/trade/market/chain/list', {params: {t: (new Date()).getTime()}}))
      }).then(resp => {
        const chainBase = {
          chainLogo: "https://static.okx.com/cdn/wallet/logo/base_20900.png?x-oss-process=image/format,webp/resize,w_48,h_48,type_6/ignore-error,1",
          chainId: 8453,
          chainName: "Base"
        }
        commit('setListChain', [...resp.data, chainBase])
      })
    },
    getListTokenFollowChainActions({commit}, params) {
      return new Promise((resolve, reject) => {
        handlesApi(resolve, reject, axiosOkx().get('dx/trade/multi/allTokens', {params}))
      }).then(resp => {
        commit('setListTokenFollowChain', resp.data)
      })
    },
    searchToken({commit}, params) {
      return new Promise((resolve, reject) => {
        handlesApi(resolve, reject, axiosOkx().get('dx/trade/multi/tokens/v2/search', {params}))
      }).then(resp => {
        commit('setListTokenFollowChain', resp.data.systemList)
      })
    },
    quote({commit}, params) {
      return new Promise((resolve, reject) => {
        handlesApi(resolve, reject, axiosOkx().get('dx/trade/multi/v3/quote', {params}))
      }).then(resp => {
        console.log(resp)
        if (resp.code !== 0) {
          return
        }
        commit('setQuoteStore', resp.data)
      }).catch(e => {
        console.log('err', e)
      })
    },
    addOrCancelCollectionToken({commit}, params) {
      return new Promise((resolve, reject) => {
        handlesApi(resolve, reject, axiosOkx().post(`dx/trade/multi/addOrCancelCollectionToken?t=${(new Date()).getTime()}`, params))
      })
    }
  },
  mutations: {
    setListChain(state, payload) {
      state.listChain = payload
    },
    setWalletId(state, payload) {
      state.walletId = payload
    },
    setListTokenFollowChain(state, payload) {
      state.listTokenFollowChain = payload
    },
    setIsShowDialogSelect(state, payload) {
      state.isShowDialogSelect = payload
    },
    setFromTokenStore(state, payload) {
      state.fromTokenStore = payload
    },
    setToTokenStore(state, payload) {
      state.toTokenStore = payload
    },
    setQuoteStore(state, payload) {
      state.quoteStore = payload
    },
    setIsRestForm(state, payload) {
      state.isResetForm = payload
    },
    setIsExchange(state, payload) {
      state.isExchange = payload
    }
  }
}
export default swapOkx
