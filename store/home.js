const home = {
  namespaced: true,
  state: () => ({
    isLoading: false
  }),
  getters: {},
  actions: {},
  mutations: {
    setIsLoading(state, payload) {
      state.isLoading = payload;
    }
  }
}
export default home
