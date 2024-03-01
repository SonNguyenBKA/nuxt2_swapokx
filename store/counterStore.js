export const state = () => ({
  counter: 0
})
export const getters = {
  getCounter(state) {
    return state.counter + 1000
  }
}
export const actions = {
  increase({ commit, state }) {
    commit('setCounter', state.counter + 1)
  }
}
export const mutations = {
  setCounter(state, value) {
    state.counter = value
  }
}
