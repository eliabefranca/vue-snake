import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isAnewGame: true,
    gameOver: false
  },

  mutations: {
    newGame (state) {
      state.gameOver = false
      state.isAnewGame = false
    },

    endGame (state) {
      state.gameOver = true
    }
  }
})

export default store