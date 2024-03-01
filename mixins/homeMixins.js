import {mapMutations, mapState} from "vuex";

export default {
  computed: {
    ...mapState('home', ['isLoading'])
  },
  methods: {
    ...mapMutations('home', ['setIsLoading'])
  }
}
