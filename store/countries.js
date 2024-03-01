import {axiosBase, handlesApi} from "~/utils/api";

const countries = {
  namespaced: true,
  state: () => ({
    countries: []
  }),
  getters: {},
  actions: {
    getAllCountries(context, data = null) {
      return new Promise((resolve, reject) => {
        handlesApi(resolve, reject, axiosBase().get('all', {params: data}), context)
      })
    }
  },
  mutations: {}
}
export default countries
