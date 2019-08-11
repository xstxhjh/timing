import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    markdownAll: []
  },
  mutations: {
    setMarkdownAll(state, arr) {
      state.markdownAll = arr
    }
  },
  actions: {}
})
